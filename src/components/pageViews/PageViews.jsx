import './pageViews.scss'
import clientImg from './../../assets/clients.png'
import operationImg from './../../assets/operation.png'
import traceurImg from './../../assets/traceur.png'
import vehiculeImg from './../../assets/vehicule.png'

const PageViews = () => {

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
                        <h1 className="pageViews_h1">100</h1>
                        <span className='pageViews_span'>No additional income</span>
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
                        <h1 className="pageViews_h1">100</h1>
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
                        <h1 className="pageViews_h1">100</h1>
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
                        <h1 className="pageViews_h1">100</h1>
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