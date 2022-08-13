import { storage } from '../api/storage';
import { showCar } from './car';
import { getCars, getEngineStart, getEngineStop, getStatus } from '../api/api';
import { TDrivingStatus, TEngine } from '../utils/types';
import { selectStartBtn, selectStopBtn, getCar, getFinishLine } from '../utils/select_elements';
import { animate, distanceBetweenElem } from '../utils/animation';
import './garage.css';

export const showGarage = (): string => `
    <h2 class="title">Garage (${storage.carsCount} cars)</h2>
    <p class="text">Page #${storage.carsPage}</p>
    <ul class="cars-container">
      ${storage.cars.map(car => `<li>${showCar(car)}</li>`).join('')}
    </ul>
`;

export const updateGarage = async (): Promise<void> => {
  const { items, counter } = await getCars(storage.carsPage);
  storage.cars = items;
  storage.carsCount = counter;

  const nextBtn = document.getElementById('next') as HTMLButtonElement;
  nextBtn.disabled = storage.carsPage * 7 >= Number(storage.carsCount);

  const prevBtn = document.getElementById('prev') as HTMLButtonElement;
  prevBtn.disabled = storage.carsPage <= 1;
};

const body = document.querySelector('#body') as HTMLBodyElement;
body.addEventListener('click', async event => {
  const target = <HTMLElement>event.target;

  if (target.classList.contains('start-engine-btn')) {
    const id = Number(target.id.split('start-engine-car-')[1]);
    startRace(id);
  }

  if (target.classList.contains('stop-engine-btn')) {
    const id = Number(target.id.split('stop-engine-car-')[1]);
    stopRace(id);
  }
});

const startRace = async (id: number): Promise<TDrivingStatus> => {
    const startBtn = selectStartBtn(id);
    startBtn.disabled = true;
    startBtn.classList.toggle('turnon', true);
  
    const { velocity, distance }: TEngine = await getEngineStart(id);
    const time = Math.round(distance / velocity);
  
    startBtn.classList.toggle('turnon', false);
  
    const stopBtn = selectStopBtn(id);
    stopBtn.disabled = false;
  
    const car = getCar(id);
    const finishLine = getFinishLine(id);
    const distanceBtwElem = Math.floor(distanceBetweenElem(car, finishLine)) + 100;
  
    storage.animation[id] = animate(car, distanceBtwElem, time);
  
    const { success } = await getStatus(id);
    if (!success) window.cancelAnimationFrame(storage.animation[id].id);
  
    return { success, id, time };
  };
  
const stopRace = async (id: number): Promise<void> => {
    const stopBtn = selectStopBtn(id);
    stopBtn.disabled = true;
    stopBtn.classList.toggle('enabled', true);
  
    await getEngineStop(id);
  
    stopBtn.classList.toggle('enabled', false);
  
    const startBtn = selectStartBtn(id);
    startBtn.disabled = false;
  
    const car = getCar(id);
    car.style.transform = 'translateX(0) translateY(52px)';
    if (storage.animation[id]) {
        window.cancelAnimationFrame(storage.animation[id].id);
    }
};