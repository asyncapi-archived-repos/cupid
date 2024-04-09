const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

const expect = chai.expect;
chai.use(chaiAsPromised);

const { getRelations } = require('../lib/appRelationsDiscovery');
const { getAsyncApiExamples, parseAsyncApiExamples } = require('./testsUtil');

const outputMermaid = 'graph TD\n server1[(mqtt://localhost:1883/)]\nFlightMonitorService[Flight Monitor Service]\nFlightMonitorService -- flight/update --> server1\nFlightNotifierService[Flight Notifier Service]\nserver1 -- flight/update --> FlightNotifierService\nFlightSubscriberService[Flight Subscriber Service]\nFlightSubscriberService -- flight/queue --> server1\nserver1 -- flight/queue --> FlightMonitorService';
const outputPlantUML = '@startuml\ntitle Classes - Class Diagram\n\nclass server1 { \n url: mqtt://localhost:1883/ \n protocol: mqtt\n}\nFlightMonitorService --|> server1:flight/update\nserver1 --|> FlightNotifierService:flight/update\nFlightSubscriberService --|> server1:flight/queue\nserver1 --|> FlightMonitorService:flight/queue\n@enduml';
const outputReactFlow = [{ id: 'Server1', data: { label: 'mqtt://localhost:1883/,mqtt' }, position: { x: 250, y: 5 } }, { id: 'FlightMonitorService', data: { label: 'Flight Monitor Service' }, position: { x: 100, y: 10 } }, { id: 'edge1', source: 'FlightMonitorService', target: 'Server1', animated: true, label: 'flight/update', type: 'edgeType', arrowHeadType: 'arrowclosed' }, { id: 'FlightNotifierService', data: { label: 'Flight Notifier Service' }, position: { x: 100, y: 10 } }, { id: 'edge2', source: 'Server1', target: 'FlightNotifierService', animated: true, label: 'flight/update', type: 'edgeType', arrowHeadType: 'arrowclosed' }, { id: 'FlightSubscriberService', data: { label: 'Flight Subscriber Service' }, position: { x: 100, y: 10 } }, { id: 'edge3', source: 'FlightSubscriberService', target: 'Server1', animated: true, label: 'flight/queue', type: 'edgeType', arrowHeadType: 'arrowclosed' }, { id: 'edge4', source: 'Server1', target: 'FlightMonitorService', animated: true, label: 'flight/queue', type: 'edgeType', arrowHeadType: 'arrowclosed' }];

