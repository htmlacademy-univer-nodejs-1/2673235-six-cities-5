export type UserType = 'regular' | 'pro';

export interface User {
  name: string;
  email: string;
  avatarUrl?: string;
  password?: string;
  type: UserType;
}
