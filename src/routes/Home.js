import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";


class Home extends Component {

  render() {
    // if(isLoggedIn)
    let linkToRedirect = '/home';
    // let linkToRedirect = isLoggedIn ? "/system/user-manage" : "/home";
    return <Redirect to={linkToRedirect} />;
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {

  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
