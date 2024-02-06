export interface User {
  id: string;
  userName: string;
  password?: string;
  token?: string;
  createdAt?: Date;
  lastActive?: Date;
}
