## Functions

<dl>
<dt><a href="#getRelations">getRelations(asyncApiDocs, [options])</a> ⇒ <code>Promise.&lt;DiscoveredRelations&gt;</code></dt>
<dd><p>Validates and analyzes a list of AsyncAPI documents and get applications described by those files</p>
</dd>
<dt><a href="#getMermaidFlowchart">getMermaidFlowchart(metrics)</a> ⇒ <code>String</code></dt>
<dd><p>Generates mermaid flowchart from default output syntax</p>
</dd>
<dt><a href="#getPlantUMLDiagram">getPlantUMLDiagram(metrics)</a> ⇒ <code>String</code></dt>
<dd><p>Generates plantUML class diagram from default output syntax</p>
</dd>
<dt><a href="#getReactFlowData">getReactFlowData(metrics)</a> ⇒ <code>Array</code></dt>
<dd><p>Generates reactFlow nodes data from default output syntax</p>
</dd>
<dt><a href="#validate">validate(asyncApiDocs)</a> ⇒ <code>Promise.&lt;Array&gt;</code></dt>
<dd><p>Validate and parse given array of AsyncAPI documents.</p>
</dd>
</dl>

<a name="getRelations"></a>

## getRelations(asyncApiDocs, [options]) ⇒ <code>Promise.&lt;DiscoveredRelations&gt;</code>
Validates and analyzes a list of AsyncAPI documents and get applications described by those files

**Kind**: global function  
**Returns**: <code>Promise.&lt;DiscoveredRelations&gt;</code> - Relations between documents  

| Param | Type | Description |
| --- | --- | --- |
| asyncApiDocs | <code>Array.&lt;String&gt;</code> | An array of stringified AsyncAPI documents |
| [options] | <code>Object</code> |  |
| [options.syntax] | <code>&#x27;default&#x27;</code> \| <code>&#x27;mermaid&#x27;</code> \| <code>&#x27;plantUML&#x27;</code> \| <code>&#x27;reactFlow&#x27;</code> | syntax in which the relation will be generated. |

<a name="getMermaidFlowchart"></a>

## getMermaidFlowchart(metrics) ⇒ <code>String</code>
Generates mermaid flowchart from default output syntax

**Kind**: global function  
**Returns**: <code>String</code> - Flowchart following mermaid syntax  

| Param | Type | Description |
| --- | --- | --- |
| metrics | <code>Object</code> | Relations between AsyncAPI docs in default output syntax |

<a name="getPlantUMLDiagram"></a>

## getPlantUMLDiagram(metrics) ⇒ <code>String</code>
Generates plantUML class diagram from default output syntax

**Kind**: global function  
**Returns**: <code>String</code> - class diagram following plantUML syntax  

| Param | Type | Description |
| --- | --- | --- |
| metrics | <code>Object</code> | Relations between AsyncAPI docs in default output syntax |

<a name="getReactFlowData"></a>

## getReactFlowData(metrics) ⇒ <code>Array</code>
Generates reactFlow nodes data from default output syntax

**Kind**: global function  
**Returns**: <code>Array</code> - reactFlow nodes data  

| Param | Type | Description |
| --- | --- | --- |
| metrics | <code>Object</code> | Relations between AsyncAPI docs in default output syntax |

<a name="validate"></a>

## validate(asyncApiDocs) ⇒ <code>Promise.&lt;Array&gt;</code>
Validate and parse given array of AsyncAPI documents.

**Kind**: global function  
**Returns**: <code>Promise.&lt;Array&gt;</code> - parsed AsyncAPI documents  

| Param | Type | Description |
| --- | --- | --- |
| asyncApiDocs | <code>Array</code> | unparsed AsyncAPI documents |

