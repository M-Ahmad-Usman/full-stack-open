
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

const helperFunctions = { dummy, totalLikes }

module.exports = helperFunctions