import express from "express"
import protectRoute from "../middleware/protectRoute.js"
import { message,deleteMessage } from "../controllers/message.Controller.js"
const router = express.Router()

router.get("/",protectRoute,message)

router.delete("/delete/:id",protectRoute,deleteMessage)

export default router