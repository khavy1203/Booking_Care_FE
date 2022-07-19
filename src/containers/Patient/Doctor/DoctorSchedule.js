import React, { Component } from "react";
import { connect } from "react-redux";
import "./DoctorSchedule.scss";
import moment from "moment";
// import localization from "moment/locale/vi";
import { LANGUAGES } from "../../../utils";
import { FormattedMessage } from "react-intl";
import BookingModal from "./Modal/BookingModal";
import { fetchSchedule } from "../../../services/scheduleService";
import { dateFormat } from "../../../utils";

class DoctorSchedule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allDays: [], //mảng dc tạo chứa ngày tháng cho thanh select
      //allAvailableTime: [],//lấy Schedule_Detail cho vào đây để hiển thị lên giao diện
      isOpenModalBooking: false,
      schedule: {}, //chứa respond của api
      selectedSchedule: {}, //chứa doctorId, date và 1 Schedule_Detail mà bệnh nhân chọn để truyền props cho booking modal
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
    for (let i = 1; i < 8; i++) {
      let object = {};
      if (language === LANGUAGES.VI) {
        // if (i === 1) {
        //   let ddMM = moment(new Date()).format("DD/MM"); //lay dc ngay thang hien tai
        //   let today = `Hôm nay - ${ddMM}`;
        //   object.label = today;
        // } else {
        let labelVi = moment(new Date())
          .add(i, "days")
          .locale("vi")
          .format("dddd - DD/MM")
          ;
        object.label = this.capitalizeFirstLetter(labelVi);
        // }
      } else {
        // if (i === 0) {
        //   let ddMM = moment(new Date()).format("DD/MM");
        //   let today = `Today - ${ddMM}`;
        //   object.label = today;
        // } else {
        object.label = moment(new Date())
          .add(i, "days")
          .locale("en")
          .format("ddd - DD/MM");
        // }
      }
      //date timestamp kiểu string
      // object.value =
      //   "" + moment(new Date()).add(i, "days").startOf("day").valueOf();

      //date DD/MM/YYYY kiểu string
      object.value =
        "" +
        moment(new Date())
          .add(i, "days")
          .startOf("day")
          .format(dateFormat.SEND_TO_SERVER);

      allDays.push(object);
    }
    console.log("check all days", allDays)
    return allDays;
  };

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.language !== prevProps.language) {
      let allDays = this.getArrDays(this.props.language);
      this.setState({ allDays: allDays });
    }
    // if (this.props.doctorIdFromParent !== prevProps.doctorIdFromParent) {
    //   let allDays = this.getArrDays(this.props.language);
    //   this.loadSchedule(
    //     this.props.doctorIdFromParent,
    //     allDays[0].value,
    //     this.props.doctorClinicId
    //   );
    // }
    if (this.props.doctorClinicId !== prevProps.doctorClinicId) {
      let allDays = this.getArrDays(this.props.language);
      this.loadSchedule(
        this.props.doctorIdFromParent,
        allDays[0].value,
        this.props.doctorClinicId
      );
    }
  }

  loadSchedule = async (id, date, clinicId) => {
    try {
      let res = await fetchSchedule(id, date, clinicId);
      if (res && +res.EC === 0) {
        // console.log(res.DT);
        this.setState({
          schedule: res.DT,
          //allAvailableTime: res.DT.Schedule_Details,
        });
      } else {
        console.log(res.EM);
        this.setState({
          schedule: {},
          //allAvailableTime: [],
        });
      }
      // console.log("check state", this.state);
    } catch (error) {
      console.log(error);
    }
  };

  handleOnChangeSelect = async (event) => {
    if (this.props.doctorIdFromParent && this.props.doctorIdFromParent !== -1) {
      let doctorId = this.props.doctorIdFromParent;
      let date = event.target.value;
      let clinicId = this.props.doctorClinicId;
      this.loadSchedule(doctorId, date, clinicId);
    }
  };

  handleClickScheduleTime = (time) => {
    this.setState({
      isOpenModalBooking: true,
      selectedSchedule: {
        ...time,
        doctorId: this.props.doctorIdFromParent,
        date: this.state.schedule.date,
      },
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
      schedule,
      //allAvailableTime,
      isOpenModalBooking,
      selectedSchedule,
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
              {schedule &&
                schedule.Schedule_Details &&
                schedule.Schedule_Details.length > 0 ? (
                <>
                  <div className="time-content-btns">
                    {schedule.Schedule_Details.map((item, index) => {
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
          selectedSchedule={selectedSchedule}
        // dataTime={selectedSchedule}
        // doctorIdFromDoctorSchedule={this.props.doctorIdFromParent}
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
