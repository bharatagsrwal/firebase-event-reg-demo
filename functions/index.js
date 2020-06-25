const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
admin.initializeApp();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "Your Gmail id",
        pass: "Your Gmail Password"
    },
});

const sendGmailConf = async (snap) => {
    try {
        const docId = snap.id
        const name = snap.data().name
        const email = snap.data().email
        let data = {
            from: 'Aura App<connectwithaurapp@gmail.com>',
            to: email,
            subject: "[Confirmation] You're confirmed!  " + name,
            html: `
                <p>Hi ${name},</p>
                <p>Thanks for filling this form, we confirmed your registartion</p>
                <br>
                <p>Regards,</p>
                <p>Team <a href="https://github.com/gdg-x/aura">AuraApp</a></p>
                `
        };
        let info = await transporter.sendMail(data);
        admin.firestore().collection('users').doc(docId).update({
            status: 'Email Sent'
        });
    } catch (e) {
        console.log(e);
    }
}

exports.sendEmail = functions.firestore.document('users/{id}').onCreate((snap, context) => {
    sendGmailConf(snap);
});