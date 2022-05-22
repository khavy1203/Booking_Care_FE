import React, { Component } from "react";
import { connect } from "react-redux";
import Select from "react-select";

import "./DoctorSchedule.scss";
class DoctorSchedule extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {}

  componentDidUpdate() {}

  render() {
    let options = [
      { label: "Thứ 2", value: "2" },
      { label: "Thứ 3", value: "3" },
      { label: "Thứ 4", value: "4" },
    ];
    return (
      <div className="doctor-schedule-container">
        <div className="all-schedules">
          <Select
            // styles={customStyles}
            options={options}
          />
        </div>
        <div className="all-available-times"></div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(DoctorSchedule);
