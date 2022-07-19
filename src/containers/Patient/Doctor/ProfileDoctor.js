//video 83
//component hiển thị mô tả ngắn về bác sĩ
import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import "./ProfileDoctor.scss";
import { fetchInfoDoctorModal } from "../../../services/doctorService";
import { _ } from "lodash";
import { dateFormat, LANGUAGES } from "../../../utils";
import { Link } from "react-router-dom";
import moment from "moment";
class ProfileDoctor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataProfile: {},
    };
  }

  async componentDidMount() {
    let id = this.props.doctorId;
    if (id) {
      let data = await this.getInfoDoctor(id);
      // console.log("profileDoctor, data", data);
      this.setState({
        dataProfile: data,
      });
      // console.log("profileDoctor", this.state.dataProfile);
    }
  }

  getInfoDoctor = async (id) => {
    try {
      let result = {};
      if (id) {
        let res = await fetchInfoDoctorModal(id);
        if (res && +res.EC === 0) {
          result = res.DT;
        } else {
          console.log(res.EM);
        }
      }
      return result;
    } catch (error) {
      console.log(error);
    }
  };

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.language === prevProps.language) {
    }
    if (this.props.doctorId !== prevProps.doctorId) {
      // let data = await this.getInfoDoctor(this.props.doctorId);
      // this.setState({
      //   dataProfile: data,
      // });
    }
  }
  renderTimeBooking = (schedule) => {
    // console.log("schedule", schedule);
    let { language } = this.props;
    // let date =
    //   language === LANGUAGES.VI
    //     ? //chia cho 1000 vi chenh lech don vi. moment don vi la mili sec, con unix dung sec
    //       moment.unix(+schedule.date / 1000).format("dddd - DD/MM/YYYY")
    //     : moment
    //         .unix(+schedule.date / 1000)
    //         .locale("en")
    //         .format("ddd - MM/DD/YYYY");
    //convert chuỗi date sang kiểu DATE
    let getDate = moment(schedule.date, dateFormat.SEND_TO_SERVER)._d;
    let date =
      language === LANGUAGES.VI
        ? moment(getDate).locale("vi").format("dddd - DD/MM/YYYY")
        : moment(getDate).locale("en").format("ddd - MM/DD/YYYY");
    if (schedule) {
      return (
        <>
          <div>
            {language === LANGUAGES.VI
              ? schedule.Timeframe.nameVI
              : schedule.Timeframe.nameEN}{" "}
            - {date}
          </div>
          <div>
            <FormattedMessage id="patient.booking-modal.priceBooking" />
          </div>
        </>
      );
    }
    return <></>;
  };

  render() {
    let { dataProfile } = this.state;
    let {
      isShowLinkDetail,
      isShowPrice,
      doctorId,
      language,
      isShowDescriptionDoctor,
      selectedSchedule,
    } = this.props;
    console.log(
      "selectedSchedule",
      moment(selectedSchedule.date, dateFormat.SEND_TO_SERVER)._d
    );

    let nameVi = "",
      nameEn = "";
    if (dataProfile && dataProfile.Group) {
      nameVi = `${dataProfile.Group.name} ${dataProfile.username}`;
      nameEn = `${dataProfile.Group.name} ${dataProfile.username}`;
    }
    return (
      <div className="profile-doctor-container">
        <div className="intro-doctor">
          <div
            className="content-left"
            style={{
              backgroundImage: `url(${dataProfile && dataProfile.image ? dataProfile.image : ""
                })`,
            }}
          ></div>
          <div className="content-right">
            <div className="up">
              {language === LANGUAGES.VI ? nameVi : nameEn}
            </div>
            <div className="down">
              {isShowDescriptionDoctor === true ? (
                <>
                  <span>
                    Fugiat nulla ut ipsum cillum esse ullamco in est in eiusmod.
                    Nostrud ad est minim aliqua irure sit aliqua. Cillum est
                    cillum proident ullamco minim aliquip cupidatat anim
                    voluptate sint cillum proident sit. Incididunt sit fugiat
                    sint dolor adipisicing. Fugiat est commodo amet enim tempor
                    esse pariatur quis nostrud velit in tempor elit. Ad fugiat
                    adipisicing eu aute eiusmod aute voluptate culpa aute
                    ullamco. Voluptate aliquip duis veniam enim proident est
                    Lorem in culpa incididunt pariatur ipsum amet. Tempor anim
                    laboris reprehenderit proident. Mollit labore in do ea quis
                    reprehenderit ea Lorem ex. Aute elit fugiat est officia
                    minim incididunt sunt.
                  </span>
                </>
              ) : (
                <>{this.renderTimeBooking(selectedSchedule)}</>
              )}
            </div>
          </div>
        </div>
        {isShowLinkDetail === true && (
          <div className="view-detail-doctor">
            <Link to={`/detail-doctor/${doctorId}`}>Xem thêm</Link>
          </div>
        )}
        {isShowPrice === true && (
          <div className="price">
            <FormattedMessage id="patient.booking-modal.price" /> 500.000VND
          </div>
        )}
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

export default connect(mapStateToProps, mapDispatchToProps)(ProfileDoctor);
