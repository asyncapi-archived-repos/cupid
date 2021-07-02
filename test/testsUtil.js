const path = require('path');
const fs = require('fs');
const { resolve } = require('path');
const { rejects } = require('assert');

const examplesPath = './test/examples/flightService';

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

function mapToObject (map) {
  const obj = {};
  for (const [key,value] of map) {
    if (value instanceof Map) {
      obj[key] = mapToObject(value);
    } else {
      obj[key] = value;
    }
  }
  return obj;
}

module.exports = {getAsyncApiExamples, mapToObject};