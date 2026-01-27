const { test, expect, beforeEach, describe } = require('@playwright/test')
const helper = require('./helper')
const { request } = require('node:http')

const {
  loginUser,
  createBlog,
  createUser,
  likeBlog
} = helper

// Testing Data
const USER1 = {
  name: 'Matti Luukkainen',
  username: 'mluukkai',
  password: 'salainen'
}

const BLOG1 = {
  title: 'Test Blog',
  author: 'Test Author',
  URL: 'https://bloglist.com'
}


describe('Blog app', () => {

  beforeEach(async ({ page, request }) => {

    // Reset the database
    await request.post('/api/testing/reset')

    // Create user in the db
    await createUser(request, USER1)

    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {

    const loginBtn = page.getByRole('button', { name: 'login' })

    await expect(loginBtn).toBeVisible()

    await loginBtn.click()

    // Make sure that the login form is visible
    expect(page.getByLabel('username')).toBeVisible()
    expect(page.getByLabel('password')).toBeVisible()

  })

  describe('login', () => {

    test('succeeds with correct credentials', async ({ page }) => {
      await loginUser(page, USER1)

      await expect(page.getByText(`${USER1.username} logged in`)).toBeVisible()

      await expect(page.getByText('Invalid Credentials')).not.toBeVisible()

    })

    test('fails with incorrect credentials', async ({ page }) => {
      await loginUser(page, { username: 'incorrect', password: 'incorrect' })

      await expect(page.getByText(`${USER1.username} logged in`)).not.toBeVisible()

      await expect(page.getByText('Invalid Credentials')).toBeVisible()
    })

    describe('When logged in', () => {
      beforeEach(async ({ page }) => {
        await loginUser(page, USER1)
      })

      test('a new blog can be created', async ({ page }) => {

        await createBlog(page, BLOG1)

        // Verify notification is shown
        const SUCCESS_MSG = `${BLOG1.title} by ${BLOG1.author} has been added.`
        await expect(page.getByText(SUCCESS_MSG)).toBeVisible()

        // Verify toggleable blog is shown in blog list
        const blogElement = page
          .getByText(`${BLOG1.title} ${BLOG1.author}`)

        // Verify the blog is available in list
        await expect(blogElement).toBeVisible()
        // Verify the existence of toggleable button
        await expect(blogElement.getByRole('button', { name: 'View' })).toBeVisible()

      })

      test('blog can be liked', async ({ page }) => {

        await createBlog(page, BLOG1)

        // Click on view button to toggle blog's details
        await page.getByRole('button', { name: 'view' }).click()

        // like blog
        await page.getByRole('button', { name: 'like' }).click()

        // Verify that the blog has only 1 like
        await expect(page.getByText('likes: 1')).toBeVisible()

      })

      test(`blog's creator can delete the blog`, async ({ page }) => {
        await createBlog(page, BLOG1)

        await page.pause()

        // Click on view button to toggle blog's details
        await page.getByRole('button', { name: 'view' }).click()

        // Register prompt dialog handler to accept blog deletion
        page.on('dialog', dialog => dialog.accept())

        // Click on remove button to delete the blog
        await page.getByRole('button', { name: 'Remove' }).click()

        await expect(page.getByText('Blog deleted successfully')).toBeVisible()
        await expect(page.getByText(BLOG1.title)).not.toBeVisible()
      })

      test('only blog author sees the remove button', async ({ page, request }) => {

        const newUser = {
          name: 'new user',
          username: 'new_user',
          password: 'password'
        }

        await Promise.all([
          createUser(request, newUser),
          createBlog(page, BLOG1)
        ])

        // Log out USER1
        await page.getByRole('button', { name: 'log out' }).click()
        // log in newUser
        await loginUser(page, newUser)

        // Toggle the blog's content
        await page.getByRole('button', { name: 'view' }).click()

        await expect(page.getByRole('button', { name: 'Remove' })).not.toBeVisible()

      })

      test('blogs are in sorted order according to likes', async ({ page }) => {

        // Test blog data
        const testBlogs = {
          leastPopular: {
            title: 'first blog',
            author: 'first author',
            URL: 'https://bloglist.com'
          },
          moderatelyPopular: {
            title: 'second blog',
            author: 'second author',
            URL: 'https://bloglist.com'
          },
          mostPopular: {
            title: 'third blog',
            author: 'third author',
            URL: 'https://bloglist.com'
          }
        }

        await page.pause()

        // Render in specific order
        await createBlog(page, testBlogs.moderatelyPopular)
        await createBlog(page, testBlogs.leastPopular)
        await createBlog(page, testBlogs.mostPopular)

        // Like the most populear blog 2 times
        await likeBlog(page, testBlogs.mostPopular)
        await likeBlog(page, testBlogs.mostPopular)

        // Like the moderately popular blog 1 time
        await likeBlog(page, testBlogs.moderatelyPopular)

        // least popular blog does not has any likes

        const blogElements = await page.locator('.blog').all()

        await expect(blogElements[0]).toContainText(testBlogs.mostPopular.title)
        await expect(blogElements[1]).toContainText(testBlogs.moderatelyPopular.title)
        await expect(blogElements[2]).toContainText(testBlogs.leastPopular.title)
      })

    })

  })

})