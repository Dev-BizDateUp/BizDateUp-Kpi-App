const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // SSL
  auth: {
    user: process.env.EMAIL_USER, // Gmail address
    pass: process.env.EMAIL_PASS, // App password (not your normal Gmail password)
  },
});

async function sendWelcomeEmail(to, name) {
  const mailOptions = {
    from: `"BizDateUp KPI" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Welcome to KPI Dashboard",
    html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</head>
<body style="font-family: 'Outfit', Arial, sans-serif; margin: 0; padding: 0; background-color: #D4DFE5;">
  
  <div style="max-width: 600px; margin: 20px auto; padding-bottom:20px; background-color: #D4DFE5;">
    
    <!-- Logo Section -->
    <div style="text-align: center; margin-bottom: 40px;  margin-top: 40px;">
      <img src="https://drive.google.com/uc?export=view&id=1WiMUGFBdBRE4jOyiBVxaTnwpoP2WGKSs" alt="BizDateUp Logo" style="max-width: 200px; height: auto; margin-top: 40px">
    </div>
    
    <!-- Header Banner -->
    <div style="background: #567BFF; border-radius: 15px; padding: 30px; text-align: center; margin-bottom: 20px;">
      <h1 style="color: white; font-size: 28px; margin: 0; font-weight: bold; letter-spacing: 1px;">
        WELCOME TO NEW KPI PORTAL
      </h1>
    </div>
    
    <!-- Main Content Card -->
    <div style="background-color: white; padding: 40px; margin-top: 0; border-radius: 15px;">
      
      <!-- Speaker Icon -->
      <div style="text-align: center; margin-bottom: 30px;">
        <img src="https://drive.google.com/uc?export=view&id=1lokE5MNDzqGlNu92Oai0T95loKnsHww9" alt="Announcement" style="width: 60px; height: 60px;">
      </div>
      
      <div style="text-align: center; margin-bottom: 30px;">
        <h2 style="color: #1f2937; font-size: 24px; margin: 0 0 10px 0;">Dear ${name},</h2>
        <h3 style="color: #1f2937; font-size: 20px; margin: 0 0 5px 0;">We're Live! Launching Our New KPI Portal</h3>
      </div>
      
      <div style="text-align: center; margin-bottom: 30px;">
        <h4 style="color: #1f2937; font-size: 18px; margin: 0; font-weight: normal;">Your Performance, Your Progress</h4>
        <p style="color: #1f2937; font-size: 16px; line-height: 1.6; margin: 20px 0;">
          We're excited to unveil something that puts your performance in your hands — introducing the BizDateUp KPI Portal!
        </p>
      </div>
      
      <!-- Login Button -->
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://internal.bizdateup.com/login" style="display: inline-block; background:  #567BFF; color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: bold;">
          Login Now
        </a>
      </div>
      
      <p style="text-align: center; color: #ef4444; font-weight: bold; margin: 10px 0;">
        Log in using Google Login only
      </p>
      
    </div>
    
    <!-- Features Section -->
    <div style="background-color: white; padding: 30px; margin-top: 20px; padding-bottom: 20px; border-radius: 15px;">
      
      <div style="margin-bottom: 20px;">
        <div style="display: flex; align-items: flex-start; margin-bottom: 15px;">
          <p style="color: #1f2937; font-size: 16px; margin: 0; line-height: 1.5;">
            <span style="font-size: 18px; font-weight: bold;">T</span>his platform is designed to help you track your goals, measure impact, and grow with clarity.
          </p>
        </div>
      </div>
      
      <div style="margin-bottom: 20px;">
        <div style="display: flex; align-items: flex-start; margin-bottom: 15px;">
          <p style="color: #1f2937; font-size: 16px; margin: 0; line-height: 1.5;">
            <span style="font-size: 18px; font-weight: bold;">Y</span>ou'll see how your work aligns with team and company success — because what you measure, you master.
          </p>
        </div>
      </div>
      
      <div style="margin-bottom: 0;">
        <div style="display: flex; align-items: flex-start; margin-bottom: 15px;">
          <p style="color: #1f2937; font-size: 16px; margin: 0; line-height: 1.5;">
            <span style="font-size: 18px; font-weight: bold;">W</span>hether you're aiming higher or staying on track, this portal is your performance compass.
          </p>
        </div>
      </div>
      
    </div>
    
  </div>
  
</body>
</html>`,
  };

  return transporter.sendMail(mailOptions);
}

module.exports = { sendWelcomeEmail };
