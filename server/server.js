import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// File paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve frontend files
app.use(express.static(path.join(__dirname, "..")));

// Parse form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Home page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "index.html"));
});

// Contact form
app.post("/contact", async (req, res) => {
  const { name, email, subject, message } = req.body;

  console.log("📨 Contact form received");

  try {
    // Validate fields
    if (!name || !email || !subject || !message) {
      console.log("⚠️ Missing fields");
      return res.redirect("/?error=missing");
    }

    console.log(
      "EMAIL_USER:",
      process.env.EMAIL_USER ? "FOUND" : "MISSING"
    );

    console.log(
      "EMAIL_PASS:",
      process.env.EMAIL_PASS ? "FOUND" : "MISSING"
    );

    // Gmail transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      connectionTimeout: 10000, // 10 seconds
    });

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      replyTo: email,
      to: process.env.EMAIL_USER,
      subject: `📬 Portfolio Contact: ${subject}`,
      text: `
Name: ${name}
Email: ${email}

Message:
${message}
      `,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color:#0d6efd;">New Portfolio Message</h2>

          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>

          <hr>

          <p>${message}</p>
        </div>
      `,
    });

    console.log("✅ Email sent successfully");

    return res.redirect("/?sent=true");

  } catch (error) {
    console.error("❌ Email error:", error);

    return res.redirect("/?error=send");
  }
});

// Start server
app.listen(port, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${port}`);
});