import asyncHandler from 'express-async-handler'
import bcrypt from 'bcrypt'

import User from '../models/user.js'

const login = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body

  try {
    const userFound = await User.findOne({ username })

    if (!userFound) {
      return res.status(400).json({
        error: 'Incorrect username or password',
      })
    }

    const isPasswordMatch = await bcrypt.compare(password, userFound.password)

    if (!isPasswordMatch) {
      return res.status(400).json({
        error: 'Incorrect username or password',
      })
    }
    let user = {
      username,
      password,
    }
    res.locals.user = user
    next()
  } catch (error) {
    res.status(500).json({ error: 'An error occurred during login.' })
  }
})

export default login
