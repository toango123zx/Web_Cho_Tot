import axios from "@/services/axios.customize";
import type { AxiosResponse } from "axios";

export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));


export const loginAPI = async (username: string, password: string) => {
  const urlBackend = "/api/auth/login";
  await sleep(3000); 
  return axios.post<IBackendRes<ILogin>>(urlBackend, { username, password });
};


export const registerAPI = async (name: string, email: string, password: string) => {
  const urlBackend = "/api/auth/register";
  return axios.post<IBackendRes<IRegister>>(urlBackend, { name, email, password });
};

export const fetchAccountAPI = async () => {
  const urlBackend = "/api/auth/account";
  await sleep(1500);
  return axios.get<IBackendRes<IFetchAccount>>(urlBackend);
};

export const getUsersAPI = () => {
  const urlBackend = `/api/users`;
  return axios.get<IBackendRes<IModelPaginate<IUserTable>>>(urlBackend);
};

export const getOnlineUsersAPI = () => {  
  const urlBackend = `/api/users/online`;
  return axios.get<IBackendRes<IOnlineUser>>(urlBackend);
};

export const getMessagesAPI = (receiverId: string) => {
  const urlBackend = `/api/messages/${receiverId}`;
  return axios.get<IBackendRes<IMessage[]>>(urlBackend);
};

export const getUsersPaginateAPI = (page: number, limit: number) => {
  return axios.get("/users", {
    params: {
      _page: page,
      _limit: limit,
    },
  });
};

export const createUserAPI = (payload: IUser) => {
  return axios.post("/api/users", payload);
};

export const deleteUserAPI = (id: number) => {
  return axios.delete(`/api/users/${id}`);
};


export const updateUserAPI = ({ id, ...rest }: IUserUpdatePayload) => {
  return axios.put(`/api/users/${id}`, rest);
};