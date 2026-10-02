import mongoose from 'mongoose';
import { CONVERSATION_TYPES, GROUP_ROLES } from '../config/constants.js';

const unreadCountSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    count: {
      type: Number,
      default: 0
    }
  },
  { _id: false }
);

const conversationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: Object.values(CONVERSATION_TYPES),
      default: CONVERSATION_TYPES.DIRECT
    },
    name: {
      type: String,
      trim: true,
      default: ''
    },
    groupImage: {
      type: String,
      default: ''
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      }
    ],
    groupAdmins: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message'
    },
    unreadCounts: [unreadCountSchema],
    pinnedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    mutedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    archivedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    deletedBy: [
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

// Indexes to Accelerate Recent Conversations Query
conversationSchema.index({ participants: 1, updatedAt: -1 });

export const Conversation = mongoose.model('Conversation', conversationSchema);