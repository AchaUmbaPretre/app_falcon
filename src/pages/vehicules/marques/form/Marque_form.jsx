import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Form,
  Input,
  Button,
  Card,
  Modal,
  Typography,
  notification,
} from "antd";
import { CarOutlined, TagOutlined } from "@ant-design/icons";
import config from "../../../../config";

const { Title, Text } = Typography;

const MarqueForm = () => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [formValues, setFormValues] = useState({});

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

      await axios.post(`${DOMAIN}/vehicule/marque`, formValues);

      notification.success({
        message: "Succès",
        description: "Marque créée avec succès",
      });

      navigate("/marques");
      window.location.reload();
    } catch (err) {
      notification.error({
        message: "Erreur",
        description:
          err.response?.data?.message ||
          `La marque ${formValues.nom_marque} existe déjà`,
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
          <CarOutlined /> Nouvelle Marque
        </Title>
        <Text type="secondary">
          Enregistrer une nouvelle marque véhicule
        </Text>

        <Card
          type="inner"
          title={
            <>
              <TagOutlined /> Informations
            </>
          }
          style={{ marginTop: 24 }}
        >
          <Form
            layout="vertical"
            form={form}
            onFinish={handleSubmit}
            autoComplete="off"
          >
            <Form.Item
              label="Nom de la marque"
              name="nom_marque"
              rules={[
                { required: true, message: "Champ obligatoire" },
              ]}
            >
              <Input
                placeholder="Entrez une nouvelle marque..."
                size="large"
              />
            </Form.Item>

            <Form.Item style={{ marginTop: 20 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                size="large"
              >
                Enregistrer
              </Button>
            </Form.Item>
          </Form>
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
        <p>Voulez-vous enregistrer cette marque ?</p>
        <p>
          <strong>Marque :</strong> {formValues.nom_marque}
        </p>
      </Modal>
    </>
  );
};

export default MarqueForm;