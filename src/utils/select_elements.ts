export function selectStartBtn(id: number): HTMLButtonElement {
    return document.getElementById(`start-engine-car-${id}`) as HTMLButtonElement;
}

export function selectStopBtn(id: number): HTMLButtonElement {
    return document.getElementById(`stop-engine-car-${id}`) as HTMLButtonElement;
}

export function getCar(id: number) {
    return document.querySelector(`#car-${id}`) as HTMLElement;
}

export function getFinishLine(id: number) {
    return document.querySelector(`#finish-line-${id}`) as HTMLDivElement;
}
