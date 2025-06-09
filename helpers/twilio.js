import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();

export function initializeTwilio(){
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = twilio(accountSid, authToken);
    return client
}