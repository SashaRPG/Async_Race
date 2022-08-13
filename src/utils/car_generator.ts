import { TBasedCar } from "./types";

const hex = '0123456789ABCDEF';
const brands = [
    'Mercedes-Benz',
    'BMW', 
    'Audi',
    'Porsche',
    'Volkswagen',
    'Opel',
    'Bugatti', 
    'Ferrari',
    'Lamborghini',
    'Maserati',
];

const models = [
    'S63AMG',
    'M5',
    'RS6',
    '911 GT3',
    'Passat VR6',
    'Omega Lotus',
    'Veyron',
    'F-40',
    'Aventador',
    'MC20',
];

function createRandomCar() {
    const brand = brands[Math.floor(Math.random() * brands.length)];    
    const model = models[Math.floor(Math.random() * models.length)]; 
    return `${brand} ${model}`;   
}

function paintCarInRandomColor() {
    let randomColor = '#';
    for (let i = 0; i < 6; i++) {
        randomColor += hex[Math.floor(Math.random() * 16)];
    }
    return randomColor;
}

export function generateCarsArray(amount = 100): Array<TBasedCar> {
    return new Array(amount).fill(1).map(()=>({
        name: createRandomCar(), 
        color: paintCarInRandomColor()
    }));
}
