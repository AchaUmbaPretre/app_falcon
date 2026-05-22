import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Typography,
  message,
  Card,
  Space,
  Input,
  Spin,
  Select,
  Modal,
  Tag,
  Tooltip,
} from "antd";
import {
  CarOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
  EditOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import "./vehiculeFalcon.scss";
import { useVehiculeFalconData } from "./hooks/useVehiculeFalconData";

const { Text } = Typography;
const { confirm } = Modal;
const { Option } = Select;

const VehiculeFalcon = () => {
  const {
    loading,
    falcon,
    vehiculeAll,
    pagination,
    saving,
    editingRow,
    searchValue,
    setSearchValue,
    setPagination,
    setEditingRow,
    handleChangeVehicule,
    handleSave,
  } = useVehiculeFalconData();

  const columns = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      render: (_, __, index) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
      width: 60,
    },
    {
      title: "Capteur Falcon",
      dataIndex: "name",
      key: "name",
      render: (text) => (
        <Space>
          <CarOutlined style={{ color: "#1890ff", fontSize: 18 }} />
          <Text strong>{text}</Text>
        </Space>
      ),
    },
    {
      title: "Véhicule",
      dataIndex: "linkedVehicule",
      key: "vehicule",
      render: (linkedVehicule, record) => {
        if (editingRow === record.id) {
          return (
            <Select
              showSearch
              placeholder="Sélectionner un véhicule"
              style={{ width: 250 }}
              optionFilterProp="children"
              onChange={handleChangeVehicule}
              defaultValue={linkedVehicule?.id_vehicule || undefined}
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              {vehiculeAll.map((v) => (
                <Option key={v.id_vehicule} value={v.id_vehicule}>
                   {v.nom_vehicule}
                </Option>
              ))}
            </Select>
          );
        }

        if (linkedVehicule) {
          return (
            <Tag color="green" icon={<CheckOutlined />}>
              {linkedVehicule.nom_marque} - {linkedVehicule.immatriculation}
            </Tag>
          );
        }

        return (
          <Tag color="red" icon={<CloseOutlined />}>
            Non relié
          </Tag>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_, record) => {
        const isEditing = editingRow === record.id;
        const isLinked = !!record.linkedVehicule;

        return (
          <Space>
            {isEditing ? (
              <>
                <Tooltip title="Enregistrer la liaison">
                  <Button
                    type="primary"
                    size="small"
                    loading={saving}
                    onClick={() => handleSave(record)}
                  >
                    Enregistrer
                  </Button>
                </Tooltip>
                <Tooltip title="Annuler la modification">
                  <Button size="small" onClick={() => setEditingRow(null)}>
                    Annuler
                  </Button>
                </Tooltip>
              </>
            ) : isLinked ? (
              <Tooltip title="Modifier le véhicule relié">
                <Button
                  type="default"
                  icon={<EditOutlined />}
                  size="small"
                  onClick={() => setEditingRow(record.id)}
                >
                  Modifier
                </Button>
              </Tooltip>
            ) : (
              <Tooltip title="Ajouter un véhicule à ce capteur">
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  size="small"
                  onClick={() => setEditingRow(record.id)}
                >
                  Ajouter
                </Button>
              </Tooltip>
            )}
          </Space>
        );
      },
    },
  ];

  // Filtrer les données en fonction de la recherche
  const filteredFalcon = falcon.filter((item) =>
    item.name?.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <Card
      title="Relier un véhicule Falcon"
      className="relierFalconCard pro-card"
      bordered
    >
      {loading ? (
        <div style={{height:'100%', width:'100%', margin:0, display:'flex', alignItems:'center', justifyContent:'center'}}>
          <Spin tip="Chargement..." size="large" />
        </div>
      ) : (
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <Input.Search
            placeholder="Rechercher un capteur Falcon..."
            allowClear
            onChange={(e) => setSearchValue(e.target.value)}
            style={{ width: 350 }}
            enterButton
          />

          <Table
            columns={columns}
            dataSource={filteredFalcon}
            rowKey="id"
            bordered
            size="middle"
            pagination={{
              ...pagination,
              total: filteredFalcon.length,
              onChange: (page, pageSize) => setPagination({ current: page, pageSize }),
            }}
            rowClassName={(record) =>
              editingRow === record.id ? "selected-row pro-row" : ""
            }
          />
        </Space>
      )}
    </Card>
  );
};

export default VehiculeFalcon;