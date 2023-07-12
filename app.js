import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import passport from 'passport'
import 'dotenv/config'

import indexRouter from './routers/index.js'
import authRouter from './routers/auth.js'
import './auth/passport.js'
import { userRouter } from './routers/user.router.js'

const port = process.env.PORT || 3000

/* CONFIGURE DATABASE - START*/
mongoose.set('strictQuery', true)
const mongoDB = process.env.MONGO_URI

main().catch((err) => console.log(err))

async function main() {
  await mongoose.connect(mongoDB)
}

const app = express()

/* MIDDLEWARES */
app.use(cors({ credentials: true, origin: process.env.FRONT_END_URL }))
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
app.use(passport.initialize())
app.use(userRouter)

/* ROUTES */
app.use('/api', indexRouter)
app.use('/api', authRouter)

app.listen(port, (err) => {
  if (err) console.log('Error in server setup')
  console.log('Server listening on Port', port)
})

/*
  BLOG WEBSITE

  ✅ Authentication 
  -> Authorization and auth via Google (jwt tokens in cookie headers)


  ✅ POST - Create blog post
  -> PUT - Edit blog post
  -> DELETE - Delete blog post
  -> GET - Sort by published / unpublished
*/
