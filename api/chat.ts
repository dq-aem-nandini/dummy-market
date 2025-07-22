import api from "./axios";

export const getChatHistory = async (partnerId: string) => {
  const res = await api.get(`/web/api/v1/chat/history/${partnerId}`);
  return res.data?.response;
};

export const sendChatMessage = async (message: {
  senderId: string;
  receiverId: string;
  content: string;
  productId: number;
}) => {
  const res = await api.post("/chat.send", message);
  return res.data;
};
