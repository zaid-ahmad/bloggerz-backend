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
// app.use('/api', authRouter)

const port = process.env.PORT || 3000

app.get('/', (req, res) => {
  res.json({
    message: 'Node Cookie JWT Service',
  })
})

app.listen(port, (err) => {
  if (err) console.log('Error in server setup')
  console.log(`Server is up at port: ${port}`)
})

/*
  BLOG WEBSITE

  ✅ Authentication with jwt tokens in cookie headers
  -> Authorization and auth via Google 


  ✅ POST - Create blog post
  ✅ PUT - Edit blog post
  -> DELETE - Delete blog post
  -> GET - Sort by published / unpublished
*/
