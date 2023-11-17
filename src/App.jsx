/*
 * @Description:
 * @Version:
 * @Author: ji.yaning
 * @Date: 2023-10-23 16:54:46
 * @LastEditors: ji.yaning
 * @LastEditTime: 2023-11-17 09:53:16
 */
import { useCallback, useState, useRef } from 'react';
import ReactFlow,
{
  addEdge,
  ReactFlowProvider,
  MiniMap,
  Controls,
  useNodesState,
  useEdgesState,
  useReactFlow,
  MarkerType,
  Panel,
  Background,
  ConnectionMode
} from 'reactflow';
import 'reactflow/dist/style.css';
import './index.css';

import UpdateNode from './components/nodeContent';
import UpdateEdge from './components/edgeContent';
import ResizableNodeSelected from './components/ResizableNodeSelected';
import ContextMenu from './components/ContextMenu';
import DownloadButton from './components/DownloadButton';
import { nodes as initialNodes1, edges as initialEdges1 } from './components/data';

const nodeTypes = {
  ResizableNodeSelected,
};

const rfStyle = {
  backgroundColor: '#B8CEFF',
};

const flowKey = 'flow_test';
const localNodes = JSON.parse(localStorage.getItem(flowKey))?.nodes;
const localEdges = JSON.parse(localStorage.getItem(flowKey))?.edges;
let nodeId = 100;

