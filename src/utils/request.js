import { message } from "antd";
import axios from "axios";

const request = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL,
  timeout: 10000,
});

request.interceptors.response.use(
  (res) => {
    const code = res.data.code;
    // 获取错误信息
    const msg = res.data.msg || "未知错误";
    if (code !== 200) {
      message.error(msg);
      return Promise.reject(new Error(msg));
    } else {
      return res.data.data;
    }
  },
  (error) => {
    console.log("err" + error);
    let { message: msg } = error;
    if (msg === "Network Error") {
      msg = "后端接口连接异常";
    } else if (msg.includes("timeout")) {
      msg = "系统接口请求超时";
    } else if (msg.includes("Request failed with status code")) {
      // 获得异常http状态码
      const statusCode = +msg.substr(msg.length - 3);
      msg = "系统接口" + statusCode + "异常";
    }
    message.error(msg);
    return Promise.reject(error);
  }
);

export default request;
