import {
  PlusCircleOutlined,
  SwapOutlined,
  ToolOutlined,
  SafetyCertificateOutlined,
  ReloadOutlined,
  AppstoreAddOutlined,
} from '@ant-design/icons';


export const getOperationIcon = (id) => {
  switch (id) {
    case 1:
      return <PlusCircleOutlined />;
    case 2:
      return <SwapOutlined />;
    case 3:
      return <ToolOutlined />;
    case 4:
      return <SafetyCertificateOutlined />;
    case 5:
      return <ReloadOutlined />;
    default:
      return <AppstoreAddOutlined />;
  }
};