for (let version = 2; version <= 3; version++) {
  describe(`appRelationDiscovery (AsyncApi version ${version})`, function () {
    let flightServiceDocs;
    let correctSlug;
    let slugOutput;
    let parsedSlugOutput;
    let output;
    let correctChannelUpdate;
    let correctChannelQueue;
    let parsedDocs;
    let parsedOutput;
    before(async function () {
      flightServiceDocs = getAsyncApiExamples(version);
      parsedDocs = await parseAsyncApiExamples(flightServiceDocs);
      output = await getRelations(flightServiceDocs);
      parsedOutput = await getRelations(parsedDocs);
      correctSlug = 'mqtt://localhost:1883/,mqtt';
      slugOutput = output.get(correctSlug);
      parsedSlugOutput = parsedOutput.get(correctSlug);
      correctChannelUpdate = 'flight/update';
      correctChannelQueue = 'flight/queue';
    });

    it('should return correct slug', function () {
      expect(output).to.have.key(correctSlug);
      expect(parsedOutput).to.have.key(correctSlug);
    });

    it('should return correct channels', function () {
      expect(slugOutput).to.have.all.keys(correctChannelUpdate, correctChannelQueue);
      expect(parsedSlugOutput).to.have.all.keys(correctChannelUpdate, correctChannelQueue);
    });

    describe('subscriber data for flight/update channel', function () {
      const channelName = 'flight/update';
      const correctSubOperation = 'Flight Monitor Service';
      const correctDescription = 'Provides updates from a subscribed flight\n';

      it('should return correct subscribe channel from slug output', function () {
        assertSubscription(slugOutput, channelName, correctSubOperation, correctDescription);
      });

      it('should return correct subscribe channel from parsed slug output', function () {
        assertSubscription(parsedSlugOutput, channelName, correctSubOperation, correctDescription);
      });
    });

    describe('publisher data for flight/update channel', function () {
      const correctPubOperation = 'Flight Notifier Service';
      const channelName = 'flight/update';
      const correctDescription = 'Receives updates from a subscribed flight\n';

      it('should return correct publish channel from slug output', function () {
        assertPublication(slugOutput, channelName, correctPubOperation, correctDescription);
      });

      it('should return correct publish channel from parsed slug output', function () {
        assertPublication(parsedSlugOutput, channelName, correctPubOperation, correctDescription);
      });
    });

    describe('subscriber data for flight/queue channel', function () {
      const channelName = 'flight/queue';
      const correctSubOperation = 'Flight Subscriber Service';
      const correctDescription = 'queue flight in order to retrieve status\n';

      it('should return correct subscribe channel from slug output', function () {
        assertSubscription(slugOutput, channelName, correctSubOperation, correctDescription);
      });

      it('should return correct subscribe channel from parsed slug output', function () {
        assertSubscription(parsedSlugOutput, channelName, correctSubOperation, correctDescription);
      });
    });

    describe('publisher data for flight/queue channel', function () {
      const correctPubOperation = 'Flight Monitor Service';
      const channelName = 'flight/queue';
      const correctDescription = 'Queues a flight in order to retrieve status\n';

      it('should return correct publish channel from slug output', function () {
        assertPublication(slugOutput, channelName, correctPubOperation, correctDescription);
      });

      it('should return correct publish channel from parsed slug output', function () {
        assertPublication(parsedSlugOutput, channelName, correctPubOperation, correctDescription);
      });
    });

    it('should return the correct mermaid syntax', async function () {
      const testOutput = await getRelations(flightServiceDocs, { syntax: 'mermaid' });
      const testParsedOutput = await getRelations(parsedDocs, { syntax: 'mermaid' });
      expect(testOutput).to.be.equal(outputMermaid);
      expect(testParsedOutput).to.be.equal(outputMermaid);
    });

    it('should return the correct plantUML syntax', async function () {
      const testOutput = await getRelations(flightServiceDocs, { syntax: 'plantUML' });
      const testParsedOutput = await getRelations(parsedDocs, { syntax: 'plantUML' });
      expect(testOutput).to.be.equal(outputPlantUML);
      expect(testParsedOutput).to.be.equal(outputPlantUML);
    });

    it('should return the correct reactFlow elements array', async function () {
      const testOutput = await getRelations(flightServiceDocs, { syntax: 'reactFlow' });
      const testParsedOutput = await getRelations(parsedDocs, { syntax: 'reactFlow' });
      expect(testOutput).to.be.deep.equal(outputReactFlow);
      expect(testParsedOutput).to.be.deep.equal(outputReactFlow);
    });
  });

  function assertPublication(output, channelName, correctPubOperation, correctDescription) {
    const channelOutput = output.get(channelName);
    const actualPublications = channelOutput.pub.get(correctPubOperation);
    /* eslint-disable no-unused-expressions */
    expect(actualPublications).to.be.not.null;
    expect(actualPublications.description).to.be.equal(correctDescription);
  }

  function assertSubscription(output, channelName, correctSubOperation, correctDescription) {
    const channelOutput = output.get(channelName);
    const actualSubscriptions = channelOutput.sub.get(correctSubOperation);
    /* eslint-disable no-unused-expressions */
    expect(actualSubscriptions).to.be.not.null;
    expect(actualSubscriptions.description).to.be.equal(correctDescription);
  }
}