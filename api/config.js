// THOSE ARE DEFAULT LOGINS FOR TEST ONLY - NOT SUITABLE FOR PRODUCTION
exports.DB_CONFIG = {
  host: 'localhost',
  port: '5432',
  user: 'postgres',
  password: 'root',
  database: 'slr'
};

//exports.SIGN_KEY = secureRandom(256, {type: 'Buffer'}); // Create a highly random byte array of 256 bytes
exports.SIGN_KEY = 'test'; // for test only