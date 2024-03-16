const path = require('path');
const fs = require('fs');
const { Parser } = require('@asyncapi/parser');

const examplesPath_AsyncApi_v2 = './test/examples/flightService';
const examplesPath_AsyncApi_v3 = './test/examples/flightService_v3';

async function parseAsyncApiExamples(asyncApiDocs) {
  const docs = [];
  const parser = new Parser();
  for (const doc of asyncApiDocs) {
    const parsedDoc = await parser.parse(doc);
    docs.push(parsedDoc);
  }
  return docs;
}

function getAsyncApiExamples(version) {
  const docs = [];  
  const examplesPath = version === 2 ? examplesPath_AsyncApi_v2 : examplesPath_AsyncApi_v3;
  const files = fs.readdirSync(examplesPath);
  for (const file of files) {
    const lastSubDir = examplesPath.substring(examplesPath.lastIndexOf('/') + 1);
    const document_path = path.join(`./examples/${lastSubDir}`, file);
    const asyncApiDoc = fs.readFileSync(path.resolve(__dirname, document_path),'utf8');
    docs.push(asyncApiDoc);
  }
  return docs;
}

module.exports = {getAsyncApiExamples,parseAsyncApiExamples};