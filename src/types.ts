export type Page = 'landing' | 'verifiy' | 'listing' | 'playlist';
export type NotificationType = 'success' | 'error';

export interface CreatePlaylist {
  userId: string;
  name: string;
  description: string;
  setPublic: boolean;
  collaborative: boolean;
}

export interface DefaultCreatePlaylistConfig {
  name: string;
  description: string;
  public: boolean;
  collaborative: boolean;
}

export interface SpotifyUserInfo {
  name: string;
  image: string;
}

export interface StoredUser {
  id: number;
  spotify_id: string;
  tplaylists: TunedPlaylistInfo[];
}

export interface TunedPlaylistInfo {
  id: number;
  user_id: number;
  spotify_playlist_id: string;
}

export interface TunedPlaylist {
  uris: string[];
  length: number;
  duration_ms: number;
}

export interface PlaylistCardInfo {
  ownerName: string;
  ownerImage: string;
  playlistName: string;
  description: string;
  totalTracks: number;
  externalUrl: string;
  image: string;
}

export interface PlaylistInfo {
  id: string;
  name: string;
  image: string;
  description: string;
  isTunedByTuner: boolean;
}

export interface NotificationData {
  header?: string;
  description: string;
}
