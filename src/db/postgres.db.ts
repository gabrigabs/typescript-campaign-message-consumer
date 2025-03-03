import { Pool, PoolClient } from 'pg';
import config from '../config';
import logger from '../utils/logger';

class PostgresDB {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      host: config.postgres.host,
      port: config.postgres.port,
      database: config.postgres.database,
      user: config.postgres.user,
      password: config.postgres.password,
      ssl: config.postgres.ssl ? { rejectUnauthorized: false } : undefined,
    });

    this.pool.on('error', (err) => {
      logger.error('Unexpected error on PostgreSQL client', {
        error: err,
      });
    });
  }

  async connect(): Promise<void> {
    try {
      const client = await this.pool.connect();
      client.release();
      logger.info('Connected to PostgreSQL');
    } catch (error) {
      logger.error('Error connecting to PostgreSQL', { error });
      throw error;
    }
  }

  async getClient(): Promise<PoolClient> {
    return this.pool.connect();
  }
}

export default new PostgresDB();
