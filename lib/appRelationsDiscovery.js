const getMermaidFlowchart = require('./getMermaidFlowchart');
const getPlantUMLDiagram = require('./getPlantUMLDiagram');
const getReactFlowData = require('./getReactFlowData');
const { validate } = require('./utils');

const supportedSyntax = ['default', 'mermaid', 'plantUML', 'reactFlow'];
const defaultOptions = {
  syntax: 'default',
};

function transformAsyncApiIntoRelationModel(apiDocument, metrics) {
  for (const operation of apiDocument.operations()) {
    for (const channel of operation.channels()) {
      for (const server of channel.servers()) {
        const relation = getOrCreateRelation(server, metrics);
        const application = getOrCreateApplication(channel, relation);
        addPubSubToApplication(apiDocument.info().title(), operation, application, channel);
      }
    }
  }
  return metrics;
}

function addPubSubToApplication(title, operation, application, channel) {
  if (['send', 'subscribe'].includes(operation.action())) {
    if (application.sub.has(title)) {
      throw new Error(`${title} is already subscribed to ${channel}`);
    }
    application.sub.set(title, channel.json());
  } else if (['receive', 'publish'].includes(operation.action())) {
    if (application.pub.has(title)) {
      throw new Error(`${title} is already publishing to ${channel}`);
    }
    application.pub.set(title, channel.json());
  } else {
    throw Error(`action ${operation.action()} not defined.`);
  }
}

function getOrCreateApplication(channel, relation) {
  let application;
  const channelName = channel.address();
  if (relation.has(channelName)) {
    application = relation.get(channelName);
  } else {
    application = {
      sub: new Map(),
      pub: new Map(),
    };
    relation.set(channelName, application);
  }
  return application;
}

function getOrCreateRelation(server, metrics) {
  const url = server.url();
  const protocol = server.protocol();
  const slug = `${url},${protocol}`;
  let relation;
  if (metrics.has(slug)) {
    relation = metrics.get(slug);
  } else {
    relation = new Map();
    metrics.set(slug, relation);
  }
  return relation;
}

/**
 * Validates and analyzes a list of AsyncAPI documents and get applications described by those files
 * 
 * @param {String[]} asyncApiDocs An array of stringified AsyncAPI documents
 * @param {Object} [options]
 * @param {('default'|'mermaid'|'plantUML'|'reactFlow')} [options.syntax] syntax in which the relation will be generated.
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
    transformAsyncApiIntoRelationModel(doc.document, metrics);
  });
  switch (syntax) {
  case 'mermaid':
    return getMermaidFlowchart(metrics);
  case 'plantUML':
    return getPlantUMLDiagram(metrics);
  case 'reactFlow':
    return getReactFlowData(metrics);
  default:
    return metrics;
  }
}

module.exports = { getRelations };
