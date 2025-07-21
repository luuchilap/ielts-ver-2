const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_PORT == 465, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Email templates
const emailTemplates = {
  emailVerification: {
    subject: 'Verify Your Email - IELTS Platform',
    html: (data) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
          <h1 style="color: #2563eb;">IELTS Platform</h1>
        </div>
        <div style="padding: 30px 20px;">
          <h2>Welcome ${data.name}!</h2>
          <p>Thank you for registering with IELTS Platform. To complete your registration, please verify your email address by clicking the button below:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.verificationUrl}" 
               style="background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Verify Email Address
            </a>
          </div>
          
          <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #6b7280;">${data.verificationUrl}</p>
          
          <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
            If you didn't create an account with us, please ignore this email.
          </p>
        </div>
        <div style="background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #6b7280;">
          © 2024 IELTS Platform. All rights reserved.
        </div>
      </div>
    `
  },

  passwordReset: {
    subject: 'Password Reset - IELTS Platform',
    html: (data) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
          <h1 style="color: #2563eb;">IELTS Platform</h1>
        </div>
        <div style="padding: 30px 20px;">
          <h2>Password Reset Request</h2>
          <p>Hello ${data.name},</p>
          <p>We received a request to reset your password. Click the button below to reset it:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.resetUrl}" 
               style="background-color: #dc2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Reset Password
            </a>
          </div>
          
          <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #6b7280;">${data.resetUrl}</p>
          
          <p style="margin-top: 30px; color: #dc2626; font-weight: bold;">
            This link will expire in 10 minutes for security reasons.
          </p>
          
          <p style="color: #6b7280; font-size: 14px;">
            If you didn't request a password reset, please ignore this email or contact support if you're concerned about your account security.
          </p>
        </div>
        <div style="background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #6b7280;">
          © 2024 IELTS Platform. All rights reserved.
        </div>
      </div>
    `
  },

  welcomeComplete: {
    subject: 'Welcome to IELTS Platform!',
    html: (data) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
          <h1 style="color: #2563eb;">IELTS Platform</h1>
        </div>
        <div style="padding: 30px 20px;">
          <h2>Welcome to IELTS Platform!</h2>
          <p>Hello ${data.name},</p>
          <p>Your email has been verified and your account is now active. You can start taking IELTS practice tests and track your progress.</p>
          
          <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1e40af; margin-top: 0;">What's Next?</h3>
            <ul style="color: #374151;">
              <li>Complete your profile to get personalized recommendations</li>
              <li>Take a diagnostic test to assess your current level</li>
              <li>Browse our library of practice tests</li>
              <li>Track your progress and improvement over time</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/dashboard" 
               style="background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Go to Dashboard
            </a>
          </div>
        </div>
        <div style="background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #6b7280;">
          © 2024 IELTS Platform. All rights reserved.
        </div>
      </div>
    `
  },

  testCompletion: {
    subject: 'Test Completed - IELTS Platform',
    html: (data) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
          <h1 style="color: #2563eb;">IELTS Platform</h1>
        </div>
        <div style="padding: 30px 20px;">
          <h2>Test Completed!</h2>
          <p>Hello ${data.name},</p>
          <p>Congratulations! You have successfully completed "${data.testTitle}".</p>
          
          <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1e40af; margin-top: 0;">Your Results</h3>
            <p><strong>Overall Score:</strong> ${data.overallScore}/9</p>
            <p><strong>Completion Time:</strong> ${data.completionTime}</p>
            ${data.skillScores ? `
              <p><strong>Skill Breakdown:</strong></p>
              <ul>
                ${data.skillScores.reading ? `<li>Reading: ${data.skillScores.reading}/9</li>` : ''}
                ${data.skillScores.listening ? `<li>Listening: ${data.skillScores.listening}/9</li>` : ''}
                ${data.skillScores.writing ? `<li>Writing: ${data.skillScores.writing}/9</li>` : ''}
                ${data.skillScores.speaking ? `<li>Speaking: ${data.skillScores.speaking}/9</li>` : ''}
              </ul>
            ` : ''}
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.resultsUrl}" 
               style="background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              View Detailed Results
            </a>
          </div>
        </div>
        <div style="background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #6b7280;">
          © 2024 IELTS Platform. All rights reserved.
        </div>
      </div>
    `
  }
};

// Send email function
exports.sendEmail = async (options) => {
  try {
    const transporter = createTransporter();

    // Get template
    const template = emailTemplates[options.template];
    if (!template) {
      throw new Error(`Email template '${options.template}' not found`);
    }

    // Prepare email options
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: options.to,
      subject: options.subject || template.subject,
      html: template.html(options.data || {}),
      ...(options.attachments && { attachments: options.attachments })
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    
    console.log('Email sent successfully:', {
      messageId: info.messageId,
      to: options.to,
      subject: mailOptions.subject
    });

    return {
      success: true,
      messageId: info.messageId
    };

  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
};

// Send bulk email
exports.sendBulkEmail = async (emails) => {
  const results = [];
  
  for (const email of emails) {
    try {
      const result = await exports.sendEmail(email);
      results.push({ ...result, email: email.to });
    } catch (error) {
      results.push({ 
        success: false, 
        error: error.message, 
        email: email.to 
      });
    }
  }
  
  return results;
};

// Verify email configuration
exports.verifyEmailConfig = async () => {
  try {
    const transporter = createTransporter();
    const verified = await transporter.verify();
    
    if (verified) {
      console.log('✅ Email configuration is valid');
      return true;
    } else {
      console.log('❌ Email configuration is invalid');
      return false;
    }
  } catch (error) {
    console.error('❌ Email configuration error:', error.message);
    return false;
  }
};

// Email queue for handling high volume (basic implementation)
class EmailQueue {
  constructor() {
    this.queue = [];
    this.processing = false;
    this.maxRetries = 3;
  }

  add(emailOptions) {
    this.queue.push({
      ...emailOptions,
      retries: 0,
      addedAt: new Date()
    });
    
    if (!this.processing) {
      this.process();
    }
  }

  async process() {
    this.processing = true;
    
    while (this.queue.length > 0) {
      const email = this.queue.shift();
      
      try {
        await exports.sendEmail(email);
        console.log(`✅ Email sent to ${email.to}`);
      } catch (error) {
        console.error(`❌ Failed to send email to ${email.to}:`, error.message);
        
        // Retry logic
        if (email.retries < this.maxRetries) {
          email.retries++;
          this.queue.push(email);
          console.log(`🔄 Retrying email to ${email.to} (attempt ${email.retries + 1})`);
        } else {
          console.error(`💀 Max retries reached for email to ${email.to}`);
        }
      }
      
      // Small delay between emails to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    this.processing = false;
  }
}

// Export email queue instance
exports.emailQueue = new EmailQueue();
