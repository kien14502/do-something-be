import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import * as path from 'path';

config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT ?? '5432') || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_DATABASE || 'mydb',

  // Entities
  entities: [path.join(__dirname, '..', '**', '*.entity{.ts,.js}')],

  // Migrations
  migrations: [path.join(__dirname, 'migrations', '*{.ts,.js}')],

  synchronize: false,
  logging: ['error', 'warn', 'migration'],
  logger: 'advanced-console',
};

const AppDataSource = new DataSource(dataSourceOptions);

export default AppDataSource;
