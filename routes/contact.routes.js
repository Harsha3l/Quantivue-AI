import express from "express";
import { query } from "../index.js";
import nodemailer from "nodemailer";

const router = express.Router();

// Get SMTP configuration from environment variables
function getSmtpTransport() {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const user = process.env.SMTP_USER || "";
  const pass = process.env.SMTP_PASS || "";

  if (!user || !pass) {
    console.warn("⚠️ SMTP credentials not configured. Contact emails will be logged to console only.");
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

/**
 * POST /contact - Submit contact form
 */
router.post("/", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        detail: "All fields are required",
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        detail: "Invalid email address",
      });
    }

    // Store contact submission in database (optional)
    try {
      await query(
        `INSERT INTO contact_submissions (name, email, subject, message, created_at)
         VALUES ($1, $2, $3, $4, NOW())`,
        [name, email.toLowerCase(), subject, message]
      );
    } catch (dbError) {
      // Table might not exist, that's okay - we'll still try to send email
      console.warn("⚠️ Could not save to database:", dbError.message);
    }

    // Send email notification
    const transporter = getSmtpTransport();
    if (transporter) {
      try {
        const supportEmail = process.env.SUPPORT_EMAIL || "support@quantivue.ai";
        
        await transporter.sendMail({
          from: `"${name}" <${email}>`,
          to: supportEmail,
          replyTo: email,
          subject: `Contact Form: ${subject}`,
          html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <p>${message.replace(/\n/g, '<br>')}</p>
            <hr>
            <p><small>This email was sent from the Quantivue AI contact form.</small></p>
          `,
          text: `
            New Contact Form Submission
            
            Name: ${name}
            Email: ${email}
            Subject: ${subject}
            
            Message:
            ${message}
          `,
        });

        console.log(`✅ Contact form email sent from ${email} to ${supportEmail}`);
      } catch (emailError) {
        console.error("❌ Failed to send contact email:", emailError);
        // Still return success if database save worked
      }
    } else {
      // Log to console if SMTP not configured
      console.log("📧 Contact Form Submission (SMTP not configured):");
      console.log(`   Name: ${name}`);
      console.log(`   Email: ${email}`);
      console.log(`   Subject: ${subject}`);
      console.log(`   Message: ${message}`);
    }

    return res.status(200).json({
      message: "Thank you for contacting us! We'll get back to you soon.",
    });
  } catch (error) {
    console.error("❌ Contact form error:", error);
    return res.status(500).json({
      detail: "Failed to submit contact form. Please try again.",
    });
  }
});

/**
 * GET /contact/info - Get contact information
 */
router.get("/info", async (req, res) => {
  try {
    // Return contact info (can be made dynamic from database later)
    return res.status(200).json({
      phone: "9014670723",
      location: "Hyderabad",
      email: "support@quantivue.ai",
      supportFeatures: [
        {
          icon: "MessageSquare",
          title: "Live Chat",
          description: "Get instant help from our support team via live chat.",
        },
        {
          icon: "Clock",
          title: "Quick Response",
          description: "We respond to all inquiries within 24 hours.",
        },
        {
          icon: "Headphones",
          title: "24/7 Support",
          description: "Our team is available around the clock for urgent issues.",
        },
      ],
    });
  } catch (error) {
    console.error("❌ Contact info error:", error);
    return res.status(500).json({
      detail: "Failed to fetch contact information",
    });
  }
});

export default router;
