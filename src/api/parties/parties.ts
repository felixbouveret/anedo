import {
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where
} from 'firebase/firestore';
import { customAlphabet } from 'nanoid';
const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

import { httpsCallableFromURL } from 'firebase/functions';

import db from '@/api/firestore';

import functions from '../functions';
import { getMultipleUsers, getUser } from '../users';
import { UserInterface } from '../users/types';
import { AnecdoteInterface, PartyInterface, PartyMemberInterface } from './types';

export const createParty = async (party: PartyInterface, owner: PartyMemberInterface) => {
  try {
    const nanoid = customAlphabet(alphabet, 8);
    const id = nanoid();
    await setDoc(doc(db, 'parties', id), { ...party, id });
    await addPartyMember(id, owner);
  } catch (e) {
    console.error('Error adding document: ', e);
  }
};

export const getParty = async (uid: string) => {
  const docRef = doc(db, 'parties', uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    // doc.data() will be undefined in this case
    console.log('No such document!');
  }
};

export const getParties = async (uid: string): Promise<DocumentData[]> => {
  const q = query(collection(db, 'parties'), where('membersUid', 'array-contains', uid));
  const querySnapshot = await getDocs(q);
  const docs: DocumentData[] = [];

  if (!querySnapshot.empty) {
    querySnapshot.forEach((doc) => {
      docs.push(doc.data());
    });
    return docs;
  } else {
    return docs;
  }
};

export const listenParties = (uid: string, callback: (parties: PartyInterface[]) => void) => {
  const q = query(collection(db, 'parties'), where('membersUid', 'array-contains', uid));

  return onSnapshot(q, (querySnapshot) => {
    const parties: PartyInterface[] = [];
    querySnapshot.forEach((doc) => {
      parties.push(doc.data() as PartyInterface);
    });
    callback(parties);
  });
};

export const listenParty = (partyUid: string, callback: (partyData: PartyInterface) => void) =>
  onSnapshot(doc(db, 'parties', partyUid), (querySnapshot) => {
    if (querySnapshot.exists()) callback(querySnapshot.data() as PartyInterface);
  });

export const updateParty = async (party: PartyInterface) => {
  try {
    await setDoc(doc(db, 'parties', party.id), party, { merge: true });
  } catch (e) {
    console.error('Error adding document: ', e);
  }
};

export const joinParty = async (partyId: string, user: PartyMemberInterface) => {
  try {
    await updateDoc(doc(db, 'parties', partyId), {
      membersUid: arrayUnion(user.uid)
    });
    await addPartyMember(partyId, user);
  } catch (e) {
    console.error('Error updating document: ', e);
  }
};

export const leaveParty = async (partyId: string, userId: string) => {
  try {
    await updateDoc(doc(db, 'parties', partyId), {
      membersUid: arrayRemove(userId)
    });
    await deleteDoc(doc(db, 'parties', partyId, 'members', userId));
  } catch (e) {
    console.error('Error updating document: ', e);
  }
};

export const deleteParty = async (partyId: string) => {
  try {
    await deleteDoc(doc(db, 'parties', partyId));
  } catch (e) {
    console.error('Error updating document: ', e);
  }
};

export const startParty = async (partyId: string) => {
  try {
    const shuffleAnecdotes = httpsCallableFromURL(
      functions,
      'https://us-central1-secret-story-b720b.cloudfunctions.net/shuffleAnecdotes?partyId=' +
        partyId
    );
    await shuffleAnecdotes({ partyId });
    await updateDoc(doc(db, 'parties', partyId), { isStarted: true });
  } catch (e) {
    console.error('Error adding document: ', e);
  }
};

const addPartyMember = async (partyId: string, member: PartyMemberInterface) => {
  try {
    await setDoc(doc(db, 'parties', partyId, 'members', member.uid), member);
  } catch (e) {
    console.error('Error adding document: ', e);
  }
};

