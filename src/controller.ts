import config from './config';
import models from './models';
import { DefaultCreatePlaylistConfig } from './types';
import views from './views/base';

// Handlers
function onLogout() {
  window.localStorage.clear();
  window.location.href = '/';
}

// This function is called when the user clicks on the 'Tune Playlist' button on the playlist listing page
function onListingPageTunePlaylist(playlistId: string) {
  window.location.hash = `${playlistId}`;
}

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// This function is called when the user clicks on the 'Tune Playlist' button on the playlist page
async function onTunePlaylist(playlistId: string) {
  let createdPlaylist = false;
  let playlistInDB = false;
  try {
    const isPlaylistInDB = await models.checkPlaylistInDB(playlistId);
    if (isPlaylistInDB) playlistInDB = true;

    views.playlist.modifyContentHeading(
      config.playlistPage.mainHeadingProcessing,
    );
    views.playlist.modifyContent(config.playlistPage.mainDescriptionProcessing);
    views.playlist.removePlaylistTuneButton();
    views.playlist.renderTuning('Fetching all tracks in the playlist.');

    // Fetch all tracks in the playlist - First step
    const currentUser = await models.getCurrentUserProfile();
    let tracksIds: string[] = [];
    let defaultPlaylistConfig: DefaultCreatePlaylistConfig = {
      name: 'Your liked songs',
      description: 'All your liked songs as a playlist',
      public: false,
      collaborative: false,
    };
    if (playlistId === 'user-saved-tracks') {
      tracksIds = await models.getCurrentUserAllSavedTracksIds();
    } else {
      tracksIds = await models.getAllTrackIdsFromPlaylist(playlistId);
      defaultPlaylistConfig = await models.getPlaylistInfo(playlistId);
    }
    views.playlist.showProgress(
      `1/4 - Fetched all ${tracksIds.length} tracks. Extracting audio features..`,
      '1/4',
    );

    // Extract audio features - Second step
    views.playlist.showProgress(
      `2/4 - Extracted audio features. Analysing..`,
      '2/4',
    );

    // Analyse and build the playlist - Third step
    if (tracksIds.length === 0 || tracksIds.length < 5) {
      views.notification.render('error', {
        description: `${tracksIds.length === 0 ? 'No tracks found in the playlist.' : 'Not enough tracks to tune the playlist.'}`,
      });
      views.playlist.addPlaylistTuneButton(playlistId, playlistInDB);
      views.playlist.addTunePlaylistHandler(onTunePlaylist);
      views.playlist.modifyContentHeading(
        config.playlistPage.mainHeadingDefault,
      );
      views.playlist.modifyContent(config.playlistPage.mainDescription);
      return;
    }
    const tunedPlaylist = await models.getTunedPlaylist(tracksIds);
    await sleep(10000);
    views.playlist.showProgress(
      `3/4 - Analysis complete. Creating playlist..`,
      '3/4',
    );

    // Create the playlist - Fourth step
    let _playlistsIdToRedirect = playlistId;
    if (!isPlaylistInDB) {
      const newPlaylist = await models.createPlaylist({
        userId: currentUser.id,
        name: `${defaultPlaylistConfig.name} - Tuned by Tuner`,
        description: `${defaultPlaylistConfig.description}.`,
      });
      createdPlaylist = true;
      await models.addTracksToPlaylist(newPlaylist.id, tunedPlaylist.uris);
      _playlistsIdToRedirect = newPlaylist.id;
      const currentUserInDB = await models.checkCurrentUserInDB(currentUser.id);
      if (currentUserInDB) {
        await models.addPlaylistToDB(currentUserInDB.id, newPlaylist.id);
      }
    } else {
      const trackIds = await models.getAllTrackIdsFromPlaylist(playlistId);
      await models.removeAllTracksFromPlaylist(playlistId, trackIds);
      await models.addTracksToPlaylist(playlistId, tunedPlaylist.uris);
    }

    // Redirect to the new playlist
    let counter = 5;
    const interval = setInterval(() => {
      counter--;
      views.playlist.modifyStep(
        `4/4 - Playlist created successfully. Redirecting in ${counter} seconds..`,
      );
      if (counter === 0) {
        clearInterval(interval);
      }
    }, 1000);

    setTimeout(() => {
      if (_playlistsIdToRedirect !== playlistId) {
        window.location.hash = `${_playlistsIdToRedirect}`;
        return;
      }
      onHashChange();
    }, 5000);

    views.playlist.showProgress(
      `4/4 - Playlist created successfully. Redirecting in 5 seconds..`,
      '1',
    );
    views.notification.render('success', {
      description: 'Playlist created successfully. Redirecting in 5 seconds..',
    });
  } catch (error) {
    if (error instanceof Error) {
      views.notification.render('error', {
        description: `Error occured while tuning the playlist. ${createdPlaylist ? 'A playlist was created but some tracks might be missing. Delete and retry!' : ''}`,
      });
    }
    if (playlistInDB) {
      views.playlist.addPlaylistTuneButton(playlistId, true);
    } else {
      views.playlist.addPlaylistTuneButton(playlistId, false);
    }
    views.playlist.addTunePlaylistHandler(onTunePlaylist);
    views.playlist.modifyContentHeading(config.playlistPage.mainHeadingDefault);
    views.playlist.modifyContent(config.playlistPage.mainDescription);
  }
}

