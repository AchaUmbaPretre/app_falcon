import { useCallback, useEffect, useState } from "react";
import { message } from 'antd';
import axios from "axios";
import config from "../../../config";


export const useVehiculeData = ({searchValue}) => {
    const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [vehicule, setVehicule] = useState([]);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
          const response = await axios.get(`${DOMAIN}/vehicule`);
          setData(response.data);
        } catch (error) {
          console.error(error);
          message.error('Failed to fetch data');
        } finally {
          setLoading(false);
        }
    }, []);

    const fetchVehicule = useCallback(async () => {
        try {
          const { data } = await axios.get(`${DOMAIN}/vehicule/count?searchValue=${searchValue}`);
          setVehicule(data[0]?.nbre_vehicule);
        } catch (error) {
          console.log(error);
        }
      }, [searchValue]);

    useEffect(() => {
        fetchData();
        fetchVehicule()
    }, [fetchData, fetchVehicule, searchValue]);

    return {
        data,
        loading,
        fetchData,
        vehicule
    }
}