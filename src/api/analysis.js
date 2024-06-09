import request from "@/utils/request";

export const pageQueryLogs = ({ pageSize, page, name, date, level, addr }) => {
  return request.get('/analysis/logs', {
    params: {
      pageSize,
      page,
      name,
      date,
      level,
      addr
    }
  })
}

export const getAggressiveNum = () => {
  return request.get("/analysis/aggressive-num");
}

export const getDeviceNum = () => {
  return request.get("/analysis/device-num");
}

export const getDangerousRegion = () => {
  return request.get("/analysis/dangerous-regions");
}

export const getFilters = () => {
  return request.get("/analysis/logs/filters");
}

export const getLineData = (prevDayNum) => {
  return request.get(`/analysis/${prevDayNum}/line.json`);
}

export const getPieData = (date) => {
  return request.get(`/analysis/${date}/pie.json`);
}