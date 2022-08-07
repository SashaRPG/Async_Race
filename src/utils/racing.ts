import { storage } from "../api/storage";
import { TCar, TRacing, TDrivingStatus } from "./types";

export async function raceEveryone(promises: Array<Promise<TDrivingStatus>>, ids: number[]): Promise<TRacing> {
    const {success, id, time} = await Promise.race(promises);

    if (!success) {
        const index = ids.findIndex(i => i === id);
        const leftPromises = [...promises.slice(0, index), ...promises.slice(index + 1, promises.length)];
        const leftIds = [...ids.slice(0, index), ...ids.slice(index + 1, ids.length)];
        return raceEveryone(leftPromises, leftIds);
    };

    const winner: TCar = storage.cars.filter((car: TCar): boolean => car.id === id)[0];

    return {
        ...winner,
        time: Number((time/100).toFixed(3))
    };
}

export async function racing(action: {(id: number): Promise<TDrivingStatus>}): Promise<TRacing> {
    const promises = storage.cars.map(({id}) => action(id));
    const winner = await raceEveryone(promises, storage.cars.map((car: {id: number, name: string, color: string}) => car.id));
    return winner;
}