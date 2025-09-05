import nodemailer from 'nodemailer'

export const sendMail = async (options) => {
   try{
         let transport = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_USERNAME,
            pass: process.env.SMTP_PASSWORD
        },
    });
     const mailOptions = {
        from: options.from,
        to: options.to,
        subject: options.subject,
        html: options.html
     }

     await transport.sendMail(mailOptions)
   }catch(error){
        console.log(error);
   }
}