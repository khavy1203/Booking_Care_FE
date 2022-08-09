import React, { Component } from "react";
import { connect } from "react-redux";

import { push } from "connected-react-router";
import * as actions from "../../store/actions";
import Navigator from "../../components/Navigator";
import { adminMenu } from "./menuApp";
import "./Header.scss";
import { LANGUAGES } from "../../utils";
import { FormattedMessage } from "react-intl";
import { logoutUser, getUserAccount } from "../../services/userService";
import { toast } from "react-toastify";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  handleChangeLanguage = (language) => {
    this.props.changeLanguageAppRedux(language);
  };

  componentDidMount() {}

  processLogoutHeader = async () => {
    let data = await logoutUser();

    if (data && +data.EC === 0) {
      const { navigate } = this.props;
      this.props.processLogout();
      const redirectPath = "/home";
      navigate(`${redirectPath}`);
    } else {
      toast.error(data.EM);
    }
  };
  render() {
    console.log("check login >>>", this.props.isLoggedIn);
    const { language } = this.props;

    return (
      <div className="header-container">
        {/* thanh navigator */}
        <div className="header-tabs-container">
          <Navigator menus={adminMenu} />
        </div>

        <div className="languages">
          {/* <span className="welcome">
            <FormattedMessage id="homeheader.welcome" />,{" "}
          </span> */}
          <span
            className={
              language === LANGUAGES.VI ? "language-vi active" : "language-vi"
            }
            onClick={() => {
              this.handleChangeLanguage(LANGUAGES.VI);
            }}
          >
            VN
          </span>
          <span
            className={
              language === LANGUAGES.EN ? "language-en active" : "language-en"
            }
            onClick={() => {
              this.handleChangeLanguage(LANGUAGES.EN);
            }}
          >
            EN
          </span>
          {/* nút logout */}
          <div
            className="btn btn-logout"
            onClick={() => this.processLogoutHeader()}
            title="Log out"
          >
            <i className="fas fa-sign-out-alt"></i>
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
  return {
    navigate: (path) => dispatch(push(path)),
    processLogout: () => dispatch(actions.processLogout()),
    changeLanguageAppRedux: (language) => {
      dispatch(actions.changeLanguageApp(language));
    },
    userloginSuccess: (userInfo) =>
      dispatch(actions.userloginSuccess(userInfo)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
