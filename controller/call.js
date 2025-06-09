import { initializeTwilio } from "../helpers/twilio.js";
import dotenv from "dotenv"

dotenv.config()

export class CallController {
    async CreateCall(req, res) {
        try {

            const { to } = req.body;

            const TWILIO_CLIENT=initializeTwilio();

            const call = TWILIO_CLIENT.calls.create({
                from: process.env.TWILIO_PHONE_NUMBER,
                to,
                url: process.env.AGENT_URL
            });

            return res.status(200).json({
                message: "successfully made the call",
                status: "success",
                call
            });

        } catch(error) {
            console.log("failed to make call...............", error);
            return res.status(500).json({
                message: "failed to make call",
                status: "error"
            });
        }
    }
}