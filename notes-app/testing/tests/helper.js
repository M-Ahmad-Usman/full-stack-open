
const loginWith = async (page, username, password) => {
  await page.getByRole('button', { name: 'login' }).click()

  await page.getByLabel('username').fill(username ?? 'alice_johnson')
  await page.getByLabel('password').fill(password ?? 'password123')

  await page.getByRole('button', { name: 'login' }).click()
}

const createNote = async (page, noteContent) => {
  await page.getByRole('button', { name: 'new note' }).click()

  await page.getByLabel('content').fill(noteContent)

  await page.getByRole('button', { name: 'save' }).click()

  // Wait for the created note to be rendered on the screen
  await page.getByText(noteContent).waitFor()
}

const helpers = {
  loginWith,
  createNote
}

module.exports = helpers