import { partytownVite } from '@builder.io/partytown/utils';
import legacy from '@vitejs/plugin-legacy';
import path from 'node:path';
import _config from './_config';

export default {
  server: {
    host: _config.server.host,
    port: _config.server.port,
    plugins: [
      legacy(),
      partytownVite({
        dest: path.join(__dirname, 'dist', '~partytown'),
      }),
    ],
  },
};
