import { storage } from "../api/storage";
import { getWinners } from "../api/api";
import { carPic } from "../garage/car";
import { Sort, Order } from "../utils/types";
import './winners.css';

export const showWinnersPage = (): string => `
  <h2>Winners (${storage.winnersCount})</h2>
  <p>Page №${storage.winnersPage}</p>
    <table>
    <tr>
    <th>№</th>
    <th>Car</th>
    <th>Model</th>
        <th class="table-button table-wins ${
    storage.sortBy === Sort.Wins ? storage.sortOrder : ''
    }	id="sort-by-wins">Number of Wins</th>
        <th class="table-button table-times ${
    storage.sortBy === Sort.Time ? storage.sortOrder : ''
    }	id="sort-by-time">Best time (sec)</th>
    </tr>
        ${storage.winners
    .map(
      (
        winner: {
          car: { name: string; color: string };
          wins: number;
          time: number;
        },
        index,
      ) => `
        <tr>
          <td>${index + 1}</td>
          <td>${carPic(winner.car.color)}</td>
          <td>${winner.car.name}</td>
          <td>${winner.wins}</td>
          <td>${winner.time}</td>
        </tr>
      `,
    )
    .join('')}
    </table>`;

export async function updateWinners(): Promise<void> {
    const {items, counter} = await getWinners({
        page: storage.winnersPage,
        sort: storage.sortBy,
        order: storage.sortOrder
    });
    storage.winners = items;
    storage.winnersCount = counter;

    const nextButton = document.querySelector('#next') as HTMLButtonElement;
    nextButton.disabled = storage.winnersPage * 10 >= Number(storage.winnersCount);

    const previousButton = document.querySelector('#prev') as HTMLButtonElement;
    previousButton.disabled = storage.winnersPage <= 1;
}

export async function setOrder(sortBy: string): Promise<void> {
    if (storage.sortOrder === Order.Asc) {
        storage.sortOrder = Order.Desc;
    } else {
        storage.sortOrder = Order.Asc;
    }
    storage.sortBy = sortBy;

    await updateWinners();
    const winnersPage = document.querySelector('#winners-page') as HTMLDivElement;
    winnersPage.innerHTML = showWinnersPage();
}