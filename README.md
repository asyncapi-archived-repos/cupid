<h5 align="center">
  <br>
  <a href="https://www.asyncapi.org"><img src="https://github.com/asyncapi/parser-nodejs/raw/master/assets/logo.png" alt="AsyncAPI logo" width="200"></a>
  <br>
  Applications Relation Finder
</h5>

![npm](https://img.shields.io/npm/v/@asyncapi/app-relations-discovery?style=for-the-badge) ![npm](https://img.shields.io/npm/dt/@asyncapi/app-relations-discovery?style=for-the-badge)

> :warning: This package is under construction.

- [Overview](#overview)
- [Install the module](#install-the-module)
- [Testing](#testing)
  - [Technical Details](#technical-details)
- [APIs](#apis)
- [Usage](#usage)
  - [Node.js](#nodejs)
  - [Default Output Syntax](#default-output-syntax)
- [Mermaid Flowchart](#mermaid-flowchart)
  - [Syntax](#syntax)
  - [Flowchart](#flowchart)
  - [Link](#link)
- [PlantUML classDiagram](#plantuml-classdiagram)
  - [Syntax](#syntax-1)
  - [ClassDiagram](#classdiagram)
  - [Link](#link-1)
- [React Flow  Nodes](#react-flow--nodes)
  - [Syntax](#syntax-2)
  - [React Flow Nodes](#react-flow-nodes)
  - [Steps to visualize relations in React Flow](#steps-to-visualize-relations-in-react-flow)
- [Develop](#develop)
- [Contributing](#contributing)
## Overview
An official library that focuses on finding and analyzing the relationships between AsyncAPI Documents to later output consolidated information about the system architecture. Output format would be customizable and available in different formats like uml, mermaid.js and other.
## Install the module

```
npm install @asyncapi/app-relations-discovery
```

## Testing
1) Clone the project `git clone https://github.com/asyncapi/app-relations-discovery.git`
2) Install the dependencies `npm i`
3) For a quick overview you can run tests by `npm test`. You can also contribute to provide more different syntax outputs to visualize the relations.

### Technical Details
This library takes AsyncAPI Documents as an array input for which the user wants to discover the relations of. It then validates and parse given array of AsyncAPI documents and generates the output in desired passed syntax.
In the process, for every different server it assigns a slug having server's URL and protocol and then maps channels with the same server. Following, it maps the service information with the channel's name as per if the service is subscribing/publishing to a given channel. In the sub/pub Map of default output syntax, it provides service name and the metadata of the service including but not limited to `description`, `payload`, `headers`, `bindings`, `extensions`.
## APIs

- For default output syntax
```javascript
const defaultOutput = appRelationsDiscovery.getRelations(...docs);
```

- For mermaid Flowchart 
```javascript
const mermaidFlowchart = appRelationsDiscovery.getRelations(...docs,{syntax:'mermaid'});
```

- For plantUML classDiagram 
```javascript
const plantUMLClassDiagram = appRelationsDiscovery.getRelations(...docs,{syntax:'plantUML'});
```

- For reactFlow nodes
```javascript
const reactFlowNodes = appRelationsDiscovery.getRelations(...docs,{syntax:'reactFlow'});
```
## Usage

### Node.js

```javascript
const appRelationsDiscovery = require('@asyncapi/app-relations-discovery');
const path = require('path');
const fs = require('fs');

const examplesPath = './test/examples/flightService';

function getAsyncApiExamples() {
  const docs = [];
  const files = fs.readdirSync(examplesPath);
  for (const file of files) {
    const document_path = path.join('./examples/flightService', file);
    const asyncApiDoc = fs.readFileSync(path.resolve(__dirname, document_path),'utf8');
    docs.push(asyncApiDoc);
  }
  return docs;
}

// For default output syntax
const defaultOutput = appRelationsDiscovery.getRelations(...docs);

// For mermaid Flowchart 
const mermaidFlowchart = appRelationsDiscovery.getRelations(...docs,{syntax:'mermaid'});

// For plantUML classDiagram 
const plantUMLClassDiagram = appRelationsDiscovery.getRelations(...docs,{syntax:'plantUML'});

// For reactFlow nodes
const reactFlowNodes = appRelationsDiscovery.getRelations(...docs,{syntax:'reactFlow'});
```

### Default Output Syntax

// Explain:

```javascript
Map(n) {
  '<server1>' => Map(m) {
    'channel1' => { sub: [Map], pub: [Map] },
    'channel2' => { sub: [Map], pub: [Map] }
  }
}
```
## Mermaid Flowchart
### Syntax
Based on FlightService example.
```
graph TD
 server1[(mqtt://localhost:1883)]
FlightMonitorService[Flight Monitor Service]
FlightMonitorService -- flight/update --> server1
FlightNotifierService[Flight Notifier Service]
server1 -- flight/update --> FlightNotifierService
FlightSubscriberService[Flight Subscriber Service]
FlightSubscriberService -- flight/queue --> server1
server1 -- flight/queue --> FlightMonitorService
```

### Flowchart

<img src="./public/img/mermaid.png" alt="Mermaid Flowchart" width="500"/> </br></br>

### Link

You can paste the mermaid output syntax to visualize the relations as Flowchart here: https://mermaid-js.github.io/mermaid-live-editor/edit
## PlantUML classDiagram 

### Syntax
Based on FlightService example.
```
@startuml
title Classes - Class Diagram

class server1 { 
 url: mqtt://localhost:1883 
 protocol: mqtt
}
FlightMonitorService --|> server1:flight/update
server1 --|> FlightNotifierService:flight/update
FlightSubscriberService --|> server1:flight/queue
server1 --|> FlightMonitorService:flight/queue
@enduml
```
### ClassDiagram

<img src="./public/img/plantUML.png" alt="PlantUML classDiagram" width="500"/> </br></br>
### Link

You can paste the plantUML output syntax to visualize the relations as classDiagram here: https://www.planttext.com/
## React Flow  Nodes 

### Syntax
Based on FlightService example.
```javascript
[
  {
    id: 'Server1',
    data: { label: 'mqtt://localhost:1883,mqtt' },
    position: { x: 250, y: 5 }
  },
  {
    id: 'FlightMonitorService',
    data: { label: 'Flight Monitor Service' },
    position: { x: 100, y: 10 }
  },
  {
    id: 'edge1',
    source: 'FlightMonitorService',
    target: 'Server1',
    animated: true,
    label: 'flight/update',
    type: 'edgeType',
    arrowHeadType: 'arrowclosed'
  },
  {
    id: 'FlightNotifierService',
    data: { label: 'Flight Notifier Service' },
    position: { x: 100, y: 10 }
  },
  {
    id: 'edge2',
    source: 'Server1',
    target: 'FlightNotifierService',
    animated: true,
    label: 'flight/update',
    type: 'edgeType',
    arrowHeadType: 'arrowclosed'
  },
  {
    id: 'FlightSubscriberService',
    data: { label: 'Flight Subscriber Service' },
    position: { x: 100, y: 10 }
  },
  {
    id: 'edge3',
    source: 'FlightSubscriberService',
    target: 'Server1',
    animated: true,
    label: 'flight/queue',
    type: 'edgeType',
    arrowHeadType: 'arrowclosed'
  },
  {
    id: 'edge4',
    source: 'Server1',
    target: 'FlightMonitorService',
    animated: true,
    label: 'flight/queue',
    type: 'edgeType',
    arrowHeadType: 'arrowclosed'
  }
]
```
### React Flow Nodes

<img src="./public/img/reactFlow.png" alt="reactFlow Nodes" width="500"/> </br></br>

### Steps to visualize relations in React Flow 

1. Setup a react project in which you want to display reactFlow nodes.
2. Install `@asyncapi/app-relations-discovery` into the project.
3. Make a react component for the example.

**Example**
```javascript
import React from 'react';
import ReactFlow from 'react-flow-renderer';
import appRelationsDiscovery from '@asyncapi/app-relations-discovery';

const elements = appRelationsDiscovery.getRelations(...docs,{syntax:'reactFlow'});

export default () => (
  <div style={{ height: 300 }}>
    <ReactFlow elements={elements} />
  </div>
);
```

## Develop

1. Write code and tests.
1. Make sure all tests pass `npm test`
1. Make sure code is well formatted and secure `npm run lint`


## Contributing

Read [CONTRIBUTING](https://github.com/asyncapi/.github/blob/master/CONTRIBUTING.md) guide.