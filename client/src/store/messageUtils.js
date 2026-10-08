export const getMessageKey = (message) => {
  if (!message) return null;

  if (message._id) return `id:${String(message._id)}`;
  if (message.id) return `id:${String(message.id)}`;

  if (message.conversation && message.createdAt && message.sender) {
    const sender = typeof message.sender === 'object'
      ? message.sender._id || message.sender.id
      : message.sender;

    return `fallback:${String(message.conversation)}:${String(sender)}:${String(message.createdAt)}:${String(message.content || '')}`;
  }

  return null;
};

export const upsertMessage = (messages, incomingMessage) => {
  if (!incomingMessage) return messages;

  const key = getMessageKey(incomingMessage);
  if (!key) return [...messages, incomingMessage];

  const existingIndex = messages.findIndex((message) => getMessageKey(message) === key);

  if (existingIndex === -1) {
    return [...messages, incomingMessage];
  }

  const nextMessages = [...messages];
  nextMessages[existingIndex] = {
    ...nextMessages[existingIndex],
    ...incomingMessage
  };

  return nextMessages;
};
