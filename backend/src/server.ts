import app from './app';
import { env } from './config/env';

// In Vercel, we must not call listen directly as Vercel runs the app serverless
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  try {
    app.listen(env.PORT, () => {
      console.log(`[Server]: API is running on http://localhost:${env.PORT}`);
      console.log(`[Swagger]: Docs available at http://localhost:${env.PORT}/api-docs`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
}

export default app;

