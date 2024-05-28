import './recharge_form.scss'
import iconClient from './../../../assets/client_row.png'
import config from '../../../config';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { SearchOutlined } from '@ant-design/icons';

function Recharge_form() {
    const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
    const [client, setClient] = useState([]);
    const navigate = useNavigate();
    const [searchValue, setSearchValue] = useState('');

    useEffect(() => {
        const fetchData = async () => {
          try {
            const { data } = await axios.get(`${DOMAIN}/recharge/rechargerClient`);
            setClient(data);
          } catch (error) {
            console.log(error);
          }
        };
        fetchData();
      }, [DOMAIN]);

      const filteredData = client?.filter((item) => 
        item.nom_client?.toLowerCase().includes(searchValue.toLowerCase())
      )

  return (
    <>
        <div className="recharge_form">
            <div className="recharge_form_wrapper">
                <div className="recharge_title_rows">
                    <h2 className="recharge_client_title">LISTE DES CLIENTS A RECHARGER</h2>
                    <div className="recharge_row_search">
                        <SearchOutlined className='product-icon-plus' />
                        <input type="search" name="" id=""  value={searchValue} onChange={(e) => setSearchValue(e.target.value)}  placeholder='Recherche...' className='product-search' />
                    </div>
                </div>
                <div className="recharge_form_rows">
                {filteredData.map(dd => (
                    <div className="recharge_form_row" onClick={()=> navigate(`/rechargeOne?id_client=${dd.id_client}`)}>
                        <img src={iconClient} alt="" className="recharge_img" />
                        <div className="recharge_form_bottom">
                            <span className="recharge_span">Nom : {dd.nom_client}</span>
                            <span className="recharge_span">Actif : {dd.nbre_actif}</span>
                        </div>
                    </div>
                ))}
                </div>
            </div>
        </div>
    </>
  )
}

export default Recharge_form