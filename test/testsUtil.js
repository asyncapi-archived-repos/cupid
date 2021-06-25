const path = require('path');
const fs = require('fs');
const parser = require('@asyncapi/parser');

const examplesPath = './test/examples/flightService';

async function getAsyncApiExamples() {
  const docs = [];
  const files = fs.readdirSync(examplesPath);
  for (const file of files) {
    const document_path = path.join('./examples/flightService', file);
    const asyncApiDoc = fs.readFileSync(path.resolve(__dirname, document_path),'utf8');
    try {
      const parsedDoc = await parser.parse(asyncApiDoc);
      docs.push(parsedDoc._json);
    } catch (err) {
      console.log(err);
    }
  }
  return docs;
}

module.exports = {getAsyncApiExamples};