import { config as dotenvConfig } from "dotenv";
dotenvConfig();
dotenvConfig({path:`.env.${process.env.NODE_ENV}`});

export default {
  generic: {
    host: process.env.SWIFTCRIB_REDIS_HOST,
    port: parseInt(process.env.SWIFTCRIB_REDIS_GENERIC_PORT as string),
    password: process.env.SWIFTCRIB_REDIS_PASSWORD
  }
};
  
