import app from './app';
import config from './src/config/env';


const server = app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`);
});

// Lidar com erros de porta em uso
server.on('error', (error: NodeJS.ErrnoException) => {
  if (error.code === 'EADDRINUSE') {
    console.log(`Port ${config.PORT} is already in use`);
    // Tentar automaticamente a próxima porta
    const newPort = Number(config.PORT) + 1;
    console.log(`Trying port ${newPort} instead`);
    app.listen(newPort);
  } else {
    console.error('Server error:', error);
  }
});