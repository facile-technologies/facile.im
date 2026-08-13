import  nodemailer from "nodemailer";
import { MAIL_PASS,MAIL_USER,EMAIL,APP_NAME, FRONTEND_URL } from "../config/index.js";



class EmailMethods {
  static sendEmail(to, subject, otp, name='') {
    let template;
    if(subject == 'Email Verification'){
        template = signupEmailVerifyTemplate(otp,name)
    }else if (subject == `Welcome to ${APP_NAME}`){
        template = welcomeEmailTemplate(name)
    }else if (subject == 'Forget Password OTP'){
      template = forgotPasswordOtpTemplate(otp,name)
    }else if( subject == "Forget Password Reset Successfully"){
      template = passwordResetSuccessTemplate(name)
    }else if (subject === "Team Invitation") {
      template =teamInvitationTemplate(otp, name);
    }


    var transporter = nodemailer.createTransport({
      host: "mail.gandi.net",
      port:465,
      secure:true,
      auth: {
        user: MAIL_USER, 
        pass: MAIL_PASS, 
      },
      debug:true,
      
    });

    var mailOptions = {
       from: '"Facile" <noreply@facile.im>', 
      to: to, 
      subject: subject, 
      html: template,
    };

   
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email Sent: " + info.response);
      }
  
    });

  }


}



// email templates


