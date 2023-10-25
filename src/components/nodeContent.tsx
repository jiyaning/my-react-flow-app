/*
 * @Description:
 * @Version:
 * @Author: ji.yaning
 * @Date: 2023-10-25 10:54:46
 * @LastEditors: ji.yaning
 * @LastEditTime: 2023-10-25 13:35:56
 */
import React, { useState, useEffect } from 'react';
import { Input, Switch } from 'antd';

export type nodeProps = {
  info: any;
  onChange: (val: any) => void;
};

export default ({ info, onChange }: nodeProps) => {
  console.log("nodeContent.tsx:18 ~ info:", info)
  const [nodeInfo, setNodeInfo] = useState<any>({});

  useEffect(() => {
    if (info.id) {
      if (!info.isHidden) {
        info.isHidden = false;
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

  return nodeInfo.id ? (
    <div className="updatenode__controls">
      <label>名称：</label>
      <Input
        placeholder=""
        value={nodeInfo.label}
        onChange={(evt) => setNodeName(evt.target.value)}
      />
      <label className="updatenode__bglabel">背景色：</label>
      <Input type="color" value={nodeInfo.nodeBg} onChange={(evt) => setNodeBg(evt.target.value)} />
      <div className="updatenode__checkboxwrapper">
        <label>是否隐藏：</label>
        {/* <Switch checked={nodeInfo.isHidden} onChange={setNodeHidden} /> */}
        <input type='checkbox' checked={nodeInfo.isHidden} onChange={(evt) => setNodeHidden(evt.target.checked)} />
      </div>
    </div>
  ) : (
    <></>
  );
};