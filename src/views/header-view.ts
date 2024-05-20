import config from '../config';
import { Page, SpotifyUserInfo } from '../types';

export class HeaderView {
  private headerElement = document.querySelector('#header')!;
  render(page: Page, userInfo?: SpotifyUserInfo) {
    if (page === 'landing') {
      this.remove();
      this.headerElement.insertAdjacentHTML(
        'afterbegin',
        this.getMarkupForDefaultHeader(
          config.landingPage.title,
          config.landingPage.description,
        ),
      );
      return;
    }

    if (page === 'verifiy') {
      this.remove();
      this.headerElement.insertAdjacentHTML(
        'afterbegin',
        this.getMarkupForDefaultHeader(
          config.landingPage.title,
          config.landingPage.verifiyDescription,
        ),
      );
      return;
    }

    if (page === 'playlist') {
      const headerDescriptionElement = document.querySelector(
        '#header-description',
      );
      if (!headerDescriptionElement) return;
      headerDescriptionElement.innerHTML = '';
      headerDescriptionElement.insertAdjacentHTML(
        'afterbegin',
        this.getMarkupForHeaderDescription(config.playlistPage.description),
      );
      return;
    }

    if (!userInfo) {
      this.remove();
      this.headerElement.insertAdjacentHTML(
        'afterbegin',
        this.getMarkupForHeaderSkeleton(),
      );
      return;
    } else {
      this.remove();
      this.headerElement?.insertAdjacentHTML(
        'afterbegin',
        this.getMarkupForHeader(userInfo),
      );
    }
  }

  remove() {
    if (!this.headerElement) return;
    this.headerElement.innerHTML = '';
  }

  addLogoutHandler(handler: () => void) {
    const logoutButton = document.querySelector('#logout-button');
    if (!logoutButton) return;
    logoutButton.addEventListener('click', handler);
  }

  private getMarkupForHeaderSkeleton(): string {
    return `
    <div class="mb-4 flex items-center justify-between">
        <div>
            <div class="mb-4 block h-6 w-56 animate-pulse rounded-full bg-gray-500 text-4xl font-bold md:text-4xl"></div>
            <p class="mt-2 text-base text-gray-500 md:text-lg dark:text-gray-400">
                Loading the page, give us a sec..
            </p>
      </div>
      <span
          class="relative inline-block h-12 w-12 animate-pulse !rounded-full bg-gray-500 object-cover object-center"
        ></span>
    </div>
    `;
  }

  private getMarkupForHeader(spotifyUserInfo: SpotifyUserInfo) {
    let headerMarkup = this.getMarkupForDefaultHeader(
      `${config.listingPage.title} ${spotifyUserInfo.name}`,
      config.listingPage.description,
    );
    headerMarkup += `
    <div class="flex gap-3 md:gap-6 mt-4 md:mt-0">
      <button id="logout-button" class="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg border border-gray-800 focus:ring focus:ring-gray-300 " type="button">Logout</button>
      <img src=${spotifyUserInfo.image} alt="avatar" class="relative inline-block h-10 w-10 md:h-12 md:w-12 !rounded-full object-cover object-center"/></div>
    </div>
    `;

    return headerMarkup;
  }

  private getMarkupForHeaderDescription(description: string) {
    return `
      <p class="text-center md:text-left  mt-2 text-base text-gray-500 md:text-lg dark:text-gray-400">${description}</p>`;
  }

  private getMarkupForDefaultHeader(
    title: string,
    description: string,
  ): string {
    return `
    <div class="mb-4 flex flex-col md:flex-row items-center justify-between">
        <div>
            <h1 class="text-center md:text-left text-4xl font-bold md:text-4xl">${title}</h1>
            <span id="header-description">${this.getMarkupForHeaderDescription(description)}</span>
        </div>
    `;
  }
}
