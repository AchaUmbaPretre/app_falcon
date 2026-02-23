import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Form,
  Input,
  Button,
  Card,
  Row,
  Col,
  Modal,
  Spin,
  Typography,
  notification,
} from "antd";
import {
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  HomeOutlined,
  IdcardOutlined,
} from "@ant-design/icons";
import config from "../../../config";

const { Title, Text } = Typography;

const ClientForm = () => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [formValues, setFormValues] = useState({});

  /* ==============================
     SUBMIT
  ============================== */

  const handleSubmit = async (values) => {
    setFormValues(values);
    setModalVisible(true);
  };

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await axios.post(`${DOMAIN}/client/client`, formValues);

      notification.success({
        message: "Succès",
        description: "Client créé avec succès",
      });

      navigate("/client");
      window.location.reload();
    } catch (err) {
      notification.error({
        message: "Erreur",
        description:
          err.response?.data?.error || "Erreur lors de la création",
      });
    } finally {
      setLoading(false);
      setModalVisible(false);
    }
  };

  return (
    <>
      <Card bordered>
        <Title level={4}>👤 Nouveau Client</Title>
        <Text type="secondary">Créer un nouveau client</Text>

        <Card style={{ marginTop: 24 }} type="inner" title="Informations générales">
          <Form
            layout="vertical"
            form={form}
            onFinish={handleSubmit}
            autoComplete="off"
          >
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Nom du client"
                  name="nom_client"
                  rules={[{ required: true, message: "Champ obligatoire" }]}
                >
                  <Input prefix={<UserOutlined />} />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  label="Nom principal"
                  name="nom_principal"
                >
                  <Input prefix={<IdcardOutlined />} />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  label="Poste"
                  name="poste"
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  label="Téléphone"
                  name="telephone"
                  rules={[{ required: true, message: "Champ obligatoire" }]}
                >
                  <Input prefix={<PhoneOutlined />} />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  label="Adresse"
                  name="adresse"
                >
                  <Input prefix={<HomeOutlined />} />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    { type: "email", message: "Email invalide" },
                  ]}
                >
                  <Input prefix={<MailOutlined />} />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item style={{ marginTop: 24 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
              >
                Enregistrer
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Card>

      {/* ==============================
         MODAL CONFIRMATION
      ============================== */}

      <Modal
        title="Confirmer l'enregistrement"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleConfirm}
        confirmLoading={loading}
        okText="Confirmer"
        cancelText="Annuler"
      >
        <p>Voulez-vous enregistrer ces informations ?</p>
        <ul>
          <li><strong>Nom :</strong> {formValues.nom_client}</li>
          <li><strong>Principal :</strong> {formValues.nom_principal}</li>
          <li><strong>Poste :</strong> {formValues.poste}</li>
          <li><strong>Téléphone :</strong> {formValues.telephone}</li>
          <li><strong>Adresse :</strong> {formValues.adresse}</li>
          <li><strong>Email :</strong> {formValues.email}</li>
        </ul>
      </Modal>
    </>
  );
};

export default ClientForm;