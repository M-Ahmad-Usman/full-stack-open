const { test, expect, beforeEach, describe } = require('@playwright/test')
const helper = require('./helper')
const { request } = require('node:http')

const {
  loginUser,
  createBlog,
  createUser,
  likeBlog,
  generateBlog,
  generateUser
} = helper

const savedUser = generateUser()

describe('Blog app', () => {

  beforeEach(async ({ page, request }) => {
    // Reset the db
    await request.post('/api/testing/reset')
    // Save user in the db
    await createUser(request, savedUser)
    await page.goto('/')
  })

  test('Login button is clickable', async ({ page }) => {
    const loginBtn = page.getByRole('link', { name: 'login' })

    await expect(loginBtn).toBeVisible()

    await loginBtn.click()

    // login form is visible
    expect(page.getByLabel('username')).toBeVisible()
    expect(page.getByLabel('password')).toBeVisible()

    // page is on login route
    expect(page).toHaveURL('/login')
  })

  describe('login', () => {

    test('succeeds with correct credentials', async ({ page }) => {
      await page.goto('/login')
      await loginUser(page, savedUser)

      await expect(page.getByText(`logged in`)).toBeVisible()

      // After login user is redirected to home screen
      await expect(page).toHaveURL('/')
    })

    test('fails with incorrect credentials', async ({ page }) => {
      await page.goto('/login')
      await loginUser(page, { username: 'incorrect', password: 'incorrect' })

      await expect(page.getByText('Invalid Credentials')).toBeVisible()
      await expect(page.getByText(`logged in`)).not.toBeVisible()

      // If login fails then user should remain on /login and shouldn't be redirected elsewhere
      await expect(page).toHaveURL('/login')
    })

    describe('When logged in', () => {

      beforeEach(async ({ page }) => {
        await page.goto('/login')
        await loginUser(page, savedUser)
        // wait for the application to save access token
        await page.getByText(`logged in`).waitFor()
      })

      test('logged in user can create blog', async ({ page }) => {

        const blog = generateBlog()

        await page.goto('/create')
        await createBlog(page, blog)

        // Verify notification is shown
        const SUCCESS_MSG = `${blog.title} by ${blog.author} has been added.`
        await expect(page.getByText(SUCCESS_MSG)).toBeVisible()

        // Verify that the clickable link for the  blog is available
        await expect(page.getByRole('link', { name: blog.title })).toBeDefined()
      })

      test('blog can be liked', async ({ page }) => {

        const blog = generateBlog()

        await page.goto('/create')
        await createBlog(page, blog)

        // Open blog's details page
        await page.getByRole('link', { name: blog.title }).click()

        // like blog
        await page.getByRole('button', { name: 'like' }).click()

        // Verify that the blog has only 1 like
        await expect(page.getByText('likes: 1')).toBeVisible()
      })

      test(`blog's creator can delete the blog`, async ({ page }) => {
        
        const blog = generateBlog()

        await page.goto('/create')
        await createBlog(page, blog)

        
        // Open blog's details page
        await page.getByRole('link', { name: blog.title }).click()
        
        await page.pause()

        // Register prompt dialog handler to accept blog deletion
        page.on('dialog', dialog => dialog.accept())

        // Click on remove button to delete the blog
        await page.getByRole('button', { name: 'Remove' }).click()

        await expect(page.getByText('Blog deleted successfully')).toBeVisible()
        await expect(page.getByText(blog.title)).not.toBeVisible()
      })

      test('only blog author sees the remove button', async ({ page, request }) => {
        
        const anotherUser = generateUser()
        await createUser(request, anotherUser)

        await page.goto('/create')
        const blog = generateBlog()
        await createBlog(page, blog)

        // Log out savedUser
        await page.getByRole('button', { name: 'logout' }).click()

        // log in anotherUser
        await page.goto('/login')
        await loginUser(page, anotherUser)

        // Open blog's details page
        await page.getByRole('link', { name: blog.title }).click()

        await expect(page.getByRole('button', { name: 'Remove' })).not.toBeVisible()
      })

      test('blogs are in sorted order according to likes', async ({ page }) => {

        // Test blog data
        const blogs = {
          leastPopular: generateBlog({ title: 'least popular blog' }),
          moderatelyPopular: generateBlog({ title: 'moderately popular blog' }),
          mostPopular: generateBlog({ title: 'most popular blog' })
        }

        // Render in specific order
        await page.goto('/create')
        await createBlog(page, blogs.moderatelyPopular)
        await page.goto('/create')
        await createBlog(page, blogs.leastPopular)
        await page.goto('/create')
        await createBlog(page, blogs.mostPopular)

        // Like the most popular blog 2 times
        await page.getByRole('link', { name: blogs.mostPopular.title }).click()
        await page.getByRole('button', { name: 'like' }).click()
        await page.getByRole('button', { name: 'like' }).click()


        // Like the moderately popular blog 1 time
        await page.goto('/')
        await page.getByRole('link', { name: blogs.moderatelyPopular.title }).click()
        await page.getByRole('button', { name: 'like' }).click()

        // least popular blog does not has any likes

        // Move to main page
        await page.goto('/')
        const blogElements = await page.locator('li').all()

        await expect(blogElements[0]).toContainText(blogs.mostPopular.title)
        await expect(blogElements[1]).toContainText(blogs.moderatelyPopular.title)
        await expect(blogElements[2]).toContainText(blogs.leastPopular.title)
      })

    })

  })

})