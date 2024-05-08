import { SpotifyApi } from '@spotify/web-api-ts-sdk';
import config from './config';
import {
  CreatePlaylist,
  StoredUser,
  TunedPlaylist,
  TunedPlaylistInfo,
} from './types';

class Models {
  private spotifySdk = SpotifyApi.withUserAuthorization(
    config.spotifyClientId,
    config.spotifyRedirectTarget,
    config.spotifyScopes,
  );

  // ************ Current Active User ************
  async getCurrentUserProfile() {
    try {
      return await this.spotifySdk.currentUser.profile();
    } catch (error) {
      throw new Error('Failed to get current active user profile');
    }
  }

  async getCurrentUserPlaylists(offset = 0) {
    try {
      return await this.spotifySdk.currentUser.playlists.playlists(
        offset === 0 ? 7 : config.listingPage.defaultPlaylistRenderCount,
        offset,
      );
    } catch (error) {
      throw new Error('Failed to get current user playlists');
    }
  }

  async getCurrentUserSavedTracks(offset = 0) {
    try {
      return await this.spotifySdk.currentUser.tracks.savedTracks(20, offset);
    } catch (error) {
      throw new Error('Failed to get current user saved tracks');
    }
  }

  async getCurrentUserAllSavedTracksIds() {
    try {
      const maxTracks = 50;
      const savedTracks = await this.getCurrentUserSavedTracks();
      const totalRequests = Math.ceil(savedTracks.total / maxTracks);
      const savedTracksPromises = [];
      for (let i = 0; i < totalRequests; i++) {
        const promise = this.spotifySdk.currentUser.tracks.savedTracks(
          maxTracks,
          i * maxTracks,
        );
        savedTracksPromises.push(promise);
      }
      const savedTracksData = await Promise.all(savedTracksPromises);
      return savedTracksData
        .map((tracks) => tracks.items.map((track) => track.track.id))
        .flat();
    } catch (error) {
      throw new Error('Failed to get current user saved tracks');
    }
  }

  async getCurrentUserAllPlaylistsIds() {
    try {
      const playlistIds: string[] = [];
      let available = true;
      let offset = 0;
      while (available) {
        const playlists = await this.spotifySdk.currentUser.playlists.playlists(
          50,
          offset,
        );
        playlists.items.forEach((playlist) => {
          playlistIds.push(playlist.id);
        });
        if (playlists.next === null) available = false;
        offset += 50;
      }
      return playlistIds;
    } catch (error) {
      throw new Error('Failed to get current user playlists');
    }
  }

  async checkCurrentUserInDB(userId: string) {
    try {
      const response = await fetch(`${config.backendURL}/user/${userId}`);
      if (response.ok) {
        return response.json() as Promise<StoredUser>;
      }
    } catch (error) {
      throw new Error('Failed to check user in DB');
    }
  }

