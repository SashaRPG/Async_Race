import { TCars, TCar, TBasedCar, TEngine, TWinners, TWinner } from "../utils/types";

const myURL = 'http://localhost:3000';

export async function getCars(page: number, limit = 7): Promise<TCars> {
    const resp = await fetch(`${myURL}/garage?_page=${page}&_limit=${limit}`);
    return {
        items: await resp.json(),
        counter: resp.headers.get('X-Total-Count'),
    };
};

export async function getOneCar(id: string): Promise<TCar> {
    return (await fetch(`${myURL}/garage/${id}`)).json();
};

export async function createCar(car: {name: string, color: string}): Promise<Response> {
    return (await fetch(`${myURL}/garage`, {
        method: 'POST',
        body: JSON.stringify(car),
        headers: {
            'Content-Type': 'application/json',
        },
    })).json();
};

export async function deleteCar(id: number): Promise<TCar> {
    return (await fetch(`${myURL}/garage/${id}`, {method: 'DELETE'})).json();
};
  
export async function updateCar(id: number, car: TBasedCar) {
    return (await fetch(`${myURL}/garage/${id}`, {
        method: 'PUT',
        body: JSON.stringify(car),
        headers: {
            'Content-Type': 'application/json',
        },
    })).json();
};

export async function getStatus(id: number): Promise<{success: boolean}> {
    const response = await fetch(`${myURL}/engine?id=${id}&status=drive`).catch();
    if (response.status !== 200) {
        return {
            success: false
        }
    } else {
        return {...(await response.json())};
    }
};

export async function getEngineStart(id: number): Promise<TEngine> {
    return (await fetch(`${myURL}/engine?id=${id}&status=started`)).json();
};
export async function getEngineStop(id: number): Promise<TEngine> {
    return (await fetch(`${myURL}/engine?id=${id}&status=stopped`)).json();
};

function sortOrder(sort?: string | null, order?: string | null) {
    if (sort && order) {
        return `&_sort=${sort}&_order=${order}`;
    } 
    return '';
};

export async function getWinners({
    page,
    limit = 10,
    sort, 
    order}: 
    {page: number;
    limit?: number;
    sort?: string | null;
    order?: string | null}): Promise<TWinners> {
        const response = await fetch(`${myURL}/winners?_page=${page}&_limit=${limit}${sortOrder(sort, order)}`);
        const items = await response.json();

        return {
            items: await Promise.all(
              items.map(async (winner: TWinner) => ({
                ...winner,
                car: await getOneCar(winner.id.toString()),
              })),
            ),
            counter: response.headers.get('X-Total-Count'),
        };
};

export async function createWinner(body: TWinner): Promise<void> {
    return (await fetch(`${myURL}/winners`, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type' : 'application/json',
        },
    })).json();
};

export async function getOneWinner(id: number): Promise<TWinner> {
    return (await fetch(`${myURL}/winners/${id}`)).json();
};
export async function getOneWinnerStatus(id: number): Promise<number> {
    return (await fetch(`${myURL}/winners/${id}`)).status;
};
export async function deleteWinner(id: number): Promise<void> {
    return (await fetch(`${myURL}/winners/${id}`, {method: 'DELETE'})).json();
};

export async function updateWinner(id: number, body: TWinner): Promise<void> {
    return (await fetch(`${myURL}/winners/${id}`, {
        method: 'PUT',
        body: JSON.stringify(body),
        headers: {
            'Content-Type' : 'application/json',
        },
    })).json();
};

export async function saveWinner({id, time} : {
    id: number;
    time: number;
}): Promise<void> {
    const statusForWinner = await getOneWinnerStatus(id);
    if (statusForWinner === 404) {
        await createWinner({
            id,
            wins: 1,
            time,
        });
    } else {
        const winner = await getOneWinner(id);
        await updateWinner(id, {
            id, 
            wins: winner.wins +1,
            time: time < winner.time ? time : winner.time,
        });
    }
};

