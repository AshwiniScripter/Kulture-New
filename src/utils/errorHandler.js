const extractErrorMessage = (payload) => {
  if (!payload) return null;
  if (typeof payload === 'string') return payload;
  if (payload.message) {
    if (typeof payload.message === 'string') return payload.message;
    if (payload.message.message) return payload.message.message;
    if (payload.message.exc) {
      const match = String(payload.message.exc).match(/"message":\s*"(.+?)"/);
      return match ? match[1] : 'An error occurred';
    }
    return null;
  }
  if (payload.exc) {
    const match = String(payload.exc).match(/"message":\s*"(.+?)"/);
    return match ? match[1] : 'An error occurred';
  }
  if (payload._server_messages) {
    try {
      const parsed = JSON.parse(payload._server_messages);
      if (Array.isArray(parsed) && parsed.length) {
        const msg = String(parsed[0])
          .replace(/^__\w+:\s*/, '')
          .replace(/<[^>]+>/g, '');
        return msg;
      }
    } catch {
      return null;
    }
  }
  return null;
};

const handleApiError = (error, fallback = 'An unknown error occurred') => {
  if (error?.response?.status === 401) {
    return 'Session expired. Please login again.';
  }
  if (error?.response?.status === 400) {
    return error.response?.data?.message || 'Invalid request';
  }
  if (error?.response?.status === 500) {
    return 'Server error. Please try again later.';
  }
  return error?.message || fallback;
};

export { extractErrorMessage, handleApiError };