async function onHashChange() {
  try {
    views.spotifyPlayer.remove();
    const playlistId = window.location.hash.slice(1);
    if (playlistId === '') {
      listPlaylists(views.pagination.currentOffset);
      return;
    }

    views.header.render('playlist');
    const isPlaylistInDB = await models.checkPlaylistInDB(playlistId);
    if (isPlaylistInDB) {
      views.playlist.render(playlistId, true);

      views.playlist.scrollIntoView();
    } else {
      views.playlist.render(playlistId, false);

      views.playlist.scrollIntoView();
    }
    views.playlistCard.render();
    views.playlist.addTunePlaylistHandler(onTunePlaylist);

    if (playlistId === 'user-saved-tracks') {
      const currentUser = await models.getCurrentUserProfile();
      const savedTracks = await models.getCurrentUserSavedTracks();
      const data = {
        playlistName: 'Liked Songs',
        description: 'Your favorite songs',
        image: 'https://misc.scdn.co/liked-songs/liked-songs-640.png',
        externalUrl: 'https://open.spotify.com/collection/tracks',
        ownerName: currentUser.display_name,
        ownerImage:
          currentUser.images.length === 0
            ? `https://api.dicebear.com/8.x/bottts-neutral/svg?seed=Rascal`
            : currentUser.images[0].url,
        totalTracks: savedTracks.total,
      };

      views.playlistCard.render(data);
      return;
    }

    views.spotifyPlayer.render(playlistId);
    views.spotifyPlayer.refreshIframe();

    const playlistInfo = await models.getPlaylistInfo(playlistId);
    const ownerInfo = await models.getAnyUserProfile(playlistInfo.owner.id);
    views.playlistCard.render({
      playlistName: playlistInfo.name,
      description: playlistInfo.description,
      externalUrl: playlistInfo.external_urls.spotify,
      image: playlistInfo.images[0].url,
      ownerName: ownerInfo.display_name,
      totalTracks: playlistInfo.tracks.total,
      ownerImage:
        ownerInfo.images.length === 0
          ? `https://api.dicebear.com/8.x/bottts-neutral/svg?seed=Rascal`
          : ownerInfo.images[0].url,
    });
  } catch (error) {
    if (error instanceof Error)
      views.notification.render('error', {
        description: 'Error occured while trying to fetch playlist details.',
      });
  }
}

