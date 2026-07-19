
const getUser = () => {
  const storedUserData = localStorage.getItem('loggedInUser')
  return storedUserData ? JSON.parse(storedUserData) : { name: undefined, username: undefined, accessToken: undefined }
}

const saveUser = (user) => {
  localStorage.setItem('loggedInUser', JSON.stringify(user))
}

const removeUser = () => {
  localStorage.removeItem('loggedInUser')
}

export default { getUser, saveUser, removeUser }