import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
// import { FormattedMessage } from "react-intl";
import "./HomeFooter.scss";
class HomeFoote extends Component {
  render() {
    return (
      <>
        <div className="home-footer">
          <div className="footer-container">
            <div className="footer-content left">
              <div>Logo</div>
              <div>Công ty Cổ phần Công nghệ BookingCare</div>
              <div>Địa chỉ</div>
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
            <div className="footer-content right">branch</div>
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
