/**
 * Generates mermaid class diagram from default output syntax
 * 
 * @param {Object} metrics Relations between AsyncAPI docs in default output syntax
 * @returns {String} class diagram following mermaid syntax
 */
function getMermaidDiagram(metrics) {
  const visitedChannels = [];
  const visitedServices = [];
  let i=1;
  let mermaidSyntax = '';
  metrics.forEach((relations,server) => {
    const [url, protocol] = server.split(',');
    mermaidSyntax+= `\nclass server${i} { \n url: ${url} \n protocol: ${protocol}\n}`;

    relations.forEach((operations, channel) => {
      const channelName = channel.split(/[/{}]/).join('');
      
      if (!visitedChannels.includes(channelName)) {
        visitedChannels.push(channelName);
        mermaidSyntax+= `\nclass ${channelName} { \n // TODO: metadata to be added \n}\n`;
      }

      operations.sub.forEach(subscriber => {
        const service = subscriber.replace(/\s/g,'');
        if (!visitedServices.includes(service)) {
          visitedServices.push(service);
          mermaidSyntax+=`\nclass ${service} {\n // TODO: metadata to be added \n}`;
        }
        mermaidSyntax+=`\n${channelName} --|> ${service}:server${i}`;
      });

      operations.pub.forEach(publisher => {
        const service = publisher.replace(/\s/g,'');
        if (!visitedServices.includes(service)) {
          visitedServices.push(service);
          mermaidSyntax+=`\nclass ${service} {\n // TODO: metadata to be added \n}`;
        }
        mermaidSyntax+=`\n${service} --|> ${channelName}:server${i}`;
      });
    });
    i++;
  });
  return `classDiagram${mermaidSyntax}`;
}

module.exports = getMermaidDiagram;