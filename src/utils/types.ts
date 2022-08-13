export type TCars = {
    items: [];
    counter: string | null;
}

export type TCar = {
    id: number;
    name: string;
    color: string;
}

export type TBasedCar = {
    name: string;
    color: string;
}

export type TEngine = {
    velocity: number;
    distance: number;
}

export type TWinner = {
    id: number;
    time: number;
    wins: number;
};

export type TWinners = {
    items: Array<{
      car: TCar;
      id: number;
      time: number;
      wins: number;
    }>;
    counter: string | null;
};

export type TDrivingStatus = {
    id: number;
    time: number;
    success: boolean;
};

export type TRacing = {
    id: number;
    name: string;
    color: string;
    time: number;
};

export enum Sort {
    Time = 'time',
    Wins = 'wins',
};

export enum Order {
    Asc = 'asc',
    Desc = 'desc',
};

export enum Page {
    Garage = 'garage',
    Winners = 'winners',
};
