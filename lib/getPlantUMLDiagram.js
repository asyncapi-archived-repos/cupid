/**
 * Generates plantUML class diagram from default output syntax
 * 
 * @param {Object} metrics Relations between AsyncAPI docs in default output syntax
 * @returns {String} class diagram following plantUML syntax
 */
function getPlantUMLDiagram(metrics) {
  let i=1;
  let plantUMLSyntax = '';
  metrics.forEach((relations,server) => {
    const [url, protocol] = server.split(',');
    plantUMLSyntax+= `\nclass server${i} { \n url: ${url} \n protocol: ${protocol}\n}`;
    
    relations.forEach((operations, channel) => {
      operations.sub.forEach((metadata,subscriber) => {
        const service = subscriber.replace(/\s/g,'');
        plantUMLSyntax+=`\n${service} --|> server${i}:${channel}`;
      });
    
      operations.pub.forEach((metadata,publisher) => {
        const service = publisher.replace(/\s/g,'');
        plantUMLSyntax+=`\nserver${i} --|> ${service}:${channel}`;
      });
    });
    i++;
  });
  return `@startuml\ntitle Classes - Class Diagram\n${plantUMLSyntax}\n@enduml`;
}
    
module.exports = getPlantUMLDiagram;