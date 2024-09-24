import nodemailer from 'nodemailer';

const sendEmail = async (to, subject, text) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.GMAIL_USER,
        to: to,
        subject: subject,
        text: text,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email đã được gửi!');
    } catch (error) {
        console.error('Có lỗi xảy ra khi gửi email:', error);
    }
};

export { sendEmail };
