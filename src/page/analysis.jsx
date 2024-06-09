/* eslint-disable react/prop-types */
import { Divider, Table } from "antd";
import { Col, Row } from "antd";
import Line from "@/component/chart/line.jsx";
import Pie from "@/component/chart/pie.jsx";
import { Select } from "antd";
import {
  EyeOutlined,
  VideoCameraOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { getPrev7Day } from "@/utils/day";
import { useState } from "react";
import { Modal } from "antd";
import { useRequest } from "ahooks";
import {
  getAggressiveNum,
  getDeviceNum,
  getFilters,
  pageQueryLogs,
  getDangerousRegion,
} from "@/api/analysis";
import dayjs from "dayjs";
import { getLineData, getPieData } from "../api/analysis";
import { Descriptions } from "antd";

const AnalysisCard = ({ number, icon, title, changeVal, changePercentage }) => {
  const Down = () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.5001 15.2019C12.6509 15.0511 12.7433 14.8416 12.743 14.6115L12.743 14.5102C12.743 14.0494 12.3699 13.6764 11.9097 13.677L7.3568 13.677L15.0586 5.97522C15.3838 5.64995 15.3838 5.12198 15.0585 4.79671C14.7333 4.47144 14.2053 4.47144 13.88 4.79671L6.17828 12.4985V7.94554C6.17828 7.48475 5.80525 7.11171 5.34504 7.1123H5.24376C4.78296 7.1123 4.40993 7.48534 4.41052 7.94554V14.6115C4.41052 15.0723 4.78355 15.4453 5.24376 15.4447L11.9097 15.4447C12.1401 15.4447 12.3493 15.3527 12.5001 15.2019Z"
        fill="#FF3B30"
      />
    </svg>
  );

  const Up = () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.21375 4.79671C7.06297 4.94748 6.97061 5.15701 6.97091 5.38711L6.97091 5.48839C6.97091 5.94919 7.34394 6.32223 7.80415 6.32164L12.3571 6.32164L4.65532 14.0234C4.33005 14.3487 4.33005 14.8766 4.65532 15.2019C4.98059 15.5272 5.50856 15.5272 5.83383 15.2019L13.5356 7.50015V12.0531C13.5356 12.5139 13.9086 12.8869 14.3688 12.8863H14.4701C14.9309 12.8863 15.3039 12.5133 15.3034 12.0531V5.38711C15.3034 4.92632 14.9303 4.55328 14.4701 4.55387L7.80415 4.55387C7.57375 4.55387 7.36452 4.64593 7.21375 4.79671Z"
        fill="#34C759"
      />
    </svg>
  );

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex">
        <div className="text-3xl font-bold">{number}</div>
        <div className="ml-auto rounded-xl shadow-sm p-2 w-14 h-14 flex-center cursor-pointer text-xl hover:shadow-md">
          {icon}
        </div>
      </div>
      <div className="text-base font-medium mt-2">{title}</div>
      <div className="flex gap-2 text-sm mt-auto text-[#7C8DB5]">
        <div className="flex gap-1">
          <div>{changeVal >= 0 ? <Up /> : <Down />}</div>
          <div>{Math.abs(changeVal)}</div>
        </div>
        <div>
          {changePercentage
            ? (changeVal >= 0 ? "+" : "-") + Math.abs(changePercentage) + "%"
            : ""}{" "}
          相比昨天
        </div>
      </div>
    </div>
  );
};

const DangerRegionModal = ({ tableData }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <EyeOutlined onClick={() => setOpen(true)} />
      <Modal open={open} onCancel={() => setOpen(false)} footer={null}>
        <Table
          columns={[
            { title: "地点", dataIndex: "addr" },
            { title: "近7天攻击性次数", dataIndex: "number" },
          ]}
          dataSource={tableData}
          pagination={false}
        />
      </Modal>
    </>
  );
};

