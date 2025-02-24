import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export class MailService{

    private transporter;
    private defaultMail = {
        from: "Me <330d14366396f1>",
        text: 'test text',
    };

    constructor(){
        this.transporter = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
              user: process.env.NODEMAILER_USER,
              pass: process.env.NODEMAILER_PASSWORD
            }
        });
    };

    async send(mail: {}){
        mail = Object.assign({}, this.defaultMail, mail);
        this.transporter.sendMail(mail, (error, info)=>{
            if(error) return console.error(error);
            console.info('mail sent:', info.response);
        });
    };

    async sendResetPasswordCode(){
        
    }
}