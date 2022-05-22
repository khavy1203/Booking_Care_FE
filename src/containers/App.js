import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Route, Switch } from "react-router-dom";
import { ConnectedRouter as Router } from "connected-react-router";
import { history } from "../redux";
// import { ToastContainer } from "react-toastify";

import {
  userIsAuthenticated,
  userIsNotAuthenticated,
} from "../hoc/authentication";

import { path } from "../utils";

import Home from "../routes/Home";
// import Login from "../routes/Login";
import Login from "./Auth/Login";

import System from "../routes/System";

// import { CustomToastCloseButton } from "../components/CustomToast";
// import ConfirmModal from "../components/ConfirmModal";

import HomePage from "./HomePage/HomePage";
import CustomScrollbars from "../components/CustomScrollbars";
import DetailDoctor from "./Patient/Doctor/DetailDoctor";

class App extends Component {
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

  componentDidMount() {
    this.handlePersistorState();
  }

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
                  {/* video bài 36 chưa làm đăng nhập vì chưa có api nên cmt lại Rout dưới */}
                  {/* <Route
                    path={path.SYSTEM}
                    component={userIsAuthenticated(System)}
                  /> */}
                  {/* tạm thời bỏ userIsAuthenticated để làm giao diện */}
                  <Route path={path.SYSTEM} component={System} />
                  <Route path={path.HOMEPAGE} component={HomePage} />
                  {/* <Route path={"users/:id"} component={DetailDoctor} /> */}
                  <Route path={path.DETAIL_DOCTOR} component={DetailDoctor} />
                </Switch>
              </CustomScrollbars>
            </div>
            {/* toast: popup báo lỗi */}
            {/* <ToastContainer
              className="toast-container"
              toastClassName="toast-item"
              bodyClassName="toast-item-body"
              autoClose={false}
              hideProgressBar={true}
              pauseOnHover={false}
              pauseOnFocusLoss={true}
              closeOnClick={false}
              draggable={false}
              closeButton={<CustomToastCloseButton />}
            /> */}
          </div>
        </Router>
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
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