const FeatureViewModal = ({ feature }) => {
  const [open, setOpen] = useState(false);
  const labels = [
    "性别",
    "年龄",
    "站位方向",
    "帽子",
    "眼镜",
    "包",
    "怀物",
    "袖子",
    "上衣风格",
    "下装风格",
    "长衫",
    "腿部衣物",
    "靴子",
  ]; // len = 13
  const feature2Items = (feature) => {
    const arr = feature.split(""); // len = 26
    return labels.map((label, index) => ({
      key: index,
      label,
      children: (() => {
        let result = "";
        switch (index) {
          case 0: // 性别
            result = items[0] == 0 ? "男" : "女";
            break;
          case 1: // 年龄
            if (arr[1] == 1) result = "大于60岁";
            else if (arr[2] == 1) result = "18至60岁之间";
            else if (arr[3] == 1) result = "小于18岁";
            break;
          case 2: // 站位方向
            if (arr[4] == 1) result = "前方";
            else if (arr[5] == 1) result = "侧方";
            else if (arr[6] == 1) result = "后方";
            break;
          case 3: //帽子
            result = arr[7] == 0 ? "没戴帽子" : "戴帽子";
            break;
          case 4: // 眼镜
            result = arr[8] == 0 ? "没戴眼镜" : "戴眼镜";
            break;
          case 5: // 包
            result = [];
            if (arr[9] == 1) result.push("有手提包");
            if (arr[10] == 1) result.push("有肩包");
            if (arr[11] == 1) result.push("有背包");
            result = result.length === 0 ? "没有包" : result.join(",");
            break;
          case 6: // 怀物
            result = arr[12] == 0 ? "无怀物" : "有怀物";
            break;
          case 7: // 袖子
            if (arr[13] == 1) result = "短袖";
            else if (arr[14] == 1) result = "长袖";
            break;
          case 8: // 上衣风格
            if (arr[15] == 1) result = "带条纹";
            else if (arr[16] == 1) result = "带logo";
            else if (arr[17] == 1) result = "带格子";
            else if (arr[18] == 1) result = "拼接风格";
            break;
          case 9: // 下装风格
            if (arr[19] == 1) result = "带条纹";
            else if (arr[20] == 1) result = "带图案";
            break;
          case 10: // 长衫
            result = arr[21] == 0 ? "未穿长衫" : "穿长衫";
            break;
          case 11: // 腿部衣物
            if (arr[22] == 1) result = "长裤";
            else if (arr[23] == 1) result = "短裤";
            else if (arr[24] == 1) result = "裙子";
            break;
          case 12: // 靴子
            result = arr[25] == 0 ? "没穿靴子" : "穿靴子";
            break;
        }
        return result;
      })(),
    }));
  };
  const items = [
    {
      key: "1",
      label: "UserName",
      children: "Zhou Maomao",
    },
    {
      key: "2",
      label: "Telephone",
      children: "1810000000",
    },
    {
      key: "3",
      label: "Live",
      children: "Hangzhou, Zhejiang",
    },
    {
      key: "4",
      label: "Remark",
      children: "empty",
    },
    {
      key: "5",
      label: "Address",
      children:
        "No. 18, Wantang Road, Xihu District, Hangzhou, Zhejiang, China",
    },
  ];
  return (
    <>
      <EyeOutlined
        onClick={() => setOpen(true)}
        style={{ color: "#1677ff" }}
        className="text-base"
        size="large"
      />
      <Modal open={open} onCancel={() => setOpen(false)} footer={null}>
        <Descriptions title="攻击者特征" items={feature2Items(feature)} />
      </Modal>
    </>
  );
};

const prev7Days = getPrev7Day();

