
const loginWith = async (page, username, password) => {
  await page.getByRole('button', { name: 'login' }).click()

  await page.getByLabel('username').fill(username ?? 'alice_johnson')
  await page.getByLabel('password').fill(password ?? 'password123')

  await page.getByRole('button', { name: 'login' }).click()
}

const helpers = {
  loginWith
}

module.exports = helpers