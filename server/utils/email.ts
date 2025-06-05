import crypto from 'crypto';
import nodemailer from 'nodemailer';

// Email configuration
const emailConfig = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
};

// Create transporter
let transporter: nodemailer.Transporter | null = null;

try {
  if (emailConfig.auth.user && emailConfig.auth.pass) {
    transporter = nodemailer.createTransport(emailConfig);
    console.log('Email transporter configured successfully');
  } else {
    console.log('Email credentials not configured - emails will be simulated');
  }
} catch (error) {
  console.error('Error configuring email transporter:', error);
}

export async function sendPasswordResetEmail(email: string, token: string): Promise<boolean> {
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
  
  const mailOptions = {
    from: `"Agenda Master" <${emailConfig.auth.user}>`,
    to: email,
    subject: 'Recuperação de Senha - Agenda Master',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Recuperação de Senha</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #3b82f6; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { 
            display: inline-block; 
            background: #3b82f6; 
            color: white; 
            padding: 12px 24px; 
            text-decoration: none; 
            border-radius: 6px; 
            margin: 20px 0;
            font-weight: bold;
          }
          .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
          .warning { background: #fef3c7; padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #f59e0b; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Recuperação de Senha</h1>
            <p>Agenda Master</p>
          </div>
          
          <div class="content">
            <h2>Olá!</h2>
            <p>Você solicitou a recuperação de senha para sua conta no Agenda Master.</p>
            
            <p>Clique no botão abaixo para criar uma nova senha:</p>
            
            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">Redefinir Senha</a>
            </div>
            
            <div class="warning">
              <strong>⚠️ Importante:</strong>
              <ul>
                <li>Este link é válido por apenas 1 hora</li>
                <li>Se você não solicitou esta recuperação, ignore este email</li>
                <li>Nunca compartilhe este link com outras pessoas</li>
              </ul>
            </div>
            
            <p>Se o botão não funcionar, copie e cole este link no seu navegador:</p>
            <p style="word-break: break-all; background: #e5e7eb; padding: 10px; border-radius: 4px; font-family: monospace;">
              ${resetUrl}
            </p>
          </div>
          
          <div class="footer">
            <p>Este email foi enviado automaticamente pelo sistema Agenda Master.</p>
            <p>Se você não solicitou esta ação, pode ignorar este email com segurança.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Recuperação de Senha - Agenda Master
      
      Olá!
      
      Você solicitou a recuperação de senha para sua conta no Agenda Master.
      
      Acesse este link para criar uma nova senha:
      ${resetUrl}
      
      IMPORTANTE:
      - Este link é válido por apenas 1 hora
      - Se você não solicitou esta recuperação, ignore este email
      - Nunca compartilhe este link com outras pessoas
      
      Se você não solicitou esta ação, pode ignorar este email com segurança.
      
      ---
      Agenda Master
    `
  };

  try {
    if (transporter) {
      console.log(`Sending password reset email to: ${email}`);
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', info.messageId);
      return true;
    } else {
      // Fallback to console simulation if no email configured
      console.log('='.repeat(60));
      console.log('EMAIL SIMULATION - Password Reset');
      console.log('='.repeat(60));
      console.log(`To: ${email}`);
      console.log(`Subject: ${mailOptions.subject}`);
      console.log(`Reset URL: ${resetUrl}`);
      console.log('='.repeat(60));
      console.log('Configure SMTP credentials to send real emails');
      console.log('Required environment variables:');
      console.log('- SMTP_HOST (default: smtp.gmail.com)');
      console.log('- SMTP_PORT (default: 587)');
      console.log('- SMTP_USER (your email)');
      console.log('- SMTP_PASS (your app password)');
      console.log('- SMTP_SECURE (true/false, default: false)');
      console.log('='.repeat(60));
      return true;
    }
  } catch (error) {
    console.error('Error sending email:', error);
    
    // Even if email fails, show the reset link in console for development
    console.log('='.repeat(60));
    console.log('EMAIL FAILED - Showing reset link for development:');
    console.log(`Reset URL: ${resetUrl}`);
    console.log('='.repeat(60));
    
    return false;
  }
}

export function generateResetToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Test email configuration
export async function testEmailConfig(): Promise<boolean> {
  if (!transporter) {
    console.log('Email transporter not configured');
    return false;
  }

  try {
    await transporter.verify();
    console.log('Email configuration is valid');
    return true;
  } catch (error) {
    console.error('Email configuration test failed:', error);
    return false;
  }
}