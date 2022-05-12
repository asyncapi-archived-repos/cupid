const path = require('path');
const fs = require('fs');
const parser = require('@asyncapi/parser');

const examplesPath = './test/examples/flightService';

async function parseAsyncApiExamples(asyncApiDocs) {
  const docs = [];
  for (const doc of asyncApiDocs) {
    const parsedDoc = await parser.parse(doc);
    docs.push(parsedDoc);
  }
  return docs;
}

function getAsyncApiExamples() {
  const docs = [];
  const files = fs.readdirSync(examplesPath);
  for (const file of files) {
    const document_path = path.join('./examples/flightService', file);
    const asyncApiDoc = fs.readFileSync(path.resolve(__dirname, document_path),'utf8');
    docs.push(asyncApiDoc);
  }
  return docs;
}

module.exports = {getAsyncApiExamples,parseAsyncApiExamples};