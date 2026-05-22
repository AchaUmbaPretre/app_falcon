import { useEffect, useState } from "react";
import { message, Modal } from 'antd';
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { getFalcon } from "../../../../services/eventService.service";
import { getVehicule, putRelierVehiculeFalcon } from "../../../../services/vehicules.service";

export const useVehiculeFalconData = () => {
  const [loading, setLoading] = useState(true);
  const [falcon, setFalcon] = useState([]);
  const [vehiculeAll, setVehiculeAll] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [searchValue, setSearchValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [selectedVehicule, setSelectedVehicule] = useState(null);

  const fetchDataAll = async () => {
    try {
      setLoading(true);
      const [falconRes, vehiculeRes] = await Promise.all([
        getFalcon(),
        getVehicule(),
      ]);

      const falconList = falconRes.data?.[0]?.items || falconRes.data || [];
      const vehiculeList = vehiculeRes.data.data || vehiculeRes.data || [];

      const merged = falconList.map((f) => {
        // Chercher le véhicule qui est lié à ce capteur via id_falcon
        const linkedVehicule = vehiculeList.find(
          (v) => Number(v.id_falcon) === Number(f.id)
        );
        return {
          ...f,
          linkedVehicule: linkedVehicule
            ? {
                id_vehicule: linkedVehicule.id_vehicule,
                immatriculation: linkedVehicule.matricule,
                nom_marque: linkedVehicule.nom_vehicule || linkedVehicule.nom_marque,
              }
            : null,
        };
      });

      setFalcon(merged);
      setVehiculeAll(vehiculeList);
    } catch (error) {
      console.error(error);
      message.error("Erreur lors du chargement des données Falcon/Véhicules");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDataAll();
  }, []);

  const handleChangeVehicule = (id_vehicule) => {
    setSelectedVehicule(id_vehicule);
  };

  const handleSave = async (record) => {
    if (!selectedVehicule) {
      message.warning("Veuillez sélectionner un véhicule.");
      return;
    }

    const vehiculeSelectionne = vehiculeAll.find(
      (v) => v.id_vehicule === selectedVehicule
    );

    Modal.confirm({
      title: "Confirmer la liaison",
      icon: <ExclamationCircleOutlined />,
      content: (
        <span>
          Voulez-vous relier le capteur <strong>{record.name}</strong> au véhicule{" "}
          <strong>
            {vehiculeSelectionne?.matricule || vehiculeSelectionne?.nom_vehicule}
          </strong>
          ?
        </span>
      ),
      okText: "Oui",
      cancelText: "Annuler",
      async onOk() {
        try {
          setSaving(true);

          await putRelierVehiculeFalcon(selectedVehicule, {
            id_falcon: record.id,
            name_falcon: record.name,
          });
          message.success("Véhicule relié/modifié avec succès !");
          await fetchDataAll();
          setEditingRow(null);
          setSelectedVehicule(null);
        } catch (error) {
          console.error(error);
          message.error("Erreur lors du reliement.");
        } finally {
          setSaving(false);
        }
      },
    });
  };

  return {
    loading,
    falcon,
    vehiculeAll,
    pagination,
    saving,
    editingRow,
    selectedVehicule,
    searchValue,
    setSearchValue,
    setPagination,
    setEditingRow,
    handleChangeVehicule,
    handleSave,
  };
};