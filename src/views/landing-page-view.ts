import config from '../config';

export class LandingPageView {
  private mainElement = document.querySelector('#main')!;
  render() {
    this.remove();
    this.mainElement.insertAdjacentHTML(
      'afterbegin',
      this.getMarkupForLandingPage(config.landingPage.content),
    );
  }

  renderVerifyAuth() {
    const loginButton = document.querySelector('.login-button');
    if (!loginButton) return;
    loginButton.innerHTML = '';
    loginButton.insertAdjacentHTML('afterbegin', this.getMarkupForVerifyAuth());
  }

  remove() {
    if (!this.mainElement) return;
    this.mainElement.innerHTML = '';
  }

  addLoginToSpotifyHandler(handler: () => Promise<void>) {
    const loginToSpotifyButton = document.querySelector('#login-to-spotify');
    if (!loginToSpotifyButton) return;
    loginToSpotifyButton.addEventListener('click', handler);
  }

  addVerifyAuthHandler(handler: () => Promise<void>) {
    const verifyAuthButton = document.querySelector('#continue-with-spotify');
    if (!verifyAuthButton) return;
    verifyAuthButton.addEventListener('click', handler);
  }

  private getMarkupForVerifyAuth(): string {
    return `
    <button class="flex select-none items-center gap-3 rounded-lg bg-[#22c55e] px-6 py-3 text-center align-middle font-sans text-xs md:text-lg font-bold  text-[#191414] shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none" id="continue-with-spotify" type="button">
      <i class="fa-brands fa-spotify text-[#191414]"></i>
      Continue to app
    </button>`;
  }

  private getMarkupForLandingPage(content: string): string {
    return `
    <div class="flex flex-col">
    <div class="order-2 md:order-1">
      <p class="mb-8 text-balance text-base md:text-lg">
        ${content}
      </p>
    </div>
    <div class="mb-5 order-1 md:order-2 md:mb-0">
      <div class="login-button">
        <button
          class="flex select-none items-center gap-3 rounded-lg bg-[#22c55e] px-6 py-3 text-center align-middle font-sans text-xs md:text-lg font-bold  text-[#191414] shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          id="login-to-spotify"
          type="button"
        >
          <i class="fa-brands fa-spotify text-[#191414] " ></i>
          Login with Spotify
        </button>
      </div>
    </div>
  </div>
    `;
  }
}
