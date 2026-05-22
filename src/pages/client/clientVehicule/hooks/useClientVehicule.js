import { useEffect, useState } from "react"
import { getVehiculeClientById } from "../../../../services/vehicules.service";


export const useClientVehicule = (id_client) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);


    const fetchData = async () => {
        try {
            const res = await getVehiculeClientById(id_client)
            setData(res.data)
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData()
    }, [id_client])

    return {
        data, 
        loading
    }
}