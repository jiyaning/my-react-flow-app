import { memo } from 'react';
import { Handle, Position, NodeResizer } from 'reactflow';

const ResizableNodeSelected = ({ data, selected }) => {
  return (
    <>
      <NodeResizer color="#F3A011" isVisible={selected} minWidth={80} minHeight={80} />
      <div
        style={{
          // width: 60,
          height: '100%',
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          // fontSize: 8
        }}
      >
        {data.label}
      </div>
      <Handle style={{ opacity: 0 }} type="source" position={Position.Top} id='a' />
      <Handle style={{ opacity: 0 }} type="source" position={Position.Right} id='b' />
      <Handle style={{ opacity: 0 }} type="source" position={Position.Bottom} id='c' />
      <Handle style={{ opacity: 0 }} type="source" position={Position.Left} id='d' />
    </>
  );
};

export default memo(ResizableNodeSelected);