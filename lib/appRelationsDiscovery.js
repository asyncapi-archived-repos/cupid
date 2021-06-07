const {validate} = require('./utils');

const supportedSyntax = ['default','mermaid'];

const defaultOptions = {
  syntax: 'default',
};

// eslint-disable-next-line sonarjs/cognitive-complexity
async function getRelations(asyncApiDocs, { syntax } = defaultOptions) {
  if (!Array.isArray(asyncApiDocs)) throw new Error('You must pass an array of AsyncApiDocuments on which you wish to discover the relations between');
  if (!supportedSyntax.includes(syntax)) throw new Error('The given syntax is not supported');

  const parsedAsyncApiDocs = await validate(asyncApiDocs);
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
                sub: [],
                pub: [],
              };
              relation.set(channelName, application);
            }
    
            const channel = doc.channel(channelName);
            const title = doc.info().title();
    
            if (channel.hasPublish()) {
              application.pub.push(title);
            }
            if (channel.hasSubscribe()) {
              application.sub.push(title);
            }
          });
        }
      };
    }
  });
  if (syntax === 'default')
    return metrics;
};

module.exports = {getRelations};
