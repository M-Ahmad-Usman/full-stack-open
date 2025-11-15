
const express = require('express')
const mongoose = require('mongoose')

const app = express()

const blogSchema = mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
})

const Blog = mongoose.model('Blog', blogSchema)

const mongoUrl = 'mongodb://192.168.1.5:27017/bloglist' 
mongoose.connect(mongoUrl, { family: 4 }).then(() => console.log("MongoDB connected"), (e) => console.log("Error: ", e))

app.use(express.json())

app.get('/api/blogs', (request, response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs)
  })
})

app.post('/api/blogs', (request, response) => {

  const { title, author, url } = request.body;

  if (!title) return response.status(400).json({error: "Blog's title is required"})
  if (!author) return response.status(400).json({error: "Author is required"})
  if (!url) return response.status(400).json({error: "Blog's url is required"})

  const blog = new Blog({title, author, url, likes: 0})

  blog.save().then((result) => {
    response.status(201).json(result)
  })
})

const PORT = 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
