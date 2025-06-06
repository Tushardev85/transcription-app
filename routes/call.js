import express from "express";
import { CallController } from "../controller/call";

const callRouter = express.Router();
const callController = new CallController();

callRouter.post("/makeCall", callController.CreateCall());

export default callRouter;