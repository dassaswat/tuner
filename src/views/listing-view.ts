import config from '../config';
import { PlaylistInfo } from '../types';

export class PlaylistListingView {
  private mainElement = document.querySelector('#main')!;
  render(playlistsInfo?: PlaylistInfo[]) {
    if (!playlistsInfo) {
      this.remove();
      this.mainElement.insertAdjacentHTML(
        'afterbegin',
        this.getMarkupForPlaylistSkeleton(),
      );
      return;
    }

    this.remove();
    this.mainElement?.insertAdjacentHTML(
      'afterbegin',
      this.getMarkupForPlaylist(playlistsInfo),
    );
  }

  renderLikedSongsCard() {
    const playlistGrid = document.querySelector('#playlist-grid');
    if (playlistGrid) {
      playlistGrid.insertAdjacentHTML(
        'afterbegin',
        this.getMarkupForLikedSongs(),
      );
      return;
    }
  }

  remove() {
    const playlistGrid = document.querySelector('#playlist-grid');
    if (playlistGrid) {
      playlistGrid.remove();
      return;
    }
    this.cleanMainMarkup();
  }

  private cleanMainMarkup() {
    if (!this.mainElement) return;
    this.mainElement.innerHTML = '';
  }

  addTunePlaylistHandler(handler: (playlistId: string) => void) {
    const fixPlaylistButtons = document.querySelectorAll('#fix-playlist');
    if (!fixPlaylistButtons) return;
    fixPlaylistButtons.forEach((button) => {
      button.addEventListener('click', (event) => {
        const target = event.target as HTMLButtonElement;
        handler(target.dataset.playlistId || '');
      });
    });
  }

  addHashChangeHandler(handler: () => Promise<void>) {
    window.addEventListener('hashchange', async () => {
      await handler();
    });
  }

  // Skeletons
  private getMarkupForPlaylistCardSkeleton(): string {
    return `
      <div class="relative flex w-auto flex-col rounded-xl bg-[#1c1917] bg-clip-border shadow-md">
          <div class="relative mx-4 mt-4 h-28 overflow-hidden animate-pulse rounded-xl bg-gray-500 bg-clip-border"></div>
          <div class="p-6">
              <div class="mb-2 block h-2 w-36 lg:w-20 animate-pulse truncate rounded-full bg-gray-500 text-base font-medium leading-relaxed md:text-4xl"></div>
              <div class="block h-2 w-40 lg:w-24 animate-pulse truncate rounded-full bg-gray-500 text-base font-medium leading-relaxed md:text-4xl"></div>
          </div>
          <div class="p-6 pt-0">
              <div class="block h-9 w-full animate-pulse select-none rounded-lg bg-[#22c55e] px-6 py-3 text-center align-middle font-sans text-xs font-bold uppercase"></div>
          </div>
      </div>
      `;
  }

  private getMarkupForPlaylistSkeleton(): string {
    const playlistSkeletons: string[] = [];
    for (let i = 0; i < config.listingPage.defaultSkeletonCount; i++) {
      playlistSkeletons.push(this.getMarkupForPlaylistCardSkeleton());
    }
    return `<div id="playlist-grid" class="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">${playlistSkeletons.join('')}</div>`;
  }

  private getMarkupForLikedSongs(): string {
    return `${this.getMarkupForPlaylistCard({ id: 'user-saved-tracks', name: 'Liked Songs', description: 'Songs that you have liked', image: 'https://misc.scdn.co/liked-songs/liked-songs-300.png', isTunedByTuner: false })}`;
  }

  private getMarkupForPlaylist(playlists: PlaylistInfo[]): string {
    const playlistCards = playlists.map((playlist) =>
      this.getMarkupForPlaylistCard(playlist),
    );
    return `<div id="playlist-grid" class="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">${playlistCards.join('')}</div>`;
  }

  private getMarkupForPlaylistCard(playlist: PlaylistInfo): string {
    return `
    <div class="relative flex w-auto flex-col rounded-xl bg-[#1c1917] bg-clip-border shadow-md ">
        <div class="relative mx-4 mt-4 h-28 overflow-hidden rounded-xl bg-white bg-clip-border">
            <img
            src=${playlist.image}
            alt="playlist-image"
            class="h-full w-full object-cover"
            loading="eager"
            />
        </div>
        <div class="p-6">
            <p class="block truncate text-base font-medium leading-relaxed">
                ${playlist.name}
            </p>
            <p class="block truncate text-sm font-normal leading-normal opacity-60">
                ${playlist.description === '' ? 'No description available' : playlist.description}
            </p>
        </div>
        <div class="p-6 pt-0">
            <button id="fix-playlist" data-playlist-id="${playlist.id}" class="block w-full select-none rounded-lg bg-[#22c55e] px-6 py-3 text-center align-middle font-sans text-xs font-bold  text-[#09090b] shadow-none transition-all hover:scale-105 hover:shadow-none focus:scale-105 focus:opacity-[0.85] focus:shadow-none active:scale-100 active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none" type="button">
                ${playlist.isTunedByTuner ? 'Re-Tune Playlist' : 'Tune Playlist'}
            </button>
        </div>
    </div>
    `;
  }
}
