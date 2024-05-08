import config from '../config';

export class PlaylistView {
  private mainElement = document.querySelector('#main')!;
  render(playlistId: string, isCreatedByTuner: boolean) {
    this.remove();
    this.mainElement?.insertAdjacentHTML(
      'afterbegin',
      this.getMarkupForPlaylist(playlistId, isCreatedByTuner),
    );
  }

  renderTuning(stepName: string) {
    const tunerContainer = document.querySelector('#tuner');
    if (!tunerContainer) return;
    tunerContainer.innerHTML = '';
    tunerContainer.insertAdjacentHTML(
      'afterbegin',
      this.getMarkupForTuning(stepName),
    );
  }

  remove() {
    this.mainElement.innerHTML = '';
  }

  removePlaylistTuneButton() {
    const startProcessingButton = document.querySelector('#control-button');
    if (!startProcessingButton) return;
    startProcessingButton.remove();
  }

  addPlaylistTuneButton(playlistId: string, isCreatedByTuner: boolean) {
    const tunerContainer = document.querySelector('#tuner');
    if (!tunerContainer) return;
    tunerContainer.innerHTML = '';
    tunerContainer.insertAdjacentHTML(
      'afterbegin',
      this.getMarkupForPlaylistTuneButton(playlistId, isCreatedByTuner),
    );
  }

  addTunePlaylistHandler(handler: (playlistId: string) => Promise<void>) {
    const tunePlaylistButton = document.querySelector('#start-processing');
    if (!tunePlaylistButton) return;
    tunePlaylistButton.addEventListener('click', () => {
      const playlistId = tunePlaylistButton.getAttribute('data-playlist-id');
      if (playlistId) {
        handler(playlistId);
      }
    });
  }

  showProgress(step: string, progress: '0' | '1/4' | '2/4' | '3/4' | '1') {
    const progressElement = document.querySelector('#progress');
    const stepElement = document.querySelector('#step');
    if (!progressElement) return;
    if (!stepElement) return;
    stepElement.textContent = '';
    stepElement.textContent = step;
    progressElement.classList.remove('w-0', 'w-1/4', 'w-2/4', 'w-3/4');
    progressElement.classList.add(`w-${progress === '1' ? 'full' : progress}`);
  }

  modifyContentHeading(heading: string) {
    const mainHeading = document.querySelector('#playlist-main-heading');
    if (!mainHeading) return;
    mainHeading.textContent = '';
    mainHeading.textContent = heading;
  }

  modifyContent(description: string) {
    const mainDescription = document.querySelector(
      '#playlist-main-description',
    );
    if (!mainDescription) return;
    mainDescription.textContent = '';
    mainDescription.textContent = description;
  }

  modifyStep(step: string) {
    const stepElement = document.querySelector('#step');
    if (!stepElement) return;
    stepElement.textContent = '';
    stepElement.textContent = step;
  }

  private getMarkupForPlaylistTuneButton(
    playlistId: string,
    isCreatedByTuner: boolean,
  ) {
    return `
    <button
      id="start-processing"
      data-playlist-id="${playlistId}"
      class="mb-5 mt-10 w-full rounded-lg bg-[#22c55e] px-6 py-3 text-center font-sans text-sm font-bold text-[#09090b] shadow-none transition-all hover:scale-105 hover:shadow-none focus:scale-105 focus:opacity-[0.85] focus:shadow-none active:scale-100 active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
      type="button"
    >
      ${isCreatedByTuner ? 'Re-Tune Playlist' : 'Tune Playlist'}
    </button>
    `;
  }

  private getMarkupForTuning(stepName: string) {
    return `
    <div class="mb-5 mt-10">
      <h2 class="sr-only">Steps</h2>
      <div>
        <p id="step" class="text-xs font-medium text-gray-500">${stepName}</p>
        <div class="mt-4 animate-pulse overflow-hidden rounded-full bg-[#1c1917]">
          <div id="progress" class="h-2 w-0 rounded-full bg-[#22c55e] transition-all duration-1000 ease-in-out"></div>
        </div>
      </div>
    </div>
    `;
  }

  private getMarkupForPlaylist(
    playlistId: string,
    isCreatedByTuner: boolean,
  ): string {
    return `
    <div class="mx-auto mt-10 flex flex-col items-center justify-center gap-4 md:gap-16 lg:flex-row">
      <div class="max-w-md lg:order-1">
        <h3 id="playlist-main-heading" class="text-xl font-bold md:text-2xl">
          ${isCreatedByTuner ? config.playlistPage.mainHeadingTuned : config.playlistPage.mainHeadingDefault}
        </h3>
        <p id="playlist-main-description" class="mt-2 text-base text-gray-400 md:text-lg">${config.playlistPage.mainDescription}<span class="block lg:hidden">For best experiance use this on desktop.</span></p>
        <div id="tuner">
          ${this.getMarkupForPlaylistTuneButton(playlistId, isCreatedByTuner)}
        </div>
        <hr class="mb-5 w-full border-gray-600 opacity-60" />
        <!-- Iframe Embed Player -->
        <div class="hidden lg:block" id="player"></div>
      </div>
      <!-- Playlist Card -->
      <div id="playlist-card"></div>
    </div>
    `;
  }
}
