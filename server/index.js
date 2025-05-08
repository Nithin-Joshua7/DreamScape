import express from "express"
import ENV_VARS from "./utils/envars.js"
import connectDB from "./db.js"
import cookieParser from "cookie-parser"
import authroutes from "./routes/auth.Route.js"
import imageRoutes from "./routes/image.Route.js"
import messageRoutes from "./routes/message.Route.js"
import cors from "cors"
const app = express()
app.use(cookieParser())
app.use(express.json())
app.use(
    cors({
        origin:"https://dreamscape-k73r.onrender.com",
        credentials:true
    })
)

app.use("/api/auth",authroutes)
app.use('/api/images', imageRoutes);
app.use('/api/messages',messageRoutes)
connectDB()

app.listen(ENV_VARS.PORT,"0.0.0.0",()=>{
    console.log(`Server started running at 4000 `)
})
