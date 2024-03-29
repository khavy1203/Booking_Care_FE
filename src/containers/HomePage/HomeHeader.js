import React, { Component } from "react";
// import { Redirect } from "react-router-dom";
import { push } from "connected-react-router";
import { Link } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import { connect } from "react-redux";
import "./HomeHeader.scss";
import MenuIcon from "@mui/icons-material/Menu";
import logo from "../../assets/Logo.svg";
import { FormattedMessage } from "react-intl";
import { LANGUAGES } from "../../utils";
import { changeLanguageApp } from "../../store/actions/appActions";
import { withRouter } from "react-router";
import { logoutUser, getUserAccount } from "../../services/userService";
import { toast } from "react-toastify";
import { RiUser3Fill } from "react-icons/ri";

import * as actions from "../../store/actions";
import Button from "react-bootstrap/esm/Button";
class HomeHeader extends Component {
  changeLanguage = (language) => {
    // alert(language);
    //fire redux action(event)
    this.props.changeLanguageAppRedux(language);
  };
  componentDidMount() {}

  processLogoutHomeHeader = async () => {
    let data = await logoutUser();

    if (data && +data.EC === 0) {
      toast.success("logout succeeds");

      const { navigate } = this.props;
      this.props.processLogout();
      const redirectPath = "/home";
      navigate(`${redirectPath}`);
    } else {
      toast.error(data.EM);
    }
  };
  returnToHome = () => {
    if (this.props.history) {
      this.props.history.push(`/home`);
    }
  };
  render() {
    let language = this.props.language;
    return (
      <React.Fragment>
        <div className="home-header-container">
          <div className="home-header-content">
            <div className="left-content">
              <Dropdown>
                <Dropdown.Toggle variant="white" id="dropdown-basic">
                  <MenuIcon className="bars-icon" />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item>
                    <Link
                      style={{ color: "black", textDecoration: "none" }}
                      to={"/register-clinic"}
                    >
                      Đăng ký phòng khám
                    </Link>
                  </Dropdown.Item>
                  <Dropdown.Item>
                    <Link
                      style={{ color: "black", textDecoration: "none" }}
                      to={"/system/partner-clinic"}
                    >
                      Dành cho đối tác
                    </Link>
                  </Dropdown.Item>
                  <Dropdown.Item>
                    <Link
                      style={{ color: "black", textDecoration: "none" }}
                      to={"/system/manage-patient"}
                    >
                      Dành cho bác sĩ
                    </Link>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>

              <img
                className="header-logo"
                src={logo}
                alt="empty"
                onClick={() => {
                  this.returnToHome();
                }}
              />

              {/* <div className="header-logo"></div> */}
            </div>
            <div className="center-content">
              <div className="child-content">
                <div>
                  <b>
                    <Link
                      to="/doctorall-page"
                      style={{ textDecoration: "none" }}
                    >
                      {" "}
                      <FormattedMessage id="homeheader.specialty" />
                    </Link>
                  </b>
                </div>
                <div className="subs-title">
                  <b>
                    <FormattedMessage id="homeheader.search-doctor" />
                  </b>
                </div>
              </div>
              <div className="child-content">
                <div>
                  <b>
                    <Link to="/clinic-page" style={{ textDecoration: "none" }}>
                      <FormattedMessage id="homeheader.health-facilities" />
                    </Link>
                  </b>
                </div>
                <div className="subs-title">
                  <FormattedMessage id="homeheader.select-clinic" />
                </div>
              </div>
              <div className="child-content">
                <div>
                  <b>
                    <Link
                      to="/doctorall-page"
                      style={{ textDecoration: "none" }}
                    >
                      <FormattedMessage id="homeheader.doctor" />
                    </Link>
                  </b>
                </div>

                <div className="subs-title">
                  <FormattedMessage id="homeheader.select-doctor" />
                </div>
              </div>
              <div className="child-content">
                <div>
                  <b>
                    <FormattedMessage id="homeheader.fee" />
                  </b>
                </div>
                <div className="subs-title">
                  <FormattedMessage id="homeheader.general-examination" />
                </div>
              </div>
            </div>
            <div className="right-content">
              <div className="support">
                <i className="fas fa-question-circle"></i>
                <FormattedMessage id="homeheader.support" />
              </div>
              <div
                className={
                  language === LANGUAGES.VI
                    ? "language-vi active"
                    : "language-vi"
                }
              >
                <span
                  onClick={() => {
                    this.changeLanguage(LANGUAGES.VI);
                  }}
                >
                  VN
                </span>
              </div>
              <div
                className={
                  language === LANGUAGES.EN
                    ? "language-en active"
                    : "language-en"
                }
              >
                <span
                  onClick={() => {
                    this.changeLanguage(LANGUAGES.EN);
                  }}
                >
                  EN
                </span>
              </div>
              {this.props.isLoggedIn ? (
                <>
                  <div id="account" className="btn btn-logout mt-2">
                    <Link to="/user-profile">
                      <RiUser3Fill style={{ fontSize: "20px" }} />
                    </Link>
                  </div>
                  <div
                    className="btn btn-logout mt-3"
                    onClick={() => this.processLogoutHomeHeader()}
                    title="Log out"
                  >
                    <i className="fas fa-sign-out-alt"></i>
                  </div>
                </>
              ) : (
                <div>
                  <span className="mx-1">
                    <Link style={{ textDecoration: "none" }} to="/login">
                      Login
                    </Link>
                  </span>
                  <span className="mx-1">
                    <Link style={{ textDecoration: "none" }} to="/register">
                      Regist{" "}
                    </Link>
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
        {this.props.isShowBanner === true && (
          <div className="home-header-banner">
            <div className="content-up">
              <div className="title1">
                <FormattedMessage id="banner.title1" />
              </div>
              <div className="title2">
                <FormattedMessage id="banner.title2" />
              </div>
              <div className="search">
                <i className="fas fa-search"></i>
                <input type="text" placeholder="Tìm chuyên khoa khám bệnh" />
              </div>
            </div>
            <div className="content-down">
              <div className="options">
                <div className="option-child">
                  <div className="icon-child">
                    <i className="fas fa-hospital-alt"></i>
                  </div>
                  <div className="text-child">
                    <FormattedMessage id="banner.specialist-examination" />
                  </div>
                </div>
                <div className="option-child">
                  <div className="icon-child">
                    <i className="fas fa-mobile-alt"></i>
                  </div>
                  <div className="text-child">
                    <FormattedMessage id="banner.telemedicine" />
                  </div>
                </div>
                <div className="option-child">
                  <div className="icon-child">
                    <i className="fas fa-notes-medical"></i>
                  </div>
                  <div className="text-child">
                    <FormattedMessage id="banner.general-examination" />
                  </div>
                </div>
                <div className="option-child">
                  <div className="icon-child">
                    <i className="fas fa-briefcase-medical"></i>
                  </div>
                  <div className="text-child">
                    <FormattedMessage id="banner.medical-test" />
                  </div>
                </div>
                <div className="option-child">
                  <div className="icon-child">
                    <i className="fas fa-first-aid"></i>
                  </div>
                  <div className="text-child">
                    <FormattedMessage id="banner.mental-health" />
                  </div>
                </div>
                <div className="option-child">
                  <div className="icon-child">
                    <i className="fas fa-user-md"></i>
                  </div>
                  <div className="text-child">
                    <FormattedMessage id="banner.dental-examination" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    language: state.app.language,
  };
};

//để truy cập hàm changeLanguageAppRedux
// thì hàm mapDispatchToProps cho phép truy cập hàm changeLanguageAppRedux
// thông qua props
const mapDispatchToProps = (dispatch) => {
  return {
    changeLanguageAppRedux: (language) => {
      dispatch(changeLanguageApp(language));
    },
    processLogout: () => dispatch(actions.processLogout()),
    navigate: (path) => dispatch(push(path)),
    userloginSuccess: (userInfo) =>
      dispatch(actions.userloginSuccess(userInfo)),
    userlogOut: () => dispatch(actions.userlogOut()),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(HomeHeader)
);
