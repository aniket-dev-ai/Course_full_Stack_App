const nodemailer = require("nodemailer");
require("dotenv").config();

const mailSender = async (email, title, body) => {
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
    let info = await transporter.sendMail({
      from: "AniketKoder || AniketKiCourseApp",
      to: `${email}`,
      subject: `${title}`,
      html: `${body}`,
    });

    console.log("Message sent: %s", info);
    return info;
  } catch (error) {
    console.log(error);
  }
};

module.exports = mailSender;
