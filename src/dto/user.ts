export interface UserRegisterDto {
  name: string;
  email: string;
  password: string;
  type: 'regular' | 'pro';
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface UserPublicDto {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  type: 'regular' | 'pro';
}

export interface AuthTokenDto {
  token: string;
}
