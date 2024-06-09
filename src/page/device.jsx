/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
"use client";
import { Button, Form, Input, Modal, Table, message } from "antd";
import { SearchOutlined, FileOutlined } from "@ant-design/icons";
import { useRef, useState } from "react";
import { useRequest } from "ahooks";
import { useImperativeHandle } from "react";
import {
  addDevice,
  deleteDevice,
  getDeviceById,
  updateDevice,
  pageQueryDevices,
} from "@/api/device";
import { forwardRef } from "react";

const FormModal = forwardRef(({ refresh }, ref) => {
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

  const [deviceId, setDeviceId] = useState();

  const [form] = Form.useForm();

  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleOk = async () => {
    setConfirmLoading(true);
    try {
      const values = await form.validateFields();
      if (!deviceId) await addDevice(values);
      else await updateDevice(values, deviceId);
      handleCancel();
      message.success("操作成功");
      refresh();
    } catch (error) {
      console.log(error);
    }
    setConfirmLoading(false);
  };

  const handleCancel = () => {
    form.resetFields();
    setDeviceId(undefined);
    handleClose();
  };

  useImperativeHandle(
    ref,
    () => ({
      show: (id) => {
        setOpen(true);
        if (id) {
          setDeviceId(id);
          getDeviceById(id).then((data) => {
            form.setFieldsValue(data);
          });
        }
      },
    }),
    [form]
  );

  return (
    <Modal
      title={deviceId ? "修改信息" : "添加设备"}
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      cancelText="取消"
      okText="保存"
      confirmLoading={confirmLoading}
    >
      <Form form={form} labelCol={{ span: 4 }}>
        <Form.Item
          name="name"
          label="设备名称"
          rules={[{ required: true, message: "设备名不能为空" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="addr"
          label="地址"
          rules={[{ required: true, message: "地址不能为空" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="username"
          label="用户名"
          rules={[{ required: true, message: "用户名不能为空" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="password"
          label="密码"
          rules={[{ required: true, message: "密码不能为空" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="ip"
          label="ip"
          rules={[{ required: true, message: "ip不能为空" }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
});

const Device = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [form] = Form.useForm();

  const { data, loading, refresh } = useRequest(() =>
    pageQueryDevices({ pageSize, page, ...form.getFieldsValue() })
  );

  const onFinish = () => {
    refresh();
  };

  const onReset = () => {
    form.resetFields();
  };

  const handleEnableOrDisable = async (status, id) => {
    try {
      await updateDevice({ enable: status }, id);
      message.success("操作成功");
      refresh();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: "删除设备",
      content: "确定删除吗？一旦删除，无法恢复",
      okType: "danger",
      okText: "确定",
      cancelText: "取消",
      onOk: async () => {
        try {
          await deleteDevice(id);
          message.success("删除成功");
          refresh();
        } catch (error) {
          console.log(error);
        }
      },
    });
  };

  const columns = [
    {
      title: "设备名称",
      dataIndex: "name",
      align: "center",
    },
    {
      title: "地址",
      dataIndex: "addr",
      align: "center",
    },
    {
      title: "用户名",
      dataIndex: "username",
      align: "center",
    },
    {
      title: "密码",
      dataIndex: "password",
      align: "center",
    },
    {
      title: "ip",
      dataIndex: "ip",
      align: "center",
    },
    {
      title: "状态",
      dataIndex: "enable",
      align: "center",
      render: (status) => (status ? "启用" : "停用"),
    },
    {
      title: "操作",
      align: "center",
      render: (_, record) => (
        <div className="flex-center gap-2 ">
          <Button type="link" onClick={() => modalRef.current?.show(record.id)}>
            修改
          </Button>
          <Button
            type="link"
            danger={!!record.enable}
            onClick={() => handleEnableOrDisable(!record.enable, record.id)}
          >
            {record.enable ? "停用" : "启用"}
          </Button>
          <Button danger type="link" onClick={() => handleDelete(record.id)}>
            删除
          </Button>
        </div>
      ),
    },
  ];

  const modalRef = useRef();

  return (
    <div className="flex flex-col gap-4 p-8">
      <Form
        form={form}
        onFinish={onFinish}
        className="bg-white w-full rounded-lg p-4"
      >
        <div className="flex mb-4">
          <div className="flex items-center gap-1 text-lg">
            <SearchOutlined />
            筛选搜索
          </div>
          <Button className="ml-auto" htmlType="button" onClick={onReset}>
            重置
          </Button>
          <Button className="ml-4" type="primary" htmlType="submit">
            查询结果
          </Button>
        </div>

        <Form.Item name="name" label="设备名称">
          <Input />
        </Form.Item>

        <Form.Item name="addr" label="地址">
          <Input />
        </Form.Item>
      </Form>

      <div className="flex bg-white w-full rounded-lg p-4">
        <div className="flex items-center gap-1 text-lg">
          <FileOutlined />
          数据列表
        </div>
        <Button className="ml-auto" onClick={() => modalRef.current?.show()}>
          添加
        </Button>
      </div>

      <Table
        bordered
        pagination={{
          total: data?.total,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条数据`,
          pageSizeOptions: ["5", "10"],
          pageSize,
          onChange: (page, pageSize) => {
            setPage(page);
            setPageSize(pageSize);
          },
        }}
        columns={columns}
        dataSource={data?.records}
        loading={loading}
      />
      <FormModal ref={modalRef} refresh={refresh} />
    </div>
  );
};

export default Device;
