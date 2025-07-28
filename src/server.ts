import 'module-alias/register';
import 'tsconfig-paths/register';
import app from './app';
import config from './config/env';

const server = app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`);
});

server.on('error', (error: NodeJS.ErrnoException) => {
  if (error.code === 'EADDRINUSE') {
    console.log(`Port ${config.PORT} is already in use`);
  } else {
    console.error('Server error:', error);
  }
});