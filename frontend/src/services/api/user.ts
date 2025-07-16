
import axios from "@/services/AxiosCustomize";

export const getUsersAPI = () => {
  return axios.get<IBackendRes<IModelPaginate<IUserTable>>>("/api/users");
};

export const getUsersPaginateAPI = (page: number, limit: number) => {
  return axios.get("/users", {
    params: { _page: page, _limit: limit },
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

export const getOnlineUsersAPI = () => {
  return axios.get<IBackendRes<IOnlineUser>>("/api/users/online");
};