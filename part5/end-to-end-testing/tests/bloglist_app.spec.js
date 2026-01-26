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
      await loginUser(page, { username: 'incorrect', password: 'incorrect'})

      await expect(page.getByText(`${USER1.username} logged in`)).not.toBeVisible()

      await expect(page.getByText('Invalid Credentials')).toBeVisible()
    }) 

  })

})