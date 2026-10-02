import mongoose from 'mongoose';
import { MESSAGE_TYPES } from '../config/constants.js';

const reactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    emoji: {
      type: String,
      required: true
    }
  },
  { _id: false }
);

const attachmentSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true
    },
    fileType: {
      type: String,
      required: true
    },
    fileName: {
      type: String,
      default: 'attachment'
    },
    fileSize: {
      type: Number,
      default: 0
    }
  },
  { _id: false }
);

const messageSchema = new mongoose.Schema(
  {
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true,
      index: true
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    content: {
      type: String,
      default: '',
      trim: true
    },
    messageType: {
      type: String,
      enum: Object.values(MESSAGE_TYPES),
      default: MESSAGE_TYPES.TEXT
    },
    attachments: [attachmentSchema],
    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message'
    },
    reactions: [reactionSchema],
    deliveredTo: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    readBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    isEdited: {
      type: Boolean,
      default: false
    },
    pinnedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    deletedFor: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    isDeletedForEveryone: {
      type: Boolean,
      default: false
    },
    mentions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ]
  },
  {
    timestamps: true
  }
);

// Fast Indexes for Paginated Feed Loading and Text Search
messageSchema.index({ conversation: 1, createdAt: -1 });
messageSchema.index({ content: 'text' });

export const Message = mongoose.model('Message', messageSchema);