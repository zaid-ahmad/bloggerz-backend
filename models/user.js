const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
  name: { type: String, required: true, maxLength: 40 },
  username: { type: String, required: true, maxLength: 20, unique: true },
  password: { type: String, required: true, unique: true },
  googleId: { type: String, unique: true },
  email: { type: String },
})

export default mongoose.model('User', UserSchema)
