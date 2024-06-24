import { injectSpeedInsights } from '@vercel/speed-insights';
import { init } from './controller';

import './styles/global.css';

injectSpeedInsights();
(async () => await init())();
