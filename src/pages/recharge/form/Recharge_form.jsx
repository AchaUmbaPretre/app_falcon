import './recharge_form.scss';
import iconClient from './../../../assets/custome.png';
import config from '../../../config';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { SearchOutlined } from '@ant-design/icons';
import { Skeleton } from 'antd'; // Import Skeleton from Ant Design

function Recharge_form() {
    const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
    const [client, setClient] = useState([]);
    const navigate = useNavigate();
    const [searchValue, setSearchValue] = useState('');
    const [loading, setLoading] = useState(true); // State to manage loading

    useEffect(() => {
        const fetchData = async () => {
          try {
            const { data } = await axios.get(`${DOMAIN}/recharge/rechargerClient`);
            setClient(data);
          } catch (error) {
            console.log(error);
          } finally {
            setLoading(false); // Set loading to false after data is fetched
          }
        };
        fetchData();
      }, [DOMAIN]);

      const filteredData = client?.filter((item) => 
        item.nom_client?.toLowerCase().includes(searchValue.toLowerCase())
      );

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
                {loading ? (
                    <div className="skeleton-container">
                        {[...Array(5)].map((_, index) => (
                            <Skeleton key={index} active avatar paragraph={{ rows: 1 }} />
                        ))}
                    </div>
                ) : (
                    filteredData.length > 0 ? (
                        <div className="recharge_form_rows">
                            {filteredData.map(dd => (
                                <div className="recharge_form_row" key={dd.id_client} onClick={() => navigate(`/rechargeOne?id_client=${dd.id_client}`)}>
                                    <img src={iconClient} alt="" className="recharge_img" />
                                    <div className="recharge_form_bottom">
                                        <span className="recharge_span">Nom : {dd.nom_client}</span>
                                        <span className="recharge_span">Actif : {dd.nbre_actif}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div>Aucun client trouvé</div>
                    )
                )}
            </div>
        </div>
    </>
  );
}

export default Recharge_form;
