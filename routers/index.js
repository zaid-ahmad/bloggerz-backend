import express from 'express'
import asyncHandler from 'express-async-handler'
import jwt from 'jsonwebtoken'
import 'dotenv/config'

const router = express.Router()

import Blog from '../models/blog.js'
import User from '../models/user.js'

router.get('/', (req, res) => {
  res.send('Welcome to Blog API')
})

router.post(
  '/create',
  asyncHandler(async (req, res) => {
    const { title, blog, published } = req.body

    let username

    const jwtToken = req.cookies.jwt

    // Verify and decode the JWT token
    jwt.verify(jwtToken, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        res.status(400).json(err)
      } else {
        // Access the user information from the decoded token
        username = decodedToken.username
        // Use the user information as needed
      }
    })

    const user = await User.findOne({ username })

    if (user) {
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
          author: user._id.toString(),
          published,
        })
        await newBlog.save()
        res.status(200).json('Blog posted successfully')
      }
    }
  })
)

router.put(
  '/:id/update',
  asyncHandler(async (req, res) => {
    const blogId = req.params.id

    const blog = Blog.findOne({ id: blogId })

    if (blog) {
      const { title, blog, published } = req.body

      let username

      const jwtToken = req.cookies.jwt

      // Verify and decode the JWT token
      jwt.verify(jwtToken, process.env.JWT_SECRET, (err, decodedToken) => {
        if (err) {
          res.status(400).json(err)
        } else {
          // Access the user information from the decoded token
          username = decodedToken.username
          // Use the user information as needed
        }
      })

      const user = await User.findOne({ username })

      if (user) {
        if (title.length < 20) {
          // 422 - Unprocessable Entity.
          // This status code indicates that the server
          // understands the request but cannot process it
          // due to semantic errors.
          res.sendStatus(422)
        } else if (blog.length < 250) {
          res.sendStatus(422)
        } else {
          const updatedBlog = {
            title,
            blog,
            timestamp: new Date(),
            author: user._id.toString(),
            published,
          }
          const theblog = await Blog.findByIdAndUpdate(blogId, updatedBlog, {})
          res.status(200).json('Blog updated successfully')
        }
      }
    } else {
      res.status(404).json('Yikes. This blog does not exist :/')
    }
  })
)

export default router
