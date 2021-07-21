/**
 * Generates reactFlow nodes data from default output syntax
 * 
 * @param {Object} metrics Relations between AsyncAPI docs in default output syntax
 * @returns {Array} reactFlow nodes data 
 */

function getReactFlowData(metrics) {
  let i=1;
  let edgId = 1;
  const nodes = [];
  const visitedServices = [];
  metrics.forEach((relations,server) => {
    const url = server.split(',');
    const node = { id: `Server${i}`, data: { label: `${url}` }, position: { x: 250, y: 5 } };
    nodes.push(node);
    relations.forEach((operations, channel) => {
      operations.sub.forEach((metadata,subscriber) => {
        const service = subscriber.replace(/\s/g,'');
        getNode(service,visitedServices,node,subscriber,nodes);
        const edge = { id: `edge${edgId}`, source: `${service}`, target: `Server${i}`, animated: true, label: `${channel}`, type: 'edgeType', arrowHeadType: 'arrowclosed'};
        nodes.push(edge);
        edgId++;
      });
      
      operations.pub.forEach((metadata,publisher) => {
        const service = publisher.replace(/\s/g,'');
        getNode(service,visitedServices,node,publisher,nodes);
        const edge = { id: `edge${edgId}`, source: `Server${i}`, target: `${service}`, animated: true, label: `${channel}`, type: 'edgeType', arrowHeadType: 'arrowclosed'};
        nodes.push(edge);
        edgId++;
      });
    });
    i++;
  });
  return nodes;
}

function getNode(service,visitedServices,node,operator,nodes) {
  if (!visitedServices.includes(service)) {
    visitedServices.push(service);
    node = { id: `${service}`, data: { label: `${operator}` }, position: { x: 100, y: 10 } };
    nodes.push(node);
  }
}
      
module.exports = getReactFlowData;