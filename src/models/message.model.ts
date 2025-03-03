import mongoose, { Schema, Document } from 'mongoose';
import { createId } from '@paralleldrive/cuid2';
import { Message } from '../interfaces/message.interface';

const MessageSchema: Schema = new Schema(
  {
    id: {
      type: String,
      default: () => createId(),
      required: true,
      unique: true,
    },
    phone_number: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    campaign_id: {
      type: String,
      required: true,
      index: true,
    },
    company_id: {
      type: String,
      required: true,
      index: true,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
    updated_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
);

export const MessageModel = mongoose.model<Message & Document>(
  'Message',
  MessageSchema,
);
