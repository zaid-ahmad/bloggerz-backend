import express from 'express'
import asyncHandler from 'express-async-handler'
import bcrypt from 'bcrypt'

import Blog from '../models/blog.js'
import User from '../models/user.js'

const router = express.Router()

router.post(
  '/signup',
  asyncHandler(async (req, res) => {
    const { name, username, password } = req.body

    User.find({ username })
      .then((users) => {
        if (users.length === 0) {
          registerUser(name, username, password, res)
        } else {
          res.send('username already exists')
        }
      })
      .catch((err) => console.log(err))
  })
)

router.post(
  '/login',
  asyncHandler(async (req, res) => {
    // Create httponly cookie containing JWT and send it as response

    const { username, password } = req.body

    try {
      const user = await User.findOne({ username })

      if (!user) {
        return res.status(404).json({ error: 'Invalid username/password.' })
      }

      const isPasswordMatch = await bcrypt.compare(password, user.password)

      if (!isPasswordMatch) {
        return res.status(401).json({ error: 'Invalid username/password.' })
      }

      const token = user.generateAuthToken()
      res
        .cookie('token', token, { httpOnly: true })
        .send(_.pick(user, ['_id', 'name', 'role']))

      res.status(200).json({ message: 'Login successful.' })
    } catch (error) {
      console.error('Error:', error)
      res.status(500).json({ error: 'An error occurred during login.' })
    }
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
