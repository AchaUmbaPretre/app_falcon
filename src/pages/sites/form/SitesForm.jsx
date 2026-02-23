import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Form,
  Input,
  Button,
  Card,
  Modal,
  Typography,
  Select,
  notification,
  Spin,
} from "antd";
import { EnvironmentOutlined, UserOutlined } from "@ant-design/icons";
import config from "../../../config";

const { Title, Text } = Typography;
const { Option } = Select;

const SitesForm = ({ onClose, onRefresh }) => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [formValues, setFormValues] = useState({});

  /* ===============================
     FETCH CLIENTS
  =============================== */

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const { data } = await axios.get(`${DOMAIN}/client`);
        setClients(data);
      } catch (error) {
        notification.error({
          message: "Erreur",
          description: "Impossible de charger les clients",
        });
      }
    };

    fetchClients();
  }, [DOMAIN]);

  /* ===============================
     SUBMIT
  =============================== */

  const handleSubmit = (values) => {
    setFormValues(values);
    setModalVisible(true);
  };

  const handleConfirm = async () => {
    try {
      setLoading(true);

      await axios.post(`${DOMAIN}/operation/site`, formValues);

      notification.success({
        message: "Succès",
        description: "Site créé avec succès",
      });
      onRefresh?.()
      onClose?.()
      navigate("/sites");
    } catch (err) {
      notification.error({
        message: "Erreur",
        description:
          err.response?.data?.message ||
          "Une erreur est survenue lors de la création",
      });
    } finally {
      setLoading(false);
      setModalVisible(false);
    }
  };

  return (
    <>
      <Card bordered>
        <Title level={4}>
          <EnvironmentOutlined /> Nouveau Site
        </Title>
        <Text type="secondary">
          Enregistrer un nouveau site client
        </Text>

        <Card
          type="inner"
          title={
            <>
              <UserOutlined /> Informations du site
            </>
          }
          style={{ marginTop: 24 }}
        >
          <Spin spinning={loading}>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              autoComplete="off"
            >
              {/* NOM SITE */}
              <Form.Item
                label="Nom du site"
                name="nom_site"
                rules={[
                  { required: true, message: "Champ obligatoire" },
                ]}
              >
                <Input size="large" placeholder="Entrez le nom du site..." />
              </Form.Item>

              {/* CLIENT */}
              <Form.Item
                label="Client ou société"
                name="id_client"
                rules={[
                  { required: true, message: "Sélection obligatoire" },
                ]}
              >
                <Select
                  size="large"
                  placeholder="Sélectionnez un client..."
                  showSearch
                  optionFilterProp="children"
                >
                  {clients.map((client) => (
                    <Option
                      key={client.id_client}
                      value={client.id_client}
                    >
                      {client.nom_client}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item style={{ marginTop: 20 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  loading={loading}
                >
                  Enregistrer
                </Button>
              </Form.Item>
            </Form>
          </Spin>
        </Card>
      </Card>

      {/* ============================
         MODAL CONFIRMATION
      ============================ */}

      <Modal
        title="Confirmer l'enregistrement"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleConfirm}
        confirmLoading={loading}
        okText="Confirmer"
        cancelText="Annuler"
      >
        <p>Voulez-vous enregistrer ce site ?</p>
        <p>
          <strong>Nom :</strong> {formValues.nom_site}
        </p>
      </Modal>
    </>
  );
};

export default SitesForm;