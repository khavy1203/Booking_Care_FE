//video 83
//component hiển thị mô tả ngắn về bác sĩ
import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import "./ProfileDoctor.scss";
import { getProfileDoctorById } from "../../../services/userService";
import { _ } from "lodash";
import { LANGUAGES } from "../../../utils";

class ProfileDoctor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataProfile: {},
    };
  }

  async componentDidMount() {
    //Mở khi có api
    //let data = await this.getInfoDoctor(this.props.doctorId);
    // this.setState({
    //   dataProfile: data,
    // });
  }

  getInfoDoctor = async (id) => {
    //Mở khi có api
    // let result = {};
    // if (id) {
    //   let res = await getProfileDoctorById(id);
    //   if (res && res.errCode === 0) {
    //     result = res.data;
    //   }
    // }
    // return result;
  };

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.language === prevProps.language) {
    }
    if (this.props.doctorId !== prevProps.doctorId) {
      //   this.getInfoDoctor(this.props.doctorId);
    }
  }

  render() {
    // let {dataProfile} = this.state
    // let nameVi='', nameEn='';
    // if(dataProfile && dataProfile.positionData){
    //     nameVi = `${dataProfile.positionData.valueVi}, ${dataProfile.lastName}`
    //     nameEn = `${dataProfile.positionData.valueEn}, ${dataProfile.FirstName}`

    // }
    return (
      <div className="profile-doctor-container">
        <div className="intro-doctor">
          <div className="content-left"></div>
          <div className="content-right">
            <div className="up">Phó giáo sư nguyen van a</div>
            <div className="down">
              <span>Duis excepteur tempor dolor nulla esse laborum sit.</span>
            </div>
          </div>
          {/* <div
          className="content-left"
          style={{
            backgroundImage: `url(${
              dataProfile && dataProfile.image ? dataProfile.image : ""
            })`,
          }}
        ></div>
        <div className="content-right">
          <div className="up">
            {(language = LANGUAGES.VI ? nameVi : nameEn)}
          </div>
          <div className="down">
            {dataProfile &&
              dataProfile.Markdown &&
              dataProfile.Markdown.description && (
                <span>dataProfile.Markdown.description</span>
              )}
          </div>
        </div> */}
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

export default connect(mapStateToProps, mapDispatchToProps)(ProfileDoctor);
