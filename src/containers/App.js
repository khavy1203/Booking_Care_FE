import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Route, Switch } from "react-router-dom";
import { ConnectedRouter as Router } from "connected-react-router";
import { history } from "../redux";
import { ToastContainer } from "react-toastify";
// import { ToastContainer } from "react-toastify";
import {
  userIsAuthenticated,
  userIsNotAuthenticated,
} from "../hoc/authentication";
import { path } from "../utils";
import Home from "../routes/Home";
// import Login from "../routes/Login";
import Login from "./Auth/Login";
import Register from "./Auth/Register";
import System from "../routes/System";
// import { CustomToastCloseButton } from "../components/CustomToast";
// import ConfirmModal from "../components/ConfirmModal";
import HomePage from "./HomePage/HomePage";
import CustomScrollbars from "../components/CustomScrollbars";
import DetailDoctor from "./Patient/Doctor/DetailDoctor";
// import Doctor from "../routes/Doctor";
import DetailSpecialty from "./Patient/Specialty/DetailSpecialty";
import DetailClinic from "./Patient/Clinic/DetailClinic";
// import ManageGroupRole from "./System/GroupRole/ManageGroupRole";//thêm quản lý group role
import ClinicContact from "./ClinicContact/ClinicContact";
import ProcedureRegisterClinic from "./Patient/Clinic/ProcedureRegisterClinic";
import ProfileUser from "./ProfileUser/ProfileUser";
import BookingHistory from "./ProfileUser/BookingHistory";
import ForgotPassword from "./Auth/ForgotPassword";
import NewPassword from "./Auth/NewPassword";
import { logoutUser, getUserAccount } from "../services/userService";
import { push } from "connected-react-router";
import * as actions from "../store/actions";
import ListClinicPage from "./ListClinicPage/ListClinicPage";
import ListDoctorPage from "./ListDoctorPage/ListDoctorPage";
import ListDoctorAll from "./ListDoctorPage/ListDoctorAll";
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.handlePersistorState();
    this.fetchCookigetUserAccount();
  }

  fetchCookigetUserAccount = async () => {
    let res = await getUserAccount();
    if (res && +res.EC === 0 && res.DT.decode) {
      this.props.userloginSuccess(res.DT.token);
    } else {
      console.log("đã vô này");
      this.props.userlogOut();
      await logoutUser(); //nếu ko có thì tiết hành clear cookie cũ đi( nếu tồn tại)
    }
  };
  handlePersistorState = () => {
    const { persistor } = this.props;
    let { bootstrapped } = persistor.getState();
    if (bootstrapped) {
      if (this.props.onBeforeLift) {
        Promise.resolve(this.props.onBeforeLift())
          .then(() => this.setState({ bootstrapped: true }))
          .catch(() => this.setState({ bootstrapped: true }));
      } else {
        this.setState({ bootstrapped: true });
      }
    }
  };
  render() {
    return (
      <Fragment>
        <Router history={history}>
          <div className="main-container">
            {/* <ConfirmModal /> */}
            {/* {this.props.isLoggedIn && <Header />} */}
            <div className="content-container">
              <CustomScrollbars style={{ height: "100vh", width: "100%" }}>
                <Switch>
                  <Route path={path.HOME} exact component={Home} />
                  <Route
                    path={path.LOGIN}
                    component={userIsNotAuthenticated(Login)}
                  />
                  <Route
                    path={path.REGISTER}
                    component={userIsNotAuthenticated(Register)}
                  />
                  {/* video bài 36 chưa làm đăng nhập vì chưa có api nên cmt lại Rout dưới */}
                  {/* <Route
                    path={path.SYSTEM}
                    component={userIsAuthenticated(System)}
                  /> */}
                  {/* tạm thời bỏ userIsAuthenticated để làm giao diện */}
                  <Route path={path.SYSTEM} component={System} />
                  {/*<Route path={"/doctor/"} component={Doctor} /> */}

                  <Route path={path.HOMEPAGE} component={HomePage} />
                  {/* <Route path={"users/:id"} component={DetailDoctor} /> */}
                  <Route path={path.DETAIL_DOCTOR} component={DetailDoctor} />
                  <Route path={path.CLINIC_CONTACT} component={ClinicContact} />
                  <Route
                    path={path.PROCEDURE_CLINIC_CONTACT}
                    component={ProcedureRegisterClinic}
                  />
                  <Route path={path.USER_PROFILE} component={ProfileUser} />
                  <Route
                    path={path.BOOKING_HISTORY}
                    component={BookingHistory}
                  />
                  <Route
                    path={path.DETAIL_SPECIALTY}
                    component={DetailSpecialty}
                  />
                  <Route path={path.DETAIL_CLINIC} component={DetailClinic} />
                  <Route
                    path={path.FORGOT_PASSWORD}
                    component={ForgotPassword}
                  />
                  <Route path={path.NEW_PASSWORD} component={NewPassword} />
                  <Route
                    path={path.LIST_CLINIC_PAGE}
                    component={ListClinicPage}
                  />
                  <Route
                    path={path.LISTDOCTOR_CLINIC}
                    component={ListDoctorPage}
                  />
                  <Route path={path.ALL_DOCTOR} component={ListDoctorAll} />
                </Switch>
              </CustomScrollbars>
            </div>
          </div>
        </Router>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    started: state.app.started,
    isLoggedIn: state.user.isLoggedIn,
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

export default connect(mapStateToProps, mapDispatchToProps)(App);
