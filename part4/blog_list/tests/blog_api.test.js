// Testing related modules
const { test, after, beforeEach, describe } = require('node:test')
const assert = require('assert')
const supertest = require('supertest')

// DB related modules
const mongoose = require('mongoose')
const Blog = require('../models/blog')

// Local helping modules
const blogData = require('./blog_data')
const helper = require('./test_helper')

// Main app module
const app = require('../app')

const api = supertest(app)

const blogList = blogData.listWithMultipleBlogs

describe('Blog API', () => {
  describe('when there is initially some notes saved', () => {

    // Persist DB state.
    // Every test will get the same state of DB
    beforeEach(async () => {
      await Blog.deleteMany({})
      await Blog.insertMany(blogList)
    })

    test('all blogs are returned as json', async () => {
      const res = await api.get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const blogs = res.body.map(blog => helper.removeProperty(blog, 'id'))

      assert.deepStrictEqual(blogs, blogList)
    })

    test('blogs have id property instead of _id', async () => {
      const { body: blogs } = await api.get('/api/blogs')

      // Check existence of id property
      assert(Object.hasOwn(blogs[0], 'id'))
      // Check absence of _id property
      assert(!Object.hasOwn(blogs[0], '_id'))
    })

    describe('viewing a specific blog', () => {

      test('succeeds with status 200 on valid id', async () => {
        const blogsInDB = await helper.blogsInDB()

        const blogToFind = blogsInDB[0]
        const validId = blogToFind.id

        const { body: blogFromDB } = await api.get(`/api/blogs/${validId}`).expect(200)

        assert.deepStrictEqual(blogFromDB, blogToFind)
      })

      test('fails with status 404 on non-existing id', async () => {
        await api.get(`/api/blogs/${helper.nonExistingId()}`)
          .expect(404)
      })

      test('fails with status 400 on malformated id', async () => {
        const malformatedId = '2342384'
        await api.get(`/api/blogs/${malformatedId}`)
          .expect(400)
      })
    })

    describe('addition of new blog', () => {

      test('succeeds with status 201 on valid data', async () => {
        const newBlog = blogData.listWithOneBlog[0]

        const { body: savedBlog } = await api.post('/api/blogs')
          .send(newBlog)
          .expect(201)
          .expect('Content-Type', /application\/json/)

        const { body: blogs } = await api.get('/api/blogs')

        // Check if blog has been added or not
        assert.deepEqual(blogs.length, blogList.length + 1)
        // Verify the contents of blogs
        assert.deepStrictEqual(helper.removeProperty(savedBlog, 'id'), newBlog)
      })

      test('fails with status 400 on invalid data', async () => {
        const blog = blogData.listWithOneBlog[0]

        const postOperationsWithInvalidData = [

          // save blog without title
          api.post('/api/blogs')
            .send(helper.removeProperty(blog, 'title'))
            .expect(400),

          // save blog without author
          api.post('/api/blogs')
            .send(helper.removeProperty(blog, 'author'))
            .expect(400),

          // save blog without url
          api.post('/api/blogs')
            .send(helper.removeProperty(blog, 'url'))
            .expect(400)
        ]

        await Promise.all(postOperationsWithInvalidData)

        const { body: blogs } = await api.get('/api/blogs')

        assert.deepEqual(blogs.length, blogList.length)

      })
    })

    describe('deletion of a blog', () => {

      test('succeeds with status 204 on valid id', async () => {

        const blogs = await helper.blogsInDB()
        const blogToDelete = blogs[0]

        await api.delete(`/api/blogs/${blogToDelete.id}`)
          .expect(204)

        const blogsAfterDeletion = await helper.blogsInDB()
        const ids = blogsAfterDeletion.map(b => b.id)

        assert(!ids.includes(blogToDelete.id))
      })

      test('fails with status 404 on non-existing id', async () => {
        await api.delete(`/api/blogs/${helper.nonExistingId()}`)
          .expect(404)
      })

      test('fails with 400 on malformatted id', async () => {
        await api.delete('/api/blogs/89498')
          .expect(400)
      })
    })

    describe('updation of a blog', () => {

      test('succeeds with 200 on valid data', async () => {
        const blogs = await helper.blogsInDB()
        const blogToUpdate = blogs[0]

        blogToUpdate.title = 'Updated Title'
        blogToUpdate.author = 'Update author'
        blogToUpdate.url = 'Update url'
        blogToUpdate.likes = blogToUpdate.likes + 1

        const { body: updatedBlog } = await api.put(`/api/blogs/${blogToUpdate.id}`)
          .send(blogToUpdate)
          .expect(200)

        assert.deepStrictEqual(updatedBlog, blogToUpdate)
      })

      test('fails with status 400 on no data', async () => {
        const blogs = await helper.blogsInDB()
        const blogToUpdate = blogs[0]

        blogToUpdate.title = 'Updated title'

        await api.put(`/api/blogs/${blogToUpdate.id}`)
          .expect(400)
      })

      test('fails with status 400 on invalid data', async () => {

        const blogs = await helper.blogsInDB()
        const blogToUpdate = blogs[0]

        // likes must be number
        blogToUpdate.likes = 'sdf'

        await api.put(`/api/blogs/${blogToUpdate.id}`)
          .send(blogToUpdate)
          .expect(400)

      })

      test('fails with status 404 on non-existing id', async () => {

        const blogs = await helper.blogsInDB()
        const blogToUpdate = blogs[0]

        blogToUpdate.title = 'Update title'

        await api.put(`/api/blogs/${helper.nonExistingId()}`)
          .send(blogToUpdate)
          .expect(404)

      })

      test.only('fails with status 400 on malformatted id', async () => {
        await api.put('/api/blogs/4498498')
          .send({ title: 'Ahmad' })
          .expect(400)
      })

    })
  })

})

// After everything is done we have to close the mongoDB collection
// otherwise the program will not terminte
after(() => {
  mongoose.connection.close()
})