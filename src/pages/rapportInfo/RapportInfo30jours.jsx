import clientImg from './../../assets/clients.png'
import operationImg from './../../assets/operation.png'
import traceurImg from './../../assets/traceur.png'
import vehiculeImg from './../../assets/vehicule.png'
import { useEffect, useState } from 'react'
import config from '../../config'
import axios from 'axios'
import CountUp from 'react-countup';
import { useNavigate } from 'react-router-dom'
import { Skeleton } from 'antd'

const RapportInfo30jours = ({ period }) => {
    const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
    const [client, setClient] = useState(null);
    const [operation, setOperation] = useState(null);
    const [traceur, setTraceur] = useState(null);
    const [vehicule, setVehicule] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchClient = async () => {
            try {
                const { data } = await axios.get(`${DOMAIN}/client/count30jours`);
                setClient(data[0].nbre_client);
            } catch (error) {
                console.log(error);
            }
        };const fetchOperation = async () => {
            try {
                const { data } = await axios.get(`${DOMAIN}/operation/count30jours`);
                setOperation(data[0].nbre_operation);
            } catch (error) {
                console.log(error);
            }
        };
        
        const fetchTraceur = async () => {
            try {
                const { data } = await axios.get(`${DOMAIN}/traceur/count30jours`);
                setTraceur(data[0].nbre_traceur);
            } catch (error) {
                console.log(error);
            }
        };
        const fetchVehicule = async () => {
            try {
                const { data } = await axios.get(`${DOMAIN}/vehicule/count30jours`);
                setVehicule(data[0].nbre_vehicule);
            } catch (error) {
                console.log(error);
            }
        };

        const fetchData = async () => {
            await Promise.all([fetchClient(), fetchOperation(), fetchTraceur(), fetchVehicule()]);
            setLoading(false);
        };

        fetchData();
    }, [DOMAIN]);
  

    return (
        <div className="pageViews">
            <div className="pageViews_rows">
                <div className="pageViews_row" onClick={() => navigate(`/clientRapport?period=${period}`)}>
                    <div className="pageViews_left">
                        <div className="pageViews_left_rond">
                            <span className="page_rond"></span>
                            <h5 className='pageViews_h5'>CLIENT</h5>
                        </div>
                        <h1 className="pageViews_h1">
                            {loading ? <Skeleton.Input active /> : <CountUp end={client} />}
                        </h1>
                        <span className='pageViews_span'>Nombre de client</span>
                    </div>
                    <div className="pageViews_right">
                        <img src={clientImg} alt="" className="pageViews_right_img" />
                    </div>
                </div>
                <div className="pageViews_row" onClick={() => navigate(`/operationRapport?period=${period}`)}>
                    <div className="pageViews_left">
                        <div className="pageViews_left_rond">
                            <span className="page_rondOp"></span>
                            <h5 className='pageViews_h5'>OPERATION</h5>
                        </div>
                        <h1 className="pageViews_h1">
                            {loading ? <Skeleton.Input active /> : <CountUp end={operation} />}
                        </h1>
                        <span className='pageViews_span'>Nombre d'opération</span>
                    </div>
                    <div className="pageViews_right">
                        <img src={operationImg} alt="" className="pageViews_right_img" />
                    </div>
                </div>
                <div className="pageViews_row" onClick={() => navigate(`/traceurRapport?period=${period}`)}>
                    <div className="pageViews_left">
                        <div className="pageViews_left_rond">
                            <span className="page_rondTr"></span>
                            <h5 className='pageViews_h5'>TRACEUR</h5>
                        </div>
                        <h1 className="pageViews_h1">
                            {loading ? <Skeleton.Input active /> : <CountUp end={traceur} />}
                        </h1>
                        <span className='pageViews_span'>Nombre de traceur</span>
                    </div>
                    <div className="pageViews_right">
                        <img src={traceurImg} alt="" className="pageViews_right_img" />
                    </div>
                </div>
                <div className="pageViews_row" onClick={() => navigate(`/vehiculeRapport?period=${period}`)}>
                    <div className="pageViews_left">
                        <div className="pageViews_left_rond">
                            <span className="page_rondV"></span>
                            <h5 className='pageViews_h5'>VEHICULE</h5>
                        </div>
                        <h1 className="pageViews_h1">
                            {loading ? <Skeleton.Input active /> : <CountUp end={vehicule} />}
                        </h1>
                        <span className='pageViews_span'>Nombre de vehicule</span>
                    </div>
                    <div className="pageViews_right">
                        <img src={vehiculeImg} alt="" className="pageViews_right_img" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RapportInfo30jours;
