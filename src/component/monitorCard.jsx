/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import { useRef } from "react";
import { useState } from "react";
import { forwardRef } from "react";
import { useImperativeHandle } from "react";
import useSemaphore from "@/hooks/useSemapahore.js";
import { Drawer } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import { useSize } from "ahooks";
import { useEffect } from "react";

const parsePred = ({ time, pred }) => {
  switch (pred) {
    case 0:
      return <div className="text-[#999999]">[{time}] 无攻击性</div>;
    case 1:
      return <div className="text-red-300">[{time}] 有攻击性</div>;
    case 2:
      return <div className="text-red-500">[{time}] 较强攻击性</div>;
    case 3:
      return <div className="text-red-700">[{time}] 很大攻击性</div>;
  }
};

const MonitorCard = forwardRef(({ device }, ref) => {
  const { name, ip, username, password } = device;
  const [predList, setPredList] = useState([]);

  const { acquire, release } = useSemaphore(1);
  const iframeRef = useRef(null);

  const handleMove = async (x, y) => {
    const move = (type, stepVal) => {
      iframeRef.current.contentWindow.postMessage(
        { type, isStop: false, stepVal },
        "*"
      );
      setTimeout(() => {
        iframeRef.current.contentWindow.postMessage(
          { type, isStop: true },
          "*"
        );
        release();
      }, 1000);
    };
    if (x !== 0) {
      await acquire();
      if (x > 0) move("Right", x);
      else move("Left", -x);
    }
    if (y !== 0) {
      await acquire();
      if (y > 0) move("Up", y);
      else move("Down", -y);
    }
  };

  useImperativeHandle(ref, () => ({
    handlePred: (pred) => {
      setPredList((prev) =>
        prev.length < 14 ? [...prev, pred] : [...prev.slice(1), pred]
      );
      const [x, y] = pred.move;
      handleMove(x, y);
    },
  }));

  const [open, setOpen] = useState(false);

  const containerRef = useRef();
  const containerSize = useSize(containerRef);
  useEffect(
    () =>
      iframeRef.current.contentWindow.postMessage(
        {
          type: "resize",
          width: containerSize?.width,
          height: containerSize?.height,
        },
        "*"
      ),
    [containerSize]
  );

  const [loading, setLoading] = useState(true);

  return (
    <div className="w-full h-96 relative" ref={containerRef}>
      {loading && (
        <div className="flex-center w-full h-full">
          <Spin size="large" />
        </div>
      )}
      <iframe
        src={import.meta.env.VITE_DAHUA_CTL_URL}
        className="h-full w-full border-0"
        style={{ display: loading ? "none" : "" }}
        ref={iframeRef}
        onLoad={(e) => {
          e.target.contentWindow.postMessage(
            {
              type: "init",
              username,
              password,
              ip,
              width: containerSize?.width,
              height: containerSize?.height,
            },
            "*"
          );
          setLoading(false);
        }}
      />
      <div className="absolute top-0 w-full p-2 text-white font-normal">
        <div>{name}</div>
        <div>{ip}</div>
      </div>
      <div
        className="absolute top-1/2 right-2 cursor-pointer text-white"
        onClick={() => setOpen(true)}
      >
        <LeftOutlined />
      </div>
      <Drawer
        title="攻击日志"
        placement="right"
        onClose={() => setOpen(false)}
        open={open}
        getContainer={false}
        width={250}
      >
        {predList.map((pred, index) => (
          <div key={index} className="text-sm">
            {parsePred(pred)}
          </div>
        ))}
      </Drawer>
    </div>
  );
});

export default MonitorCard;
