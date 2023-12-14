import { format } from 'date-fns';

const secondsToDate = (seconds: number) => format(new Date(seconds * 1000), 'dd/MM/yyyy');
const getTime = (seconds: number) => format(new Date(seconds * 1000), 'k:m');

export const useDate = () => ({
  secondsToDate,
  getTime
});
