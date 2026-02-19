import {
  UserOutlined,
  ClusterOutlined,
  CarOutlined,
  FileTextOutlined,
  HourglassOutlined,
  UsergroupAddOutlined,
  DollarOutlined,
  FileOutlined,
  HomeOutlined,
  ToolOutlined,
  SettingOutlined,
  AuditOutlined
} from '@ant-design/icons';

 export const getMenuIcon = (icon) => {
    switch (icon) {
      case 'UserOutlined':
        return <UserOutlined style={{ fontSize: '16px', color:'#2c8faaff' }} />;
      case 'ClusterOutlined':
        return <ClusterOutlined style={{ fontSize: '16px', color:'#2c8faaff' }} />;
      case 'CarOutlined':
        return <CarOutlined style={{ fontSize: '16px', color:'#2c8faaff' }} />;
      case 'FileTextOutlined':
        return <FileTextOutlined style={{ fontSize: '16px', color:'#2c8faaff' }} />;
      case 'HourglassOutlined':
        return <HourglassOutlined style={{ fontSize: '16px', color:'#2c8faaff' }} />;
      case 'UsergroupAddOutlined':
        return <UsergroupAddOutlined style={{ fontSize: '16px', color:'#2c8faaff' }} />;
      case 'DollarOutlined':
        return <DollarOutlined style={{ fontSize: '16px', color:'#2c8faaff' }} />;
      case 'FileOutlined':
        return <FileOutlined style={{ fontSize: '16px', color:'#2c8faaff' }} />;
      case 'HomeOutlined':
        return <HomeOutlined style={{ fontSize: '16px', color:'#2c8faaff' }} />;
      case 'ToolOutlined':
        return <ToolOutlined style={{ fontSize: '16px', color:'#2c8faaff' }} />;
      case 'SettingOutlined':
        return <SettingOutlined style={{ fontSize: '16px', color:'#2c8faaff' }} />;
      case 'AuditOutlined':
        return <AuditOutlined style={{ fontSize: '16px', color:'#2c8faaff' }} />;
      default:
        return null;
    }
  };