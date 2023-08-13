import express from 'express'
import asyncHandler from 'express-async-handler'
import bcrypt from 'bcrypt'
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
    const { title, blog, published, author } = req.body

    const user = await User.findOne({ username: author })

    if (user) {
      if (title.length < 20 || title.length > 60) {
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
        res.sendStatus(200)
      }
    } else {
      res.sendStatus(404)
    }
  })
)

router.put(
  '/blogs/:id/update',
  asyncHandler(async (req, res) => {
    const blogId = req.params.id

    const blog = Blog.findOne({ id: blogId })

    if (blog) {
      const { title, blog, published, author } = req.body

      const user = await User.findOne({ username: author })

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

router.delete(
  '/blogs/:id/delete',
  asyncHandler(async (req, res) => {
    const blogId = req.params.id

    const blog = Blog.findOne({ id: blogId })

    if (blog) {
      const theblog = await Blog.findByIdAndRemove(blogId)
      res.sendStatus(200)
    } else {
      res.status(404).json('Yikes. This blog does not exist :/')
    }
  })
)

router.get(
  '/blogs',
  asyncHandler(async (req, res) => {
    const blogs = await Blog.find({ published: true }).populate('author').exec()

    res.send(blogs)
  })
)

router.get(
  '/:username/blogs',
  asyncHandler(async (req, res) => {
    const { published } = req.query

    const username = req.params.username

    const user = await User.find({ username })

    if (published !== 'op') {
      if (published == 'all') {
        try {
          const blogs = await Blog.find({ author: user[0]._id })
          res.json(blogs)
        } catch (error) {
          console.error('Error:', error)
          res.status(500).send('An error occurred.')
        }
      } else if (published == 'yes') {
        try {
          const blogs = await Blog.find({
            published: true,
            author: user[0]._id,
          })
            .populate('author')
            .exec()
          res.json(blogs)
        } catch (error) {
          console.error('Error:', error)
          res.status(500).send('An error occurred.')
        }
      } else if (published == 'no') {
        try {
          const blogs = await Blog.find({
            published: false,
            author: user[0]._id,
          })
            .populate('author')
            .exec()
          res.json(blogs)
        } catch (error) {
          console.error('Error:', error)
          res.status(500).send('An error occurred.')
        }
      }
    } else {
      const blogs = await Blog.find({ author: user[0]._id })
      res.send(blogs)
    }
  })
)

router.get(
  '/blogs/:id',
  asyncHandler(async (req, res) => {
    const blogId = req.params.id

    const blog = await Blog.findOne({ _id: blogId }).populate('author').exec()

    res.send(blog)
  })
)

router.post(
  '/signup',
  asyncHandler(async (req, res) => {
    const { name, username, password } = req.body

    User.find({ username })
      .then((users) => {
        if (users.length === 0) {
          registerUser(name, username, password, res)
        } else {
          res.sendStatus(409)
        }
      })
      .catch((err) => res.json('some error occured x_x'))
  })
)

const registerUser = async (name, username, password, res) => {
  try {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    const newUser = new User({
      name,
      username,
      password: hashedPassword,
    })

    const savedUser = await newUser.save()
    res.status(200).json(savedUser)
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ error: 'An error occurred during registration.' })
  }
}

export default router
