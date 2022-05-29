import React, { Component } from "react";
import { connect } from "react-redux";
import "./ManageSchedule.scss";
import { FormattedMessage } from "react-intl";
import Select from "react-select";
import DatePicker from "../../../components/Input/DatePicker";

const options = [
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" },
];

class ManageSchedule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOption: "",
      currentDate: "",
    };
  }

  handleChange = (selectedOption) => {
    this.setState({ selectedOption }, () =>
      console.log(`Option selected:`, this.state.selectedOption)
    );
  };

  handleOnchangeDatePicker = (date) => {
    this.setState({
      currentDate: date[0],
    });
  };

  render() {
    let yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
    return (
      <div className="manage-schedule-container">
        <div className="m-s-title">
          <FormattedMessage id={"manage-schedule.title"} />
        </div>
        <div className="container">
          <div className="row">
            <div className="col-6 form-group">
              <label>
                <FormattedMessage id={"manage-schedule.choose-doctor"} />
              </label>
              <Select
                value={this.state.selectedOption}
                onChange={this.handleChange}
                options={options}
              />
            </div>
            <div className="col-6 form-group">
              <label>
                <FormattedMessage id={"manage-schedule.choose-date"} />
              </label>
              <DatePicker
                className="form-control"
                onChange={this.handleOnchangeDatePicker}
                value={this.state.currentDate}
                minDate={yesterday}
              />
            </div>
            <div className="col-12 pick-hour-container">
              <button className="btn btn-schedule" key="index">
                8:00 - 9:00
              </button>
              <button className="btn btn-schedule" key="index">
                9:00 - 10:00
              </button>
              <button className="btn btn-schedule" key="index">
                11:00 - 12:00
              </button>
            </div>
            <div className="col-12">
              <button className="btn btn-primary btn-save-schedule">
                <FormattedMessage id={"manage-schedule.save"} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageSchedule);
