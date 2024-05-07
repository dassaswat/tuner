export class SpotifyPlayerView {
  render(playlistId: string) {
    const playerElement = document.querySelector('#player');
    if (!playerElement) return;
    playerElement.innerHTML = '';
    playerElement.insertAdjacentHTML(
      'afterbegin',
      this.getMarkupForSpotifyPlayer(playlistId),
    );
  }

  remove() {
    const playerElement = document.querySelector('#player');
    if (!playerElement) return;
    playerElement.remove();
  }

  private getMarkupForSpotifyPlayer(playlistId: string): string {
    return `
    <iframe
        style="border-radius: 12px"
        src="https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator"
        width="100%"
        height="152"
        frameborder="0"
        allowfullscreen=""
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
    ></iframe>`;
  }
}
