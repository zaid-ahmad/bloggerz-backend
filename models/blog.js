import mongoose from 'mongoose'
const Schema = mongoose.Schema

const BlogSchema = new Schema({
  title: { type: String, required: true, maxLength: 60 },
  blog: { type: String, required: true, maxLength: 10000 },
  timestamp: { type: Date },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  published: { type: Boolean, required: true },
})

const Blog = mongoose.model('Blog', BlogSchema)
export default Blog
