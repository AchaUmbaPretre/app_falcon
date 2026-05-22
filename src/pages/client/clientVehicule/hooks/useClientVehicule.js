import { useEffect, useMemo, useState } from "react";
import { getVehiculeClientById } from "../../../../services/vehicules.service";
import { getConnectivity, getFalcon } from "../../../../services/eventService.service";
import moment from "moment";
import { notification } from "antd";

export const useClientVehicule = (id_client) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [falcon, setFalcon] = useState([]);
    const [reportData, setReportData] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [dateRange, setDateRange] = useState([moment().startOf('day'), moment().endOf('day')]);

    const fetchData = async () => {
        try {
            setLoading(true);
            
            const [falconRes] = await Promise.all([
                getFalcon()
            ]);
            
            setFalcon(falconRes.data?.[0]?.items || falconRes.data || []);
            
            const res = await getVehiculeClientById(id_client);
            setData(res.data || []);
            
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchDataRapport = async () => {
        setLoading(true);
        try {
        const params = {
            startDate: dateRange[0].format('YYYY-MM-DD HH:mm:ss'),
            endDate: dateRange[1].format('YYYY-MM-DD HH:mm:ss'),
        };
        const { data } = await getConnectivity(params);
        setReportData(data);
        } catch (err) {
        notification.error({
            message: 'Erreur de chargement',
            description: "Impossible de récupérer les données du rapport",
        });
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => { fetchDataRapport()}, [dateRange]);

    useEffect(() => {
        if (id_client) {
            fetchData();
        }
    }, [id_client]);

    const mergedCourses = useMemo(() => {
        return data.map((c) => {
            const capteur = reportData.find((f) => f.device_id === c.id_falcon);
            return { ...c, capteurInfo: capteur || null };
        });
    }, [data, falcon]);


    return {
        data: mergedCourses,
        loading,
        mergedCourses
    };
};