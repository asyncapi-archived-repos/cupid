const parser = require('@asyncapi/parser');

function validate(asyncApiDocs) {
  return Promise.all(asyncApiDocs.map(async doc => parser.parse(doc.json())));
}

module.exports = { validate };