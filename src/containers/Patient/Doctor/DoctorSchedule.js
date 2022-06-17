import React, { Component } from "react";
import { connect } from "react-redux";
import "./DoctorSchedule.scss";
import moment from "moment";
import localization from "moment/locale/vi";
import { LANGUAGES } from "../../../utils";
import { FormattedMessage } from "react-intl";
import BookingModal from "./Modal/BookingModal";
import { fetchSchedule } from "../../../services/scheduleService";
import { dateFormat } from "../../../utils";

class DoctorSchedule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allDays: [],
      allAvailableTime: [],
      isOpenModalBooking: false,
      dataScheduleTimeModal: {},
    };
  }

  async componentDidMount() {
    let { language } = this.props;
    let allDays = this.getArrDays(language);
    if (allDays && allDays.length > 0) {
      this.setState({ allDays: allDays });
    }

    // console.log("moment vie", moment(new Date()).format("dddd - DD/MM"));
    // console.log(
    //   "moment eng",
    //   moment(new Date()).local("en").format("ddd - DD/MM")
    // );
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  getArrDays = (language) => {
    let allDays = [];
    for (let i = 0; i < 7; i++) {
      let object = {};
      if (language === LANGUAGES.VI) {
        if (i === 0) {
          let ddMM = moment(new Date()).format("DD/MM"); //lay dc ngay thang hien tai
          let today = `Hôm nay - ${ddMM}`;
          object.label = today;
        } else {
          let labelVi = moment(new Date())
            .add(i, "days")
            .format("dddd - DD/MM");
          object.label = this.capitalizeFirstLetter(labelVi);
        }
      } else {
        if (i === 0) {
          let ddMM = moment(new Date()).format("DD/MM");
          let today = `Today - ${ddMM}`;
          object.label = today;
        } else {
          object.label = moment(new Date())
            .add(i, "days")
            .locale("en")
            .format("ddd - DD/MM");
        }
      }
      // console.log(
      //   moment(new Date())
      //     .add(i, "days")
      //     .startOf("day")
      //     .format(dateFormat.SEND_TO_SERVER)
      // );
      object.value = moment(new Date())
        .add(i, "days")
        .startOf("day")
        .format(dateFormat.SEND_TO_SERVER);

      // object.value = moment(new Date()).add(i, "days").startOf("day").valueOf();
      allDays.push(object);
    }

    return allDays;
  };

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.language !== prevProps.language) {
      let allDays = this.getArrDays(this.props.language);
      this.setState({ allDays: allDays });
    }
    if (this.props.doctorIdFromParent !== prevProps.doctorIdFromParent) {
      let allDays = this.getArrDays(this.props.language);
      this.loadSchedule(this.props.doctorIdFromParent, allDays[0].value);
    }
  }

  loadSchedule = async (id, date) => {
    try {
      let res = await fetchSchedule(id, date);
      if (res && +res.EC === 0) {
        console.log(res.DT.Schedule_Details);
        this.setState({
          allAvailableTime: res.DT.Schedule_Details,
        });
      } else {
        console.log(res.EM);
        this.setState({
          allAvailableTime: [],
        });
      }
      // console.log("check state", this.state);
    } catch (error) {
      console.log(error);
    }
  };

  handleOnChangeSelect = async (event) => {
    // console.log(event.target.value);
    //Mở cmt khi có api
    if (this.props.doctorIdFromParent && this.props.doctorIdFromParent !== -1) {
      let doctorId = this.props.doctorIdFromParent;
      let date = event.target.value;
      this.loadSchedule(doctorId, date);
    }
  };

  handleClickScheduleTime = (time) => {
    // console.log("time", time);
    this.setState({
      isOpenModalBooking: true,
      dataScheduleTimeModal: time,
    });
  };

  closeBookingModal = () => {
    this.setState({
      isOpenModalBooking: false,
    });
  };

  render() {
    let {
      allDays,
      allAvailableTime,
      isOpenModalBooking,
      dataScheduleTimeModal,
    } = this.state;
    let { language } = this.props;
    return (
      <>
        <div className="doctor-schedule-container">
          <div className="all-schedules">
            <select
              onChange={(event) => {
                this.handleOnChangeSelect(event);
              }}
            >
              {allDays &&
                allDays.length > 0 &&
                allDays.map((item, index) => {
                  return (
                    <option value={item.value} key={index}>
                      {item.label}
                    </option>
                  );
                })}
            </select>
          </div>
          <div className="all-available-times">
            <div className="text-calendar">
              <i className="fas fa-calendar-alt">
                <span>
                  <FormattedMessage id={"patient.detail-doctor.schedule"} />
                </span>
              </i>
            </div>
            <div className="time-content">
              {/* Mở cmt khi gọi dc API */}
              {allAvailableTime && allAvailableTime.length > 0 ? (
                <>
                  <div className="time-content-btns">
                    {allAvailableTime.map((item, index) => {
                      let timeDisplay =
                        language === LANGUAGES.VI
                          ? item.Timeframe.nameVI
                          : item.Timeframe.nameEN;
                      return (
                        <button
                          key={index}
                          className={
                            language === LANGUAGES.VI ? "btn-vie" : "btn-en"
                          }
                          onClick={() => this.handleClickScheduleTime(item)}
                        >
                          {timeDisplay}
                        </button>
                      );
                    })}
                  </div>
                  <div className="book-free">
                    <span>
                      <FormattedMessage id={"patient.detail-doctor.choose"} />
                      <FormattedMessage
                        id={"patient.detail-doctor.book-free"}
                      />
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="no-schedule">
                    <FormattedMessage
                      id={"patient.detail-doctor.no-schedule"}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <BookingModal
          isOpenModal={isOpenModalBooking}
          closeBookingModal={this.closeBookingModal}
          dataTime={dataScheduleTimeModal}
          doctorIdFromDoctorSchedule={this.props.doctorIdFromParent}
        />
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(DoctorSchedule);
