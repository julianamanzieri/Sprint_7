import dotenv from 'dotenv';

const envFound = dotenv.config();

if (envFound.error) {
  throw new Error("⚠️  Couldn't find.env file  ⚠️");
}

export default {
  port: process.env.PORT || 3000,
  mongoDB: process.env.MONGODB_URI || 'mongodb_default_uri',
  sqlHost: process.env.SQL_HOST || 'localhost',
  sqlUser: process.env.SQL_USER || 'default_user',
  sqlPassword: process.env.SQL_PASSWORD || 'default_password',
  sqlPort: parseInt(process.env.SQL_PORT || '3306', 10),
  sqlDatabase: process.env.SQL_DATABASE || 'default_database',
  database: process.env.DATABASE || 'sql'
};
