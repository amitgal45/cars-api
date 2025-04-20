export interface IOtpService {
  generateOtp(phoneNumber: string): Promise<{
    id: string;
    code: string;
    expiresIn: number;
  }>;

  verifyOtp(
    phoneNumber: string,
    code: string,
  ): Promise<{
    isValid: boolean;
    message: string;
  }>;
}
