//video 82, 93
import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import "./DetailSpecialty.scss";
import HomeHeader from "../../HomePage/HomeHeader";
import DoctorSchedule from "../Doctor/DoctorSchedule";
import DoctorExtraInfo from "../Doctor/DoctorExtraInfo";
import ProfileDoctor from "../Doctor/ProfileDoctor";

class DetailSpecialty extends Component {
  constructor(props) {
    super(props);
    this.state = {
      arrDoctorId: [44, 45, 46],
    };
  }
  componentDidMount() {}

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.language === prevProps.language) {
    }
  }

  handleOnchangeselect = (event) => {};

  render() {
    let { arrDoctorId } = this.state;
    return (
      <div className="detail-specialty-container">
        <HomeHeader />
        <div className="detail-specialty-body">
          <div className="description-specialty">
            <div>Mô tả chuyên khoa</div>
            Ullamco qui exercitation amet veniam. Aute tempor tempor nulla
            commodo dolor voluptate nostrud ex. Exercitation aliqua Lorem ipsum
            reprehenderit ad amet fugiat non dolore culpa eiusmod reprehenderit
            duis laboris.
          </div>

          <div className="search-sp-doctor">
            <select>
              <option
                onClick={(event) => {
                  this.handleOnchangeselect(event);
                }}
              >
                1
              </option>
              <option>2</option>
              <option>3</option>
            </select>
          </div>
          {arrDoctorId &&
            arrDoctorId.length > 0 &&
            arrDoctorId.map((item, index) => {
              return (
                <div className="each-doctor" key={index}>
                  <div className="dt-content-left">
                    <div className="profile-doctor">
                      <ProfileDoctor
                        doctorId={item}
                        isShowDescriptionDoctor={true}
                        isShowLinkDetail={true}
                        isShowPrice={false}
                      />
                    </div>
                  </div>
                  <div className="dt-content-right">
                    <div className="doctor-schedule">
                      <div className="doctor-schedule-container">
                        <DoctorSchedule doctorIdFromParent={item} />
                      </div>
                    </div>
                    <div className="doctor-extra-info">
                      <div className="doctor-extra-info-container">
                        <DoctorExtraInfo doctorIdFromParent={item} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailSpecialty);
