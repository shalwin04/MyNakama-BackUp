import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
// import emailjs, { EmailJSResponseStatus } from "@emailjs/nodejs";

dotenv.config();

const app = express();
const port = 3001;

app.use(bodyParser.json());

const passkey = process.env.MYNAKAMA_KEY;

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // Use `true` for port 465, `false` for all other ports
  // service: "gmail",
  auth: {
    user: "mynakama.chat@gmail.com",
    pass: passkey,
  },
});

transporter
  .sendMail({
    from: '"My Nakama" <mynakama.chat@gmail.com>',
    to: "shalwinsanju.25cs@licet.ac.in", // list of receivers
    subject: "Emergency", // Subject line
    text: "Hey!", // plain text body
    html: "<b>Hello world?</b>", // html body
  })
  .then(() => {
    console.log("Email Sent");
  })
  .catch((err) => {
    console.error(err);
  });

// const Emailjs_Key = process.env.EMAILJS_PUBKEY;
// const Service_Key = process.env.EMAILJS_SERVICE;
// const Template_Key = process.env.EMAILJS_TEMPLATE;

// const templateParams = {
//   from_name: "MyNakama",
//   to_email: "shalwinsanju.25cs@licet.ac.in",
//   message: "Hello, this is a test email sent from MyNakama",
// };

// app.post("/send-email", async (req, res) => {
//   try {
//     const response = await emailjs.send(
//       Service_Key,
//       Template_Key,
//       templateParams,
//       {
//         publicKey: Emailjs_Key,
//       }
//     );
//     console.log("Success", response.status, response.text);
//     res.status(200).send("Email sent successfully");
//   } catch (err) {
//     if (err instanceof EmailJSResponseStatus) {
//       console.log("EMAILJS FAILED...", err);
//       return;
//     }
//     console.log("ERROR", err);
//     res.status(500).send("Failed to send email");
//   }
// });

// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });

// // try {
// //   await emailjs.send(Service_Key, Template_Key, templateParams, {
// //     publicKey: Emailjs_Key,
// //     // privateKey: 'YOUR_PRIVATE_KEY', // optional, highly recommended for security reasons
// //   });
// //   console.log("Success");
// // } catch (err) {
// //   if (err instanceof EmailJSResponseStatus) {
// //     console.log("EMAILJS FAILED...", err);
// //   }

// //   console.log("ERROR", err);
// // }

// // emailjs
// //   .send(Service_Key, Template_Key, templateParams, {
// //     publicKey: Emailjs_Key,
// //     // privateKey: 'YOUR_PRIVATE_KEY', // optional, highly recommended for security reasons
// //   })
// //   .then(
// //     (response) => {
// //       console.log("SUCCESS!", response.status, response.text);
// //     },
// //     (err) => {
// //       console.log("FAILED...", err);
// //     }
// //   );
// console.log("Message sent: %s", info.messageId);
// Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
// }

// async function main() {
//   // send mail with defined transport object
//   const info = await transporter.sendMail({
//     from: '"My Nakama" <mynakama.chat@gmail.com>', // sender address
//     to: "shalwinsanju.25cs@licet.ac.in", // list of receivers
//     subject: "Emergency", // Subject line
//     text: "Hey!", // plain text body
//     html: "<b>Hello world?</b>", // html body
//   });

//   console.log("Message sent: %s", info.messageId);
//   // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
// }

// main().catch(console.error);
