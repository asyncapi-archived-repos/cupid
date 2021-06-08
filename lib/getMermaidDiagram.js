/**
 * Generates mermaid class diagram from default syntax
 * 
 * @param {Object} metrics Relations between AsyncAPI docs in default syntax
 * @returns {String} class diagram following mermaid syntax
 */
function getMermaidDiagram(metrics) {
  const visitedChannels = [];
  const visitedServices = [];
  let i=1;
  let mermaidSyntax = '';
  metrics.forEach((relations,server) => {
    const url = server.split(',')[0];
    const protocol = server.split(',')[1];
    mermaidSyntax+= `\nclass server${i} { \n url: ${url} \n protocol: ${protocol}\n}`;

    relations.forEach((operations, channel) => {
      const channelName = channel.split('/').join('');
      
      if (!visitedChannels.includes(channelName)) {
        visitedChannels.push(channelName);
        mermaidSyntax+= `\nclass ${channelName} { \n metadata \n}\n`;
      }

      operations.sub.forEach(subscriber => {
        const service = subscriber.split(' ').join('');
        if (!visitedServices.includes(service)) {
          visitedServices.push(service);
          mermaidSyntax+=`\nclass ${service} {\n metadata \n}`;
        }
        mermaidSyntax+=`\n${channelName} --|> ${service}:server${i}`;
      });

      operations.pub.forEach(publisher => {
        const service = publisher.split(' ').join('');
        if (!visitedServices.includes(service)) {
          visitedServices.push(service);
          mermaidSyntax+=`\nclass ${service} {\n metadata\n}`;
        }
        mermaidSyntax+=`\n${service} --|> ${channelName}:server${i}`;
      });
    });
    i++;
  });
  mermaidSyntax=`classDiagram${mermaidSyntax}`;
  return mermaidSyntax;
}

module.exports = getMermaidDiagram;