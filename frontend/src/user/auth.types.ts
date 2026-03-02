
export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface VerifyData {
    email: string;
    verificationCode: string;
}