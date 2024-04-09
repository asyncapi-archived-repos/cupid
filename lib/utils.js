const { Parser } = require('@asyncapi/parser');

/**
 * Validate and parse given array of AsyncAPI documents. 
 *
 * @param {Array} asyncApiDocs unparsed AsyncAPI documents
 * @returns {Promise<Array>} parsed AsyncAPI documents
 */

function validate(asyncApiDocs) {
  return Promise.all(asyncApiDocs.map(async doc => {
    if (typeof doc === 'object' && typeof doc.document.extensions === 'function' && doc.document.extensions().get('x-parser-spec-parsed').value()) {
      return doc;
    }
    const parser = new Parser();
    return await parser.parse(doc);
  }));
}

module.exports = { validate };
