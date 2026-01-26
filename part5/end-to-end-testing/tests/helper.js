
const loginUser = async (page, user) => {
  await page.getByRole('button', { name: 'login' }).click()

  // fill in the login form
  await page.getByLabel('username').fill(user.username)
  await page.getByLabel('password').fill(user.password)

  await page.getByRole('button', { name: 'login' }).click()
}

const helper = { loginUser }

module.exports = helper