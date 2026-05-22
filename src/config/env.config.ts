import cloudinary from "./cloudinary.config";

const ENV_CONFIG = {
  db_uri: process.env.DB_URI as string,
  port: process.env.PORT || 8080,

  jwt_secret: process.env.JWT_SECRET as string,
  jwt_expiry: process.env.JWT_EXPIRY as string,
  cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME!!,
  cloudinary_api_key: process.env.CLOUDINARY_API_KEY!!,
  cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET!!,
};

export default ENV_CONFIG;
