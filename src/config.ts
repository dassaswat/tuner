const config = {
  backendURL: import.meta.env.VITE_BACKEND_URL,
  spotifyRedirectTarget: import.meta.env.VITE_REDIRECT_TARGET,
  spotifyClientId: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
  spotifyScopes: [
    'user-read-private',
    'user-read-email',
    'playlist-read-private',
    'user-library-read',
    'playlist-modify-public',
    'playlist-modify-private',
  ],
  landingPage: {
    title: 'Tuner - The Intuitive Playlist Optimizer for Music Lovers',
    description: 'Login into spotify to continue.',
    verifiyDescription: 'Authentication successful, continue to app.',
    content: `Listening to music should be a seamless, enjoyable experience - but random playlists can really kill the vibe. That's where Tuner comes in. Tuner is the clever Spotify enhancer that creates flowing playlists perfectly suited to your taste. It simply analyzes the music you already love, then assembles new playlists by stringing together similar songs in an order that just feels right. No more abrupt transitions that ruin your groove! With Tuner's intuitive playlists, you'll enjoy a smooth, engaging listener journey from start to finish. `,
  },
  listingPage: {
    title: 'Hey,',
    description: 'Choose a playlist to analyze and create a new one.',
    defaultPlaylistRenderCount: 8 as const,
    defaultSkeletonCount: 4 as const,
  },
  playlistPage: {
    description: "Let's get your playlist fixed!",
    mainHeadingTuned: 'Click below to retune your playlist',
    mainHeadingDefault: 'Click below to fix this playlist',
    mainHeadingProcessing: 'Processing your playlist',
    mainDescription: `We will fetch all the songs from the playlist, analyze them and intelligently reorders them to create a more dynamic, engaging listening experience that avoids getting stuck in a single emotional tone.`,
    mainDescriptionProcessing:
      'While we are processing your playlist, sit back, relax and maybe listen to some music using the player below. We will notify you and then redirect you to the playlist page once ready.',
  },
};

export default config;
