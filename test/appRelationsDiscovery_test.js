const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

const expect = chai.expect;
chai.use(chaiAsPromised);

const {getRelations} = require('../lib/appRelationsDiscovery');
const {getAsyncApiExamples} = require('./testsUtil'); 

const outputMermaid = 'graph TD\n server1[(mqtt://localhost:1883)]\nFlightMonitorService[Flight Monitor Service]\nFlightMonitorService -- flight/update --> server1\nFlightNotifierService[Flight Notifier Service]\nserver1 -- flight/update --> FlightNotifierService\nFlightSubscriberService[Flight Subscriber Service]\nFlightSubscriberService -- flight/queue --> server1\nserver1 -- flight/queue --> FlightMonitorService';
const outputPlantUML = '@startuml\ntitle Classes - Class Diagram\n\nclass server1 { \n url: mqtt://localhost:1883 \n protocol: mqtt\n}\nFlightMonitorService --|> server1:flight/update\nserver1 --|> FlightNotifierService:flight/update\nFlightSubscriberService --|> server1:flight/queue\nserver1 --|> FlightMonitorService:flight/queue\n@enduml';

describe('appRelationDiscovery', function() {
  it('should return the correct mermaid syntax for the given docs', async function() {
    const flightServiceDocs = getAsyncApiExamples();
    const output = await getRelations(flightServiceDocs,{syntax: 'mermaid'});
    expect(output).to.be.equal(outputMermaid);
  });

  it('should return the correct plantUML syntax for the given docs', async function() {
    const flightServiceDocs = getAsyncApiExamples();
    const output = await getRelations(flightServiceDocs,{syntax: 'plantUML'});
    expect(output).to.be.equal(outputPlantUML);
  });
});
