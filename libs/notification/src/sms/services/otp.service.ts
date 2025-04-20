import { Injectable } from '@nestjs/common';
import { IOtpService } from '../interfaces/otp-service.interface';
import { randomBytes } from 'crypto';

@Injectable()
export class OtpService implements IOtpService {
  private readonly otpStore: Map<string, { code: string; expiresAt: number }> = new Map();
  private readonly OTP_LENGTH = 6;
  private readonly OTP_EXPIRY_MINUTES = 5;

  async generateOtp(phoneNumber: string): Promise<{
    id: string;
    code: string;
    expiresIn: number;
  }> {
    // Generate random OTP
    const code = randomBytes(this.OTP_LENGTH).toString('hex').slice(0, this.OTP_LENGTH).toUpperCase();

    // Calculate expiry time
    const expiresAt = Date.now() + this.OTP_EXPIRY_MINUTES * 60 * 1000;

    // Store OTP
    this.otpStore.set(phoneNumber, { code, expiresAt });

    return {
      id: phoneNumber, // Using phone number as ID for simplicity
      code,
      expiresIn: this.OTP_EXPIRY_MINUTES,
    };
  }

  async verifyOtp(
    phoneNumber: string,
    code: string,
  ): Promise<{
    isValid: boolean;
    message: string;
  }> {
    const storedOtp = this.otpStore.get(phoneNumber);

    if (!storedOtp) {
      return {
        isValid: false,
        message: 'No OTP found for this phone number',
      };
    }

    if (Date.now() > storedOtp.expiresAt) {
      this.otpStore.delete(phoneNumber);
      return {
        isValid: false,
        message: 'OTP has expired',
      };
    }

    if (storedOtp.code !== code.toUpperCase()) {
      return {
        isValid: false,
        message: 'Invalid OTP code',
      };
    }

    // Clear the OTP after successful verification
    this.otpStore.delete(phoneNumber);

    return {
      isValid: true,
      message: 'OTP verified successfully',
    };
  }
}
