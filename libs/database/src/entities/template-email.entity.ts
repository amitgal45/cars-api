import { Entity, PrimaryColumn, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity()
export class EmailTemplate extends BaseEntity {
  @Column()
  subject: string;

  @Column('text')
  content: string;
  
  @Column('jsonb', { nullable: true })
  metadata?: Record<string, any>;

  // Sample templates
  static readonly WELCOME_EMAIL = {
    id: 'welcome-email',
    subject: 'Welcome to Cars API, {{name}}!',
    content: `
      <h1>Welcome to Cars API!</h1>
      <p>Dear {{name}},</p>
      <p>Thank you for joining our platform. We're excited to have you on board!</p>
      <p>Your account has been successfully created with the following details:</p>
      <ul>
        <li>Email: {{email}}</li>
        <li>Account Type: {{accountType}}</li>
      </ul>
      <p>If you have any questions, feel free to contact our support team.</p>
      <p>Best regards,<br>The Cars API Team</p>
    `,
    metadata: {
      category: 'welcome',
      tags: ['onboarding', 'welcome']
    }
  };

  static readonly PASSWORD_RESET = {
    id: 'password-reset',
    subject: 'Password Reset Request for Cars API',
    content: `
      <h2>Password Reset Request</h2>
      <p>Hello {{name}},</p>
      <p>We received a request to reset your password. Click the link below to proceed:</p>
      <p><a href="{{resetLink}}">Reset Password</a></p>
      <p>This link will expire in {{expiryTime}} minutes.</p>
      <p>If you didn't request this, please ignore this email.</p>
      <p>Best regards,<br>The Cars API Team</p>
    `,
    metadata: {
      category: 'security',
      tags: ['password', 'reset']
    }
  };

  static readonly CAR_LISTING_NOTIFICATION = {
    id: 'car-listing-notification',
    subject: 'New Car Listing: {{carMake}} {{carModel}}',
    content: `
      <h2>New Car Listing Alert!</h2>
      <p>Hello {{name}},</p>
      <p>A new car matching your preferences has been listed:</p>
      <div style="border: 1px solid #ddd; padding: 15px; margin: 10px 0;">
        <h3>{{carMake}} {{carModel}} ({{carYear}})</h3>
        <p><strong>Price:</strong> {{price}}</p>
        <p><strong>Mileage:</strong> {{mileage}} km</p>
        <p><strong>Location:</strong> {{location}}</p>
      </div>
      <p>View the full listing: <a href="{{listingUrl}}">Click here</a></p>
      <p>Best regards,<br>The Cars API Team</p>
    `,
    metadata: {
      category: 'notifications',
      tags: ['cars', 'listings', 'alerts']
    }
  };
}
