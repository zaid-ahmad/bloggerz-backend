const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CommentSchema = new Schema({
  name: { type: String, required: true, maxLength: 15 },
  comment: { type: String, required: true, maxLength: 50000 },
  timestamp: { type: Date },
})

export default mongoose.model('Comments', CommentSchema)
