import { createBrowserRouter } from "react-router-dom";
import Layout from "@/layout";
import { createRef } from "react";
import Home from "@/page/home.jsx";
import Device from "@/page/device";
import Analysis from "@/page/analysis";
import {
  CameraOutlined,
  HomeOutlined,
  LineChartOutlined,
  SettingOutlined,
} from "@ant-design/icons";

export const routes = [
  {
    key: "1",
    path: "/",
    name: "首页",
    element: <Home />,
    nodeRef: createRef(),
    icon: <HomeOutlined />,
  },
  {
    key: "2",
    path: "/device",
    name: "设备",
    element: <Device />,
    nodeRef: createRef(),
    icon: <CameraOutlined />,
  },
  {
    key: "4",
    path: "/analysis",
    name: "统计",
    element: <Analysis />,
    nodeRef: createRef(),
    icon: <LineChartOutlined />,
  },
];

export const key2Path = {
  1: "/",
  2: "/device",
  4: "/analysis",
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: routes.map((route) => ({
      index: route.path === "/",
      path: route.path === "/" ? undefined : route.path,
      element: route.element,
    })),
  },
]);