async function fetchPlaylists(offset: number) {
  views.playlistListing.render();
  const _playlists = await models.getCurrentUserPlaylists(offset);
  const playlists = _playlists.items.map(async (item) => {
    return {
      id: item.id,
      name: item.name,
      description: item.description,
      isTunedByTuner: Boolean(await models.checkPlaylistInDB(item.id)),
      image:
        item.images === null
          ? `https://source.unsplash.com/random/1920x1080/?music,instruments,guitar,party`
          : item.images[0].url,
    };
  });
  const playlistsData = await Promise.all(playlists);
  views.playlistListing.render(playlistsData);
  if (offset === 0) views.playlistListing.renderLikedSongsCard();
  views.playlistListing.addTunePlaylistHandler(onListingPageTunePlaylist);

  views.pagination.currentOffset = _playlists.offset;
  views.pagination.toggleButtonActiveState(!!_playlists.next, 'next');
  views.pagination.toggleButtonActiveState(!!_playlists.previous, 'prev');
  return _playlists;
}

async function listPlaylists(offset: number = 0) {
  try {
    views.header.render('listing');
    const user = await models.getCurrentUserProfile();

    views.header.render('listing', {
      name: user.display_name,
      image:
        user.images.length === 0
          ? `https://api.dicebear.com/8.x/bottts-neutral/svg?seed=Rascal`
          : user.images[0].url,
    });
    views.header.addLogoutHandler(onLogout);

    // Get the current user's playlists
    const playlists = await fetchPlaylists(offset);
    views.pagination.render(!!playlists.next, !!playlists.previous);
    views.pagination.addNextPageHandler(fetchPlaylists);
    views.pagination.addPrevPageHandler(fetchPlaylists);
  } catch (error) {
    if (error instanceof Error) {
      views.notification.render('error', {
        description: 'Error occured while trying to fetch user playlists.',
      });
    }
  }
}

export async function init() {
  window.location.hash = '';
  const hasActiveAuth = () => {
    const store = window.localStorage;
    let authActiveState = false;
    for (let i = 0; i < localStorage.length; i++) {
      const key = store.key(i);
      const value = store.getItem(key!);
      if (
        key?.startsWith('spotify-sdk:') &&
        value?.startsWith(`{"access_token"`)
      ) {
        authActiveState = true;
        break;
      }
    }
    return authActiveState;
  };
  const hasAuthVerifier = () => {
    const store = window.localStorage;
    let hasVerfier = false;
    for (let i = 0; i < localStorage.length; i++) {
      const key = store.key(i);
      const value = store.getItem(key!);
      if (
        key?.startsWith('spotify-sdk:verifier') &&
        value?.startsWith(`{"verifier"`)
      ) {
        hasVerfier = true;
        break;
      }
    }
    return hasVerfier;
  };
  if (hasActiveAuth()) {
    listPlaylists();
    views.playlistListing.addHashChangeHandler(onHashChange);

    const currentUser = await models.getCurrentUserProfile();
    let user = await models.checkCurrentUserInDB(currentUser.id);
    if (!user) {
      user = await models.addCurrentUserToDB(currentUser.id);
    }
    if (!user) {
      views.notification.render('error', {
        description: 'Failed to fetch user.',
      });
      return;
    }
    const playlistsIds = await models.getCurrentUserAllPlaylistsIds();
    const notInUserPlaylist = user.tplaylists.filter(
      (tplaylist) => !playlistsIds.includes(tplaylist.spotify_playlist_id),
    );
    notInUserPlaylist.forEach(async (tplaylist) => {
      await models.removePlaylistFromDB(tplaylist.id);
    });
    return;
  }
  if (hasAuthVerifier()) {
    views.header.render('verifiy');
    views.landingPage.render();
    views.landingPage.renderVerifyAuth();
    views.landingPage.addVerifyAuthHandler(async () => {
      await models.getCurrentUserProfile();
      if (hasActiveAuth()) window.location.reload();
    });
    return;
  }
  views.header.render('landing');
  views.landingPage.render();
  views.landingPage.addLoginToSpotifyHandler(async () => {
    await models.getCurrentUserProfile();
  });
}
