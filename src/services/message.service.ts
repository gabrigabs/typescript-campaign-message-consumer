import { MessageDTO } from '../dtos/message.dto';
import messageRepository from '../repositories/message.repository';
import campaignRepository from '../repositories/campaign.repository';
import logger from '../utils/logger';

class MessageService {
  async createMessage(messageData: MessageDTO): Promise<void> {
    try {
      logger.info('Creating a new message', {
        campaign_id: messageData.campaign_id,
        phone: messageData.phone_number,
      });

      await messageRepository.saveMessage(messageData);

      await campaignRepository.updateCampaignStatus(messageData.campaign_id);

      logger.info('Message created successfully', {
        campaign_id: messageData.campaign_id,
        phone: messageData.phone_number,
      });
    } catch (error) {
      logger.error('Failed to create message', {
        error,
        campaign_id: messageData.campaign_id,
      });
      throw error;
    }
  }
}

export default new MessageService();