function App () {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes1);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges1);
  const [nodeInfo, setNodeInfo] = useState({});
  const [edgeInfo, setEdgeInfo] = useState({});
  const [selection, setSelection] = useState({});
  const [menu, setMenu] = useState(null);
  const ref = useRef(null);
  const connectingNodeId = useRef(null);

  // screenToFlowPosition() 函数将屏幕像素位置转换为流位置，reactflow版本'11.10.0'以后支持
  const { screenToFlowPosition } = useReactFlow();

  const onConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  let id = 1000
  const getId = () => `${id++}`;

  const onConnectStart = useCallback((_, { nodeId }) => {
    connectingNodeId.current = nodeId;
  }, []);

  const onConnectEnd = useCallback(
    (event) => {
      const targetIsPane = event.target.classList.contains('react-flow__pane');

      if (targetIsPane) {
        // we need to remove the wrapper bounds, in order to get the correct position
        const id = getId();
        const newNode = {
          id,
          type: 'ResizableNodeSelected',
          position: screenToFlowPosition({
            x: event.clientX,
            y: event.clientY,
          }),
          data: { label: `Node ${id}` },
          style: {
            background: "#3dea84",
            color: "white",
            border: '1px solid orange',
            borderRadius: '100%',
            width: 90,
            height: 60,
          },
        };

        setNodes((nds) => nds.concat(newNode));
        setEdges((eds) =>
          eds.concat({ id, source: connectingNodeId.current, target: id }),
        );
      }
    },
    [screenToFlowPosition],
  );

  const onPaneClick = useCallback(() => setMenu(null), [setMenu]);

  // 保存
  const [rfInstance, setRfInstance] = useState({});
  const onSave = useCallback(() => {
    if (rfInstance) {
      const flow = rfInstance.toObject();
      localStorage.setItem(flowKey, JSON.stringify(flow));
      console.log(JSON.stringify(flow));
    }
  }, [rfInstance]
  );

  // 恢复
  const { setViewport } = useReactFlow();
  const onRestore = useCallback(() => {
    const restoreFlow = async () => {
      const flow = JSON.parse(localStorage.getItem(flowKey));
      if (flow) {
        const { x = 0, y = 0, zoom = 0 } = flow.viewport;
        setNodes(flow.nodes || []);
        setEdges(flow.edges || []);
        setViewport({ x, y, zoom });
      }
    };
    restoreFlow();
  }, [setNodes, setViewport]
  );

  // 清空
  const onDelete = useCallback(() => {
    const restoreFlow = async () => {
      setNodes([] || []);
      setEdges([] || []);
    };
    restoreFlow();
  }, [setNodes]
  );

  // 点击节点
  const onNodeClick = (e, node) => {
    // console.log("onNodeClick ~ e, node:", e, node)
    setNodeInfo({
      ...node.data,
      id: node.id,
      nodeBg: node.style && node.style.background ? node.style.background : '#ffffff',
      fontColor: node.style && node.style.color ? node.style.color : '#ffffff',
      fontSize: node.style && node.style.fontSize ? node.style.fontSize : 2,
    });
  };

  // 点击节点连接线
  const onEdgeClick = (e, edge) => {
    setEdgeInfo(edges.find((item) => edge.id === item.id));
  };

  // 选中改变
  const onSelectionChange = useCallback((selection) => {
    // console.log("onSelectionChange ~ selection:", selection)
    setSelection(selection)
  }, [])


  // 新增节点
  const reactFlowInstance = useReactFlow();
  const onAdd = useCallback(() => {
    const id = `${++nodeId}`;
    const newNode = {
      id,
      type: 'ResizableNodeSelected',
      position: {
        // x: 100,
        // y: 300,
        x: Math.random() * 600,
        y: Math.random() * 600,
      },
      data: {
        label: `Node ${id}`,
      },
      style: {
        background: "#6a7d9a",
        color: "white",
        border: '1px solid orange',
        borderRadius: '100%',
        width: 80,
        height: 80,
      },
    };
    reactFlowInstance.addNodes(newNode);
  }, []);

  // 改变节点内容
  const changeNode = (val) => {
    setNodes((nds) =>
      nds.map((item) => {
        if (item.id === val.id) {
          item.data = val;
          item.hidden = val.isHidden;
          item.draggable = val.isDraggable;
          item.selectable = val.isSelectable;
          item.style = { background: val.nodeBg, width: 80, height: 80, borderRadius: '100%', color: val.fontColor, fontSize: val.fontSize };
        }
        return item;
      }),
    );
  };

  // 改变连接线内容
  const changeEdge = (val) => {
    // console.log("changeEdge ~ val:", val)
    setEdges((nds) =>
      nds.map((item) => {
        if (item.id === val.id) {
          item.label = val.label;
          item.type = val.type;
          item.hidden = val.isHidden;
          item.animated = val.isAnimated;
          item.style = { stroke: val.color };
        }
        return item;
      }),
    );
  };

  // 默认edge样式
  const defaultEdgeOptions = {
    style: {
      strokeWidth: 1,
      stroke: '#116F97'
    },
    type: 'default',
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: '#116F97'
    } // 连接线尾部的箭头
  }

  const onNodesDelete = useCallback(
    (deleted) => {
      // console.log("deleted:", deleted)
      setEdges(
        deleted.reduce((acc, node) => {
          const incomers = getIncomers(node, nodes, edges);
          const outgoers = getOutgoers(node, nodes, edges);
          const connectedEdges = getConnectedEdges([node], edges);

          const remainingEdges = acc.filter((edge) => !connectedEdges.includes(edge));

          const createdEdges = incomers.flatMap(({ id: source }) =>
            outgoers.map(({ id: target }) => ({ id: `${source}->${target}`, source, target }))
          );

          return [...remainingEdges, ...createdEdges];
        }, edges)
      );
    },
    [nodes, edges]
  );

  const onNodeContextMenu = useCallback(
    (event, node) => {
      // console.log("onNodeContextMenu ~ event, node:", event, node)
      // Prevent native context menu from showing
      event.preventDefault();

      // Calculate position of the context menu. We want to make sure it
      // doesn't get positioned off-screen.
      const pane = ref.current.getBoundingClientRect();
      setMenu({
        nodeInfo: node,
        top: event.clientY < pane.height - 200 && event.clientY,
        left: event.clientX < pane.width - 200 && event.clientX,
        right: event.clientX >= pane.width - 200 && pane.width - event.clientX,
        bottom: event.clientY >= pane.height - 200 && pane.height - event.clientY,
      });
    },
    [setMenu]
  );

  const onPaneContextMenu = useCallback((event) => {
    event.preventDefault();
    setMenu(null)
  }, [setMenu])

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        ref={ref}
        nodes={nodes} // 节点
        edges={edges} // 连接线
        onNodesChange={onNodesChange} // 节点拖拽等改变
        onNodesDelete={onNodesDelete} // 节点删除
        onEdgesChange={onEdgesChange} // 连接线拖拽等改变
        onNodeClick={onNodeClick} // 点击节点
        onEdgeClick={onEdgeClick} // 点击连接线
        onConnect={onConnect} // 节点直接连接
        onConnectStart={onConnectStart}
        onConnectEnd={onConnectEnd}
        nodeTypes={nodeTypes} // 节点类型
        // edgeTypes={edgeTypes}
        onNodeContextMenu={onNodeContextMenu}
        fitView // 渲染节点数据
        style={rfStyle} // 背景色
        defaultEdgeOptions={defaultEdgeOptions} // 默认连接线样式
        onInit={setRfInstance} // 初始化保存的数据
        connectionMode={ConnectionMode.Loose}
        onSelectionChange={onSelectionChange}
        onPaneContextMenu={onPaneContextMenu}
        onPaneClick={onPaneClick}
      >
        {menu && <ContextMenu onClick={onPaneClick} {...menu} />}
        <Background variant="lines" gap={16} size={1} />
        {
          selection.nodes?.length > 0 && (<UpdateNode info={nodeInfo} onChange={changeNode} />)
        }
        {
          selection.edges?.length > 0 && (<UpdateEdge info={edgeInfo} onChange={changeEdge} />)
        }
        <Panel position='top-left'>
          <button onClick={onAdd} style={{ marginRight: '10px' }}>add node</button>
          <button onClick={onSave} style={{ marginRight: '10px' }}>save</button>
          <button onClick={onRestore} style={{ marginRight: '10px' }}>restore last saved</button>
          <button onClick={onDelete}>delete all nodes</button>
        </Panel>
        <MiniMap />
        <Controls />
        <DownloadButton />
      </ReactFlow>
    </div>
  );
}

export default function () {
  return (
    <ReactFlowProvider>
      <App />
    </ReactFlowProvider>
  );
}