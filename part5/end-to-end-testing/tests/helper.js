
const loginUser = async (page, user) => {
  await page.getByRole('button', { name: 'login' }).click()

  // fill in the login form
  await page.getByLabel('username').fill(user.username)
  await page.getByLabel('password').fill(user.password)

  await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, blog) => {
  await page.getByRole('button', { name: 'Create New Blog' }).click()

  // fill in the form with blog data
  await page.getByLabel('Title').fill(blog.title)
  await page.getByLabel('Author').fill(blog.author)
  await page.getByLabel('URL').fill(blog.URL)

  await page.getByRole('button', { name: 'Add Blog' }).click()
}

const helper = { loginUser, createBlog }

module.exports = helper