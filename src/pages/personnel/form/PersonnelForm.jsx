import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Form,
  Input,
  Button,
  Card,
  Select,
  Modal,
  Spin,
  notification,
  Typography,
} from "antd";
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from "@ant-design/icons";
import config from "../../../config";

const { Title } = Typography;
const { Option } = Select;

const PersonnelForm = ({fetchData, onClose}) => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [formValues, setFormValues] = useState({});

  const roles = ["admin", "secretaire", "superviseur", "technicien"];

  const handleSubmit = (values) => {
    setFormValues(values);
    setModalVisible(true);
  };

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await axios.post(`${DOMAIN}/users/register`, formValues);
      notification.success({
        message: "Succès",
        description: "Personnel enregistré avec succès",
      });
      setModalVisible(false);
      fetchData?.()
      onClose?.()
      navigate("/personnel");
    } catch (err) {
      notification.error({
        message: "Erreur",
        description:
          err.response?.data?.message || "Erreur lors de l'enregistrement",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card bordered>
        <Title level={4}>
          <UserOutlined /> Nouveau Personnel
        </Title>
        <Card
          type="inner"
          title="Informations du personnel"
          style={{ marginTop: 24 }}
        >
          <Spin spinning={loading}>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              autoComplete="off"
            >
              <Form.Item
                label="Nom complet"
                name="username"
                rules={[{ required: true, message: "Champ obligatoire" }]}
              >
                <Input size="large" placeholder="Entrez le nom complet" />
              </Form.Item>

              <Form.Item
                label="Rôle"
                name="role"
                rules={[{ required: true, message: "Sélection obligatoire" }]}
              >
                <Select size="large" placeholder="Sélectionnez un rôle">
                  {roles.map((role) => (
                    <Option key={role} value={role}>
                      {role}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="Téléphone"
                name="telephone"
                rules={[{ required: true, message: "Champ obligatoire" }]}
              >
                <Input
                  size="large"
                  placeholder="Entrez le numéro de téléphone"
                  prefix={<PhoneOutlined />}
                />
              </Form.Item>

              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Champ obligatoire" },
                  { type: "email", message: "Email invalide" },
                ]}
              >
                <Input size="large" placeholder="Entrez l'email" prefix={<MailOutlined />} />
              </Form.Item>

              <Form.Item
                label="Mot de passe"
                name="password"
                rules={[{ required: true, message: "Champ obligatoire" }]}
              >
                <Input.Password
                  size="large"
                  placeholder="Entrez un mot de passe"
                  prefix={<LockOutlined />}
                />
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

      <Modal
        title="Confirmer l'enregistrement"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleConfirm}
        confirmLoading={loading}
        okText="Confirmer"
        cancelText="Annuler"
      >
        <p>Voulez-vous enregistrer ce personnel avec les informations suivantes ?</p>
        <ul>
          <li><strong>Nom :</strong> {formValues.username}</li>
          <li><strong>Rôle :</strong> {formValues.role}</li>
          <li><strong>Téléphone :</strong> {formValues.telephone}</li>
          <li><strong>Email :</strong> {formValues.email}</li>
        </ul>
      </Modal>
    </>
  );
};

export default PersonnelForm;