const parser = require('@asyncapi/parser');

function validate(asyncApiDocs) {
  return new Promise((resolve,reject) => {
    const parsedDocs = [];
    const Promises = [];
    asyncApiDocs.forEach(document => {
      Promises.push(new Promise((resolve, reject) => {
        parser.parse(document.json())
          .then(parsedDoc => parsedDocs.push(parsedDoc))
          .then(() => resolve())
          .catch(err => reject(err));
      }));
    });
    Promise.all(Promises)
      .then(() => resolve(parsedDocs))
      .catch(err => reject(err));
  });
}

module.exports = { validate };