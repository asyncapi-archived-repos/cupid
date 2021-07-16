<h5 align="center">
  <br>
  <a href="https://www.asyncapi.org"><img src="https://github.com/asyncapi/parser-nodejs/raw/master/assets/logo.png" alt="AsyncAPI logo" width="200"></a>
  <br>
  Applications Relation Finder
</h5>

![npm](https://img.shields.io/npm/v/@asyncapi/app-relations-discovery?style=for-the-badge) ![npm](https://img.shields.io/npm/dt/@asyncapi/app-relations-discovery?style=for-the-badge)

> :warning: This package is under construction.

## Overview
An official library that focuses on finding and analyzing the relationships between AsyncAPI Documents to later output consolidated information about the system architecture. Output format would be customizable and available in different formats like uml, mermaid.js and other.

## Install

```
npm install @asyncapi/app-relations-discovery
```

## API

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