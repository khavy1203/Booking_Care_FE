import React, { Component } from "react";
// import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import Slider from "react-slick";
import { LANGUAGES } from "../../../utils";
import { fetchTopClinicHome } from "../.././../services/clinicService";
import "./MedicalFacility.scss";
import { withRouter } from "react-router";
class MedicalFacility extends Component {
  constructor(props) {
    super(props);
    this.state = {
      arrClinics: [],
    };
  }

  componentDidMount() {
    this.getTopClinic(10);
  }

  getTopClinic = async (limit) => {
    try {
      let res = await fetchTopClinicHome(limit);
      if (res && +res.EC === 0) {
        this.setState({
          arrClinics: res.DT,
        });
      } else {
        console.log(res.EM);
      }
    } catch (error) {
      console.log(error);
    }
  };

  handleViewDetailClinic = (clinic) => {
    if (this.props.history) {
      this.props.history.push(`/doctor-page/${clinic.id}`);
    }
  };

  render() {
    let { language } = this.props;
    let { arrClinics } = this.state;
    return (
      <div className="section-share section-medical-facility">
        <div className="section-container">
          <div className="section-header">
            <span className="title-section">Cơ sở y tế nổi bật</span>
            <button className="btn-section">
              <Link
                to="/clinic-page"
                style={{ textDecoration: "none", color: "black" }}
              >
                Xem thêm
              </Link>
            </button>
          </div>
          <div className="section-body">
            <Slider {...this.props.settings}>
              {arrClinics &&
                arrClinics.length > 0 &&
                arrClinics.map((item, index) => {
                  return (
                    <div
                      key={index}
                      className="section-customize clinic-child"
                      onClick={() => {
                        this.handleViewDetailClinic(item);
                      }}
                    >
                      <div
                        className="bg-image section-medical-facility"
                        style={{ backgroundImage: `url(${item.image})` }}
                      ></div>
                      <div className="clinic-name">
                        {language === LANGUAGES.VI ? item.nameVI : item.nameEN}
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
    language: state.app.language,
    isLoggedIn: state.user.isLoggedIn,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(MedicalFacility)
);
