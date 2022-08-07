import './index.css';
import { createPage } from './main_page/main_page';
import { showGarage, updateGarage } from './garage/garage';
import { showWinnersPage, updateWinners, setOrder } from './winners/winners';
import { startTheDrive, stopTheDrive } from './utils/drive';
import { selectStartBtn, selectStopBtn, getCar, getFinishLine } from './utils/select_elements';
import { storage } from './api/storage';
import { createCar, updateCar, saveWinner, getOneCar, deleteCar, deleteWinner } from './api/api'
import { generateCarsArray } from './utils/car_generator';
import { Sort, Page } from './utils/types';
import { racing } from './utils/racing';
import './style.scss';

let choosenCars: {id: number, name: string, color: string};

createPage();
await updateGarage();