import React, { Component } from "react";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import Slider from "react-slick";
import { FormattedMessage } from "react-intl";
import { fetchTopDoctorHome } from "../../../services/doctorService";
import { LANGUAGES } from "../../../utils";
class OutstandingDoctor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      arrDoctors: [],
    };
  }

  componentDidMount() {
    this.getTopDoctor(10);
  }

  getTopDoctor = async (limit) => {
    try {
      let res = await fetchTopDoctorHome(limit);
      if (res && +res.EC === 0) {
        this.setState({
          arrDoctors: res.DT,
        });
      } else {
        console.log(res.EM);
      }
    } catch (error) {
      console.log(error);
    }
  };

  handleViewDetailDoctor = (doctor) => {
    if (this.props.history) {
      this.props.history.push(`/detail-doctor/${doctor.id}`);
    }
  };

  render() {
    let { arrDoctors } = this.state;
    let { language } = this.props;
    return (
      <div className="section-share section-outstanding-doctor">
        <div className="section-container">
          <div className="section-header">
            <span className="title-section">
              <FormattedMessage id="homepage.outstanding-doctor" />
            </span>
            <button className="btn-section">
              <FormattedMessage id="homepage.more-info" />
            </button>
          </div>
          <div className="section-body">
            <Slider {...this.props.settings}>
              {arrDoctors &&
                arrDoctors.length > 0 &&
                arrDoctors.map((item, index) => {
                  let imageBase64 = "";
                  //ảnh lưu xuống DB đã encode sang base64
                  //nên phải decode để có ảnh
                  if (item.image) {
                    imageBase64 = item.image;

                  }
                  let nameVi = `Bác sĩ ${item.username}`;
                  let nameEn = `Doctor ${item.username}`;
                  return (
                    <div
                      key={index}
                      className="section-customize"
                      onClick={() => {
                        this.handleViewDetailDoctor(item);
                      }}
                    >
                      <div className="customize-border">
                        <div className="outer-bg">
                          <div
                            className="bg-image section-outstanding-doctor"
                            style={{ backgroundImage: `url(${imageBase64})` }}
                          ></div>
                        </div>
                        <div className="position text-center">
                          <div className="outstanding-doctor-text">
                            {language === LANGUAGES.VI ? nameVi : nameEn}
                          </div>
                          <div>Cơ xương khớp</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </Slider>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    language: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(OutstandingDoctor)
);
