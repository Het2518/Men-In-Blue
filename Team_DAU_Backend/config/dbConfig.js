const dbVar = {
  ADMIN_DB_NAME: process.env.ADMIN_DB_NAME || 'admin_hydra',
  DB_NAME: process.env.DB_NAME || 'hydra',

  ADMIN_LOGIN_AUTHENTICATION: process.env.ADMIN_LOGIN_AUTHENTICATION || 'password',
}

module.exports = dbVar