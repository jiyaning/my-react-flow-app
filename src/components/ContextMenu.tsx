/*
 * @Description: 鼠标右键菜单
 * @Version:
 * @Author: ji.yaning
 * @Date: 2023-10-25 14:11:37
 * @LastEditors: ji.yaning
 * @LastEditTime: 2023-11-16 16:04:54
 */
import React, { useCallback } from 'react';
import { useReactFlow } from 'reactflow';

export default function ContextMenu({ nodeInfo, top, left, right, bottom, ...props }) {
  // console.log("ContextMenu ~ nodeInfo:", nodeInfo)
  let { id } = nodeInfo
  // console.log("ContextMenu ~ id:", id)
  const { getNode, setNodes, addNodes, setEdges } = useReactFlow();

  const duplicateNode = useCallback(() => {
    const node = getNode(id);
    const position = {
      x: node.position.x + 50,
      y: node.position.y + 50,
    };
    addNodes({ ...node, id: `${node.id}-copy`, position });
  }, [id, getNode, addNodes]);

  const deleteNode = useCallback(() => {
    setNodes((nodes) => nodes.filter((node) => node.id !== id));
    setEdges((edges) => edges.filter((edge) => edge.source !== id));
  }, [id, setNodes, setEdges]);

  return (
    <div style={{ top, left, right, bottom }} className="context-menu" {...props}>
      <p style={{ margin: '0.5em' }}>
        {/* <small>id: {id}</small> */}
        <small>{nodeInfo.data.label}</small>
      </p>
      <button onClick={duplicateNode}>复制</button>
      <button onClick={deleteNode}>删除</button>
    </div>
  );
}
