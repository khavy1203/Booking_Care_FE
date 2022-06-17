//video 83
//component hiển thị mô tả ngắn về bác sĩ
import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import "./ProfileDoctor.scss";
import { fetchInfoDoctorModal } from "../../../services/doctorService";
import { _ } from "lodash";
import { LANGUAGES } from "../../../utils";
import { Link } from "react-router-dom";
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
      console.log("profileDoctor, data", data);
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

  render() {
    // let {dataProfile, isShowLinkDetail, isShowPrice} = this.state

    let { dataProfile } = this.state;
    let {
      isShowLinkDetail,
      isShowPrice,
      doctorId,
      language,
      isShowDescriptionDoctor,
    } = this.props;
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
              backgroundImage: `url(${
                dataProfile && dataProfile.image ? dataProfile.image : ""
              })`,
            }}
          ></div>
          <div className="content-right">
            <div className="up">
              {language === LANGUAGES.VI ? nameVi : nameEn}
            </div>
            <div className="down">
              {isShowDescriptionDoctor === true && (
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
          <div className="price">Giá khám 500.000VND</div>
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
