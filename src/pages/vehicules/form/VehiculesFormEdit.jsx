import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react'
import config from '../../../config';
import { message } from 'antd';

const VehiculesFormEdit = ({id, onClose, onSave}) => {
    const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchData = useCallback(async () => {
        setLoading(true);

        try {
            const response = await axios.get(`${DOMAIN}/vehicule/one`, {params:{id_vehicule: id}})
            setData(response.data)
        } catch (error) {
            console.error(error);
            message.error('Failed to fetch data');
        }
    }, [id]);

    useEffect(()=> {
        fetchData()
    }, [])

  return (
    <>
        aaaaaa
    </>
  )
}

export default VehiculesFormEdit