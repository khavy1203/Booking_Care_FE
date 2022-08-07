import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import Slider from "react-slick";
import "./Specialty.scss";
import { withRouter } from "react-router";
import { fetchTopSpecialtyHome } from "../../../services/specialtyService";
import { LANGUAGES } from "../../../utils";
import { Link } from "react-router-dom";

class Specialty extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSpecialty: [],
    };
  }

  async componentDidMount() {
    await this.getTopSpecialty(10);
  }

  getTopSpecialty = async (limit) => {
    try {
      let res = await fetchTopSpecialtyHome(limit);
      if (res && +res.EC === 0) {
        this.setState({
          dataSpecialty: res.DT,
        });
        console.log("top specialty data", this.state.dataSpecialty);
      } else {
        console.log(res.EM);
      }
    } catch (error) {
      console.log(error);
    }
  };

  handleViewDetailSpecialty = (specialty) => {
    if (this.props.history) {
      this.props.history.push(`/doctorall-page`);

      //this.props.history.push(`/detail-specialty/${specialty.id}`);
    }
  };

  render() {
    let { dataSpecialty } = this.state;
    let { language } = this.props;
    //console.log("check state", dataSpecialty);
    return (
      <div className="section-share section-specialty">
        <div className="section-container">
          <div className="section-header">
            <span className="title-section">
              <FormattedMessage id={"homepage.specialty-popular"} />
            </span>
            <button className="btn-section">
              <Link
                to="/doctorall-page"
                style={{ textDecoration: "none", color: "black" }}
              >
                <FormattedMessage id={"homepage.more-info"} />{" "}
              </Link>
            </button>
          </div>
          <div className="section-body">
            <Slider {...this.props.settings}>
              {dataSpecialty &&
                dataSpecialty.length > 0 &&
                dataSpecialty.map((item, index) => {
                  return (
                    <div
                      key={index}
                      className="section-customize specialty-child"
                      onClick={() => {
                        this.handleViewDetailSpecialty(item);
                      }}
                    >
                      <div
                        className="bg-image section-specialty"
                        style={{ backgroundImage: `url(${item.image})` }}
                      ></div>
                      <div className="specialty-name">
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
    isLoggedIn: state.user.isLoggedIn,
    language: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Specialty)
);
