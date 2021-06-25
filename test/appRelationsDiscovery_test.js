const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

const expect = chai.expect;
chai.use(chaiAsPromised);

const {getRelations} = require('../lib/appRelationsDiscovery');
const {getAsyncApiExamples} = require('./testsUtil'); 

describe('appRelationDiscovery', function() {
  it('should return a map of relations', async function() {
    const flightServiceDocs = await getAsyncApiExamples();
    const defaultOutput = await getRelations(flightServiceDocs);
    expect(typeof defaultOutput).to.be.equal('object');
  });
});
