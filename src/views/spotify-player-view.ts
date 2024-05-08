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

  refreshIframe() {
    const iframe = document.querySelector(
      '#spotify-player',
    ) as HTMLIFrameElement;
    if (!iframe) return;

    iframe.src = iframe.src;
  }

  private getMarkupForSpotifyPlayer(playlistId: string): string {
    return `
    <iframe id="spotify-player"  style="border-radius:12px" src="https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator" width="100%" height="152" frameBorder="0"  allow="encrypted-media" loading="lazy"></iframe>`;
  }
}
