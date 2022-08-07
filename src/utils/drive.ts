import { storage } from "../api/storage";
import { getEngineStart, getEngineStop, getStatus } from "../api/api";
import { distanceBetweenElem, animate } from "./animation";
import { TEngine, TDrivingStatus } from "./types";
import { selectStartBtn, selectStopBtn, getCar, getFinishLine } from "./select_elements";

export async function startTheDrive(id: number): Promise<TDrivingStatus> {
    const startButton = selectStartBtn(id);
    startButton.disabled = true;
    startButton.classList.toggle('enabled', true);

    const {velocity, distance}: TEngine = await getEngineStart(id);
    const time = Math.round(distance / velocity);

    startButton.classList.toggle('enabled', false);

    const stopButton = selectStopBtn(id);
    stopButton.disabled = false;
    const car = getCar(id);
    const finishLine = getFinishLine(id);
    const distanceBetweenCars = Math.floor(distanceBetweenElem(car, finishLine)) + 100;
    storage.animation[id] = animate(car, distanceBetweenCars, time);

    const {success} = await getStatus(id);
    if (!success){
        window.cancelAnimationFrame(storage.animation[id].id);
    }

    return {success, id, time};
}

export async function stopTheDrive(id: number): Promise<void> {
    const stopButton = selectStopBtn(id);
    stopButton.disabled = true;
    stopButton.classList.toggle('enabled', true);

    await getEngineStop(id);
    stopButton.classList.toggle('enabled', false);

    const startButton = selectStartBtn(id);
    startButton.disabled = false;
    const car = getCar(id);
    car.style.transform = 'translateX(0) translateY(52px)';
    if (storage.animation[id]){
        window.cancelAnimationFrame(storage.animation[id].id);
    }
};
