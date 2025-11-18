
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

  // Reduces blogs array to the following object
  // { authorName: numberOfBlogs, ... }
  // Here authorName and numberOfBlogs both are values from a blog object of blogs array
  const reducer1 = (accum, curr) => {

    if (Object.hasOwn(accum, curr.author))
      accum[curr.author]++
    else
      accum[curr.author] = 1

    return accum
  }
  const authors = blogs.reduce(reducer1, {})

  // Returns the [author, blogs] block with highest value of blogs
  const reducer2 = (curr, next) => {

    // curr = [author, blogs]
    // next = [author, blogs]

    const blogsOfCurrAuthor = curr[1]
    const blogsOfNextAuthor = next[1]

    if (blogsOfCurrAuthor < blogsOfNextAuthor)
      curr = next

    return curr
  }
  const [authorWithMostBlogs, numberOfBlogs] = Object.entries(authors).reduce(reducer2)

  return { author: authorWithMostBlogs, blogs: numberOfBlogs }
}

const mostLikes = (blogs) => {
  if (!Array.isArray(blogs))
    throw new Error('An array of blogs is expected.')

  if (blogs.length === 0)
    return null

  // Reduces blogs array to the following object
  // { authorName: numberOfLikes, ... }
  // Here authorName and numberOfLikes both are values from a blog object of blogs array
  const reducer1 = (accum, curr) => {

    if (Object.hasOwn(accum, curr.author))
      accum[curr.author] += curr.likes
    else
      accum[curr.author] = curr.likes

    return accum
  }
  const authors = blogs.reduce(reducer1, {})

  // Returns the [author, likes] block with highest value of likes
  const reducer2 = (curr, next) => {

    // curr = [author, likes]
    // next = [author, likes]

    const likesOfCurrAuthor = curr[1]
    const likesOfNextAuthor = next[1]

    if (likesOfCurrAuthor < likesOfNextAuthor)
      curr = next

    return curr
  }
  const [authorWithMostLikes, numberOfLikes] = Object.entries(authors).reduce(reducer2)

  return { author: authorWithMostLikes, likes: numberOfLikes }
}

const helperFunctions = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}

module.exports = helperFunctions