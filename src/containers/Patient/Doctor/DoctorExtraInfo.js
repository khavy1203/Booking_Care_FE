//video 82
import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import "./DoctorExtraInfo.scss";
import { LANGUAGES } from "../../../utils";

class DoctorExtraInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowDetailInfo: false,

      //Thông tin phòng khám
      clinicName_VI: "",
      addressVI: "",
      clinicName_EN: "",
      addressEN: "",
      timework: "",
      provinceId: "",
      districtId: "",
      wardId: "",

      //thông tin chuyên khoa
      specialtyEN: "",
      specialtyVI: "",

      noteVI: "",
      paymentVI: "",
      noteEN: "",
      paymentEN: "",
      price: "",

      lstWard: [],
      lstDistrict: [],
      lstProvince: [],

      province: "",
      district: "",
      ward: "",
    };
  }
  componentDidMount() {}

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.language === prevProps.language) {
    }
    if (this.props.DetailDoctor !== prevProps.DetailDoctor) {
      let { DetailDoctor } = this.props;
      this.setState({
        noteVI: DetailDoctor.Doctorinfo.noteVI,
        paymentVI: DetailDoctor.Doctorinfo.paymentVI,
        noteEN: DetailDoctor.Doctorinfo.noteEN,
        paymentEN: DetailDoctor.Doctorinfo.paymentEN,
        price: DetailDoctor.Doctorinfo.price,
        clinicName_VI: DetailDoctor.Clinic.nameVI,
        addressVI: DetailDoctor.Clinic.addressVI,
        clinicName_EN: DetailDoctor.Clinic.nameEN,
        addressEN: DetailDoctor.Clinic.addressEN,
        timework: DetailDoctor.Clinic.timework,
        provinceId: DetailDoctor.Clinic.provinceId,
        districtId: DetailDoctor.Clinic.districtId,
        wardId: DetailDoctor.Clinic.wardId,
      });
    }
  }

  fetchProvince = () => {
    fetch("https://provinces.open-api.vn/api/", {
      method: "GET", // or 'PUT'
    })
      .then((response) => response.json())
      .then((actualData) => {
        this.setState({
          lstProvince: actualData,
        });
      })
      .catch((err) => {
        console.log(err.message);
      })
      .finally(() => {
        // setLoading(false);
      });
  };

  fetchDistrict = () => {
    fetch("https://provinces.open-api.vn/api/d", {
      method: "GET", // or 'PUT'
    })
      .then((response) => response.json())
      .then((actualData) => {
        console.log("check actual Data", actualData);
        let lstDistrictOfProvince = actualData.filter(
          (item) => item.province_code === +this.state.clinicData.provinceId
        );
        this.setState({ lstDistrict: lstDistrictOfProvince });
      })
      .catch((err) => {
        console.log(err.message);
      })
      .finally(() => {
        // setLoading(false);
      });
  };

  fetchWard = () => {
    fetch("https://provinces.open-api.vn/api/w", {
      method: "GET", // or 'PUT'
    })
      .then((response) => response.json())
      .then((actualData) => {
        console.log("check actual Data", actualData);
        let lstWardOfDistrict = actualData.filter(
          (item) => item.district_code === +this.state.clinicData.districtId
        );
        this.setState({ lstWard: lstWardOfDistrict });
      })
      .catch((err) => {
        console.log(err.message);
      })
      .finally(() => {
        // setLoading(false);
      });
  };

  showHideDetailInfo = (status) => {
    this.setState({
      isShowDetailInfo: status,
    });
  };

  render() {
    let { language } = this.props;
    let {
      isShowDetailInfo,
      //Thông tin phòng khám
      clinicName_VI,
      addressVI,
      clinicName_EN,
      addressEN,
      timework,
      provinceId,
      districtId,
      wardId,

      noteVI,
      paymentVI,
      noteEN,
      paymentEN,
      price,
    } = this.state;

    //console.log(this.state);

    return (
      <div className="doctor-extra-info-container">
        <div className="content-up">
          <div className="text-address">ĐỊA CHỈ KHÁM</div>
          <div className="name-clinic">
            {language === LANGUAGES.VI ? clinicName_VI : clinicName_EN}
          </div>
          <div className="detail-adress">
            {language === LANGUAGES.VI ? addressVI : addressEN}
          </div>
        </div>
        <div className="content-down">
          {isShowDetailInfo === false && (
            <div className="short-info">
              GIÁ KHÁM: {price}đ.{" "}
              <span
                onClick={() => {
                  this.showHideDetailInfo(true);
                }}
              >
                Xem chi tiết
              </span>
            </div>
          )}

          {isShowDetailInfo === true && (
            <>
              <div className="title-price">GIÁ KHÁM:</div>
              <div className="detail-info">
                <div className="price">
                  <span className="left">Giá khám</span>
                  <span className="right">{price}đ</span>
                </div>
                <div className="note">
                  {language === LANGUAGES.VI ? noteVI : noteEN}
                </div>
              </div>

              <div className="payment">
                {language === LANGUAGES.VI ? paymentVI : paymentEN}
              </div>
              <div className="hide-price">
                <span
                  onClick={() => {
                    this.showHideDetailInfo(false);
                  }}
                >
                  Ẩn bảng giá
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(DoctorExtraInfo);
