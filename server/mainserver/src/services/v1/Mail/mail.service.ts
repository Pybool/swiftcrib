import ejs from "ejs";
import sendMail from "./mailtrigger.service";

const mailActions = {
  auth: {
    sendEmailConfirmationOtp: async (email: string, otp: string) => {
      return new Promise(async (resolve, reject) => {
        try {
          const template = await ejs.renderFile(
            "src/templates/emailConfirmation.ejs",
            { email, otp }
          );

          const mailOptions = {
            from: "info.swiftcrib@gmail.com",
            to: email,
            subject: "Confirm your registration",
            text: `Use the otp in this mail to complete your account onboarding`,
            html: template,
          };
          await sendMail(mailOptions);
          resolve({ status: true });
        } catch (error) {
          console.log(error);
          resolve({ status: false });
        }
      }).catch((error: any) => {
        console.log(error);
        throw error;
      });
    },

    sendPasswordResetMail: async (email: string, user: any) => {
      return { status: true, message: "" };
    },
  },

  listing: {
    contactUs: async (email: string, data: any) => {
      return new Promise(async (resolve, reject) => {
        try {
          const logo = ""
          const template = await ejs.renderFile(
            "src/templates/propertyEnquiry.ejs",
            { email, data, logo }
          );

          const mailOptions = {
            from: process.env.SWIFTCRIB_EMAIL_CONTACT_US,
            to: email,
            subject: "Thank you for reaching out!",
            text: `We thank you for indicating interest in our properties, we would respond as soon as possible`,
            html: template,
          };
          await sendMail(mailOptions);
          resolve({ status: true });
        } catch (error) {
          console.log(error);
          resolve({ status: false });
        }
      }).catch((error: any) => {
        console.log(error);
        throw error;
      });
    },
  },
};

export default mailActions;
