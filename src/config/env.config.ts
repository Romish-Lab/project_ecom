const ENV_CONFIG = {
  db_uri: process.env.DB_URI as string,
  port: process.env.PORT || 8080,

  jwt_secret: process.env.JWT_SECRET as string,
  jwt_expiry: process.env.JWT_EXPIRY as string,
};

export default ENV_CONFIG;