import app from './app';
import { env } from './config/env';
import { connectDB } from './config/db';

const startServer = async (): Promise<void> => {
  try {
    await connectDB();
    const PORT = parseInt(env.PORT as string, 10) || 5000;
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${env.NODE_ENV}`);
    });

    // Graceful shutdown
    const shutdown = () => {
      console.log('Shutting down gracefully...');
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
