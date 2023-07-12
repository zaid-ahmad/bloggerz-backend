import asyncHandler from 'express-async-handler'

import User from '../models/user.js'

const login = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body

  try {
    const user = await User.findOne({ username })

    if (!user) {
      return res.status(400).json({
        error: 'Incorrect username or password',
      })
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password)

    if (!isPasswordMatch) {
      return res.status(400).json({
        error: 'Incorrect username or password',
      })
    }
    res.locals.user = user
    next()
  } catch (error) {
    res.status(500).json({ error: 'An error occurred during login.' })
  }
})

export default login
