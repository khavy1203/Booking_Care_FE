import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import "./DoctorSchedule.scss";
import moment from "moment";
import "moment/locale/vi";
import { LANGUAGES } from "../../../utils";
import { FormattedMessage } from "react-intl";
import BookingModal from "./Modal/BookingModal";
import { fetchSchedule } from "../../../services/scheduleService";
import { Button, Modal } from "react-bootstrap";
import {
  getUserAccount,
  logoutUser,
  updateInforUser,
  getUserById,
} from "../../../services/userService";
import _ from "lodash";

class DoctorSchedule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allDays: [], //mảng dc tạo chứa ngày tháng cho thanh select

      isOpenCheckLoginModal: false,
      isOpenModalBooking: false,

      schedule: {}, //chứa respond của api
      selectedSchedule: {}, //chứa date và 1 Schedule_Detail mà bệnh nhân chọn để truyền props cho booking modal

      patientData: {},
      patientDataDecode: {},
    };
  }

  async componentDidMount() {
    let { language } = this.props;
    let allDays = this.getArrDays(language);
    if (allDays && allDays.length > 0) {
      this.setState({ allDays: allDays });
    }
  }

  fetchCookigetUserAccount = async () => {
    let res = await getUserAccount();
    if (res && +res.EC === 0 && res.DT.decode) {
      //console.log("check res.DT", res.DT);

      // get UserbyID

      this.setState({
        patientDataDecode: res.DT.decode,
      });
      // console.log("patientDataDecode", this.state.patientDataDecode);
      let infoUser = await getUserById(res.DT.decode.id);
      if (infoUser && infoUser.EC === 0) {
        this.setState({
          patientData: infoUser.DT,
        });
        // console.log("patientData", this.state.patientData);
      }
    } else {
      this.props.userlogOut();
      await logoutUser(); //nếu ko có thì tiết hành clear cookie cũ đi( nếu tồn tại)

      const { navigate } = this.props;
      const redirectPath = "/login";
      navigate(`${redirectPath}`);
    }
  };

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
            .locale("vi")
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

      //date timestamp kiểu string
      //object.value = moment(new Date()).add(i, "days").startOf("day").valueOf();

      object.value = moment(new Date())
        .add(i, "days")
        .startOf("day")
        .toISOString();

      // console.log(
      //   "getArrDays",
      //   moment(new Date()).add(i, "days").startOf("day").toDate()
      // );

      //date DD/MM/YYYY kiểu string
      // object.value =
      //   "" +
      //   moment(new Date())
      //     .add(i, "days")
      //     .startOf("day")
      //     .format(dateFormat.SEND_TO_SERVER);

      allDays.push(object);
    }
    console.log("allDays", allDays);

    return allDays;
  };

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.language !== prevProps.language) {
      let allDays = this.getArrDays(this.props.language);
      this.setState({ allDays: allDays });
    }

    //chỗ này tự động nạp kế hoạch khám bệnh của bác sĩ
    if (this.props.DetailDoctor !== prevProps.DetailDoctor) {
      let allDays = this.getArrDays(this.props.language);
      this.loadSchedule(
        this.props.DetailDoctor.id,
        allDays[0].value,
        this.props.DetailDoctor.clinicId
      );
    }
  }

  //hàm này dùng để lấy kế hoạch khám bệnh của bác sĩ theo id bác sĩ, id phòng khám trong ngày được chọn
  //và lưu vào state schedule
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

  //Hàm này dùng để khi bệnh nhân chọn ngày thì sẽ gọi lấy các giờ khám trong ngày đó
  handleOnChangeSelect = async (event) => {
    //console.log("handleOnChangeSelect", event.target.value);
    if (this.props.DetailDoctor && this.props.DetailDoctor.id) {
      let doctorId = this.props.DetailDoctor.id;
      let date = event.target.value;
      let clinicId = this.props.DetailDoctor.clinicId;
      this.loadSchedule(doctorId, date, clinicId);
    }
  };

  //hàm này dùng để mở form đặt lịch bookingModal và truyền props cho bookingModal
  handleClickScheduleTime = async (time) => {
    let { isLoggedIn } = this.props;
    if (!isLoggedIn) {
      this.setState({
        isOpenCheckLoginModal: true,
      });
    } else {
      await this.fetchCookigetUserAccount();
      //console.log(this.state.patientData);
      this.setState({
        isOpenModalBooking: true,
        selectedSchedule: {
          ...time,
          date: this.state.schedule.date,
        },
      });
      //console.log("this.state.schedule.date", this.state.schedule.date);
    }

    //console.log("isLoggedIn", isLoggedIn);
  };

  closeBookingModal = () => {
    this.setState({
      isOpenModalBooking: false,
    });
  };

  closeCheckModal = () => {
    this.setState({
      isOpenCheckLoginModal: false,
    });
  };

  goToLogin = () => {
    if (this.props.history) {
      const prevLocation = window.location.pathname;
      this.props.history.push(`/login?redirectTo=${prevLocation}`);
    }
  };

  render() {
    let {
      allDays,
      schedule,

      patientData,

      isOpenModalBooking,
      isOpenCheckLoginModal,

      selectedSchedule,
    } = this.state;
    let { DetailDoctor } = this.props;
    //console.log("check state", this.state);
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
          show={isOpenModalBooking}
          handleClose={this.closeBookingModal}
          selectedSchedule={selectedSchedule}
          DetailDoctor={DetailDoctor}
          PatientData={patientData}
        />

        {/* Modal yêu cầu đăng nhập */}
        <Modal show={isOpenCheckLoginModal} onHide={this.closeCheckModal}>
          <Modal.Header closeButton>
            <Modal.Title>Thông báo đăng nhập</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Bạn vui lòng đăng nhập tài khoản để đặt lịch khám bệnh</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={() => this.goToLogin()}>
              Đăng nhập
            </Button>
            <Button variant="secondary" onClick={this.closeCheckModal}>
              Thoát
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
    isLoggedIn: state.user.isLoggedIn,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(DoctorSchedule)
);
