import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
// import { FormattedMessage } from "react-intl";
import "./HomeFooter.scss";
import logo from "../../assets/Logo.svg";
class HomeFoote extends Component {
  render() {
    return (
      <>
        <div className="homepage-footer">
          <div className="footer-container">
            <div className="footer-content left">
              <div className="footer-logo"></div>
              <div className="company-title">
                <h5>Công ty Cổ phần Công nghệ VigorDoctor</h5>
              </div>
              <div>180 Đ. Cao Lỗ, Phường 4, Quận 8, Thành phố Hồ Chí Minh</div>
            </div>
            <div className="footer-content center">
              <Link className="footer-link" to={"/home"}>
                Liên hệ hợp tác
              </Link>
              <Link className="footer-link" to={"/home"}>
                Câu hỏi thường gặp
              </Link>
              <Link className="footer-link" to={"/home"}>
                Điều khoản sử dụng
              </Link>
              <Link className="footer-link" to={"/home"}>
                Chính sách Bảo mật
              </Link>
              <Link className="footer-link" to={"/home"}>
                Quy trình hỗ trợ giải quyết khiếu nại
              </Link>
              <Link className="footer-link" to={"/home"}>
                Quy chế hoạt động
              </Link>
            </div>
            <div className="footer-content right">
              <div className="company-info">
                <div className="info-item">
                  <h5>Văn phòng tại TP Hồ Chí Minh</h5>
                  <p>180 Đ. Cao Lỗ, Phường 4, Quận 8, Thành phố Hồ Chí Minh</p>
                </div>
                <div className="info-item">
                  <h5>Hỗ trợ khách hàng</h5>
                  <p>support@vigordoctor.vn (7h30 - 18h) </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom">&copy; 2022</div>
      </>
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

export default connect(mapStateToProps, mapDispatchToProps)(HomeFoote);
