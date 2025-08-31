// Object for all Default cred
const defaultVar = {
  PAGINATION_LIMIT: parseInt(process.env.PAGINATION_LIMIT || 500),
  PORT: process.env.PORT || 3000,
  FRONTEND_HOST_URL: process.env.FRONTEND_HOST_URL || 'https://www.google.com',
  BACKEND_URL: process.env.BACKEND_URL,

  // APP_ID: process.env.APP_ID,
  // DEFAULT_IOS_FALLBACK: process.env.DEFAULT_IOS_FALLBACK,

  // PACKAGE_NAME: process.env.PACKAGE_NAME,
  // APP_NAME: process.env.APP_NAME,
  // DEFAULT_ANDROID_FALLBACK: process.env.DEFAULT_ANDROID_FALLBACK,

  // DEFAULT_WEB_FALLBACK: process.env.DEFAULT_WEB_FALLBACK,

  OTP_LENGTH: process.env.OTP_LENGTH || 6,

  ADMINS_DB_POOLSIZE: process.env.ADMINS_DB_POOLSIZE || 10,
  USERS_DB_POOLSIZE: process.env.USERS_DB_POOLSIZE || 10,

  JWT_SECRET: process.env.JWT_SECRET || 'aAbBcC@test_123',
  JWT_SECRET_USER: process.env.JWT_SECRET_USER || 'aAbBcC@test_123_User', // JWT secret for user
  JWT_VALIDITY: process.env.JWT_VALIDITY || '30d',
  REFRESH_TOKEN_VALIDITY: process.env.REFRESH_TOKEN_VALIDITY || '30d', // Refresh token validity
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || 'aAbBcC@test_123', // Refresh token secret

  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY || '0123456789abcdef0123456789abcdef', // Encryption key
  IV_VALUE: process.env.IV_VALUE || 'abcdef9876543210abcdef9876543210', // IV value

  PRIVATE_KEY: `-----BEGIN RSA PRIVATE KEY-----
MIICXQIBAAKBgQDUH3YJ9lSOPsof/8qyHKPG1kuAQXNLEWE4bd+VLBgbEitOwm9+
TLpzcnzweaiVfr9NIoaEydxP4ZlJF/h/7fhOuazSQRld429/k+ZzyfmpDkGIPbgK
OndPdy0AuWZoiEMXKQvSbtmbCN0isWlquW1vU7FnSJi4Dm1LbgpnL6FLgwIDAQAB
AoGBAIbHaq/PxVAQU0tbssXS7rkDJjva2k/DPjuljF9zAeoJdFz5q+/a/skl4H7H
PjemrhRrsH8k54gV9th7k5htcswhjs+beqAAS2gbkfM2gyE1py3eMW+9o7B+iurd
anml/SQburJEOqHnavIH33IfqDL21ikNo++3CIfMobKcGbhRAkEA/MrF8V4JEhWH
RYp5dl4Ykeu6+yP71Yg1ZWAqRRBzU+Mvei4I2zO/wjYiBmSY/1R++bBRLV+uybfO
eAXzq49xSQJBANbQkaSTcQfMxXB/YmADBWSxzNuxeUqhkKvUlmrC9r6tMcPDjgkw
I02bPsrkZVWtb1JUvwF2sK9j1ZFsmwXXYmsCQC3BLe6wDIg/aUqG89Ee2ueeeSt3
qd9OVgvRShVSEu2+ExvUNTonta+bSLFLh/2+93SOG0NRLDvKjw5eVWpZ/jECQQC1
bWxEun5RXyI2NHAqtQJ+HCjwOAFABhrA9Yig3M83FeIc+/HfUrfOWNr800++v/9w
YsD7hHoPd9sturNniJTHAkAY27gpCsXkQ4mBYNMmyW7SvP0u7D4J39CpM1vLBInM
SSMOg2rBkjg7SFp1Y+xtRNv6V/fYLQq2ohILPu1KkHIf
-----END RSA PRIVATE KEY-----`,
  PUBLIC_KEY: `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDUH3YJ9lSOPsof/8qyHKPG1kuA
QXNLEWE4bd+VLBgbEitOwm9+TLpzcnzweaiVfr9NIoaEydxP4ZlJF/h/7fhOuazS
QRld429/k+ZzyfmpDkGIPbgKOndPdy0AuWZoiEMXKQvSbtmbCN0isWlquW1vU7Fn
SJi4Dm1LbgpnL6FLgwIDAQAB
-----END PUBLIC KEY-----`,

  MAIL_TRANSPORTER: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    auth: {
      user: process.env.SMTP_USERNAME || 'something@gmail.com',
      pass: process.env.SMTP_PASSWORD || 'afwefblhwejpwkvf'
    }
  },
  SMTP_FROM: process.env.SMTP_FROM || 'hello@something.com',
  READ_ARTICLE_TTL: process.env.READ_ARTICLE_TTL || 259200, // 3 days in seconds (60 * 60 * 24 * 3)
}
module.exports = defaultVar
