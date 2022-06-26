import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";
import UserManage from "../containers/System/UserManage";
import UserRedux from "../containers/System/Admin/UserRedux";
// import RegisterPackageGroupOrAcc from "../containers/System/RegisterPackageGroupOrAcc";
import Header from "../containers/Header/Header";
import ManageDoctor from "../containers/System/Admin/ManageDoctor";
import ManageSpecialty from "../containers/System/Specialty/ManageSpecialty";
import ManageClinic from "../containers/System/Clinic/ManageClinic";
import ManageGroupRole from "../containers/System/GroupRole/ManageGroupRole";
import { push } from "connected-react-router";
import { getUserAccount } from "../services/userService";
import * as actions from "../store/actions";
class System extends Component {

  componentDidMount() {
    const { isLoggedIn } = this.props;
    if (isLoggedIn === false) {//nếu trùng false có khả năng người dùng đã login bằng mxh, tài khoản đã lưu dưới cookie
      this.checkUser();//mục đích lấy cookie set lại cho localStorage
    }

  }
  checkUser = async () => {
    //kiểm tra có tồn tại user chưa ( tránh trường hợp login bằng các mạng xã hội)
    let response = await getUserAccount();
    let token = "";
    console.log("check respone.data >>>", token)
    if (response && +response.EC === 0) {
      token = response.DT.token;
      let id = response.DT.decode.groupWithRoles.id;
      if (token) {
        this.props.userloginSuccess(token);
        if (+id === 3) {
          const { navigate } = this.props;
          const redirectPath = "/home";
          navigate(`${redirectPath}`);
        }
      }
    }
  }
  render() {
    const { systemMenuPath, isLoggedIn } = this.props;
    if (isLoggedIn === false) {
      const { navigate } = this.props;
      const redirectPath = "/login";
      navigate(`${redirectPath}`);
    }

    return (
      <React.Fragment>
        <Header />
        <div className="system-container">
          <div className="system-list">
            <Switch>
              <Route path="/system/user-manage" component={UserManage} />
              <Route path="/system/user-redux" component={UserRedux} />
              <Route path="/system/manage-doctor" component={ManageDoctor} />
              {/* <Route
                path="/system/register-package-group-or-account"
                component={RegisterPackageGroupOrAcc}
              /> */}
              <Route path="/system/manage-clinic" component={ManageClinic} />
              <Route
                path="/system/manage-specialty"
                component={ManageSpecialty}
              />
              <Route
                path="/system/manage-grouprole"
                component={ManageGroupRole}
              />
              <Route
                component={() => {
                  return <Redirect to={systemMenuPath} />;
                }}
              />
            </Switch>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    systemMenuPath: state.app.systemMenuPath,
    isLoggedIn: state.user.isLoggedIn,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    navigate: (path) => dispatch(push(path)),
    userloginSuccess: (userInfo) =>
      dispatch(actions.userloginSuccess(userInfo)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(System);
