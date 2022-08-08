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

let chosenCar: {id: number, name: string, color: string};
const body = document.querySelector('#body') as HTMLBodyElement;
const createForm = document.querySelector('#create-form') as HTMLFormElement;
const updateForm = document.querySelector('#update-form') as HTMLFormElement;


createPage();
await updateGarage();

async function generateCarsClick(event: MouseEvent) {
    const generateButton = <HTMLButtonElement>event.target;
    generateButton.disabled = true;
    const generatedCars = generateCarsArray();
    await Promise.all(generatedCars.map(async car => createCar(car)));
    await updateGarage();
    const garage = document.querySelector('#garage') as HTMLDivElement;
    garage.innerHTML = showGarage();
    generateButton.disabled = false;
}

async function raceButtonClick(event: MouseEvent) {
    const raceButton = <HTMLButtonElement>event.target;
    const victoryMessage = document.querySelector('#winner-message') as HTMLElement;
    raceButton.disabled = true;
    const resetButton = document.querySelector('.reset-button') as HTMLButtonElement;
    resetButton.disabled = true;
    const winner = await racing(startTheDrive);
    victoryMessage.innerHTML = `${winner.name} has won! The result is ${winner.time} seconds!`;
    await saveWinner(winner);
    setTimeout(() => {
       victoryMessage.classList.add('hidden'); 
    }, 6000);
}

async function resetButtonClick(event: MouseEvent) {
    const resetButton = <HTMLButtonElement>event.target;
    resetButton.disabled = true;
    storage.cars.map(({id}) => stopTheDrive(id));
    const victoryMessage = document.querySelector('#winner-message') as HTMLElement;
    victoryMessage.classList.add('hidden');
    const raceButton = document.querySelector('#race') as HTMLButtonElement;
    raceButton.disabled = false;
}

async function garageButtonClick() {
    const garagePage = document.querySelector('#garage') as HTMLDivElement;
    const winnersPage = document.querySelector('#winners') as HTMLDivElement;
    await updateGarage();
    storage.view = Page.Garage;
    garagePage.style.display = 'block';
    winnersPage.style.display = 'none';
}

async function winnersButtonClick() {
    const garagePage = document.querySelector('#garage') as HTMLDivElement;
    const winnersPage = document.querySelector('#winners') as HTMLDivElement;
    winnersPage.style.display = 'block';
    garagePage.style.display = 'none';
    await updateWinners();
    storage.view = Page.Winners;
    winnersPage.innerHTML = showWinnersPage();
}

async function previousButtonClick() {
    switch (storage.view) {
        case Page.Garage : {
            storage.carsPage -= 1;
            await updateGarage();
            const garagePage = document.querySelector('#garage') as HTMLDivElement;
            garagePage.innerHTML = showGarage();
            break;
        }
        case Page.Winners : {
            storage.winnersPage -= 1;
            await updateWinners();
            const winnersPage = document.querySelector('#winners') as HTMLDivElement;
            winnersPage.innerHTML = showWinnersPage();
            break;
        }
        default:
    }
}

async function nextButtonClick() {
    switch (storage.view) {
        case Page.Garage : {
            storage.carsPage += 1;
            await updateGarage();
            const garagePage = document.querySelector('#garage') as HTMLDivElement;
            garagePage.innerHTML = showGarage();
            break;
        }
        case Page.Winners : {
            storage.winnersPage += 1;
            await updateWinners();
            const winnersPage = document.querySelector('#winners') as HTMLDivElement;
            winnersPage.innerHTML = showWinnersPage();
            break;
        }
        default:
    }
}

async function deleteButtonClick(target: HTMLElement) {
    const id = Number(target.id.split('delete-')[1]);
    await deleteCar(id);
    await deleteWinner(id);
    await updateGarage();
    const garagePage = document.querySelector('#garage') as HTMLDivElement;
    garagePage.innerHTML = showGarage();
}

async function selectAndUpdateClick(target: HTMLElement) {
    const nameUpdate = document.querySelector('#update-name') as HTMLInputElement;
    const colorUpdate = document.querySelector('#update-color') as HTMLInputElement;
    const updateButton = document.querySelector('#update-button') as HTMLButtonElement;
    chosenCar = await getOneCar(target.id.split('select-')[1]);
    nameUpdate.value = chosenCar.name;
    colorUpdate.value = chosenCar.color;
    nameUpdate.disabled = false;
    colorUpdate.disabled = false;
    updateButton.disabled = false;
}

body.addEventListener('click', async event => {
    const target = <HTMLElement>event.target;
    if (target.classList.contains('generate-button')) {
        generateCarsClick(event);
    } else if (target.classList.contains('reset-button')) {
        resetButtonClick(event);
    } else if (target.classList.contains('race-button')) {
        raceButtonClick(event);
    } else if (target.classList.contains('choose-garage-button')) {
        garageButtonClick();
    } else if (target.classList.contains('choose-winners-button')) {
        winnersButtonClick();
    }

    if (target.classList.contains('prev-button')) {
        previousButtonClick();
    }

    if (target.classList.contains('next-button')) {
        nextButtonClick();
    }

    if (target.classList.contains('table-times')) {
        setOrder(Sort.Time);
    }
    if (target.classList.contains('table-wins')) {
        setOrder(Sort.Wins);
    }

    if (target.classList.contains('select-btn')) {
        selectAndUpdateClick(target);
    }
    if (target.classList.contains('delete-btn')) {
        deleteButtonClick(target);
    }
})

createForm.addEventListener('submit', async event => {
    event.preventDefault();
    const garage = document.querySelector('#garage') as HTMLDivElement;
    const createName = document.querySelector('#create-name') as HTMLInputElement;
    const createColor = document.querySelector('#create-color') as HTMLInputElement;
    const newCar = { name: createName.value, color: createColor.value };
    await createCar(newCar);
    await updateGarage();
    garage.innerHTML = showGarage();
    createName.value = '';
    createColor.value = '';
});

updateForm.addEventListener('submit', async event => {
    event.preventDefault();
    const updateButton = document.querySelector('#update-btn') as HTMLButtonElement;
    const garage = document.querySelector('#garage') as HTMLDivElement;
    const updateName = document.querySelector('#update-name') as HTMLInputElement;
    const updateColor = document.querySelector('#update-color') as HTMLInputElement;
    const car = { name: updateName.value, color: updateColor.value };
    await updateCar(chosenCar.id, car);
    await updateGarage();
    garage.innerHTML = showGarage();
    updateName.value = '';
    updateButton.disabled = true;
    updateName.disabled = true;
    updateColor.disabled = true;
    updateColor.value = '';
});