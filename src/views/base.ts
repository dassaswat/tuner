import { HeaderView } from './header-view';
import { LandingPageView } from './landing-page-view';
import { PlaylistListingView } from './listing-view';
import { NotificationView } from './notification-view';
import { PaginationView } from './pagination-view';
import { PlaylistCardView } from './playlist-card-view';
import { PlaylistView } from './playlist-view';
import { SpotifyPlayerView } from './spotify-player-view';

const views = {
  header: new HeaderView(),
  landingPage: new LandingPageView(),
  playlistListing: new PlaylistListingView(),
  pagination: new PaginationView(),
  playlist: new PlaylistView(),
  playlistCard: new PlaylistCardView(),
  spotifyPlayer: new SpotifyPlayerView(),
  notification: new NotificationView(),
};

export default views;