const Analysis = () => {
  const [lineSelect, setLineSelect] = useState(7);
  const [pieSelect, setPieSelect] = useState(prev7Days[0]);
  const [tableSelect, setTableSelect] = useState(prev7Days[0]);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [filteredInfo, setFilteredInfo] = useState({});
  const { data, loading } = useRequest(
    () => pageQueryLogs({ pageSize, page, date: tableSelect, ...filteredInfo }),
    {
      refreshDeps: [page, pageSize, tableSelect, filteredInfo],
    }
  );

  const { data: filters } = useRequest(getFilters);

  const { data: deviceNumCardData } = useRequest(getDeviceNum);

  const { data: aggressiveNumCardData } = useRequest(getAggressiveNum);

  const { data: dangerousRegionData } = useRequest(getDangerousRegion);

  const { data: lineData } = useRequest(() => getLineData(lineSelect), {
    refreshDeps: [lineSelect],
  });

  const { data: pieData } = useRequest(() => getPieData(pieSelect), {
    refreshDeps: [pieSelect],
  });

  const columns = [
    {
      title: "设备名",
      dataIndex: "name",
      filters: filters && filters.name.map((i) => ({ text: i, value: i })),
      filteredValue: filteredInfo.name || null,
    },
    {
      title: "攻击等级",
      dataIndex: "level",
      filters: [
        {
          text: "1",
          value: 1,
        },
        {
          text: "2",
          value: 2,
        },
        {
          text: "3",
          value: 3,
        },
      ],
      filteredValue: filteredInfo.level || null,
    },
    {
      title: "时间",
      dataIndex: "time",
      render: (value) => dayjs(value).format("HH:mm:ss"),
    },
    {
      title: "地点",
      dataIndex: "addr",
      filters: filters && filters.addr.map((i) => ({ text: i, value: i })),
      filteredValue: filteredInfo.addr || null,
    },
    {
      title: "特征",
      dataIndex: "feature",
      render: (feature) => <FeatureViewModal feature={feature} />,
    },
  ];

  return (
    <div className="p-8">
      <Row className="rounded-xl border-[#E6EDFF] border-[1px] border-solid w-full h-40 p-5">
        <Col span={6}>
          <AnalysisCard
            icon={<WarningOutlined className="text-[#FD8584]" />}
            title="攻击行为次数"
            {...aggressiveNumCardData}
          />
        </Col>
        <Col span={3} className="flex justify-center">
          <Divider type="vertical" className="h-full border-[#E6EDFF]" />
        </Col>
        <Col span={6}>
          <AnalysisCard
            icon={<VideoCameraOutlined className="text-[#967FF2]" />}
            title="设备数"
            {...deviceNumCardData}
          />
        </Col>
        <Col span={3} className="flex justify-center">
          <Divider type="vertical" className="h-full border-[#E6EDFF]" />
        </Col>
        <Col span={6}>
          <AnalysisCard
            icon={
              <DangerRegionModal tableData={dangerousRegionData?.tableData} />
            }
            title="高危地区数"
            {...dangerousRegionData?.cardData}
          />
        </Col>
      </Row>
      <Row className="mt-14">
        <Col
          span={15}
          className="rounded-xl border-[#E6EDFF] border-[1px] border-solid relative p-2"
        >
          <div className="absolute top-2 right-2 z-50">
            <Select
              style={{ width: 120 }}
              value={lineSelect}
              onChange={(value) => {
                setLineSelect(value);
              }}
              options={[
                { value: 7, label: "近7天" },
                { value: 3, label: "近3天" },
              ]}
            />
          </div>
          <Line data={lineData} />
        </Col>

        <Col
          span={8}
          push={1}
          className="rounded-xl border-[#E6EDFF] border-[1px] border-solid relative p-2"
        >
          <div className="absolute top-2 left-2 z-50">
            <Select
              style={{ width: 120 }}
              value={pieSelect}
              onChange={(value) => {
                setPieSelect(value);
              }}
              options={prev7Days.map((item) => ({ label: item, value: item }))}
            />
          </div>
          <Pie data={pieData} />
        </Col>
      </Row>
      <div className="mt-14 rounded-xl border-[#E6EDFF] border-[1px] border-solid p-5">
        <div className="flex">
          <div className="text-xl font-bold">攻击检测日志</div>
          <Select
            value={tableSelect}
            onChange={(value) => {
              setTableSelect(value);
            }}
            style={{ width: 120 }}
            options={prev7Days.map((item) => ({ label: item, value: item }))}
            className="ml-auto"
          />
        </div>
        <Table
          columns={columns}
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
          dataSource={data?.records}
          loading={loading}
          onChange={(_, filters) => {
            setFilteredInfo(filters);
          }}
          className="mt-4"
        />
      </div>
    </div>
  );
};

export default Analysis;
