const removeProperty = (document, property) => {
  if (!property) return null

  delete document[property]
  return document
}

const helper = { removeProperty }

module.exports = helper