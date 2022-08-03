import { getCars, getWinners } from './api';

const { items: cars, counter: carsCount } = await getCars(1);
const { items: winners, counter: winnersCount } = await getWinners({ page: 1 });

const animation: { [key: number]: { id: number } } = {};

export const storage = {
  carsPage: 1,
  winnersPage: 1,
  cars,
  carsCount,
  winners,
  winnersCount,
  animation,
  view: 'garage',
  sortBy: '',
  sortOrder: '',
};
