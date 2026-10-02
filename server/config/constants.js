export const ROLES = {
  USER: 'user',
  ADMIN: 'admin'
};

export const GROUP_ROLES = {
  OWNER: 'owner',
  ADMIN: 'admin',
  MEMBER: 'member'
};

export const MESSAGE_TYPES = {
  TEXT: 'text',
  IMAGE: 'image',
  FILE: 'file',
  AUDIO: 'audio',
  SYSTEM: 'system'
};

export const CONVERSATION_TYPES = {
  DIRECT: 'direct',
  GROUP: 'group'
};

export const REPORT_REASONS = {
  SPAM: 'Spam',
  HARASSMENT: 'Harassment',
  SCAM: 'Scam',
  INAPPROPRIATE: 'Inappropriate content',
  IMPERSONATION: 'Impersonation',
  OTHER: 'Other'
};

export const ALLOWED_FILE_TYPES = {
  IMAGES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  DOCUMENTS: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'application/zip',
    'application/x-zip-compressed'
  ],
  AUDIO: ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/webm']
};

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB