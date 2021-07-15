/**
 * Generates reactFlow elements data from default output syntax
 * 
 * @param {Object} metrics Relations between AsyncAPI docs in default output syntax
 * @returns {Array} reactFlow elements data following 
 */

function getReactFlowData(metrics) {
  let i=1;
  let edgId = 1;
  const elements = [];
  const visitedServices = [];
  metrics.forEach((relations,server) => {
    const url = server.split(',');
    const node = { id: `Server${i}`, data: { label: `${url}` }, position: { x: 250, y: 5 } };
    elements.push(node);
    relations.forEach((operations, channel) => {
      operations.sub.forEach((metadata,subscriber) => {
        const service = subscriber.replace(/\s/g,'');
        if (!visitedServices.includes(service)) {
          const node = { id: `${service}`, data: { label: `${subscriber}` }, position: { x: 100, y: 10 } };
          elements.push(node);
        }
        const edge = { id: `edge${edgId}`, source: `${service}`, target: `Server${i}`, animated: true, label: `${channel}`, type: 'edgeType', arrowHeadType: 'arrowclosed'};
        elements.push(edge);
        edgId++;
      });
      
      operations.pub.forEach((metadata,publisher) => {
        const service = publisher.replace(/\s/g,'');
        if (!visitedServices.includes(service)) {
          const node = { id: `${service}`, data: { label: `${publisher}` }, position: { x: 100, y: 10 } };
          elements.push(node);
        }
        const edge = { id: `edge${edgId}`, source: `Server${i}`, target: `${service}`, animated: true, label: `${channel}`, type: 'edgeType', arrowHeadType: 'arrowclosed'};
        elements.push(edge);
        edgId++;
      });
    });
    i++;
  });
  return elements;
}
      
module.exports = getReactFlowData;