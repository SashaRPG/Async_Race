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

export enum Sort {
    Time = 'time',
    Wins = 'wins',
}

export enum Order {
    Asc = 'asc',
    Desc = 'desc',
}

