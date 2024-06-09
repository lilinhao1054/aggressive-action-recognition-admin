import request from "@/utils/request";

export const getDeviceById = (id) => {
  return request.get(`/devices/${id}`)
}

export const pageQueryDevices = ({ pageSize, page, name, enable, addr }) => {
  return request.get('/devices', {
    params: {
      pageSize,
      page,
      name,
      enable,
      addr
    }
  })
}

export const addDevice = (device) => {
  return request.post('/devices', device);
}

export const deleteDevice = (id) => {
  return request.delete(`/devices/${id}`)
}

export const updateDevice = (device, id) => {
  return request.put(`/devices/${id}`, device)
}