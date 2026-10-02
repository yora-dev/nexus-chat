import jwt from 'jsonwebtoken';

export const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET || 'nexus_chat_super_secret_jwt_key_2026_production',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

export const verifyToken = (token) => {
  return jwt.verify(
    token,
    process.env.JWT_SECRET || 'nexus_chat_super_secret_jwt_key_2026_production'
  );
};