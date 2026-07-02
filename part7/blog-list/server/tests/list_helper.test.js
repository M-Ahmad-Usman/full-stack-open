
const { test, describe } = require('node:test')
const assert = require('node:assert')

const listHelper = require('../utils/list_helper')
const blogData = require('./blog_data')

const { listWithNoBlog, listWithOneBlog, listWithMultipleBlogs } = blogData

test('dummy returns one', () => {

  const { dummy } = listHelper

  assert.strictEqual(dummy(listWithNoBlog), 1)
})

describe('Total Likes', () => {

  // The function to test
  const { totalLikes } = listHelper

  test('of empty list is zero', () => {
    assert.strictEqual(totalLikes(listWithNoBlog), 0)
  })

  test('when list has only one blog equals to the likes of that', () => {
    assert.strictEqual(totalLikes(listWithOneBlog), listWithOneBlog[0].likes)
  })

  test('of a bigger list is calculated right', () => {
    const TOTAL_LIKES = 36 // Total likes in the list of multiple blogs

    assert.strictEqual(totalLikes(listWithMultipleBlogs), TOTAL_LIKES)
  })
})

describe('Favorite blog', () => {

  // The function to test
  const { favoriteBlog } = listHelper

  test('when list has no blog equals to null', () => {
    assert.deepStrictEqual(favoriteBlog(listWithNoBlog), null)
  })

  test('when list has one blog equals to that blog', () => {
    const FAVORITE_BLOG = listWithOneBlog[0]

    assert.deepStrictEqual(favoriteBlog(listWithOneBlog), FAVORITE_BLOG)
  })

  test('when list has many blogs equals to the blog having most likes', () => {
    const FAVORITE_BLOG = listWithMultipleBlogs[2]

    assert.deepStrictEqual(favoriteBlog(listWithMultipleBlogs), FAVORITE_BLOG)
  })
})

describe('Most Blogs', () => {

  // The function to test
  const { mostBlogs } = listHelper

  test('when list has not blogs equals to null', () => {
    assert.deepStrictEqual(mostBlogs(listWithNoBlog), null)
  })

  test('when list has one blog equals to the author of that blog with number of blogs to 1', () => {
    const AUTHOR_WITH_MOST_BLOGS = {
      author: listWithOneBlog[0].author,
      blogs: 1
    }

    assert.deepStrictEqual(mostBlogs(listWithOneBlog), AUTHOR_WITH_MOST_BLOGS)
  })

  test('when list has many blogs equals to the author with most blogs', () => {
    const AUTHOR_WITH_MOST_BLOGS = {
      author: 'Robert C. Martin',
      blogs: 3
    }

    assert.deepStrictEqual(mostBlogs(listWithMultipleBlogs), AUTHOR_WITH_MOST_BLOGS)
  })
})

describe('Most Likes', () => {

  // The function to test
  const { mostLikes } = listHelper

  test('when list has not blogs equals to null', () => {
    assert.deepStrictEqual(mostLikes(listWithNoBlog), null)
  })

  test('when list has one blog equals to the author of that blog with number of blogs to 1', () => {
    const AUTHOR_WITH_MOST_LIKES = {
      author: listWithOneBlog[0].author,
      likes: listWithOneBlog[0].likes
    }

    assert.deepStrictEqual(mostLikes(listWithOneBlog), AUTHOR_WITH_MOST_LIKES)
  })

  test('when list has many blogs equals to the author with most blogs', () => {
    const AUTHOR_WITH_MOST_LIKES = {
      author: 'Edsger W. Dijkstra',
      likes: 17
    }

    assert.deepStrictEqual(mostLikes(listWithMultipleBlogs), AUTHOR_WITH_MOST_LIKES)
  })
})