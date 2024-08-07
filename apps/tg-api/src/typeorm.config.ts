import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

config({ path: '.env' });

const { DB_DATABASE, DB_HOST, DB_PASSWORD, DB_PORT, DB_USERNAME } = process.env;

const entities = ['src/**/*.entity{.ts,.js}', '**/*.entity{.ts,.js}'];
const migrations = [
  'src/db/migrations/*',
  'db/db/migrations/*',
  'db/apps/backend/src/db/migrations/*',
];

const connectionSource = new DataSource({
  database: DB_DATABASE,
  entities: entities,
  host: DB_HOST,
  migrations: migrations,
  namingStrategy: new SnakeNamingStrategy(),
  password: DB_PASSWORD,
  port: Number(DB_PORT),
  synchronize: false,
  type: 'postgres',
  username: DB_USERNAME,
});

export default connectionSource;
