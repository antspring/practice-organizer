import { createApp } from './server/app';
import { startServer } from './server/server';

const app = createApp();

startServer(app);
