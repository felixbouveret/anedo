import get from 'lodash-es/get';
import set from 'lodash-es/set';
import { computed, reactive, watch } from 'vue';

import AuthService from '@/api/Auth';
import { UserInterface } from '@/api/users/types';
import { useStorage } from '@/composables/useStorage';

const { getFromLocalStorage, setInLocalStorage, removeFromLocalStorage } = useStorage();

const userData = reactive({
  uid: '',
  email: '',
  displayName: '',
  photoURL: ''
});

const setUserData = (key: string, data: unknown) => set(userData, key, data);
const getUserData = <T>(key: string): T => get(userData, key);

const isLoggedIn = computed(() => !!userData.email);

const login = async (mail: string, password: string) => {
  const user = await AuthService.login(mail, password);
  fillUserData(user);
};

const logout = async () => {
  await AuthService.logout();
  resetUserData();
};

const register = async (email: string, password: string, displayName: string) => {
  const user = await AuthService.register(email, password, displayName);
  if (user) {
    fillUserData(user);
    persistUserData();
  }
  return user;
};

const resetUserData = async () => {
  for (const key in userData) delete userData[key];
  removeFromLocalStorage(['uid', 'email', 'displayName', 'photoURL']);
};

const persistUserData = () => {
  setInLocalStorage('uid', userData.uid);
  setInLocalStorage('email', userData.email);
  setInLocalStorage('displayName', userData.displayName);
  setInLocalStorage('photoURL', userData.photoURL);
};

const fillUserData = (user: UserInterface) => {
  setUserData('uid', user.uid);
  setUserData('email', user.email);
  setUserData('displayName', user.displayName);
  setUserData('photoURL', user.photoURL);
};

const fillUserDataFromSession = () => {
  const userLocal = {} as Partial<UserInterface>;
  userLocal.uid = getFromLocalStorage<string>('uid');
  userLocal.email = getFromLocalStorage<string>('email');
  userLocal.displayName = getFromLocalStorage<string>('displayName');
  userLocal.photoURL = getFromLocalStorage<string>('photoURL');
  Object.assign(userData, userLocal);
};

const localEmail = getFromLocalStorage('email');
if (localEmail) fillUserDataFromSession();

watch(userData, (_) => {
  persistUserData();
});

export const useUser = () => ({
  isLoggedIn,
  getUserData,
  setUserData,
  persistUserData,
  resetUserData,
  fillUserData,
  logout,
  login,
  register,
  userData
});
