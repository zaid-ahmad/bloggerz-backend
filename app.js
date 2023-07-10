import express from 'express'
import mongoose from 'mongoose'
// import session from 'express-session'
// import bcrypt from 'bcrypt'
import asyncHandler from 'express-async-handler'
import cors from 'cors'
import 'dotenv/config'

const User = './models/user'
import Blog from './models/blog'
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
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

/* ROUTES */
app.get('/', (req, res) => {
  res.send('hellooo')
})

app.post(
  '/create',
  asyncHandler(async (req, res) => {
    const { title, blog, published } = req.body

    if (title.length < 20) {
      // 422 - Unprocessable Entity.
      // This status code indicates that the server
      // understands the request but cannot process it
      // due to semantic errors.
      res.sendStatus(422)
    } else if (blog.length < 250) {
      res.sendStatus(422)
    } else {
      const newBlog = new Blog({
        title,
        blog,
        timestamp: new Date(),
        author: 'Zaid', // should be req.user
        published,
      })
      await newBlog.save()
      res.status(200).json('Blog posted successfully')
    }
  })
)

app.listen(port, (err) => {
  if (err) console.log('Error in server setup')
  console.log('Server listening on Port', port)
})

/*
  BLOG WEBSITE

  -> Authentication & Authorization via Google (jwt tokens in cookie headers)


  -> POST - Create blog post
  -> PUT - Edit blog post
  -> DELETE - Delete blog post
  -> GET - Sort by published / unpublished
*/
