/*
 * @Description:
 * @Version:
 * @Author: ji.yaning
 * @Date: 2023-10-25 10:54:46
 * @LastEditors: ji.yaning
 * @LastEditTime: 2023-11-17 11:26:47
 */
import React, { useState, useEffect } from 'react';
import { Input, InputNumber, Switch } from 'antd';

export type nodeProps = {
  info: any;
  onChange: (val: any) => void;
};

export default ({ info, onChange }: nodeProps) => {
  // console.log("nodeContent.tsx:18 ~ info:", info)
  const [nodeInfo, setNodeInfo] = useState<any>({});

  useEffect(() => {
    if (info.id) {
      if (!info.isHidden) {
        info.isHidden = false;
      }
      if (!info.isDraggable) {
        info.isDraggable = true;
      }
      if (!info.isSelectable) {
        info.isSelectable = true;
      }
      setNodeInfo(info);
    }
  }, [info.id]);

  // 改变名称
  const setNodeName = (value: string) => {
    setNodeInfo({
      ...nodeInfo,
      label: value,
    });
    onChange({
      ...nodeInfo,
      label: value,
    });
  };

  // 改变背景色
  const setNodeBg = (value: string) => {
    setNodeInfo({
      ...nodeInfo,
      nodeBg: value,
    });
    onChange({
      ...nodeInfo,
      nodeBg: value,
    });
  };

  // 改变字号
  const setNodeFontSize = (value: any) => {
    setNodeInfo({
      ...nodeInfo,
      fontSize: value,
    });
    onChange({
      ...nodeInfo,
      fontSize: value,
    });
  };

  // 改变字体颜色
  const setNodeFontColor = (value: string) => {
    setNodeInfo({
      ...nodeInfo,
      fontColor: value,
    });
    onChange({
      ...nodeInfo,
      fontColor: value,
    });
  };

  // 是否隐藏
  const setNodeHidden = (value: boolean) => {
    setNodeInfo({
      ...nodeInfo,
      isHidden: value,
    });
    onChange({
      ...nodeInfo,
      isHidden: value,
    });
  };

  // 是否可拖拽
  const setNodeDrag = (value: boolean) => {
    setNodeInfo({
      ...nodeInfo,
      isDraggable: value,
    });
    onChange({
      ...nodeInfo,
      isDraggable: value,
    });
  };

  // 是否可选中
  const setNodeSelected = (value: boolean) => {
    setNodeInfo({
      ...nodeInfo,
      isSelectable: value,
    });
    onChange({
      ...nodeInfo,
      isSelectable: value,
    });
  };

  return nodeInfo.id ? (
    <div className="updatenode__controls">
      <label>名称：</label>
      <Input
        placeholder="请输入节点名称"
        value={nodeInfo.label}
        onChange={(evt) => setNodeName(evt.target.value)}
      />
      <div className="updatenode__checkboxwrapper">
        <label>字号：</label>
        <InputNumber min={1} max={20} defaultValue={2} value={nodeInfo.fontSize} onChange={(evt) => setNodeFontSize(evt)} />
      </div>
      <label className="updatenode__bglabel">字体颜色：</label>
      <Input type="color" value={nodeInfo.fontColor} onChange={(evt) => setNodeFontColor(evt.target.value)} />
      <label className="updatenode__bglabel">背景色：</label>
      <Input type="color" value={nodeInfo.nodeBg} onChange={(evt) => setNodeBg(evt.target.value)} />
      <div className="updatenode__checkboxwrapper">
        <label>是否隐藏：</label>
        {/* <Switch checked={nodeInfo.isHidden} onChange={setNodeHidden} /> */}
        <input type='checkbox' checked={nodeInfo.isHidden} onChange={(evt) => setNodeHidden(evt.target.checked)} />
      </div>
      <div className="updatenode__checkboxwrapper">
        <label>是否可拖拽：</label>
        <input type='checkbox' checked={nodeInfo.isDraggable} onChange={(evt) => setNodeDrag(evt.target.checked)} />
      </div>
      <div className="updatenode__checkboxwrapper">
        <label>是否可选中：</label>
        <input type='checkbox' checked={nodeInfo.isSelectable} onChange={(evt) => setNodeSelected(evt.target.checked)} />
      </div>
    </div>
  ) : (
    <></>
  );
};