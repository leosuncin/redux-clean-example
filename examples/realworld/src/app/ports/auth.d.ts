export type User = {
  email: string;
  username: string;
  bio: string;
  image: string;
};
export type AuthResponse = {
  user: User & {
    token: string;
  };
};

export type AuthReturned = {
  user: User;
  token: string;
};

export type Login = {
  email: string;
  password: string;
};

export type Register = {
  username: string;
  email: string;
  password: string;
};

export type UpdateUser = Partial<User & Register>;

export type AuthApi = {
  register(payload: Register): Promise<AuthReturned>;
  login(payload: Login): Promise<AuthReturned>;
  getUser(): Promise<AuthReturned>;
  updateUser(payload: UpdateUser): Promise<AuthReturned>;
};
