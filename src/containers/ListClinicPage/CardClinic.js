import React, { Component } from "react";
// import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import HomeHeader from "../HomePage/HomeHeader";

import HomeFooter from "../HomePage/HomeFooter";
import "./ListClinicPage.scss";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import * as actions from "../../store/actions";
import {
    FcOvertime, FcVoicemail, FcTabletAndroid, FcShare
} from "react-icons/fc";
require("dotenv").config();

class CardClinic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            clinicData: {},

        };

    }
    componentDidMount() {

    }



    // key = {`row-${index}`
    // id = { item.id }
    // nameVI = { item.nameVI }
    // nameEN = { item.nameEN }
    // addressVI = { item.addressVI }
    // addressEN = { item.addressEN }
    // img = { item.image }
    // email = { item.Users['email'] }
    // phoneContact = { item.phoneContact }

    render() {
        // let { nameProvince, nameDistrict, nameWard } = this.props;
        return (
            <>
                <div key={this.props.key} className="Clinic_clinic_wrapper__2TMPG">
                    <div className="Clinic_banner__2D8B_">
                        <img
                            alt="dont have img"
                            src={this.props.img}
                            className="Image_wrapper__18WCY"
                        />
                    </div>
                    <div className="Clinic_summary__1JSae">
                        <div className="Clinic_top__27iif">
                            <a
                                href="/tra-cuu/phong-kham/d1573a07-5cec-4697-9b5f-8b6bf1993437"
                                className="Clinic_title__36l72"
                                draggable="false"
                            >
                                {this.props.nameVI}
                            </a>
                            <div className="Clinic_address__4NF8S">
                                {`${this.props.addressVI} -${this.props.nameWard}  - ${this.props.nameDistrict} - ${this.props.nameProvince}  `}
                            </div>
                        </div>
                        <div className="Clinic_bottom__1TFQL">
                            <div className="Clinic_specialist_name__LGHp5" />
                            <div className="Clinic_button__3OXHf">
                                <a
                                    target="_blank"
                                    rel="noreferrer"
                                    href={`https://www.facebook.com/sharer/sharer.php?u=${process.env.REACT_APP_URL}/${this.props.nameEN}`}
                                    className="Clinic_share__1yg0X"
                                    draggable="false"
                                >
                                    <FcShare
                                        className="Image_wrapper__18WCY"
                                        value={{ height: '16px', width: '15px', marginRight: '10px' }}
                                    />
                                    <span>Chia s???</span>
                                </a>
                                <a
                                    href={`/doctor-page/${this.props.id}`}
                                    className="Clinic_btn_detail__2spys"
                                    draggable="false"
                                >
                                    Xem chi ti???t
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="Clinic_about_clinic__Dss8k">
                        <div className="Clinic_item__ZdsU7">
                            <div className="Clinic_label__1WuN_">
                                <FcTabletAndroid
                                    className="Image_wrapper__18WCY"
                                    value={{ height: '16px', width: '15px', marginRight: '10px' }}
                                />
                                <span>??i???n tho???i:</span>
                            </div>
                            <div className="Clinic_text__2Kkr7">{this.props.phoneContact}</div>
                        </div>
                        <div className="Clinic_item__ZdsU7">
                            <div className="Clinic_label__1WuN_">
                                <FcVoicemail
                                    className="Image_wrapper__18WCY"
                                    value={{ height: '16px', width: '15px' }}
                                />
                                <span>Email:</span>
                            </div>
                            <div className="Clinic_text__2Kkr7">{this.props.email}</div>
                        </div>
                        <div className="Clinic_item__ZdsU7">
                            <div className="Clinic_label__1WuN_">

                                <FcOvertime
                                    className="Image_wrapper__18WCY"
                                    value={{ height: '16px', width: '15px' }}
                                />
                                <span>Gi??? l??m vi???c:</span>
                            </div>
                            <div className="Clinic_text__2Kkr7">
                                {this.props.email.timework ? this.props.email.timework : `T??? th??? hai ?????n th??? b???y: t??? 04h00 ?????n 19h00. Ch??? nh???t: t??? 04h00 ?????n
                                 12h00.`}

                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.user.isLoggedIn,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        userlogOut: () => dispatch(actions.userlogOut()),
        userloginSuccess: (userInfo) =>
            dispatch(actions.userloginSuccess(userInfo)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CardClinic);
