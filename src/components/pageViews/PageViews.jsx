import './pageViews.scss'
import clientImg from './../../assets/clients.png'
import operationImg from './../../assets/operation.png'
import traceurImg from './../../assets/traceur.png'
import vehiculeImg from './../../assets/vehicule.png'
import { useEffect, useState } from 'react'
import config from '../../config'
import axios from 'axios'

const PageViews = () => {
    const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
    const [client, setClient] = useState('');
    const [operation, setOperation] = useState('');
    const [traceur, setTraceur] = useState('');
    const [vehicule, setVehicule] = useState('');
    const [loading, setLoading] = useState('');

    useEffect(() => {
        const fetchClient = async () => {
          try {
            const { data } = await axios.get(`${DOMAIN}/client/count`);
            setClient(data[0].nbre_client);
          } catch (error) {
            console.log(error);
          }
        };
        fetchClient();
    }, [DOMAIN]);

    useEffect(() => {
        const fetchOperation = async () => {
          try {
            const { data } = await axios.get(`${DOMAIN}/operation/count`);
            setOperation(data[0].nbre_operation);
          } catch (error) {
            console.log(error);
          }
        };
        fetchOperation();
    }, [DOMAIN]);

    useEffect(() => {
        const fetchTraceur = async () => {
          try {
            const { data } = await axios.get(`${DOMAIN}/traceur/count`);
            setTraceur(data[0].nbre_traceur);
          } catch (error) {
            console.log(error);
          }
        };
        fetchTraceur();
    }, [DOMAIN]);

    useEffect(() => {
        const fetchVehicule = async () => {
          try {
            const { data } = await axios.get(`${DOMAIN}/vehicule/count`);
            setVehicule(data[0].nbre_vehicule);
          } catch (error) {
            console.log(error);
          }
        };
        fetchVehicule();
    }, [DOMAIN]);

  return (
    <>
        <div className="pageViews">
            <div className="pageViews_rows">
                <div className="pageViews_row">
                    <div className="pageViews_left">
                        <div className="pageViews_left_rond">
                            <span className="page_rond"></span>
                            <h5 className='pageViews_h5'>CLIENT</h5>
                        </div>
                        <h1 className="pageViews_h1">{client}</h1>
                        <span className='pageViews_span'>Nombre de client</span>
                    </div>
                    <div className="pageViews_right">
                        <img src={clientImg} alt="" className="pageViews_right_img" />
                    </div>
                </div>
                <div className="pageViews_row">
                    <div className="pageViews_left">
                        <div className="pageViews_left_rond">
                            <span className="page_rond"></span>
                            <h5 className='pageViews_h5'>OPERATION</h5>
                        </div>
                        <h1 className="pageViews_h1">{operation}</h1>
                        <span className='pageViews_span'>Nombre d'opération</span>
                    </div>
                    <div className="pageViews_right">
                        <img src={operationImg} alt="" className="pageViews_right_img" />
                    </div>
                </div>
                <div className="pageViews_row">
                    <div className="pageViews_left">
                        <div className="pageViews_left_rond">
                            <span className="page_rond"></span>
                            <h5 className='pageViews_h5'>TRACEUR</h5>
                        </div>
                        <h1 className="pageViews_h1">{traceur}</h1>
                        <span className='pageViews_span'>Nombre de traceur</span>
                    </div>
                    <div className="pageViews_right">
                        <img src={traceurImg} alt="" className="pageViews_right_img" />
                    </div>
                </div>
                <div className="pageViews_row">
                    <div className="pageViews_left">
                        <div className="pageViews_left_rond">
                            <span className="page_rond"></span>
                            <h5 className='pageViews_h5'>VEHICULE</h5>
                        </div>
                        <h1 className="pageViews_h1">{vehicule}</h1>
                        <span className='pageViews_span'>Nombre de vehicule</span>
                    </div>
                    <div className="pageViews_right">
                        <img src={vehiculeImg} alt="" className="pageViews_right_img" />
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}

export default PageViews