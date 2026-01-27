
const createUser = async(request, user) => {
  await request.post('/api/users', { data: user })
}

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

const likeBlog = async (page, blog) => {

  const blogElement = await page
    .getByText(blog.title)
  
  await blogElement.getByRole('button', { name: 'view' }).click()
  await blogElement.getByRole('button', { name: 'like' }).click()

  await blogElement.getByRole('button', { name: 'hide' }).click()

}

const helper = { 
  loginUser,
  createBlog,
  createUser,
  likeBlog
}

module.exports = helper