function signupEmailVerifyTemplate(OTP, name = "there") {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email</title>
  </head>
  <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
    
    <div style="padding: 60px 20px;">
      
      <div style="
        max-width: 600px;
        margin: 0 auto;
        background: #ffffff;
        border-radius: 20px;
        overflow: hidden;
        box-shadow: 0 25px 50px rgba(0,0,0,0.2);
      ">
        
        <!-- Header -->
        <div style="
          background: linear-gradient(135deg, #0072ff 0%, #00c6ff 100%);
          padding: 50px 40px;
          text-align: center;
          position: relative;
        ">
          <!-- Decorative circles -->
          <div style="
            position: absolute;
            width: 150px;
            height: 150px;
            background: rgba(255,255,255,0.1);
            border-radius: 50%;
            top: -50px;
            right: -50px;
          "></div>
          <div style="
            position: absolute;
            width: 100px;
            height: 100px;
            background: rgba(255,255,255,0.1);
            border-radius: 50%;
            bottom: -30px;
            left: -30px;
          "></div>
          
          <div style="position: relative; z-index: 1;">
            <!-- Logo/Icon placeholder -->
            <div style="
              width: 70px;
              height: 70px;
              background: rgba(255,255,255,0.2);
              backdrop-filter: blur(10px);
              border-radius: 16px;
              margin: 0 auto 20px;
              display: flex;
              align-items: center;
              justify-content: center;
              border: 2px solid rgba(255,255,255,0.3);
            ">
              <div style="
                font-size: 32px;
                color: white;
              ">✉️</div>
            </div>
            
            <div style="
              font-size: 32px;
              font-weight: 700;
              color: #ffffff;
              letter-spacing: -0.5px;
              margin-bottom: 10px;
              text-shadow: 0 2px 10px rgba(0,0,0,0.1);
            ">
              ${APP_NAME}
            </div>
            <div style="
              font-size: 15px;
              color: rgba(255,255,255,0.95);
              font-weight: 500;
              letter-spacing: 0.5px;
            ">
              Verify Your Email Address
            </div>
          </div>
        </div>

        <!-- Content -->
        <div style="padding: 50px 40px;">
          
          <!-- Greeting -->
          <div style="
            font-size: 26px;
            font-weight: 700;
            margin: 0 0 12px 0;
            color: #1a202c;
            line-height: 1.3;
          ">
            Hi ${name}! 👋
          </div>
          
          <div style="
            font-size: 15px;
            color: #718096;
            margin-bottom: 35px;
          ">
            Welcome aboard! Let's get you verified.
          </div>

          <p style="
            font-size: 16px;
            color: #4a5568;
            line-height: 1.7;
            margin: 0 0 35px 0;
          ">
            Thanks for joining <strong style="color: #0072ff;">${APP_NAME}</strong>! 
            To complete your registration and unlock all features, please enter the verification code below in your app.
          </p>

          <!-- OTP Card -->
          <div style="
            background: linear-gradient(135deg, #f8faff 0%, #f0f4ff 100%);
            border: 3px solid #e6edff;
            border-radius: 16px;
            padding: 35px 30px;
            text-align: center;
            margin: 35px 0;
            box-shadow: 0 4px 15px rgba(0,114,255,0.08);
          ">
            <div style="
              font-size: 12px;
              text-transform: uppercase;
              letter-spacing: 2px;
              color: #0072ff;
              font-weight: 700;
              margin-bottom: 18px;
            ">
              Verification Code
            </div>
            
            <div style="
              font-size: 48px;
              font-weight: 800;
              background: linear-gradient(135deg, #0072ff 0%, #00c6ff 100%);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
              letter-spacing: 14px;
              font-family: 'Courier New', monospace;
              margin: 15px 0;
              text-shadow: 0 4px 10px rgba(0,114,255,0.1);
            ">
              ${OTP}
            </div>
            
            <div style="
              display: inline-block;
              background: #fff3cd;
              color: #856404;
              font-size: 12px;
              padding: 8px 16px;
              border-radius: 20px;
              margin-top: 18px;
              font-weight: 600;
            ">
              ⏱️ Expires in 15 minutes
            </div>
          </div>

          <!-- Steps Card -->
          <div style="
            background: #f7fafc;
            border-radius: 12px;
            padding: 25px;
            margin: 30px 0;
            border-left: 4px solid #0072ff;
          ">
            <div style="
              font-size: 14px;
              font-weight: 600;
              color: #2d3748;
              margin-bottom: 15px;
            ">
              📋 Next Steps:
            </div>
            <ol style="
              margin: 0;
              padding-left: 20px;
              color: #4a5568;
              font-size: 14px;
              line-height: 1.8;
            ">
              <li>Copy the verification code above</li>
              <li>Return to the ${APP_NAME} app</li>
              <li>Paste the code to verify your email</li>
            </ol>
          </div>

          <!-- Security Warning -->
          <div style="
            background: linear-gradient(135deg, #fff5f5 0%, #fed7d7 100%);
            border: 2px solid #fc8181;
            border-radius: 12px;
            padding: 20px;
            margin: 25px 0;
            display: flex;
            align-items: flex-start;
          ">
            <div style="
              font-size: 24px;
              margin-right: 15px;
            ">🔒</div>
            <div>
              <p style="
                margin: 0;
                font-size: 14px;
                color: #c53030;
                line-height: 1.6;
                font-weight: 500;
              ">
                <strong>Security Alert:</strong> If you didn't request this verification code, 
                please ignore this email. Your account is safe, and no action is required.
              </p>
            </div>
          </div>

          <!-- Divider -->
          <div style="
            height: 1px;
            background: linear-gradient(90deg, transparent, #e2e8f0, transparent);
            margin: 35px 0;
          "></div>

          <!-- Help Section -->
          <div style="text-align: center;">
            <p style="
              font-size: 14px;
              color: #718096;
              margin: 0 0 15px 0;
            ">
              Need assistance? We're here to help!
            </p>
            <a href="mailto:support@${APP_NAME.toLowerCase()}.com" style="
              display: inline-block;
              background: linear-gradient(135deg, #0072ff 0%, #00c6ff 100%);
              color: white;
              text-decoration: none;
              padding: 12px 30px;
              border-radius: 25px;
              font-weight: 600;
              font-size: 14px;
              box-shadow: 0 4px 15px rgba(0,114,255,0.3);
            ">
              Contact Support
            </a>
          </div>

        </div>

        <!-- Footer -->
        <div style="
          background: linear-gradient(to bottom, #f7fafc, #edf2f7);
          padding: 40px 40px 35px;
          border-top: 1px solid #e2e8f0;
        ">
          <div style="text-align: center;">
            
            <!-- Social Links -->
            <div style="margin-bottom: 25px;">
              <a href="#" style="display: inline-block; margin: 0 8px; text-decoration: none;">
                <div style="
                  width: 40px;
                  height: 40px;
                  background: linear-gradient(135deg, #0072ff 0%, #00c6ff 100%);
                  border-radius: 50%;
                  line-height: 40px;
                  color: white;
                  font-size: 18px;
                  font-weight: bold;
                  transition: transform 0.2s;
                  box-shadow: 0 4px 10px rgba(0,114,255,0.2);
                ">f</div>
              </a>
              <a href="#" style="display: inline-block; margin: 0 8px; text-decoration: none;">
                <div style="
                  width: 40px;
                  height: 40px;
                  background: linear-gradient(135deg, #0072ff 0%, #00c6ff 100%);
                  border-radius: 50%;
                  line-height: 40px;
                  color: white;
                  font-size: 18px;
                  font-weight: bold;
                  box-shadow: 0 4px 10px rgba(0,114,255,0.2);
                ">𝕏</div>
              </a>
              <a href="#" style="display: inline-block; margin: 0 8px; text-decoration: none;">
                <div style="
                  width: 40px;
                  height: 40px;
                  background: linear-gradient(135deg, #0072ff 0%, #00c6ff 100%);
                  border-radius: 50%;
                  line-height: 40px;
                  color: white;
                  font-size: 18px;
                  font-weight: bold;
                  box-shadow: 0 4px 10px rgba(0,114,255,0.2);
                ">in</div>
              </a>
            </div>

            <p style="
              font-size: 13px;
              color: #a0aec0;
              margin: 0 0 8px 0;
              line-height: 1.5;
              font-weight: 500;
            ">
              © ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.
            </p>
            
            <p style="
              font-size: 12px;
              color: #cbd5e0;
              margin: 0;
            ">
              This email was sent to you as a registered user of ${APP_NAME}.
            </p>
          </div>
        </div>

      </div>
      
      <!-- Spacer -->
      <div style="height: 50px;"></div>
      
    </div>

  </body>
  </html>
  `;
}




function welcomeEmailTemplate(name = "there") {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to ${APP_NAME}</title>
  </head>
  <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
    
    <div style="padding: 60px 20px;">
      
      <div style="
        max-width: 600px;
        margin: 0 auto;
        background: #ffffff;
        border-radius: 20px;
        overflow: hidden;
        box-shadow: 0 25px 50px rgba(0,0,0,0.2);
      ">
        
        <!-- Header -->
        <div style="
          background: linear-gradient(135deg, #0072ff 0%, #00c6ff 100%);
          padding: 50px 40px;
          text-align: center;
          position: relative;
        ">
          <!-- Decorative circles -->
          <div style="
            position: absolute;
            width: 150px;
            height: 150px;
            background: rgba(255,255,255,0.1);
            border-radius: 50%;
            top: -50px;
            right: -50px;
          "></div>
          <div style="
            position: absolute;
            width: 100px;
            height: 100px;
            background: rgba(255,255,255,0.1);
            border-radius: 50%;
            bottom: -30px;
            left: -30px;
          "></div>
          
          <div style="position: relative; z-index: 1;">
            <!-- Logo/Icon placeholder -->
            <div style="
              width: 70px;
              height: 70px;
              background: rgba(255,255,255,0.2);
              backdrop-filter: blur(10px);
              border-radius: 16px;
              margin: 0 auto 20px;
              display: flex;
              align-items: center;
              justify-content: center;
              border: 2px solid rgba(255,255,255,0.3);
            ">
              <div style="
                font-size: 32px;
                color: white;
              ">🎉</div>
            </div>
            
            <div style="
              font-size: 32px;
              font-weight: 700;
              color: #ffffff;
              letter-spacing: -0.5px;
              margin-bottom: 10px;
              text-shadow: 0 2px 10px rgba(0,0,0,0.1);
            ">
              ${APP_NAME}
            </div>
            <div style="
              font-size: 15px;
              color: rgba(255,255,255,0.95);
              font-weight: 500;
              letter-spacing: 0.5px;
            ">
              Welcome to the Community
            </div>
          </div>
        </div>

        <!-- Content -->
        <div style="padding: 50px 40px;">
          
          <!-- Greeting -->
          <div style="
            font-size: 26px;
            font-weight: 700;
            margin: 0 0 12px 0;
            color: #1a202c;
            line-height: 1.3;
          ">
            Hi ${name}! 👋
          </div>
          
          <div style="
            font-size: 15px;
            color: #718096;
            margin-bottom: 35px;
          ">
            We're thrilled to have you here.
          </div>

          <p style="
            font-size: 16px;
            color: #4a5568;
            line-height: 1.7;
            margin: 0 0 25px 0;
          ">
            Welcome to <strong style="color: #0072ff;">${APP_NAME}</strong>! Your account has been successfully created 
            and you're all set to start exploring.
          </p>

          <p style="
            font-size: 15px;
            color: #4a5568;
            line-height: 1.7;
            margin: 0 0 35px 0;
          ">
            Jump right in to discover all the powerful features we've built for you. Whether you're just getting started 
            or ready to go full speed, we've got your back every step of the way.
          </p>

          <!-- Highlight Card -->
          <div style="
            background: linear-gradient(135deg, #f8faff 0%, #f0f4ff 100%);
            border: 3px solid #e6edff;
            border-radius: 16px;
            padding: 30px 25px;
            margin: 20px 0 35px 0;
            box-shadow: 0 4px 15px rgba(0,114,255,0.08);
          ">
            <div style="
              font-size: 12px;
              text-transform: uppercase;
              letter-spacing: 2px;
              color: #0072ff;
              font-weight: 700;
              margin-bottom: 18px;
              text-align: center;
            ">
              Get Started in Minutes
            </div>

            <div style="
              display: flex;
              flex-direction: column;
              gap: 12px;
              font-size: 14px;
              color: #4a5568;
              line-height: 1.8;
            ">
              <div>✅ Log in to your new account</div>
              <div>✅ Complete your profile & preferences</div>
              <div>✅ Explore the dashboard and key features</div>
            </div>

            <div style="text-align: center; margin-top: 25px;">
              <a href="${FRONTEND_URL}/login" style="
                display: inline-block;
                background: linear-gradient(135deg, #0072ff 0%, #00c6ff 100%);
                color: white;
                text-decoration: none;
                padding: 12px 30px;
                border-radius: 25px;
                font-weight: 600;
                font-size: 14px;
                box-shadow: 0 4px 15px rgba(0,114,255,0.3);
              ">
                Login to Your Account
              </a>
            </div>
          </div>

          <!-- Info / Safety Note -->
          <div style="
            background: #f7fafc;
            border-radius: 12px;
            padding: 20px;
            margin: 10px 0 30px 0;
            border-left: 4px solid #0072ff;
          ">
            <p style="
              margin: 0;
              font-size: 14px;
              color: #4a5568;
              line-height: 1.6;
            ">
              If you did not create this account, you can safely ignore this email, or reach out to our support team so we can take a look.
            </p>
          </div>

          <!-- Divider -->
          <div style="
            height: 1px;
            background: linear-gradient(90deg, transparent, #e2e8f0, transparent);
            margin: 35px 0;
          "></div>

          <!-- Help Section -->
          <div style="text-align: center;">
            <p style="
              font-size: 14px;
              color: #718096;
              margin: 0 0 15px 0;
            ">
              Have questions or need help getting started?
            </p>
            <a href="mailto:support@${APP_NAME.toLowerCase()}.com" style="
              display: inline-block;
              background: linear-gradient(135deg, #0072ff 0%, #00c6ff 100%);
              color: white;
              text-decoration: none;
              padding: 12px 30px;
              border-radius: 25px;
              font-weight: 600;
              font-size: 14px;
              box-shadow: 0 4px 15px rgba(0,114,255,0.3);
            ">
              Contact Support
            </a>
          </div>

        </div>

        <!-- Footer -->
        <div style="
          background: linear-gradient(to bottom, #f7fafc, #edf2f7);
          padding: 40px 40px 35px;
          border-top: 1px solid #e2e8f0;
        ">
          <div style="text-align: center;">
            
            <!-- Social Links -->
            <div style="margin-bottom: 25px;">
              <a href="#" style="display: inline-block; margin: 0 8px; text-decoration: none;">
                <div style="
                  width: 40px;
                  height: 40px;
                  background: linear-gradient(135deg, #0072ff 0%, #00c6ff 100%);
                  border-radius: 50%;
                  line-height: 40px;
                  color: white;
                  font-size: 18px;
                  font-weight: bold;
                  transition: transform 0.2s;
                  box-shadow: 0 4px 10px rgba(0,114,255,0.2);
                ">f</div>
              </a>
              <a href="#" style="display: inline-block; margin: 0 8px; text-decoration: none;">
                <div style="
                  width: 40px;
                  height: 40px;
                  background: linear-gradient(135deg, #0072ff 0%, #00c6ff 100%);
                  border-radius: 50%;
                  line-height: 40px;
                  color: white;
                  font-size: 18px;
                  font-weight: bold;
                  box-shadow: 0 4px 10px rgba(0,114,255,0.2);
                ">𝕏</div>
              </a>
              <a href="#" style="display: inline-block; margin: 0 8px; text-decoration: none;">
                <div style="
                  width: 40px;
                  height: 40px;
                  background: linear-gradient(135deg, #0072ff 0%, #00c6ff 100%);
                  border-radius: 50%;
                  line-height: 40px;
                  color: white;
                  font-size: 18px;
                  font-weight: bold;
                  box-shadow: 0 4px 10px rgba(0,114,255,0.2);
                ">in</div>
              </a>
            </div>

            <p style="
              font-size: 13px;
              color: #a0aec0;
              margin: 0 0 8px 0;
              line-height: 1.5;
              font-weight: 500;
            ">
              © ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.
            </p>
            
            <p style="
              font-size: 12px;
              color: #cbd5e0;
              margin: 0;
            ">
              This email was sent to you as a registered user of ${APP_NAME}.
            </p>
          </div>
        </div>

      </div>
      
      <!-- Spacer -->
      <div style="height: 50px;"></div>
      
    </div>

  </body>
  </html>
  `;
}


function forgotPasswordOtpTemplate(OTP, name = "there") {
  return `
  <!DOCTYPE html>
  <html lang="en" style="margin:0; padding:0;">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Your Verification Code</title>
  </head>
  <body style="margin:0; padding:0; background:#f6f6f6; font-family:Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f6f6f6; padding:40px 0;">
      <tr>
        <td align="center">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width:500px; background:#ffffff; border-radius:12px; padding:30px; box-shadow:0 4px 20px rgba(0,0,0,0.05);">
            <tr>
              <td align="center" style="font-size:24px; font-weight:bold; color:#333;">
                Password Reset Request
              </td>
            </tr>
            <tr><td style="height:20px;"></td></tr>
            <tr>
              <td style="font-size:15px; color:#555;">
                Hi <strong>${name}</strong>,
                <br><br>
                You requested to reset your password. Please use the OTP code below:
              </td>
            </tr>
            <tr><td style="height:28px;"></td></tr>
            <tr>
              <td align="center">
                <div style="
                  font-size:32px;
                  letter-spacing:6px;
                  font-weight:bold;
                  color:#2b6cb0;
                  background:#e8f1ff;
                  padding:14px 28px;
                  border-radius:10px;
                  display:inline-block;
                  border:1px solid #C5DBFF;
                ">
                  ${OTP}
                </div>
              </td>
            </tr>
            <tr><td style="height:30px;"></td></tr>
            <tr>
              <td style="font-size:14px; color:#777; line-height:1.5;">
                This code will expire soon. If you did not request this, please ignore this email.
              </td>
            </tr>
            <tr><td style="height:40px;"></td></tr>
            <tr>
              <td align="center" style="font-size:12px; color:#999;">
                © ${new Date().getFullYear()} Your Company Name. All rights reserved.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
}


function passwordResetSuccessTemplate(name = "there") {
  return `
  <!DOCTYPE html>
  <html lang="en" style="margin:0; padding:0;">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Password Reset Successful</title>
  </head>
  <body style="margin:0; padding:0; background:#f6f6f6; font-family:Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f6f6f6; padding:40px 0;">
      <tr>
        <td align="center">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width:500px; background:#ffffff; border-radius:12px; padding:30px; box-shadow:0 4px 20px rgba(0,0,0,0.05);">
            <tr>
              <td align="center" style="font-size:24px; font-weight:bold; color:#333;">
                Your Password Has Been Updated
              </td>
            </tr>
            <tr><td style="height:20px;"></td></tr>
            <tr>
              <td style="font-size:15px; color:#555;">
                Hi <strong>${name}</strong>,
                <br><br>
                This is a confirmation that your password was successfully reset.
              </td>
            </tr>
            <tr><td style="height:26px;"></td></tr>
            <tr>
              <td align="center">
                <div style="
                  font-size:14px;
                  color:#2f855a;
                  background:#e6fff2;
                  padding:12px 20px;
                  border-radius:10px;
                  border:1px solid #B7F5D6;
                  display:inline-block;
                ">
                  You can now log in using your new password.
                </div>
              </td>
            </tr>
            <tr><td style="height:35px;"></td></tr>
            <tr>
              <td style="font-size:14px; color:#777; line-height:1.5;">
                If this wasn’t you, please contact support immediately.
              </td>
            </tr>
            <tr><td style="height:40px;"></td></tr>
            <tr>
              <td align="center" style="font-size:12px; color:#999;">
                © ${new Date().getFullYear()} Your Company Name. All rights reserved.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
}






function teamInvitationTemplate(inviteLink, name = "there") {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Team Invitation</title>
  </head>

  <body style="
    margin:0;
    padding:0;
    font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;
    background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);
  ">

    <div style="padding:60px 20px;">
      <div style="
        max-width:600px;
        margin:0 auto;
        background:#ffffff;
        border-radius:20px;
        overflow:hidden;
        box-shadow:0 25px 50px rgba(0,0,0,0.2);
      ">

        <!-- Header -->
        <div style="
          background:linear-gradient(135deg,#0072ff 0%,#00c6ff 100%);
          padding:50px 40px;
          text-align:center;
          position:relative;
        ">
          <div style="
            position:absolute;
            width:150px;
            height:150px;
            background:rgba(255,255,255,0.1);
            border-radius:50%;
            top:-50px;
            right:-50px;
          "></div>

          <div style="position:relative;z-index:1;">
            <div style="
              width:70px;
              height:70px;
              background:rgba(255,255,255,0.2);
              border-radius:16px;
              margin:0 auto 20px;
              display:flex;
              align-items:center;
              justify-content:center;
              border:2px solid rgba(255,255,255,0.3);
              font-size:32px;
              color:white;
            ">
              🤝
            </div>

            <div style="
              font-size:32px;
              font-weight:700;
              color:#ffffff;
              margin-bottom:10px;
            ">
              ${APP_NAME}
            </div>

            <div style="
              font-size:15px;
              color:rgba(255,255,255,0.95);
              font-weight:500;
            ">
              You're Invited to Join a Team
            </div>
          </div>
        </div>

        <!-- Content -->
        <div style="padding:50px 40px;">

          <div style="
            font-size:26px;
            font-weight:700;
            margin-bottom:15px;
            color:#1a202c;
          ">
            Hi ${name}! 👋
          </div>

          <p style="
            font-size:16px;
            color:#4a5568;
            line-height:1.7;
            margin-bottom:30px;
          ">
            You’ve been invited to join a team on 
            <strong style="color:#0072ff;">${APP_NAME}</strong>.
            Click the button below to accept your invitation and get started.
          </p>

          <!-- CTA Button -->
          <div style="text-align:center;margin:40px 0;">
            <a href="${inviteLink}" style="
              display:inline-block;
              background:linear-gradient(135deg,#0072ff 0%,#00c6ff 100%);
              color:white;
              text-decoration:none;
              padding:14px 36px;
              border-radius:30px;
              font-weight:600;
              font-size:15px;
              box-shadow:0 4px 15px rgba(0,114,255,0.35);
            ">
              Accept Invitation
            </a>
          </div>

          <!-- Info Card -->
          <div style="
            background:#f7fafc;
            border-radius:12px;
            padding:20px;
            border-left:4px solid #0072ff;
            font-size:14px;
            color:#4a5568;
            line-height:1.6;
          ">
            If you already have an account, you’ll be redirected to login.  
            Otherwise, you can quickly create a new account and join the team.
          </div>

          <!-- Security Note -->
          <div style="
            background:linear-gradient(135deg,#fff5f5 0%,#fed7d7 100%);
            border:2px solid #fc8181;
            border-radius:12px;
            padding:18px;
            margin-top:30px;
            font-size:14px;
            color:#c53030;
          ">
            🔒 If you were not expecting this invitation, you can safely ignore this email.
          </div>

        </div>

        <!-- Footer -->
        <div style="
          background:#f7fafc;
          padding:35px;
          border-top:1px solid #e2e8f0;
          text-align:center;
        ">
          <p style="
            font-size:13px;
            color:#a0aec0;
            margin:0 0 8px;
          ">
            © ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.
          </p>

          <p style="
            font-size:12px;
            color:#cbd5e0;
            margin:0;
          ">
            This invitation was sent to you by a team member on ${APP_NAME}.
          </p>
        </div>

      </div>
    </div>

  </body>
  </html>
  `;
}


  

export default EmailMethods;
