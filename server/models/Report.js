import mongoose from 'mongoose';
import { REPORT_REASONS } from '../config/constants.js';

const reportSchema = new mongoose.Schema(
  {
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    reportedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reportedMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message'
    },
    reportedConversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation'
    },
    reason: {
      type: String,
      enum: Object.values(REPORT_REASONS),
      required: true
    },
    description: {
      type: String,
      default: '',
      maxlength: [500, 'Description cannot exceed 500 characters']
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'resolved', 'dismissed'],
      default: 'pending'
    },
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

reportSchema.index({ status: 1, createdAt: -1 });

export const Report = mongoose.model('Report', reportSchema);