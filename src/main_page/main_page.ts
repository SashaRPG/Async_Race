import { showGarage } from '../garage/garage';
import { showWinnersPage } from '../winners/winners';
import './main_page.css';

export const createPage = (): void => {
  const page = `
    <header class="header">
      <h1 class="header__title" >Async Race</h1>
      <button type="button" class="button choose-garage-button">Garage</button>
      <button type="button" class="button choose-winners-button">Winners</button>
    </header>
    <main id="garage-page">
      <div class="container-for-forms">
        <form class="form create-form" id="create-form">
          <input class="input" id="create-name" name="name" type="text" required />
          <input class="color" id="create-color" name="color" type="color" value="#ffffff" />
          <button class="button" id="create-button" type="submit">Create</button>
        </form>
        <form class="form update-form" id="update-form">
          <input class="input" id="update-name" name="name" type="text" disabled required />
          <input class="color" id="update-color" name="color" type="color" value="#ffffff" disabled />
          <button class="button" id="update-button" type="submit" disabled >Update</button>
        </form>
      </div>
      <ul class="controls">
        <li class="item" ><button class="button race-button" id="race">Race</button></li>
        <li class="item" ><button class="button reset-button" id="reset" disabled>Reset</button></li>
        <li class="item" ><button class="button generate-button" id="generate">Generate</button></li>
      </ul>
      <div id="garage" class="garage">${showGarage()}</div>
      <div>
        <p class="winner-message hidden" id="winner-message"></p>
      </div>
    </main>
    <div id="winners" class="winners">${showWinnersPage()}</div>
    <div class="pagination">
      <button class="button prev-button" disabled id="prev">←</button>
      <button class="button next-button" disabled id="next">→</button>
    </div>
`;
  const app = document.createElement('div');
  app.innerHTML = page;
  const body = document.querySelector('#body') as HTMLBodyElement;
  body.appendChild(app);
};