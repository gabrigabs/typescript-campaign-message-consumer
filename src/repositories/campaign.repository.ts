import postgres from '../db/postgres.db';
import logger from '../utils/logger';

class CampaignRepository {
  async updateCampaignStatus(
    campaignId: string,
    status: string = 'SENT',
  ): Promise<void> {
    const client = await postgres.getClient();

    try {
      await client.query('BEGIN');

      const updateQuery = `
        UPDATE "Campaign"
        SET status = $1, updated_at = NOW()
        WHERE id = $2
      `;

      const result = await client.query(updateQuery, [status, campaignId]);

      if (result.rowCount === 0) {
        logger.warn(`Campaign with ID ${campaignId} not found`);
      }

      await client.query('COMMIT');

      logger.info('Campaign status updated', {
        campaignId,
        status,
      });
    } catch (error) {
      await client.query('ROLLBACK');
      logger.error('Error updating campaign status', {
        error,
        campaignId,
      });
      throw error;
    } finally {
      client.release();
    }
  }
}

export default new CampaignRepository();
