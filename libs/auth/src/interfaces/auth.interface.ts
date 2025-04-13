export interface ILoginRequest {
  email: string;
  password: string;
  loginType?: 'ADMIN' | 'USER';
}

export interface IRegisterRequest extends ILoginRequest {
  passwordConfirm: string;
  firstName?: string;
  lastName?: string;
}
