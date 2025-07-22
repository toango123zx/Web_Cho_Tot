import axios from "@/services/AxiosCustomize";
import { sleep } from "../sleep";

export const loginAPI = async (username: string, password: string) => {
  await sleep(3000);
  return axios.post<IBackendRes<ILogin>>("/api/auth/login", { username, password });
};

export const registerAPI = async (name: string, email: string, password: string) => {
  return axios.post<IBackendRes<IRegister>>("/api/auth/register", { name, email, password });
};

export const fetchAccountAPI = async () => {
  await sleep(1500);
  return axios.get<IBackendRes<IFetchAccount>>("/api/auth/account");
};
