/**
 * Generates mermaid flowchart from default output syntax
 * 
 * @param {Object} metrics Relations between AsyncAPI docs in default output syntax
 * @returns {String} Flowchart following mermaid syntax
 */
function getMermaidFlowchart(metrics) {
  const visitedServices = [];
  let i=1;
  let mermaidSyntax = '';
  metrics.forEach((relations,server) => {
    const [url] = server.split(',');
    mermaidSyntax+=`\n server${i}[(${url})]`;

    relations.forEach((operations, channel) => {
      operations.sub.forEach((metadata,subscriber) => {
        const service = subscriber.replace(/\s/g,'');
        if (!visitedServices.includes(service)) {
          visitedServices.push(service);
          mermaidSyntax+=`\n${service}[${subscriber}]`;
        }
        mermaidSyntax+=`\nserver${i} -- ${channel} --> ${service}`;
      });

      operations.pub.forEach((metadata,publisher) => {
        const service = publisher.replace(/\s/g,'');
        if (!visitedServices.includes(service)) {
          visitedServices.push(service);
          mermaidSyntax+=`\n${service}[${publisher}]`;
        }
        mermaidSyntax+=`\n${service} -- ${channel} --> server${i}`;
      });
    });
    i++;
  });
  return `graph TD${mermaidSyntax}`;
}

module.exports = getMermaidFlowchart;