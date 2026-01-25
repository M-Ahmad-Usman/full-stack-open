const { test, expect, describe, beforeEach } = require('@playwright/test')
const helpers = require('./helper')

const { loginWith, createNote } = helpers

describe('Note app', () => {

  beforeEach(async ({ page, request }) => {

    // Reset the database
    await request.post('/api/testing/reset')
    // Create new user
    await request.post('/api/users', {
      data: {
        name: 'Alice Johnson',
        username: 'alice_johnson',
        password: 'password123'
      }
    })

    await page.goto('/')
  })

  test('front page can be opened', async ({ page }) => {

    const locator = page.getByText('Notes')
    await expect(locator).toBeVisible()
    await expect(page.getByText('Note app, Department of Computer Science, University of Helsinki 2025')).toBeVisible()
  })

  test('user can log in', async ({ page }) => {
    await loginWith(page, 'alice_johnson', 'password123')

    await expect(page.getByText('Alice Johnson logged in')).toBeVisible()
  })

  test('login fails with wrong password', async ({ page }) => {
    await loginWith(page, 'alice_johnson', 'wrong_password')

    await expect(page.getByText('wrong credentials')).toBeVisible()

    // We can also test that the error is rendered in the correct component
    const errorDiv = page.locator('.error')
    await expect(errorDiv).toContainText('wrong credentials')

    // We can also test rendered text styles
    await expect(errorDiv).toHaveCSS('border-style', 'solid')
    await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')

    await expect(page.getByText('Matti Luukkainen logged in')).not.toBeVisible()
  })

  describe('When logged in', () => {

    // Log in user
    beforeEach(async ({ page }) => {
      loginWith(page, 'alice_johnson', 'password123')
    })

    test('a new note can be created', async ({ page }) => {
      const noteContent = 'a note created by playwright'
      await createNote(page, noteContent)

      await expect(page.getByText(noteContent)).toBeVisible()
    })

    describe('and several notes exists', () => {

      beforeEach(async ({ page }) => {
        await createNote(page, 'first note')
        await createNote(page, 'second note')
        await createNote(page, 'third note')
      })

      test('one of those can be made nonimportant', async ({ page }) => {

        /* To add breakpoints for test debugging, use:
            await page.pause() 
        */

        const otherNoteText = page.getByText('second note')
        
        // The note text is in span element. Referncing span parent which is main note
        const otherNoteElement = otherNoteText.locator('..')

        await otherNoteElement
          .getByRole('button', { name: 'make not important' })
          .click()

        await expect(otherNoteElement.getByText('make important')).toBeVisible()

      })

    })
  })

})
