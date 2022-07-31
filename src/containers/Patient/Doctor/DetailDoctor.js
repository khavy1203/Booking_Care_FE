//Component trang chi tiết bác sĩ
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import HomeHeader from "../../HomePage/HomeHeader";
import "./DetailDoctor.scss";
import DoctorSchedule from "./DoctorSchedule";
import DoctorExtraInfo from "./DoctorExtraInfo";
import { fetchInfoDoctor } from "../../../services/doctorService";
// import { fetchSchedule } from "../../../services/scheduleService";
import { LANGUAGES } from "../../../utils";
class DetailDoctor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detailDoctor: {},
      currentDoctorId: -1,

      doctorName: "",
      doctorImage: "",

      //Thông tin bác sĩ
      degree_VI: "",
      degree_EN: "",
      introductionVI: "",
      doctorDes_VI: "",

      introductionEN: "",
      doctorDes_EN: "",
    };
  }
  async componentDidMount() {
    //điều kiện để ứng dụng ko bao giờ chết
    if (
      this.props.match &&
      this.props.match.params &&
      this.props.match.params.id
    ) {
      let id = this.props.match.params.id;
      this.setState({
        currentDoctorId: id,
      });
      this.loadInfoDoctor(id);
    }
  }

  loadInfoDoctor = async (id) => {
    try {
      let res = await fetchInfoDoctor(id);
      if (res && +res.EC === 0) {
        this.setState({
          detailDoctor: res.DT,

          doctorName: res.DT.username,
          doctorImage: res.DT.image,

          introductionVI: res.DT.Doctorinfo.introductionVI,
          introductionEN: res.DT.Doctorinfo.introductionEN,
          degree_VI: res.DT.Doctorinfo.degree_VI,
          degree_EN: res.DT.Doctorinfo.degree_EN,

          doctorDes_VI: res.DT.Doctorinfo.descriptionHTLM_VI,
          doctorDes_EN: res.DT.Doctorinfo.descriptionHTLM_EN,

          specialtyVI: res.DT.Specialty.nameVI,
          specialtyEN: res.DT.Specialty.nameEN,
        });
        console.log("detailDoctor", this.state.detailDoctor);
      } else {
        console.log(res.EM);
      }
    } catch (error) {
      console.log(error);
    }
  };

  componentDidUpdate(prevProps, prevState, snapshot) {}

  render() {
    let {
      detailDoctor,

      doctorName,
      doctorImage,

      introductionVI,
      introductionEN,
      degree_VI,
      degree_EN,

      doctorDes_VI,
      doctorDes_EN,
    } = this.state;
    let { language } = this.props;
    let nameVi = `${degree_VI} ${doctorName}`;
    let nameEn = `${degree_EN} ${doctorName}`;
    return (
      <Fragment>
        <HomeHeader isShowBanner={false} />
        <div className="doctor-detail-container">
          <div className="intro-doctor">
            <div
              className="content-left"
              style={{
                backgroundImage: `url(${doctorImage})`,
              }}
            ></div>
            <div className="content-right">
              <div className="up">
                {language === LANGUAGES.VI ? nameVi : nameEn}
              </div>
              <div className="down">
                <span>
                  {language === LANGUAGES.VI ? introductionVI : introductionEN}
                </span>
              </div>
            </div>
          </div>
          <div className="schedule-doctor">
            <div className="content-left">
              <DoctorSchedule DetailDoctor={detailDoctor} />
            </div>
            <div className="content-right">
              <DoctorExtraInfo DetailDoctor={detailDoctor} />
            </div>
          </div>
          {doctorDes_VI || doctorDes_EN ? (
            <>
              <div className="detail-info-doctor">
                <div
                  dangerouslySetInnerHTML={{
                    __html:
                      language === LANGUAGES.VI ? doctorDes_VI : doctorDes_EN,
                  }}
                ></div>
              </div>
            </>
          ) : (
            <></>
          )}

          <div className="comment-doctor">comment-doctor</div>
        </div>
      </Fragment>
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailDoctor);
