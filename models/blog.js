import mongoose from 'mongoose'
const Schema = mongoose.Schema

const BlogSchema = new Schema({
  title: { type: String, required: true, maxLength: 60 },
  blog: { type: String, required: true, maxLength: 10000 },
  timestamp: { type: Date },
  author: { type: Schema.Types.ObjectId, ref: 'Author', required: true },
  published: { type: Boolean, required: true },
})

export default mongoose.model('Blog', BlogSchema)
