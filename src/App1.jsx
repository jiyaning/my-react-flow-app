/*
 * @Description: 官方文档示例
 * @Version:
 * @Author: ji.yaning
 * @Date: 2023-10-23 16:54:46
 * @LastEditors: ji.yaning
 * @LastEditTime: 2023-11-16 13:35:21
 */
import React, { useCallback, useRef, useState } from 'react';
import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  MiniMap,
  Controls,
  Background,
  Panel,
  NodeToolbar,
  NodeResizer
} from 'reactflow';
import 'reactflow/dist/style.css';

const initialNodes = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: 'node 1' } },
  { id: '2', position: { x: 0, y: 100 }, data: { label: 'node 2' } },
];
const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];

export default function App1 () {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
      >
        <Controls />
        <MiniMap />
        <Background variant="dots" gap={12} size={1} />
        <NodeToolbar/>
        <Panel />
        <NodeResizer />
      </ReactFlow>
    </div>
  );
}