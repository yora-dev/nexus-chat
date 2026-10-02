import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    type: {
      type: String,
      enum: ['message', 'mention', 'reaction', 'group_invite', 'group_activity', 'chat_request'],
      required: true
    },
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation'
    },
    message: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message'
    },
    content: {
      type: String,
      required: true
    },
    isRead: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

notificationSchema.index({ recipient: 1, createdAt: -1 });

export const Notification = mongoose.model('Notification', notificationSchema);