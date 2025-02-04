import { Col, Row } from "antd";
import MonitorCard from "@/component/monitorCard";
import { useRequest } from "ahooks";
import { pageQueryDevices } from "@/api/device";
import { useEffect } from "react";
import { io } from "socket.io-client";
import { useRef } from "react";
import { playSound } from '@/utils/warnning';
import { notification } from "antd";

const Home = () => {
  const { data } = useRequest(() => pageQueryDevices({ enable: true }));

  const refs = useRef({});

  useEffect(() => {
    if (data) {
      const socket = io(import.meta.env.VITE_APP_API_URL);

      const ids = data.map((device) => device.id);

      socket.emit("init", ids);

      ids.forEach((id) => {
        socket.on(`pred${id}`, refs.current[id].handlePred);
      });

      const findDeviceById = (id) => data.find((device) => device.id == id);

      socket.on('warn', ({ id }) => {
        notification.error({
          message: `${findDeviceById(id)?.name} 检测出高危行为！`,
        })
        playSound();
        refs.current[id].warn();
      })

      return () => {
        socket.disconnect();
      };
    }
  }, [data]);

  return (
    <div className="flex flex-col gap-5">
      <Row>
        {data?.map((device) => (
          <Col key={device.id} span={12}>
            <MonitorCard
              device={device}
              ref={(ref) => (refs.current[device.id] = ref)}
            />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Home;
