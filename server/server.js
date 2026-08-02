import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Get current file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve the parent portfolio folder
app.use(express.static(path.join(__dirname, "..")));

// Parse form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve portfolio homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "index.html"));
});

// Contact form route
app.post("/contact", async (req, res) => {
  const { name, email, subject, message } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `Portfolio Contact: ${subject}`,
      html: `
        <h2>New Portfolio Message</h2>

        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>

        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

 res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Message Sent</title>

  <link
    href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/css/bootstrap.min.css"
    rel="stylesheet">

  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">

  <style>
    body{
      min-height:100vh;
      display:flex;
      justify-content:center;
      align-items:center;
      background:linear-gradient(135deg,#0d1117,#161b22);
      color:white;
    }

    .success-card{
      max-width:500px;
      width:100%;
      background:#fff;
      color:#212529;
      border:none;
      border-radius:24px;
      padding:3rem 2rem;
      text-align:center;
      animation:popIn .6s ease;
      box-shadow:0 20px 50px rgba(0,0,0,.35);
    }

    .success-icon{
      font-size:4rem;
      color:#198754;
      animation:bounce 1s ease infinite alternate;
    }

    @keyframes popIn{
      from{
        opacity:0;
        transform:scale(.8) translateY(30px);
      }
      to{
        opacity:1;
        transform:scale(1) translateY(0);
      }
    }

    @keyframes bounce{
      from{ transform:translateY(0); }
      to{ transform:translateY(-8px); }
    }
  </style>
</head>

<body>

  <div class="success-card">
    <div class="success-icon mb-3">
      <i class="fas fa-circle-check"></i>
    </div>

    <h2 class="fw-bold mb-3">Message Sent Successfully!</h2>

    <p class="text-muted mb-4">
      Thank you for contacting <strong>OwenTech</strong>.
      Your message has been delivered and I’ll get back to you as soon as possible.
    </p>

    <a href="/" class="btn btn-success btn-lg rounded-pill px-4">
      <i class="fas fa-arrow-left me-2"></i>
      Back to Portfolio
    </a>
  </div>

</body>
</html>
`);
  } catch (error) {
    console.error("Email error:", error);

   res.status(500).send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <link
    href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/css/bootstrap.min.css"
    rel="stylesheet">

  <style>
    body{
      min-height:100vh;
      display:flex;
      justify-content:center;
      align-items:center;
      background:linear-gradient(135deg,#0d1117,#161b22);
    }

    .error-card{
      max-width:500px;
      width:100%;
      background:white;
      border-radius:24px;
      padding:3rem 2rem;
      text-align:center;
      animation:shake .5s ease;
      box-shadow:0 20px 50px rgba(0,0,0,.35);
    }

    @keyframes shake{
      0%,100%{ transform:translateX(0); }
      25%{ transform:translateX(-8px); }
      75%{ transform:translateX(8px); }
    }
  </style>
</head>

<body>

  <div class="error-card">
    <div class="display-1 text-danger mb-3">⚠️</div>

    <h2 class="fw-bold mb-3 text-danger">Could Not Send Message</h2>

    <p class="text-muted mb-4">
      Something went wrong while sending your message.
      Please try again later or contact me directly via email.
    </p>

    <a href="/" class="btn btn-danger btn-lg rounded-pill px-4">
      <i class="fas fa-arrow-left me-2"></i>
      Try Again
    </a>
  </div>

</body>
</html>
`);
  }
});
// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});