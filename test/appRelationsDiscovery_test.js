const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

const expect = chai.expect;
chai.use(chaiAsPromised);

const {getRelations} = require('../lib/appRelationsDiscovery');
const {getAsyncApiExamples,parseAsyncApiExamples} = require('./testsUtil'); 

const outputMermaid = 'graph TD\n server1[(mqtt://localhost:1883)]\n FlightMonitorService[Flight Monitor Service]\n FlightMonitorService -- "flight/update" --> server1\n FlightNotifierService[Flight Notifier Service]\n server1 -- "flight/update" --> FlightNotifierService\n FlightSubscriberService[Flight Subscriber Service]\n FlightSubscriberService -- "flight/queue" --> server1\n server1 -- "flight/queue" --> FlightMonitorService';
const outputPlantUML = '@startuml\ntitle Classes - Class Diagram\n\nclass server1 { \n url: mqtt://localhost:1883 \n protocol: mqtt\n}\nFlightMonitorService --|> server1:flight/update\nserver1 --|> FlightNotifierService:flight/update\nFlightSubscriberService --|> server1:flight/queue\nserver1 --|> FlightMonitorService:flight/queue\n@enduml';
const outputReactFlow =  [{ id: 'Server1', data: { label: 'mqtt://localhost:1883,mqtt' }, position: { x: 250, y: 5 } }, { id: 'FlightMonitorService', data: { label: 'Flight Monitor Service' }, position: { x: 100, y: 10 } }, { id: 'edge1', source: 'FlightMonitorService', target: 'Server1', animated: true, label: 'flight/update', type: 'edgeType', arrowHeadType: 'arrowclosed' }, { id: 'FlightNotifierService', data: { label: 'Flight Notifier Service' }, position: { x: 100, y: 10 } }, { id: 'edge2', source: 'Server1', target: 'FlightNotifierService', animated: true, label: 'flight/update', type: 'edgeType', arrowHeadType: 'arrowclosed' }, { id: 'FlightSubscriberService', data: { label: 'Flight Subscriber Service' }, position: { x: 100, y: 10 } }, { id: 'edge3', source: 'FlightSubscriberService', target: 'Server1', animated: true, label: 'flight/queue', type: 'edgeType', arrowHeadType: 'arrowclosed' }, { id: 'edge4', source: 'Server1', target: 'FlightMonitorService', animated: true, label: 'flight/queue', type: 'edgeType', arrowHeadType: 'arrowclosed'}];
const flightUpdateSubData = new Map(Object.entries({'Flight Monitor Service': {description: 'Provides updates from a subscribed flight\n',subscribe: {summary: 'Inform about the status of a subscribed flight',message: {summary: 'Provides flight status on arrival and destination',payload: {type: 'object',properties: {user: {type: 'object',properties: {userName: {type: 'string',minimum: 1,description: 'user name',example: 'John Smith','x-parser-schema-id': '<anonymous-schema-3>'},phoneNumber: {type: 'string',minimum: 5,description: 'phone number where notifications will be received.',example: '+13451235','x-parser-schema-id': '<anonymous-schema-4>'}},'x-parser-schema-id': '<anonymous-schema-2>'},departure: {type: 'object',properties: {iataCode: {type: 'string',description: '2 to 3-character IATA carrier code',example: 'MAD','x-parser-schema-id': '<anonymous-schema-6>'},scheduledDate: {type: 'string',format: 'date-time',description: 'scheduled datetime of the flight, local to the airport.',example: '2020-10-20 19:15','x-parser-schema-id': '<anonymous-schema-7>'},gate: {type: 'string',description: 'departure gate',example: '2D','x-parser-schema-id': '<anonymous-schema-8>'},terminal: {type: 'string',description: 'airport terminal',example: '4','x-parser-schema-id': '<anonymous-schema-9>'}},'x-parser-schema-id': '<anonymous-schema-5>'},arrival: {type: 'object',properties: {iataCode: {type: 'string',description: '2 to 3-character IATA carrier code',example: 'MAD','x-parser-schema-id': '<anonymous-schema-11>'},scheduledDate: {type: 'string',format: 'date-time',description: 'scheduled datetime of the flight, local to the airport.',example: '2020-10-20 19:15','x-parser-schema-id': '<anonymous-schema-12>'},gate: {type: 'string',description: 'departure gate',example: '2D','x-parser-schema-id': '<anonymous-schema-13>'},terminal: {type: 'string',description: 'airport terminal',example: '4','x-parser-schema-id': '<anonymous-schema-14>'}},'x-parser-schema-id': '<anonymous-schema-10>'}},'x-parser-schema-id': '<anonymous-schema-1>'},'x-parser-original-schema-format': 'application/vnd.aai.asyncapi;version=2.0.0','x-parser-original-payload': {type: 'object',properties: {user: {type: 'object',properties: {userName: {type: 'string',minimum: 1,description: 'user name',example: 'John Smith'},phoneNumber: {type: 'string',minimum: 5,description: 'phone number where notifications will be received.',example: '+13451235'}}},departure: {type: 'object',properties: {iataCode: {type: 'string',description: '2 to 3-character IATA carrier code',example: 'MAD'},scheduledDate: {type: 'string',format: 'date-time',description: 'scheduled datetime of the flight, local to the airport.',example: '2020-10-20 19:15'},gate: {type: 'string',description: 'departure gate',example: '2D'},terminal: {type: 'string',description: 'airport terminal',example: '4'}}},arrival: {type: 'object',properties: {iataCode: {type: 'string',description: '2 to 3-character IATA carrier code',example: 'MAD'},scheduledDate: {type: 'string',format: 'date-time',description: 'scheduled datetime of the flight, local to the airport.',example: '2020-10-20 19:15'},gate: {type: 'string',description: 'departure gate',example: '2D'},terminal: {type: 'string',description: 'airport terminal',example: '4'}}}}},schemaFormat: 'application/vnd.aai.asyncapi;version=2.0.0','x-parser-message-parsed': true,'x-parser-message-name': 'flightStatus'}}}}));
const flightUpdatePubData = new Map(Object.entries({'Flight Notifier Service': {description: 'Receives updates from a subscribed flight\n',publish: {summary: 'Inform about the status of a subscribed flight',message: {summary: 'Provides flight status on arrival and destination',payload: {type: 'object',properties: {user: {type: 'object',properties: {userName: {type: 'string',minimum: 1,description: 'user name',example: 'John Smith','x-parser-schema-id': '<anonymous-schema-3>'},phoneNumber: {type: 'string',minimum: 5,description: 'phone number where notifications will be received.',example: '+13451235','x-parser-schema-id': '<anonymous-schema-4>'}},'x-parser-schema-id': '<anonymous-schema-2>'},departure: {type: 'object',properties: {iataCode: {type: 'string',description: '2 to 3-character IATA carrier code',example: 'MAD','x-parser-schema-id': '<anonymous-schema-6>'},scheduledDate: {type: 'string',format: 'date-time',description: 'scheduled datetime of the flight, local to the airport.',example: '2020-10-20 19:15','x-parser-schema-id': '<anonymous-schema-7>'},gate: {type: 'string',description: 'departure gate',example: '2D','x-parser-schema-id': '<anonymous-schema-8>'},terminal: {type: 'string',description: 'airport terminal',example: '4','x-parser-schema-id': '<anonymous-schema-9>'}},'x-parser-schema-id': '<anonymous-schema-5>'},arrival: {type: 'object',properties: {iataCode: {type: 'string',description: '2 to 3-character IATA carrier code',example: 'MAD','x-parser-schema-id': '<anonymous-schema-11>'},scheduledDate: {type: 'string',format: 'date-time',description: 'scheduled datetime of the flight, local to the airport.',example: '2020-10-20 19:15','x-parser-schema-id': '<anonymous-schema-12>'},gate: {type: 'string',description: 'departure gate',example: '2D','x-parser-schema-id': '<anonymous-schema-13>'},terminal: {type: 'string',description: 'airport terminal',example: '4','x-parser-schema-id': '<anonymous-schema-14>'}},'x-parser-schema-id': '<anonymous-schema-10>'}},'x-parser-schema-id': '<anonymous-schema-1>'},'x-parser-original-schema-format': 'application/vnd.aai.asyncapi;version=2.0.0','x-parser-original-payload': {type: 'object',properties: {user: {type: 'object',properties: {userName: {type: 'string',minimum: 1,description: 'user name',example: 'John Smith'},phoneNumber: {type: 'string',minimum: 5,description: 'phone number where notifications will be received.',example: '+13451235'}}},departure: {type: 'object',properties: {iataCode: {type: 'string',description: '2 to 3-character IATA carrier code',example: 'MAD'},scheduledDate: {type: 'string',format: 'date-time',description: 'scheduled datetime of the flight, local to the airport.',example: '2020-10-20 19:15'},gate: {type: 'string',description: 'departure gate',example: '2D'},terminal: {type: 'string',description: 'airport terminal',example: '4'}}},arrival: {type: 'object',properties: {iataCode: {type: 'string',description: '2 to 3-character IATA carrier code',example: 'MAD'},scheduledDate: {type: 'string',format: 'date-time',description: 'scheduled datetime of the flight, local to the airport.',example: '2020-10-20 19:15'},gate: {type: 'string',description: 'departure gate',example: '2D'},terminal: {type: 'string',description: 'airport terminal',example: '4'}}}}},schemaFormat: 'application/vnd.aai.asyncapi;version=2.0.0','x-parser-message-parsed': true,'x-parser-message-name': 'flightStatus'}}}}));
const flightQueueSubData = new Map(Object.entries({'Flight Subscriber Service': {description: 'queue flight in order to retrieve status\n',subscribe: {summary: 'Receive information about the flight that should be monitored for changes',message: {summary: 'Requets to queue a flight to be monitored',payload: {type: 'object',properties: {flight: {type: 'object',properties: {carrierCode: {type: 'string',description: '2 to 3-character IATA carrier code',example: 'LH','x-parser-schema-id': '<anonymous-schema-3>'},flightNumber: {type: 'integer',minimum: 1,description: '1 to 4-digit number of the flight',example: '193','x-parser-schema-id': '<anonymous-schema-4>'},scheduledDepartureDate: {type: 'string',format: 'date-time',description: 'scheduled departure date of the flight, local to the departure airport.',example: '2020-10-20','x-parser-schema-id': '<anonymous-schema-5>'}},'x-parser-schema-id': '<anonymous-schema-2>'},user: {type: 'object',properties: {userName: {type: 'string',minimum: 1,description: 'user name',example: 'John Smith','x-parser-schema-id': '<anonymous-schema-7>'},phoneNumber: {type: 'string',minimum: 5,description: 'phone number where notifications will be received.',example: '+13451235','x-parser-schema-id': '<anonymous-schema-8>'}},'x-parser-schema-id': '<anonymous-schema-6>'}},'x-parser-schema-id': '<anonymous-schema-1>'},'x-parser-original-schema-format': 'application/vnd.aai.asyncapi;version=2.0.0','x-parser-original-payload': {type: 'object',properties: {flight: {type: 'object',properties: {carrierCode: {type: 'string',description: '2 to 3-character IATA carrier code',example: 'LH'},flightNumber: {type: 'integer',minimum: 1,description: '1 to 4-digit number of the flight',example: '193'},scheduledDepartureDate: {type: 'string',format: 'date-time',description: 'scheduled departure date of the flight, local to the departure airport.',example: '2020-10-20'}}},user: {type: 'object',properties: {userName: {type: 'string',minimum: 1,description: 'user name',example: 'John Smith'},phoneNumber: {type: 'string',minimum: 5,description: 'phone number where notifications will be received.',example: '+13451235'}}}}},schemaFormat: 'application/vnd.aai.asyncapi;version=2.0.0','x-parser-message-parsed': true,'x-parser-message-name': 'flightQueue'}}}}));
const flightQueuePubData = new Map(Object.entries({'Flight Monitor Service': {description: 'Queues a flight in order to retrieve status\n',publish: {summary: 'Subscribe about the status of a given flight',message: {summary: 'Requets to queue a flight to be monitored',payload: {type: 'object',properties: {flight: {type: 'object',properties: {carrierCode: {type: 'string',description: '2 to 3-character IATA carrier code',example: 'LH','x-parser-schema-id': '<anonymous-schema-17>'},flightNumber: {type: 'integer',minimum: 1,description: '1 to 4-digit number of the flight',example: '193','x-parser-schema-id': '<anonymous-schema-18>'},scheduledDepartureDate: {type: 'string',format: 'date-time',description: 'scheduled departure date of the flight, local to the departure airport.',example: '2020-10-20','x-parser-schema-id': '<anonymous-schema-19>'}},'x-parser-schema-id': '<anonymous-schema-16>'},user: {type: 'object',properties: {userName: {type: 'string',minimum: 1,description: 'user name',example: 'John Smith','x-parser-schema-id': '<anonymous-schema-21>'},phoneNumber: {type: 'string',minimum: 5,description: 'phone number where notifications will be received.',example: '+13451235','x-parser-schema-id': '<anonymous-schema-22>'}},'x-parser-schema-id': '<anonymous-schema-20>'}},'x-parser-schema-id': '<anonymous-schema-15>'},'x-parser-original-schema-format': 'application/vnd.aai.asyncapi;version=2.0.0','x-parser-original-payload': {type: 'object',properties: {flight: {type: 'object',properties: {carrierCode: {type: 'string',description: '2 to 3-character IATA carrier code',example: 'LH'},flightNumber: {type: 'integer',minimum: 1,description: '1 to 4-digit number of the flight',example: '193'},scheduledDepartureDate: {type: 'string',format: 'date-time',description: 'scheduled departure date of the flight, local to the departure airport.',example: '2020-10-20'}}},user: {type: 'object',properties: {userName: {type: 'string',minimum: 1,description: 'user name',example: 'John Smith'},phoneNumber: {type: 'string',minimum: 5,description: 'phone number where notifications will be received.',example: '+13451235'}}}}},schemaFormat: 'application/vnd.aai.asyncapi;version=2.0.0','x-parser-message-parsed': true,'x-parser-message-name': 'flightQueue'}}}}));