const updatePartyMember = async (partyId: string, memberUid: string, payload: any) => {
  try {
    await setDoc(doc(db, 'parties', partyId, 'members', memberUid), payload, { merge: true });
  } catch (e) {
    console.error('Error updating member: ', e);
  }
};

export const getPartyMember = async (partyId: string, memberUid: string) => {
  try {
    const memberPersonalInfos = await getUser(memberUid);
    const memberStatus = await getDoc(doc(db, 'parties', partyId, 'members', memberUid));
    if (memberStatus.exists() && memberPersonalInfos) {
      return { ...memberStatus.data(), ...memberPersonalInfos };
    } else {
      // doc.data() will be undefined in this case
      console.log('No such document!');
    }
  } catch (e) {
    console.error('Error adding document: ', e);
  }
};

export const getAllPartyMembers = async (partyId: string, membersUids: string[]) => {
  try {
    const membersPersonalInfos = await getMultipleUsers(membersUids);
    const membersStatusSnapshot = await getDocs(collection(db, 'parties', partyId, 'members'));
    const membersStatus: any[] = [];
    membersStatusSnapshot.forEach((doc) => {
      membersStatus.push(doc.data());
    });
    const result = membersPersonalInfos.map((personalInfos) => ({
      ...personalInfos,
      ...membersStatus.find((member) => member.uid === personalInfos.uid)
    }));
    return result;
  } catch (e) {
    console.error('Error adding document: ', e);
  }
};

export const listenPartyMembers = (
  partyUid: string,
  callback: (partyUsers: UserInterface[]) => void
) =>
  onSnapshot(collection(db, 'parties', partyUid, 'members'), async (querySnapshot) => {
    const membersStatus: UserInterface[] = [];
    querySnapshot.forEach((doc) => membersStatus.push(doc.data() as UserInterface));
    const membersUids = membersStatus.map((member) => member.uid);

    const membersPersonalInfos = await getMultipleUsers(membersUids);

    const result = membersPersonalInfos.map((personalInfos) => ({
      ...personalInfos,
      ...membersStatus.find((member) => member.uid === personalInfos.uid)
    }));

    callback(result);
  });

export const addAnecdotes = async (
  partyId: string,
  memberUid: string,
  anecdotes: AnecdoteInterface[]
) => {
  try {
    await setDoc(doc(db, 'parties', partyId, 'members', memberUid), { anecdotes }, { merge: true });
    await updateDoc(doc(db, 'parties', partyId, 'members', memberUid), { isReady: true });
  } catch (e) {
    console.error('Error adding document: ', e);
  }
};

export const getAnecdotesToAnwser = async (partyId: string, memberUid: string) => {
  try {
    const docRef = doc(db, 'parties', partyId, 'anecdotesToGuess', memberUid).withConverter({
      toFirestore: () => ({}),
      fromFirestore: (snapshot) => {
        const anecdotes = snapshot.data().anecdotes;
        return anecdotes.map(({ content }: { content: string }) => content);
      }
    });
    const docSnap = await getDoc(docRef);

    return docSnap.data();
  } catch (e) {
    console.error('Error adding document: ', e);
  }
};

export const makeAGuess = async (payload: {
  partyId: string;
  guesserUid: string;
  anecdotesOwnerUid: string;
  anecdote: string;
}) => {
  try {
    const makeAGuess = httpsCallableFromURL(
      functions,
      'https://us-central1-secret-story-b720b.cloudfunctions.net/makeAGuess'
    );
    const { data } = await makeAGuess(payload);
    const updatePayload = {
      guessed: false
    } as {
      guessed: boolean;
      lastGuessDate?: Date;
    };
    if (data?.isCorrect) updatePayload.guessed = true;
    if (!data?.isTooEarly) updatePayload.lastGuessDate = new Date();
    await updatePartyMember(payload.partyId, payload.guesserUid, updatePayload);
    return data;
  } catch (e) {
    console.error('Error submiting your answer: ', e);
  }
};
