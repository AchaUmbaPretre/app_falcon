import { useCallback, useEffect, useState } from "react"
import { getFalcon } from "../../../../services/eventService.service";
import { notification } from "antd";

export const usePositionData = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);


    const load = useCallback(
    async () => {
      setLoading(true);
      try {
        const res = await getFalcon();
        setData(res?.data[0].items || []);
      } catch (err) {
        notification.error({
          message: "Erreur de chargement",
          description: "Impossible de récupérer les données carburant.",
          placement: "topRight",
        });
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    load();
  }, [load]);

  return {
    data,
    loading
  }
}