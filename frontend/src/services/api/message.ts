import axios from "@/services/AxiosCustomize";

export const getMessagesAPI = (receiverId: string) => {
  return axios.get<IBackendRes<IMessage[]>>(`/api/messages/${receiverId}`);
};
