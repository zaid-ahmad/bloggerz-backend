import express from 'express'
import asyncHandler from 'express-async-handler'

const router = express.Router()

router.get('/', (req, res) => {
  res.send('Welcome to Blog API')
})

router.post(
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

export default router
