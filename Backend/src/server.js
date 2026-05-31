const app = require('./app');
const connectDB = require('./config/db');
const env = require('./config/env');

connectDB()
  .then(() => {
    app.listen(env.port, () => console.log(`Backend running on port ${env.port}`));
  })
  .catch((error) => {
    console.error('Failed to start backend:', error);
    process.exit(1);
  });
