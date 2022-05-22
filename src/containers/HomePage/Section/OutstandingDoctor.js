import React, { Component } from "react";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import Slider from "react-slick";

class OutstandingDoctor extends Component {
  handleViewDetailDoctor = (doctor) => {
    doctor = { id: 1 };
    if (this.props.history) {
      this.props.history.push(`/detail-doctor/${doctor.id}`);
    }
  };
  render() {
    return (
      <div className="section-share section-outstanding-doctor">
        <div className="section-container">
          <div className="section-header">
            <span className="title-section">Bác sĩ nổi bật tuần qua</span>
            <button className="btn-section">Xem thêm</button>
          </div>
          <div className="section-body">
            <Slider {...this.props.settings}>
              {/* nhớ truyền item vào handleViewDetailDoctor*/}
              <div
                className="section-customize"
                onClick={() => {
                  this.handleViewDetailDoctor();
                }}
              >
                <div className="customize-border">
                  <div className="outer-bg">
                    <div className="bg-image section-outstanding-doctor"></div>
                  </div>
                  <div className="position text-center">
                    <div className="">Giáo sư, Tiến sĩ 1111</div>
                    <div className="">Cơ xương khớp</div>
                  </div>
                </div>
              </div>
              <div className="section-customize">
                <div className="customize-border">
                  <div className="outer-bg">
                    <div className="bg-image section-outstanding-doctor"></div>
                  </div>
                  <div className="position text-center">
                    <div className="">Giáo sư, Tiến sĩ</div>
                    <div className="">Cơ xương khớp</div>
                  </div>
                </div>
              </div>
              <div className="section-customize">
                <div className="customize-border">
                  <div className="outer-bg">
                    <div className="bg-image section-outstanding-doctor"></div>
                  </div>
                  <div className="position text-center">
                    <div className="">Giáo sư, Tiến sĩ</div>
                    <div className="">Cơ xương khớp</div>
                  </div>
                </div>
              </div>
              <div className="section-customize">
                <div className="customize-border">
                  <div className="outer-bg">
                    <div className="bg-image section-outstanding-doctor"></div>
                  </div>
                  <div className="position text-center">
                    <div className="">Giáo sư, Tiến sĩ</div>
                    <div className="">Cơ xương khớp</div>
                  </div>
                </div>
              </div>
              <div className="section-customize">
                <div className="customize-border">
                  <div className="outer-bg">
                    <div className="bg-image section-outstanding-doctor"></div>
                  </div>
                  <div className="position text-center">
                    <div className="">Giáo sư, Tiến sĩ</div>
                    <div className="">Cơ xương khớp</div>
                  </div>
                </div>
              </div>
              <div className="section-customize">
                <div className="customize-border">
                  <div className="outer-bg">
                    <div className="bg-image section-outstanding-doctor"></div>
                  </div>
                  <div className="position text-center">
                    <div className="">Giáo sư, Tiến sĩ</div>
                    <div className="">Cơ xương khớp</div>
                  </div>
                </div>
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
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(OutstandingDoctor)
);
