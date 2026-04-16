import app from './app';
import { env } from './config/env';
import { connectDB } from './config/db';

const startServer = async (): Promise<void> => {
  try {
    await connectDB();
    app.listen(env.PORT, () => {
      console.log(`Server running on port ${env.PORT}`);
      console.log(`Environment: ${env.NODE_ENV}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
