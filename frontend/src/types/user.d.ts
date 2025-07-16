interface IUser {
  _id: string;
  email: string;
  name: string;
}

interface ILogin {
  access_token: string;
  user: IUser;
}

interface IRegister {
  _id: string;
  createdAt: string;
}

interface IUserUpdatePayload {
  id: number;
  name: string;
  email: string;
}

interface IFetchAccount {
  user: IUser;
}

interface IUserTable extends IUser {
  createdAt: string;
  updatedAt: string;
}