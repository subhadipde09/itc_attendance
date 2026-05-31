const app = require('./app');
const connectDB = require('./config/db');
const env = require('./config/env');
require('dotenv').config();
const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
  })
  .catch((error) => {
    console.error('Failed to start backend:', error);
    process.exit(1);
  });
