const {validate} = require('./utils');

const supportedSyntax = ['default','mermaid'];

// eslint-disable-next-line sonarjs/cognitive-complexity
async function getRelations(asyncApiDocs,requestedSyntax = 'default') {
  if (typeof asyncApiDocs !== 'object') throw new Error('You must pass an array of AsyncApiDocuments on which you wish to discover the relations between');
  if (!supportedSyntax.includes(requestedSyntax)) return;

  const parsedAsyncApiDocs = await validate(asyncApiDocs);
  const metrics = new Map();
  
  parsedAsyncApiDocs.forEach(doc => {
    if (doc.hasServers()) {
      const servers = doc.servers();

      for (const [, credentials] of Object.entries(servers)) {
        const slug = `${credentials.url()},${credentials.protocol()}`;
        let relation;
        if (metrics.has(slug)) {
          relation = metrics.get(slug);
        } else {
          relation = new Map();
        }
        // metrics
        // ServerMap(n-servers) => {
        //   <Url+protocol> => ChannelMap(n-channels) => {
        //      <channelName> => { sub: [] , pub: [] }
        //    },
        //    ....
        // }
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
            }
    
            const channel = doc.channel(channelName);
            const title = doc.info().title();
    
            if (channel.hasPublish()) {
              application.pub.push(title);
            }
            if (channel.hasSubscribe()) {
              application.sub.push(title);
            }

            relation.set(channelName, application);
          });
        }
        metrics.set(slug,relation);
      };
    }
  });
  if (requestedSyntax === 'default')
    return metrics;
};

module.exports = {getRelations};
