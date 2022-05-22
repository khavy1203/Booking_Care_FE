import React, { Component } from "react";
import { connect } from "react-redux";
// import { FormattedMessage } from "react-intl";

class HomeFoote extends Component {
  render() {
    return (
      <div className="home-footer">
        <p>
          &copy; 2022 DATN{" "}
          <a target="_blank" href="#">
            More info
          </a>
        </p>
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
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeFoote);
