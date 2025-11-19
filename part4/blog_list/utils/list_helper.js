
const dummy = (blogs) => {
  if (Array.isArray(blogs))
    return 1
  return 0
}

const totalLikes = (blogs) => {
  if (!Array.isArray(blogs))
    throw new Error('An array of blogs is expected.')

  const reducer = (total, blog) => total + blog.likes

  return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  if (!Array.isArray(blogs))
    throw new Error('An array of blogs is expected.')

  if (blogs.length === 0)
    return null
  else if (blogs.length === 1)
    return blogs[0]

  const reducer = (favorite, current) => current.likes > favorite.likes ? current : favorite

  return blogs.reduce(reducer)
}

const mostBlogs = (blogs) => {
  if (!Array.isArray(blogs))
    throw new Error('An array of blogs is expected.')
  if (blogs.length === 0)
    return null

  const counts = {}
  let maxAuthor = null
  let maxCount = 0

  for (const blog of blogs) {
    counts[blog.author] = (counts[blog.author] || 0) + 1
    if (counts[blog.author] > maxCount) {
      maxCount = counts[blog.author]
      maxAuthor = blog.author
    }
  }

  return { author: maxAuthor, blogs: maxCount }
}

const mostLikes = (blogs) => {
  if (!Array.isArray(blogs))
    throw new Error('An array of blogs is expected.')
  if (blogs.length === 0)
    return null

  const likes = {}
  let maxAuthor = null
  let maxLikes = 0

  for (const blog of blogs) {

    likes[blog.author] = (likes[blog.author] || 0) + blog.likes

    if (likes[blog.author] > maxLikes) {
      maxLikes = likes[blog.author]
      maxAuthor = blog.author
    }
  }

  return { author: maxAuthor, likes: maxLikes }
}

const helperFunctions = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}

module.exports = helperFunctions