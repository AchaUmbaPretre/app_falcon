import { useCallback, useEffect, useState } from "react";
import config from "../../../../config";
import axios from "axios";

export const useVehiculeFormData = () => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;

  const [isLoading, setIsLoading] = useState(false);
  const [marque, setMarque] = useState([]);
  const [client, setClient] = useState([]);
  const [modele, setModele] = useState([]);
  const [IdMarque, setIdMarque] = useState("");

  // 🔹 Récupération des marques
  const fetchMarques = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get(`${DOMAIN}/vehicule/marque`);
      setMarque(data);
    } catch (error) {
      console.error("Erreur fetchMarques:", error);
    } finally {
      setIsLoading(false);
    }
  }, [DOMAIN]);

  // 🔹 Récupération des clients
  const fetchClients = useCallback(async () => {
    try {
      const { data } = await axios.get(`${DOMAIN}/client`);
      setClient(data);
    } catch (error) {
      console.error("Erreur fetchClients:", error);
    }
  }, [DOMAIN]);

  // 🔹 Récupération des modèles selon marque
  const fetchModeles = useCallback(async () => {
    if (!IdMarque) {
      setModele([]);
      return;
    }

    try {
      setIsLoading(true);
      const { data } = await axios.get(
        `${DOMAIN}/vehicule/modele?id_marque=${IdMarque}`
      );
      setModele(data);
    } catch (error) {
      console.error("Erreur fetchModeles:", error);
    } finally {
      setIsLoading(false);
    }
  }, [DOMAIN, IdMarque]);

  // 🔹 Chargement initial
  useEffect(() => {
    fetchMarques();
    fetchClients();
  }, [fetchMarques, fetchClients]);

  // 🔹 Rechargement modèles si marque change
  useEffect(() => {
    fetchModeles();
  }, [fetchModeles]);

  return {
    isLoading,
    marque,
    client,
    modele,
    setIdMarque,
  };
};
