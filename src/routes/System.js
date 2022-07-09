import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";
import UserManage from "../containers/System/UserManage";
import UserRedux from "../containers/System/Admin/UserRedux";
import { push } from "connected-react-router";
import * as actions from "../store/actions";
// import RegisterPackageGroupOrAcc from "../containers/System/RegisterPackageGroupOrAcc";
import Header from "../containers/Header/Header";
import ManageDoctor from "../containers/System/Admin/ManageDoctor";
import ManageClinic from "../containers/System/Clinic/ManageClinic";
import ManageGroupRole from "../containers/System/GroupRole/ManageGroupRole";
import Specialty from "../containers/System/Specialty/Specialty";
import Partner from "../containers/System/Partner/Partner";
import { getUserAccount, logoutUser } from "../services/userService";

class System extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //phần thêm user

    }
  }
  componentDidMount() {
    this.fetchCookigetUserAccount();

  }
  fetchCookigetUserAccount = async () => {
    let res = await getUserAccount();
    if (res && +res.EC === 0 && res.DT.decode) {
      this.props.userloginSuccess(res.DT.token);
    } else {
      this.props.userlogOut();
      await logoutUser();//nếu ko có thì tiết hành clear cookie cũ đi( nếu tồn tại)

      const { navigate } = this.props;
      const redirectPath = "/login";
      navigate(`${redirectPath}`);
    }

  }
  render() {
    const { isLoggedIn } = this.props;
    return (
      <React.Fragment>
        <Header />
        <div className="system-container">
          <div className="system-list">
            <Switch>
              <Route path="/system/user-manage" component={UserManage} />
              <Route path="/system/user-redux" component={UserRedux} />
              <Route path="/system/manage-doctor" component={ManageDoctor} />

              <Route path="/system/manage-clinic" component={ManageClinic} />
              <Route
                path="/system/manage-grouprole"
                component={ManageGroupRole}
              />
              <Route
                path="/system/manage-specialty"
                component={Specialty}
              />
              <Route
                path="/system/partner-clinic"
                component={Partner}
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
    isLoggedIn: state.user.isLoggedIn,
    language: state.app.language,

  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    navigate: (path) => dispatch(push(path)),
    userlogOut: () => dispatch(actions.userlogOut()),
    changeLanguageAppRedux: (language) => {
      dispatch(actions.changeLanguageApp(language));
    },
    userloginSuccess: (userInfo) =>
      dispatch(actions.userloginSuccess(userInfo)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(System);
