
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

  const reducer = (favorite, current) => current.likes > favorite.likes ? current: favorite

  return blogs.reduce(reducer)
}

const helperFunctions = { dummy, totalLikes, favoriteBlog }

module.exports = helperFunctions