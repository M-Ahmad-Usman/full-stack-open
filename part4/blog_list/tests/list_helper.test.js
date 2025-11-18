
const { test, describe } = require('node:test')
const assert = require('node:assert')

const listHelper = require('../utils/list_helper')
const blogData = require('./blog_data')

test('dummy returns one', () => {

  const result = listHelper.dummy(blogData.emptyBlogList)
  assert.strictEqual(result, 1)
})

describe('Total Likes', () => {

  test('of empty list is zero', () => {
    const totalLikes = listHelper.totalLikes(blogData.emptyBlogList)
    assert.strictEqual(totalLikes, 0)
  })

  test('when list has only one blog equals to the likes of that', () => {

    const listWithOneBlog = blogData.listWithOneBlog

    const totalLikes = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(totalLikes, listWithOneBlog[0].likes)
  })

  test('of a bigger list is calculated right', () => {
    const listWithMultipleBlogs = blogData.listWithMultipleBlogs
    const TOTAL_LIKES = 36 // Total likes in the list of multiple blogs

    const totalLikes = listHelper.totalLikes(listWithMultipleBlogs)
    assert.strictEqual(totalLikes, TOTAL_LIKES)
  })
})

describe('Favorite blog', () => {

  test('when list has no blog. an error is thrown', () => {
    const emptyBlogList = blogData.emptyBlogList

    assert.deepStrictEqual(listHelper.favoriteBlog(emptyBlogList), null)
  })

  test('when list has one blog equals to that blog', () => {
    const favoriteBlog = listHelper.favoriteBlog(blogData.listWithOneBlog)
    const FAVORITE_BLOG = blogData.listWithOneBlog[0]

    assert.deepStrictEqual(favoriteBlog, FAVORITE_BLOG)
  })

  test('when list has many blogs equals to the blog having most likes', () => {
    const favoriteBlog = listHelper.favoriteBlog(blogData.listWithMultipleBlogs)
    const FAVORITE_BLOG = blogData.listWithMultipleBlogs[2]

    assert.deepStrictEqual(favoriteBlog, FAVORITE_BLOG)
  })
})