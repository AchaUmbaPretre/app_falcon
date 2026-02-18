import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import config from "../../../config";
import {
  message,
  Form,
  Input,
  Select,
  Button,
  Spin,
  Card,
  Row,
  Col,
  Progress,
  Typography,
  Space,
} from "antd";
import { useVehiculeFormData } from "./hooks/useVehiculeFormData";

const { Title } = Typography;

const VehiculesFormEdit = ({ id, onClose, onSave }) => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [vehiculeData, setVehiculeData] = useState(null);

  const { marque, client, modele, setIdMarque } = useVehiculeFormData();

  /* ======================================================
     🔹 FETCH VEHICULE DATA
  ====================================================== */
  const fetchData = useCallback(async () => {
    if (!id) return;

    setLoading(true);

    try {
      const { data } = await axios.get(`${DOMAIN}/vehicule/one`, {
        params: { id_vehicule: id },
      });

      if (data && data.length > 0) {
        const vehicule = data[0];
        setVehiculeData(vehicule);

        if (vehicule.id_marque) {
          setIdMarque(vehicule.id_marque);
        }
      }
    } catch (error) {
      console.error(error);
      message.error("Erreur lors du chargement du véhicule");
    } finally {
      setLoading(false);
    }
  }, [id, DOMAIN, setIdMarque]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /* ======================================================
     🔹 Synchronisation Form après chargement modèle
  ====================================================== */
  useEffect(() => {
    if (vehiculeData && modele.length > 0) {
      form.setFieldsValue(vehiculeData);
    }
  }, [vehiculeData, modele, form]);

  /* ======================================================
     🔹 SUBMIT UPDATE
  ====================================================== */
  const handleSubmit = async (values) => {
    try {
      setLoading(true);

      await axios.put(`${DOMAIN}/vehicule/update`, {
        id_vehicule: id,
        ...values,
      });

      message.success("Véhicule modifié avec succès");

      if (onSave) onSave();
      if (onClose) onClose();
    } catch (error) {
      console.error(error);
      message.error("Erreur lors de la modification");
    } finally {
      setLoading(false);
    }
  };

  /* ======================================================
     🔹 Progress calcul (UI professionnel)
  ====================================================== */
  const filledFields = Object.values(form.getFieldsValue()).filter(
    (v) => v !== undefined && v !== null && v !== ""
  ).length;

  const progressPercent = Math.round((filledFields / 6) * 100);

  /* ======================================================
     🔹 RENDER
  ====================================================== */
  return (
    <Spin spinning={loading}>
      <Card
        bordered={false}
        style={{
          borderRadius: 12,
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        }}
      >
        <Title level={4} style={{ marginBottom: 10 }}>
          Modification du Véhicule
        </Title>

        <Progress
          percent={progressPercent}
          size="small"
          style={{ marginBottom: 25 }}
        />

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Nom du véhicule"
                name="nom_vehicule"
                rules={[{ required: true, message: "Champ obligatoire" }]}
              >
                <Input size="large" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="Matricule"
                name="matricule"
              >
                <Input size="large" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="Marque"
                name="id_marque"
                rules={[{ required: true, message: "Champ obligatoire" }]}
              >
                <Select
                  size="large"
                  placeholder="Sélectionner une marque"
                  onChange={(value) => {
                    form.setFieldValue("id_modele", undefined);
                    setIdMarque(value);
                  }}
                  options={marque.map((m) => ({
                    label: m.nom_marque,
                    value: m.id_marque,
                  }))}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="Modèle"
                name="id_modele"
                rules={[{ required: true, message: "Champ obligatoire" }]}
              >
                <Select
                  size="large"
                  placeholder="Sélectionner un modèle"
                  disabled={!form.getFieldValue("id_marque")}
                  options={modele.map((m) => ({
                    label: m.modele,
                    value: m.id_modele,
                  }))}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="Client"
                name="id_client"
              >
                <Select
                  size="large"
                  placeholder="Sélectionner un client"
                  allowClear
                  options={client.map((c) => ({
                    label: c.nom_client,
                    value: c.id_client,
                  }))}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="Code"
                name="code"
              >
                <Input size="large" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item style={{ marginTop: 20 }}>
            <Space style={{ width: "100%", justifyContent: "flex-end" }}>
              <Button onClick={onClose} size="large">
                Annuler
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
              >
                Modifier
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </Spin>
  );
};

export default VehiculesFormEdit;
