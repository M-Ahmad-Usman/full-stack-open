const { test, expect, beforeEach, describe } = require('@playwright/test')
const helper = require('./helper')

const { loginUser, createBlog } = helper

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

    })

  })

})