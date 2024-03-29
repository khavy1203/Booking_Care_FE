import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import { toast } from "react-toastify";

import * as actions from "../../store/actions";

import "./Login.scss";
// import { FormattedMessage } from "react-intl";
import { handleLoginApi } from "../../services/userService";
class Login extends Component {
  // constructor để khai báo states
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      isShowPassword: false,
      objectInputable: {
        isInvalidAccount: true,
        isInvaliPassword: true,
      },
      defaultValidInput: {
        isInvalidAccount: true,
        isInvalidPassword: true,
      },

      query: "",
    };
  }

  async componentDidMount() {
    let query = await this.getQueryFromURL();
    if (query) this.setState({ query: query });
    //console.log(this.state.query);
  }

  getQueryFromURL = async () => {
    const params = new Proxy(new URLSearchParams(window.location.search), {
      get: (searchParams, prop) => searchParams.get(prop),
    });
    return params.redirectTo;
  };

  loginGoogle = async () => {
    window.open("http://localhost:5000/api/v1/google", "_self");
  };
  loginGithub = async () => {
    window.open("http://localhost:5000/api/v1/github", "_self");
  };
  handleOnChangeUsername = (event) => {
    this.setState({ username: event.target.value.trim() });
    // console.log(event.target.value);
  };
  handleOnChangePassword = (event) => {
    this.setState({ password: event.target.value.trim() });
  };
  handleLogin = async () => {
    if (!this.state.username) {
      toast.warn("Please enter an account");
      this.setState({
        objectInputable: {
          ...this.state.defaultValidInput,
          isInvaliPassword: false,
        },
      });
      return false;
    }
    if (!this.state.password) {
      toast.warn("Please enter password");
      this.setState({
        objectInputable: {
          ...this.state.defaultValidInput,
          isInvalidAccount: false,
        },
      });
      return false;
    }
    let response = await handleLoginApi(
      this.state.username.trim(),
      this.state.password.trim()
    );
    if (response && +response.EC === 0) {
      await this.props.userloginSuccess(response.DT.access_token);
      const { navigate } = this.props;
      //Huyên:
      let { query } = this.state;
      //console.log(query);
      // const redirectPath = "/home";
      let redirectPath = "/home";
      if (query) {
        redirectPath = query;
      }
      navigate(`${redirectPath}`);
    }
    if (response && +response.EC !== 0) {
      //fail
      toast.warn(response.EM);
    }
    return true;
  };
  handleTogglePassword = () => {
    this.setState({ isShowPassword: !this.state.isShowPassword });
  };
  forgotPassword = () => {
    const { navigate } = this.props;
    const redirectPath = "/forgot-password";
    navigate(`${redirectPath}`);
  };
  render() {
    return (
      <div className="login-backround">
        <div className="login-container">
          <div className="login-content row">
            <div className="col-12 text-login">Login</div>
            <div className="col-12 form-group  login-input">
              <label>Email:</label>
              <input
                placeholder="Enter your email"
                type="text"
                className="form-control"
                value={this.state.username}
                onChange={(event) => {
                  this.handleOnChangeUsername(event);
                }}
              />
            </div>
            <div className="col-12 form-group  login-input">
              <label>Password:</label>
              <div className="custom-input-password">
                <input
                  placeholder="Enter your password"
                  type={this.state.isShowPassword ? "text" : "password"}
                  className="form-control"
                  value={this.state.password}
                  onChange={(event) => {
                    this.handleOnChangePassword(event);
                  }}
                />
                <span
                  onClick={() => {
                    this.handleTogglePassword();
                  }}
                >
                  <i
                    className={
                      this.state.isShowPassword
                        ? "fas fa-eye"
                        : "fas fa-eye-slash"
                    }
                  ></i>
                </span>
              </div>
            </div>
            <div className="col-12" style={{ color: "red" }}>
              {this.state.errMessage}
            </div>
            <div className="col-12">
              <button
                className="btn-login"
                onClick={() => {
                  this.handleLogin();
                }}
              >
                Login
              </button>
            </div>
            <div className="col-12">
              <span
                className="forgot-password"
                onClick={() => this.forgotPassword()}
              >
                Forgot your password?
              </span>
            </div>
            <div className="col-12 text-center  mt-3">
              <span className="text-other-login">Or Login with:</span>
            </div>
            <div className="col-12 social-login">
              <i
                className="fab fa-google-plus-g google"
                onClick={() => this.loginGoogle()}
              ></i>
              <i
                className="fa fa-github github"
                onClick={() => this.loginGithub()}
              ></i>
            </div>
          </div>
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
  return {
    navigate: (path) => dispatch(push(path)),
    // adminLoginSuccess: (adminInfo) =>
    //   dispatch(actions.adminLoginSuccess(adminInfo)),
    // adminLoginFail: () => dispatch(actions.adminLoginFail()),

    // userLoginFail: () => dispatch(actions.adminLoginFail()),
    // userloginSuccess: (userInfo) =>
    //   dispatch(actions.userloginSuccess(userInfo)),
    userloginSuccess: (userInfo) =>
      dispatch(actions.userloginSuccess(userInfo)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