  async addCurrentUserToDB(userId: string) {
    try {
      const response = await fetch(`${config.backendURL}/user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ spotify_id: userId }),
      });
      if (!response.ok) {
        throw new Error('Failed to add current user to DB');
      }
      return response.json() as Promise<StoredUser>;
    } catch (error) {
      throw new Error('Failed to add user to DB');
    }
  }

  // ************ Playlists ************
  async getPlaylistInfo(playlistId: string) {
    try {
      return await this.spotifySdk.playlists.getPlaylist(playlistId);
    } catch (error) {
      throw new Error('Failed to get playlist info');
    }
  }

  async getAllTrackIdsFromPlaylist(playlistId: string) {
    try {
      const maxTracks = 50;
      const playlistData = await this.getPlaylistInfo(playlistId);
      const totalRequests = Math.ceil(playlistData.tracks.total / maxTracks);
      const tracksPromise = [];
      for (let i = 0; i < totalRequests; i++) {
        const promise = this.spotifySdk.playlists.getPlaylistItems(
          playlistId,
          undefined,
          undefined,
          maxTracks,
          i * maxTracks,
        );
        tracksPromise.push(promise);
      }

      const playlistTracks = await Promise.all(tracksPromise);
      return playlistTracks
        .map((tracks) => tracks.items.map((track) => track.track.id))
        .flat();
    } catch (error) {
      throw new Error('Failed to get playlist tracks');
    }
  }

  async createPlaylist(data: CreatePlaylist) {
    try {
      return await this.spotifySdk.playlists.createPlaylist(data.userId, {
        name: data.name,
        description: data.description,
      });
    } catch (error) {
      throw new Error('Failed to create playlist');
    }
  }

  async addTracksToPlaylist(playlistId: string, tracksURI: string[]) {
    try {
      const maxTracks = 100;
      for (let i = 0; i < Math.ceil(tracksURI.length / maxTracks); i++) {
        const tracks = tracksURI.slice(i * maxTracks, (i + 1) * maxTracks);
        await this.spotifySdk.playlists.addItemsToPlaylist(playlistId, tracks);
      }
    } catch (error) {
      throw new Error('Failed to add tracks to playlist');
    }
  }

  async removeAllTracksFromPlaylist(playlistId: string, tracksId: string[]) {
    try {
      const chunkSize = 4;
      const maxTracks = 100;
      const deletePromises = [];

      for (let i = 0; i < Math.ceil(tracksId.length / maxTracks); i++) {
        const promise = this.spotifySdk.playlists.removeItemsFromPlaylist(
          playlistId,
          {
            tracks: tracksId
              .slice(i * maxTracks, (i + 1) * maxTracks)
              .map((trackId) => ({
                uri: `spotify:track:${trackId}`,
              })),
          },
        );
        deletePromises.push(promise);
      }
      for (let i = 0; i < deletePromises.length; i += chunkSize) {
        const chunk = deletePromises.slice(i, i + chunkSize);
        Promise.all(chunk);
      }
    } catch (error) {
      throw new Error('Failed to delete tracks from playlist');
    }
  }

  async checkPlaylistInDB(playlistId: string) {
    try {
      const response = await fetch(
        `${config.backendURL}/playlists/${playlistId}`,
      );
      if (response.ok) {
        return response.json() as Promise<TunedPlaylistInfo>;
      }
    } catch (error) {
      throw new Error('Failed to check playlist in DB');
    }
  }

  async removePlaylistFromDB(playlistId: number) {
    try {
      const response = await fetch(
        `${config.backendURL}/playlists/${playlistId}`,
        {
          method: 'DELETE',
        },
      );
      if (!response.ok) {
        throw new Error('Failed to remove playlist from DB');
      }
    } catch (error) {
      throw new Error('Failed to remove playlist from DB');
    }
  }

  async addPlaylistToDB(userId: number, spotifyPlaylistId: string) {
    try {
      const response = await fetch(
        `${config.backendURL}/users/${userId}/playlists`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ spotify_playlist_id: spotifyPlaylistId }),
        },
      );
      if (!response.ok) {
        throw new Error('Failed to add playlist to DB');
      }
      return response.json() as Promise<TunedPlaylistInfo>;
    } catch (error) {
      throw new Error('Failed to add playlist to DB');
    }
  }

  async getTunedPlaylist(currentPlaylistTrackIds: string[]) {
    try {
      const tracksFeatures = await this.getAudioFeaturesOfTracks(
        currentPlaylistTrackIds,
      );
      const response = await fetch(`${config.backendURL}/analyse`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tracksFeatures),
      });
      return response.json() as Promise<TunedPlaylist>;
    } catch (error) {
      throw new Error('Failed to get tuned playlist');
    }
  }

  // ************ Audio Features And Misc ************
  async getAudioFeaturesOfTracks(trackIds: string[]) {
    try {
      const maxTracks = 100;
      const trackPromises = [];
      for (let i = 0; i < Math.ceil(trackIds.length / maxTracks); i++) {
        const tracks = trackIds.slice(i * maxTracks, (i + 1) * maxTracks);
        const promise = this.spotifySdk.tracks.audioFeatures(tracks);
        trackPromises.push(promise);
      }
      const trackFeatures = await Promise.all(trackPromises);
      return trackFeatures.flat();
    } catch (error) {
      throw new Error('Failed to get audio features');
    }
  }

  async getAnyUserProfile(userId: string) {
    try {
      return await this.spotifySdk.users.profile(userId);
    } catch (error) {
      throw new Error('Failed to get user info');
    }
  }
}

const models = new Models();
export default models;
