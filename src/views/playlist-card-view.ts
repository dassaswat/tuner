import { PlaylistCardInfo } from '../types';

export class PlaylistCardView {
  render(playlistInfo?: PlaylistCardInfo) {
    const playlistCardElement = document.querySelector('#playlist-card');
    if (!playlistCardElement) return;
    playlistCardElement.innerHTML = '';

    if (!playlistInfo) {
      playlistCardElement.insertAdjacentHTML(
        'afterbegin',
        this.getMarkupForPlaylistCardSkeleton(),
      );
      return;
    }

    playlistCardElement.insertAdjacentHTML(
      'afterbegin',
      this.getMarkupForPlaylistCard(playlistInfo),
    );
  }

  private getMarkupForPlaylistCardSkeleton(): string {
    return `
    <div class="w-80 rounded-xl bg-[#1c1917] bg-clip-border shadow-md md:order-2">
        <div class="relative h-48 animate-pulse overflow-hidden rounded-xl bg-gray-500 bg-clip-border"></div>
        <div class="p-6">
            <div class="flex justify-between pb-3">
                <div class="flex items-center gap-2">
                    <span class="h-5 w-5 animate-pulse rounded-full bg-gray-500 object-cover"></span>
                    <div class="block h-2 w-36 animate-pulse rounded-full bg-gray-500 font-medium lg:w-20"></div>
                </div>
            </div>
            <div class="mb-2 block h-2 w-36 animate-pulse rounded-full bg-gray-500 font-medium lg:w-40"></div>
            <div class="mb-2 block h-2 w-36 animate-pulse rounded-full bg-gray-500 font-medium lg:w-52"></div>
            <div class="block h-2 w-36 animate-pulse rounded-full bg-gray-500 font-medium lg:w-52"></div>
        </div>
        <div class="p-6 pt-0">
            <hr class="mb-5 w-full border-gray-600 opacity-60" />
            <div class="block h-9 w-full animate-pulse select-none rounded-lg bg-[#22c55e] px-6 py-3 text-center align-middle font-sans text-xs font-bold uppercase"></div>
        </div>
    </div>
    `;
  }

  private getMarkupForPlaylistCard(playlistInfo: PlaylistCardInfo): string {
    return `
    <div class="w-80 rounded-xl bg-[#1c1917] bg-clip-border shadow-md lg:order-2 ">
        <div class="relative h-48 overflow-hidden rounded-xl">
            <img
            src=${playlistInfo.image}
            alt="playlist-image"
            class="h-full w-full object-cover"
            loading="eager"
            />
        </div>
        <div class="p-6">
            <div class="flex justify-between pb-3">
                <div class="flex items-center gap-2">
                    <img
                        src=${playlistInfo.ownerImage}
                        alt="avatar"
                        class="h-5 w-5 rounded-full object-cover"
                    />
                    <p class="text-sm font-normal text-gray-400">${playlistInfo.ownerName}</p>
                </div>
                <p class="text-sm font-normal text-gray-400">${playlistInfo.totalTracks} songs</p>
            </div>
            <p class="text-base font-medium">${playlistInfo.playlistName}</p>
            <p class=" text-sm font-normal text-gray-400">
                ${playlistInfo.description === '' ? 'No description available' : playlistInfo.description}
            </p>
        </div>
        <div class="p-6 pt-0">
            <hr class="mb-5 w-full border-gray-600 opacity-60" />
            <a
            href=${playlistInfo.externalUrl}
            target="_blank"
            rel="noreferrer"
            >
                <button
                    id="fix-playlist"
                    class="w-full rounded-lg bg-[#22c55e] px-6 py-3 text-center text-xs font-bold text-[#09090b] shadow-none transition-all hover:scale-105 hover:shadow-none focus:scale-105 focus:opacity-[0.85] focus:shadow-none active:scale-100 active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                    type="button"
                >
                    Open in Spotify
                </button>
            </a>
        </div>
    </div>
    `;
  }
}
