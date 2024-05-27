import './recharge_form.scss'
import iconClient from './../../../assets/client_row.png'

function Recharge_form() {
  return (
    <>
        <div className="recharge_form">
            <div className="recharge_form_wrapper">
                <h2 className="recharge_client">Liste de clients</h2>
                <div className="recharge_form_rows">
                    <div className="recharge_form_row">
                        <img src={iconClient} alt="" className="recharge_img" />
                        <div className="recharge_form_bottom">
                            <span className="recharge_span">Nom : Acha</span>
                            <span className="recharge_span">Nombre de numero actif : Acha</span>
                        </div>
                    </div>
                    <div className="recharge_form_row">
                        <img src={iconClient} alt="" className="recharge_img" />
                        <div className="recharge_form_bottom">
                            <span className="recharge_span">Nom : Acha</span>
                            <span className="recharge_span">Nbre de numero actif : Acha</span>
                        </div>
                    </div>
                    <div className="recharge_form_row">
                        <img src={iconClient} alt="" className="recharge_img" />
                        <div className="recharge_form_bottom">
                            <span className="recharge_span">Nom : Acha</span>
                            <span className="recharge_span">Nbre de numero actif : Acha</span>
                        </div>
                    </div>
                    <div className="recharge_form_row">
                        <img src={iconClient} alt="" className="recharge_img" />
                        <div className="recharge_form_bottom">
                            <span className="recharge_span">Nom : Acha</span>
                            <span className="recharge_span">Nbre de numero actif : Acha</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}

export default Recharge_form