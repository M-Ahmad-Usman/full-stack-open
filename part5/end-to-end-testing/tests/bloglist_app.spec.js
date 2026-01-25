const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {

  beforeEach(async ({ page }) => {
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
})