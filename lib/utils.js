const parser = require('@asyncapi/parser');

/**
 * Validate and parse given array of AsyncAPI documents. 
 *
 * @param {Array} asyncApiDocs unparsed AsyncAPI documents
 * @returns {Promise<Array>} parsed AsyncAPI documents
 */

function validate(asyncApiDocs) {
  return Promise.all(asyncApiDocs.map(async doc => {
    if (typeof doc === 'object' && doc.ext && doc.ext('x-parser-spec-parsed')) {
      return doc;
    }
    return parser.parse(doc);
  }));
}

module.exports = { validate };
