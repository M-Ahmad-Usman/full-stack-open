const { test, expect, beforeEach, describe } = require('@playwright/test')
const helper = require('./helper')

const { loginUser } = helper

// User for testing
const USER1 = {
  name: 'Matti Luukkainen',
  username: 'mluukkai',
  password: 'salainen'
}

describe('Blog app', () => {

  beforeEach(async ({ page, request }) => {

    // Reset the database
    await request.post('/api/testing/reset')

    // Create user in the db
    await request.post('/api/users', { data: USER1 })

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
        
        const TEST_BLOG = {
          title: 'Test Blog',
          author: 'Test Author',
          URL: 'https://bloglist.com'
        }

        await page.getByRole('button', { name: 'Create New Blog' }).click()

        await page.getByLabel('Title').fill(TEST_BLOG.title)
        await page.getByLabel('Author').fill(TEST_BLOG.author)
        await page.getByLabel('URL').fill(TEST_BLOG.URL)

        await page.getByRole('button', { name: 'Add Blog' }).click()

        // Verify notification is shown
        const SUCCESS_MSG = `${TEST_BLOG.title} by ${TEST_BLOG.author} has been added.`
        await expect(page.getByText(SUCCESS_MSG)).toBeVisible()

        // Verify toggleable blog is shown in blog list
        const blogElement = page
          .getByText(`${TEST_BLOG.title} ${TEST_BLOG.author}`)

        // Verify the blog is available in list
        await expect(blogElement).toBeVisible()
        // Verify the existence of toggleable button
        await expect(blogElement.getByRole('button', { name: 'View' })).toBeVisible()

      })
    })

  })

})