describe('appRelationDiscovery', function() {
  let flightServiceDocs;
  let correctSlug;
  let slugOutput;
  let parsedSlugOutput;
  let output;
  let correctChannelUpdate;
  let correctChannelQueue;
  let parsedDocs;
  let parsedOutput;

  before(async function() {
    flightServiceDocs = getAsyncApiExamples();
    parsedDocs = await parseAsyncApiExamples(flightServiceDocs);
    output = await getRelations(flightServiceDocs);
    parsedOutput = await getRelations(parsedDocs);
    correctSlug = 'mqtt://localhost:1883,mqtt';
    slugOutput = output.get(correctSlug);
    parsedSlugOutput = parsedOutput.get(correctSlug);
    correctChannelUpdate = 'flight/update';
    correctChannelQueue = 'flight/queue';
  });
  it('should return correct slug', function() {
    expect(output).to.have.key(correctSlug);
    expect(parsedOutput).to.have.key(correctSlug);
  });

  it('should return correct channels', function() {
    expect(slugOutput).to.have.all.keys(correctChannelUpdate, correctChannelQueue);
    expect(parsedSlugOutput).to.have.all.keys(correctChannelUpdate, correctChannelQueue);
  });

  it('should return correct subscriber data for flight/update channel', async function() {
    const updateChannelOutput = slugOutput.get(correctChannelUpdate);
    const updateChannelParsedOutput = parsedSlugOutput.get(correctChannelUpdate);
    const correctSubOperation = 'Flight Monitor Service';
    expect(updateChannelOutput.sub.get(correctSubOperation)).to.deep.equal(flightUpdateSubData.get(correctSubOperation));
    expect(updateChannelParsedOutput.sub.get(correctSubOperation)).to.deep.equal(flightUpdateSubData.get(correctSubOperation));
  });

  it('should return correct publisher data for flight/update channel', async function() {
    const updateChannelOutput = slugOutput.get(correctChannelUpdate);
    const updateChannelParsedOutput = parsedSlugOutput.get(correctChannelUpdate);
    const correctPubOperation = 'Flight Notifier Service';
    expect(updateChannelOutput.pub.get(correctPubOperation)).to.deep.equal(flightUpdatePubData.get(correctPubOperation));
    expect(updateChannelParsedOutput.pub.get(correctPubOperation)).to.deep.equal(flightUpdatePubData.get(correctPubOperation));
  });

  it('should return correct subscriber data for flight/queue channel', async function() {
    const queueChannelOutput = slugOutput.get(correctChannelQueue);
    const queueChannelParsedOutput = parsedSlugOutput.get(correctChannelQueue);
    const correctSubOperation = 'Flight Subscriber Service';
    expect(queueChannelOutput.sub.get(correctSubOperation)).to.deep.equal(flightQueueSubData.get(correctSubOperation));
    expect(queueChannelParsedOutput.sub.get(correctSubOperation)).to.deep.equal(flightQueueSubData.get(correctSubOperation));
  });

  it('should return correct publisher data for flight/queue channel', async function() {
    const queueChannelOutput = slugOutput.get(correctChannelQueue);
    const queueChannelParsedOutput = parsedSlugOutput.get(correctChannelQueue);
    const correctPubOperation = 'Flight Monitor Service';
    expect(queueChannelOutput.pub.get(correctPubOperation)).to.deep.equal(flightQueuePubData.get(correctPubOperation));
    expect(queueChannelParsedOutput.pub.get(correctPubOperation)).to.deep.equal(flightQueuePubData.get(correctPubOperation));
  });

  it('should return the correct mermaid syntax', async function() {
    const testOutput = await getRelations(flightServiceDocs,{syntax: 'mermaid'});
    const testParsedOutput = await getRelations(parsedDocs,{syntax: 'mermaid'});
    expect(testOutput).to.be.equal(outputMermaid);
    expect(testParsedOutput).to.be.equal(outputMermaid);
  });

  it('should return the correct plantUML syntax', async function() {
    const testOutput = await getRelations(flightServiceDocs,{syntax: 'plantUML'});
    const testParsedOutput = await getRelations(parsedDocs,{syntax: 'plantUML'});
    expect(testOutput).to.be.equal(outputPlantUML);
    expect(testParsedOutput).to.be.equal(outputPlantUML);
  });

  it('should return the correct reactFlow elements array', async function() {
    const testOutput = await getRelations(flightServiceDocs,{syntax: 'reactFlow'});
    const testParsedOutput = await getRelations(parsedDocs,{syntax: 'reactFlow'});
    expect(testOutput).to.be.deep.equal(outputReactFlow);
    expect(testParsedOutput).to.be.deep.equal(outputReactFlow);
  });
});
