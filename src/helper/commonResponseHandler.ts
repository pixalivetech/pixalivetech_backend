import { saveLog } from "../controller/logs.controller";
import { LogsDocument, Logs } from "../model/logs.model";
var nodemailer = require('nodemailer');
import axios from 'axios';


/**
 * @param res {Function} Response 
 * @param success {Boolean} Http Status Code for the response
 * @param result {Object/Array} Result for the Response
 * @param message {string} Primary message for the response
 * @param extendedMessage {Object} Detailed Message for the error Message
 * @function commonResponse {Function} Used for Handling the Common Response
 */

export let response = function (req, res, activity, level, method, success, statusCode, result, message, extendedMessage?) {
    const LogsData: LogsDocument = new Logs();
    let date = new Date()
    LogsData.activity = activity;
    var trusted_proxies = ['177.144.11.100', '177.144.11.101'];
    LogsData.userId = (req.body.loginId) ? req.body.loginId : '';
    LogsData.url = req.baseurl;
    LogsData.time = date.getTime();
    LogsData.date = date;
    LogsData.level = level;
    LogsData.description = message;
    LogsData.method = method;
    LogsData.processStatus = (statusCode === 200) ? true : false;
    saveLog(LogsData);
    res.status(statusCode);
    return res.json({
        success: success,
        result: result || '',
        message: message || '',
        extendedMessage: extendedMessage || '',
        statusCode: statusCode
    });
}



export const sendEmail = async (contact) => {
    var sender = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'pixalivetech', 
            pass:'ykvq gnvt lslu gjii'
        }
    });

    var composemail = {
        from: contact.email,
        to: 'pixalivetech@gmail.com', 
        subject: `New Contact: ${contact.subject}`,
    text: `
      Name: ${contact.name}
      Email: ${contact.email}
      Mobile Number: ${contact.mobileNumber}
      Subject: ${contact.subject}
      Message: ${contact.message}
    `,
    }

    await sender.sendMail(composemail, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Mail send successfully' + info.response)
        }
    })
}

/**
 * @author kaaviyan
 * @date 09-02-2025
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to generate random code
 */

export function generate(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
        for (let i = 0; i < length; i++) 
        {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters.charAt(randomIndex);
        }
    return  result;
    }

    /**
 * @author kaaviyan
 * @date 09-02-2025
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to send otp on user registration
 */
    export const sendOtp = async (mobileNumber,otp) => {
        const url = 'https://2factor.in/API/V1/2372fa0e-5edd-11eb-8153-0200cd936042/SMS/+91'+mobileNumber + '/' + otp;
        try {
            const response = await axios.get(url);
        } catch (exception) {
            process.stderr.write(`ERROR received from ${url}: ${exception}\n`);
        }
    }


    export const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'pixaliveadearns@gmail.com',
          pass: 'tcqkdycouumvjrac',
        },
      });
  export let  sendEmailOtp=async(email,otp)=>{
            if(!email){throw new Error("email is not register")}
                      const mailOptions = {
                      from: 'pixaliveadearns@gmail.com',
                      to: email,
                      subject: 'Email Verification OTP',
                      text: `Your verification OTP: ${otp}`,
                    };
              await transporter.sendMail(mailOptions);
      
      }
      export let  sendReferralCode=async(email,referralCode)=>{
        if(!email){throw new Error("email is not register")}
                  const mailOptions = {
                  from: 'pixaliveadearns@gmail.com',
                  to: email,
                  subject: 'join with us',
                  text: `use my referral code: ${referralCode}`,
                };
          return await transporter.sendMail(mailOptions);
  
  }


  export let formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};
