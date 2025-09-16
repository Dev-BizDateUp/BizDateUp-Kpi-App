const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
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
async function senderwillgetemail(name,to,receiver_name) {
  const mailOptions = {
    from: `"BizDateUp KPI" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Shared Badge To Other Employee",
    html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="color-scheme" content="light dark">
    <meta name="supported-color-schemes" content="light dark">
    <title>Shine Badge Recognition</title>
    <!--[if mso]>
    <noscript>
        <xml>
            <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
    </noscript>
    <![endif]-->
    
    <style type="text/css">
        /* Universal styles that work in light and dark mode */
        :root {
            color-scheme: light dark;
            supported-color-schemes: light dark;
        }
        
        /* Mobile responsive styles */
        @media only screen and (max-width: 600px) {
            .container { width: 100% !important; max-width: 100% !important; }
            .header-padding { padding: 30px 20px !important; }
            .content-padding { padding: 30px 20px !important; }
            .main-title { font-size: 20px !important; }
            .cta-button { width: 100% !important; }
            .cta-button a { display: block !important; font-size: 18px !important; }
        }
        
        /* Dark mode protection */
        @media (prefers-color-scheme: dark) {
            .protect-dark { 
                background: #fefefe !important; 
                color: #111111 !important; 
            }
            .protect-header {
                background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 25%, #1e40af 50%, #2563eb 75%, #1d4ed8 100%) !important;
                color: #fefefe !important;
            }
            .slate-text { color: #60a5fa !important; }
            .accent-text { color: #fbbf24 !important; }
            .text-primary { color: #111111 !important; }
            .text-secondary { color: #333333 !important; }
            .highlight-box {
                background: #2a2a2a !important;
                border-left: 4px solid #60a5fa !important;
                border: 1px solid #404040 !important;
                color: #fefefe !important;
            }
            .cta-section {
                background: #2a2a2a !important;
                border-left: 4px solid #16a34a !important;
                border: 1px solid #404040 !important;
                color: #fefefe !important;
            }
            .cta-button-dark {
                background: #60a5fa !important;
                color: #111111 !important;
                border: 2px solid #111111 !important;
            }
        }
        
        /* Keyframe animations for shiny effects */
        @keyframes shineMove {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
        }
        
        @keyframes shimmer {
            0% { transform: translateX(-100%) skewX(-15deg); }
            100% { transform: translateX(200%) skewX(-15deg); }
        }
        
        @keyframes shineEffect {
            0% { transform: translateX(-150%) translateY(-150%) rotate(45deg); }
            50% { transform: translateX(50%) translateY(50%) rotate(45deg); }
            100% { transform: translateX(250%) translateY(250%) rotate(45deg); }
        }
    </style>
</head>

<body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">
    
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f5f5f5;">
        <tr>
            <td align="center" style="padding: 20px 10px;">
                
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 32px rgba(0,0,0,0.12); border: 1px solid #e0e0e0;" class="container protect-dark">
                    
                    <!-- Header with blue gradient and shine effect -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 25%, #2563eb 50%, #1d4ed8 75%, #1e3a8a 100%); background-size: 300% 300%; padding: 35px 30px; text-align: center; position: relative; animation: shineMove 6s ease-in-out infinite;" class="header-padding protect-header">
                            
                            <!-- Shine overlay effects -->
                            <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(45deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.6) 25%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0.6) 75%, rgba(255,255,255,0.2) 100%); pointer-events: none; opacity: 0.7; animation: shimmer 4s linear infinite;"></div>
                            
                            <!-- Moving shine effect -->
                            <div style="position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.6) 50%, transparent 70%); transform: rotate(45deg); animation: shineEffect 3s ease-in-out infinite; pointer-events: none;"></div>
                            
                            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: 1px; position: relative; z-index: 3; text-shadow: 0 2px 8px rgba(0,0,0,0.5);" class="main-title">
                                Shine Badge Recognition
                            </h1>
                        </td>
                    </tr>
                    
                    <!-- Main content area -->
                    <tr>
                        <td style="padding: 35px 30px; background-color: #ffffff;" class="content-padding protect-dark">
                            
                            <p style="font-size: 18px; color: #212529; margin: 0 0 20px; font-weight: 600; text-align: left;" class="text-primary">
                                Hi <strong style="color: #1e40af;" class="slate-text">${name}</strong>,
                            </p>
                            
                            <p style="font-size: 16px; color: #495057; margin: 0 0 20px; line-height: 1.6; text-align: left;" class="text-secondary">
                                Thank you for recognizing your colleague with a <strong style="font-weight: 700; color: #1e40af;" class="slate-text">Shine Badge</strong>! 
                            </p>
                            
                            <p style="font-size: 16px; color: #495057; margin: 0 0 25px; line-height: 1.6; text-align: left;" class="text-secondary">
                                Your appreciation helps us build a culture of recognition, teamwork, and positivity.
                            </p>
                            
                            <!-- Badge recipient highlight -->
                            <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 18px; border-radius: 6px; margin: 25px 0; text-align: left;" class="highlight-box">
                                <p style="margin: 0; font-size: 16px; color: #212529; font-weight: 600; text-align: left;" class="text-primary">
                                    <strong style="color: #1e40af;" class="slate-text">Badge Given To:</strong> 
                                    <span style="font-weight: 700; color: #f59e0b;" class="accent-text">${receiver_name}</span>
                                </p>
                            </div>
                            
                            <!-- View Badge CTA Button Section -->
                            <div style="background-color: #f8fdf8; padding: 25px; border-radius: 12px; margin: 25px 0; text-align: center; border-left: 4px solid #16a34a; border: 1px solid #e0f2e0;" class="cta-section">
                                <p style="color: #16a34a; font-size: 16px; font-weight: 700; margin: 0 0 15px 0; text-transform: uppercase; letter-spacing: 0.5px;">
                                    &#127942; Badge Details
                                </p>
                                <p style="color: #1f2937; font-size: 14px; margin: 0 0 20px 0; line-height: 1.5;">
                                    Click below to view the complete badge details and recognition message
                                </p>
                                
                                <!-- Bulletproof CTA Button -->
                                <!--[if mso]>
                                <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="https://internal.bizdateup.com/login" style="height:50px;v-text-anchor:middle;width:200px;" arcsize="10%" strokecolor="#1e40af" fillcolor="#3b82f6">
                                  <w:anchorlock/>
                                  <center style="color:#ffffff;font-family:Arial,sans-serif;font-size:16px;font-weight:bold;">View Badge &#11088;</center>
                                </v:roundrect>
                                <![endif]-->
                                
                                <!--[if !mso]><!-->
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto;">
                                    <tr>
                                        <td style="border-radius: 8px; background: #3b82f6; text-align: center; border: 2px solid #1e40af;" class="cta-button">
                                            <a href="https://internal.bizdateup.com/login" target="_blank" style="background-color: #3b82f6; border: 2px solid #1e40af; font-family: Arial, sans-serif; font-size: 16px; font-weight: bold; text-decoration: none; padding: 15px 30px; color: #ffffff; border-radius: 8px; display: inline-block; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);" class="cta-button-dark">
                                                View Badge Details &#11088;
                                            </a>
                                        </td>
                                    </tr>
                                </table>
                                <!--<![endif]-->
                            </div>
                            
                            <p style="font-size: 16px; color: #495057; margin: 25px 0 15px; line-height: 1.6; text-align: left;" class="text-secondary">
                                Keep shining the spotlight on great work—it makes a real difference.
                            </p>
                            
                            <p style="font-size: 16px; color: #212529; margin: 0; font-weight: 600; text-align: left;" class="text-primary">
                                Best Regards,<br>
                                <span style="color: #1e40af; font-weight: 700;" class="slate-text">Team HR</span>
                            </p>
                            
                        </td>
                    </tr>
                    
                </table>
                
            </td>
        </tr>
    </table>
    
</body>
</html>`,
  };
  await transporter.sendMail(mailOptions);
}
async function receiverwillgetemail(name,to) {
  const mailOptions = {
    from: `"BizDateUp KPI" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Received Badge From Employee",
    text: `Hi ${name} you have received badge from an anonyomous employee`,
  };
  return transporter.sendMail(mailOptions);
}
async function approvebadgeemail(name,to) {
  const mailOptions = {
    from: `"BizDateUp KPI" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Badge Approved",
    text: `Hi ${name} Your Badge Is Approved`,
  };
  return transporter.sendMail(mailOptions);
}


module.exports = { sendWelcomeEmail, receiverwillgetemail,senderwillgetemail, approvebadgeemail };
