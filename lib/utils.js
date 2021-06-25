const parser = require('@asyncapi/parser');

/**
 * Validate and parse given array of AsyncAPI documents. 
 *
 * @param {Array} asyncApiDocs unparsed AsyncAPI documents
 * @returns {Array} parsed AsyncAPI documents
 */
function validate(asyncApiDocs) {
  return Promise.all(asyncApiDocs.map(async doc => {
    if (doc && doc['x-parser-spec-parsed'] === true) {
      return doc;
    }
    return parser.parse(doc);
  }));
}

module.exports = { validate };
