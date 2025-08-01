const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
    try {
        // Validate input options
        if (!options.email || !options.subject || !options.message) {
            throw new Error("Missing required email options: email, subject, or message");
        }

        // Log environment variables for debugging
        console.log("SMTP Configuration:", {
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            user: process.env.SMTP_USER,
            service: process.env.SMTP_SERVICE
        });

        // Create transporter with Gmail SMTP configuration
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || "smtp.gmail.com",
            port: parseInt(process.env.SMTP_PORT) || 465,
            secure: process.env.SMTP_PORT == 465, // true for 465 (SSL), false for 587 (TLS)
            auth: {
                user: process.env.SMTP_USER || "santhosh190203@gmail.com",
                pass: process.env.SMTP_PASS || "jmzv bqjt llfo suxr"
            },
            logger: true, // Enable logging
            debug: true, // Show SMTP traffic
            connectionTimeout: 10000, // 10 seconds
            greetingTimeout: 10000,
            socketTimeout: 10000
        });

        // Define email options
        const mailOptions = {
            from: `"Hekto App" <${process.env.SMTP_USER || "santhosh190203@gmail.com"}>`,
            to: options.email,
            subject: options.subject,
            text: options.message,
            html: options.html || `<p>${options.message.replace(/\n/g, "<br>")}</p>`,
            replyTo: process.env.SMTP_USER || "santhosh190203@gmail.com"
        };

        // Send email
        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent: ${info.messageId}`);
        return info;
    } catch (error) {
        console.error(`Error sending email: ${error.message}`, error);
        throw new Error(`Failed to send email: ${error.message}`);
    }
};

module.exports = sendEmail;
// const nodeMailer = require("nodemailer");

// const sendEmail = async (options) => {
//     const transporter = nodeMailer.createTransport({
//         service: process.env.SMPT_SERVICE,
//         auth: {
//             user: process.env.SMPT_USER,
//             pass: process.env.SMPT_PASS
//         }
//     });

//     const mailOptions = {
//         from: process.env.SMPT_USER,
//         to: options.email,
//         subject: options.subject,
//         text: options.message
//     };

//     await transporter.sendMail(mailOptions);
// };

// module.exports = sendEmail;