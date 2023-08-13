import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import passport from 'passport'
import 'dotenv/config'

import indexRouter from './routers/index.js'
import './auth/passport.js'
import { userRouter } from './routers/user.router.js'

/* CONFIGURE DATABASE - START*/
mongoose.set('strictQuery', true)
const mongoDB = process.env.MONGO_URI

main().catch((err) => console.log(err))

async function main() {
  await mongoose.connect(mongoDB)
  console.log('Connected to database')
}

const app = express()

/* MIDDLEWARES */
app.use(cors({ credentials: true, origin: process.env.FRONT_END_URL }))
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
app.use(passport.initialize())
app.use(userRouter)

// /* ROUTES */
app.use('/api', indexRouter)

const port = process.env.PORT || 3000

app.listen(port, (err) => {
  if (err) console.log('Error in server setup')
  console.log(`Server is up at port: ${port}`)
})
