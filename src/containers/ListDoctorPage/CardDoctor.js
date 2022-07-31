import React, { Component } from "react";
// import { Redirect } from "react-router-dom";
import { connect } from "react-redux";

import "../ListClinicPage/ListClinicPage.scss"
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import * as actions from "../../store/actions";
import {
    FcOvertime, FcVoicemail, FcTabletAndroid, FcShare, FcMoneyTransfer
} from "react-icons/fc";
require("dotenv").config();

class CardDoctor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            clinicData: {},

        };
    }
    componentDidMount() {

    }


    render() {
        let { lstProvince, lstDistrict, lstWard } = this.props;
        console.log("check props>>> ", this.props)
        return (
            <>
                <div key={this.props.key} className="Clinic_clinic_wrapper__2TMPG">
                    <div className="Clinic_banner__2D8B_">
                        <img
                            alt="dont have img"
                            src={this.props.image}
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
                                {this.props.username}
                            </a>
                            <div className="Clinic_address__4NF8S">
                                Bác sĩ : {this.props.degree_VI ? this.props.degree_VI : "Chưa cập nhật thông tin cá nhân"}
                            </div>
                        </div>

                        <div className="Clinic_bottom__1TFQL">
                            <div className="Clinic_specialist__N6xa3">{this.props.namespecial}</div>
                            <div className="Clinic_specialist_name__LGHp5" />
                            <div className="Clinic_button__3OXHf">
                                <a
                                    target="_blank"
                                    rel="noreferrer"
                                    href="https://www.facebook.com/sharer/sharer.php?u=https://edoctor.io/tra-cuu/phong-kham/trung-tam-y-khoa-medic-hoa-hao"
                                    className="Clinic_share__1yg0X"
                                    draggable="false"
                                >
                                    <FcShare />
                                    <span>Chia sẻ</span>
                                </a>
                                <a
                                    href={`/detail-doctor/${this.props.id}`}
                                    className="Clinic_btn_detail__2spys"
                                    draggable="false"
                                >
                                    Xem chi tiết
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
                                <span>Điện thoại:</span>
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

                                <FcMoneyTransfer
                                    className="Image_wrapper__18WCY"
                                    value={{ height: '16px', width: '15px' }}
                                />
                                <span>Giá khám:</span>
                            </div>
                            <div className="Clinic_text__2Kkr7">
                                {this.props.price?.toLocaleString('en-US', { style: 'currency', currency: 'VND' })}
                            </div>
                        </div>
                        <div className="Clinic_item__ZdsU7">
                            <div className="Clinic_label__1WuN_">

                                <FcOvertime
                                    className="Image_wrapper__18WCY"
                                    value={{ height: '16px', width: '15px' }}
                                />
                                <span>Giờ làm việc:</span>
                            </div>
                            <div className="Clinic_text__2Kkr7">
                                Từ thứ hai đến thứ bảy: từ 04h00 đến 19h00. Chủ nhật: từ 04h00 đến
                                12h00.
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

export default connect(mapStateToProps, mapDispatchToProps)(CardDoctor);
