const nodemailer = require("nodemailer");

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: process.env.EMAIL_PORT === "465", // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify connection
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Email service error:", error);
  } else {
    console.log("✅ Email service ready");
  }
});

// Send job application acknowledgment
const sendApplicationAcknowledgment = async (applicantData, jobTitle) => {
  const { firstName, lastName, email, phone } = applicantData;
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

  const subject = `Application Received: ${jobTitle}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Application Received</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f9f9f9;
        }
        .container {
          background-color: #ffffff;
          border-radius: 10px;
          padding: 30px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
          text-align: center;
          padding-bottom: 20px;
          border-bottom: 2px solid #f0b90b;
        }
        .header h1 {
          color: #f0b90b;
          font-size: 24px;
          margin: 0;
        }
        .content {
          padding: 20px 0;
        }
        .content h2 {
          color: #1a1a1a;
          font-size: 20px;
          margin-bottom: 15px;
        }
        .highlight {
          background-color: #fef9e7;
          border-left: 4px solid #f0b90b;
          padding: 12px 16px;
          border-radius: 4px;
          margin: 15px 0;
        }
        .cta-section {
          background-color: #f0b90b;
          color: #1a1a1a;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
          margin: 20px 0;
        }
        .cta-section h3 {
          margin: 0 0 10px 0;
          font-size: 18px;
        }
        .cta-section p {
          margin: 0 0 15px 0;
        }
        .cta-button {
          display: inline-block;
          background-color: #1a1a1a;
          color: #ffffff;
          padding: 12px 30px;
          text-decoration: none;
          border-radius: 5px;
          font-weight: bold;
        }
        .footer {
          text-align: center;
          padding-top: 20px;
          border-top: 1px solid #eee;
          font-size: 12px;
          color: #888;
        }
        .footer a {
          color: #f0b90b;
          text-decoration: none;
        }
        .social-links {
          margin: 15px 0;
        }
        .social-links a {
          margin: 0 10px;
          color: #555;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎬 Cinematography Academy</h1>
        </div>

        <div class="content">
          <h2>Hi ${firstName} ${lastName},</h2>

          <p>Thank you for applying for the <strong>${jobTitle}</strong> position at Cinematography Academy.</p>

          <div class="highlight">
            <p><strong>✅ Your application has been received!</strong></p>
            <p>We will review your application and contact you within 5-7 business days if you are shortlisted.</p>
          </div>

          <p><strong>Application Details:</strong></p>
          <ul>
            <li><strong>Position:</strong> ${jobTitle}</li>
            <li><strong>Email:</strong> ${email}</li>
            ${phone ? `<li><strong>Phone:</strong> ${phone}</li>` : ''}
            <li><strong>Application Date:</strong> ${new Date().toLocaleDateString()}</li>
          </ul>

          <div class="cta-section">
            <h3>📚 Continue Your Learning Journey</h3>
            <p>While you wait, explore our professional courses and services.</p>
            <a href="${frontendUrl}/courses" class="cta-button">Browse Courses</a>
            <a href="${frontendUrl}/plans-and-pricing" class="cta-button" style="background-color: #333; margin-left: 10px;">View Services</a>
          </div>

          <p>In the meantime, feel free to:</p>
          <ul>
            <li>📖 Explore our <a href="${frontendUrl}/courses" style="color: #f0b90b;">course catalog</a> to enhance your skills</li>
            <li>🎥 Check out our <a href="${frontendUrl}/services" style="color: #f0b90b;">production services</a></li>
            <li>📅 Follow us on social media for updates</li>
          </ul>

          <p>We appreciate your interest in joining our team!</p>

          <p>Best regards,<br>
          <strong>The Cinematography Academy Team</strong></p>
        </div>

        <div class="footer">
          <p>© ${new Date().getFullYear()} Cinematography Academy. All rights reserved.</p>
          <p>
            <a href="${frontendUrl}">Visit our website</a> |
            <a href="${frontendUrl}/contact">Contact Us</a>
          </p>
          <p>
            <small>You received this email because you applied for a position at Cinematography Academy.</small>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: process.env.EMAIL_FROM || `"Cinematography Academy" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: subject,
    html: html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Application acknowledgment email sent to ${email}`);
    console.log(`   Message ID: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Error sending email:", error);
    return { success: false, error: error.message };
  }
};

// Send notification to admin (optional)
const sendAdminNotification = async (applicantData, jobTitle, vacancyId) => {
  const { firstName, lastName, email, phone, message } = applicantData;
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

  const subject = `New Job Application: ${jobTitle}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>New Application Received</title>
    </head>
    <body>
      <h2>New Job Application</h2>
      <p><strong>Position:</strong> ${jobTitle}</p>
      <p><strong>Applicant:</strong> ${firstName} ${lastName}</p>
      <p><strong>Email:</strong> ${email}</p>
      ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
      <p><strong>Message:</strong></p>
      <p>${message || 'No message provided'}</p>
      <p>
        <a href="${frontendUrl}/admin/jobs/${vacancyId}">View Application</a>
      </p>
    </body>
    </html>
  `;

  const mailOptions = {
    from: process.env.EMAIL_FROM || `"Cinematography Academy" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
    subject: subject,
    html: html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Admin notification email sent`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Error sending admin notification:", error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendApplicationAcknowledgment,
  sendAdminNotification,
};