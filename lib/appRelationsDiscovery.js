const getMermaidDiagram = require('./getMermaidDiagram');
const {validate} = require('./utils');

const supportedSyntax = ['default','mermaid'];

const defaultOptions = {
  syntax: 'default',
};

/**
 * Validates and analyzes a list of AsyncAPI documents and get applications described by those files
 * 
 * @param {Array} asyncApiDocs An array of asyncApiDocuments
 * @param {Object} options for getting a relations
 * @returns {Promise<DiscoveredRelations>} Relations between documents
 */
// eslint-disable-next-line sonarjs/cognitive-complexity
async function getRelations(asyncApiDocs, { syntax } = defaultOptions) {
  if (!Array.isArray(asyncApiDocs)) throw new Error('You must pass an array of AsyncApiDocuments on which you wish to discover the relations between');
  if (!supportedSyntax.includes(syntax)) throw new Error('The given syntax is not supported');

  let parsedAsyncApiDocs;  
  try {
    parsedAsyncApiDocs = await validate(asyncApiDocs);
  } catch (e) {
    throw new Error(e);
  }
  const metrics = new Map();
  
  parsedAsyncApiDocs.forEach(doc => {
    if (doc.hasServers()) {
      const servers = doc.servers();

      for (const credentials of Object.values(servers)) {
        const slug = `${credentials.url()},${credentials.protocol()}`;
        let relation;
        if (metrics.has(slug)) {
          relation = metrics.get(slug);
        } else {
          relation = new Map();
          metrics.set(slug,relation);
        }

        if (doc.hasChannels()) {
          doc.channelNames().forEach((channelName) => {
            let application;
            if (relation.has(channelName)) {
              application = relation.get(channelName);
            } else {
              application = {
                sub: new Map(),
                pub: new Map(),
              };
              relation.set(channelName, application);
            }
    
            const channel = doc.channel(channelName);
            const title = doc.info().title();
            
            if (channel.hasPublish() && !application.pub.has(title)) {
              application.pub.set(title,channel._json);
            }
            if (channel.hasSubscribe() && !application.sub.has(title)) {
              application.sub.set(title,channel._json);
            }
          });
        }
      };
    }
  });
  if (syntax === 'default')
    return metrics;
  if (syntax === 'mermaid')
    return getMermaidDiagram(metrics);
};

module.exports = {getRelations};
