import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import Slider from "react-slick";
import "./Specialty.scss";
import { withRouter } from "react-router";
//import api here

class Specialty extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSpecialty: [],
    };
  }

  async componentDidMount() {
    //fetch api here
  }

  handleViewDetailSpecialty = (specialty) => {
    specialty = { id: 1 };
    if (this.props.history) {
      this.props.history.push(`/detail-specialty/${specialty.id}`);
    }
  };

  render() {
    return (
      <div className="section-share section-specialty">
        <div className="section-container">
          <div className="section-header">
            <span className="title-section">
              <FormattedMessage id={"homepage.specialty-popular"} />
            </span>
            <button className="btn-section">
              <FormattedMessage id={"homepage.more-info"} />
            </button>
          </div>
          <div className="section-body">
            <Slider {...this.props.settings}>
              <div
                className="section-customize specialty-child"
                onClick={() => {
                  this.handleViewDetailSpecialty();
                }}
              >
                <div className="bg-image section-specialty"></div>
                <div className="specialty-name">cơ xương khớp Nhấp vào đây</div>
              </div>
              <div className="section-customize">
                <div className="bg-image section-specialty"></div>
                <div>cơ xương khớp 2</div>
              </div>
              <div className="section-customize">
                <div className="bg-image section-specialty"></div>
                <div>cơ xương khớp 3</div>
              </div>
              <div className="section-customize">
                <div className="bg-image section-specialty"></div>
                <div>cơ xương khớp 4</div>
              </div>
              <div className="section-customize">
                <div className="bg-image section-specialty"></div>
                <div>cơ xương khớp 5</div>
              </div>
              <div className="section-customize">
                <div className="bg-image section-specialty"></div>
                <div>cơ xương khớp 6</div>
              </div>
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
