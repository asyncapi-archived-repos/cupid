const parser = require('@asyncapi/parser');

/**
 * 
 * @param {Array} asyncApiDocs unparsed asyncApi documents
 * @returns {Array} parsed asyncApi documents
 */
function validate(asyncApiDocs) {
  return Promise.all(asyncApiDocs.map(async doc => parser.parse(doc.json())));
}

module.exports = { validate };