module.exports = {
  api: {
    host: process.env.API_HOST || 'localhost',
    port: process.env.API_PORT || 3000
  },
  database: {
    host: process.env.DATABASE_HOST || 'localhost',
    port: process.env.DATABASE_PORT || 3001
  },
  scrapper: {
    host: process.env.SCRAPPER_HOST || 'localhost',
    port: process.env.SCRAPPER_PORT || 3002
  }
};
