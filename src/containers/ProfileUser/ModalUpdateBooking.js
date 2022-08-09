//video 82
import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { Button, Modal } from "react-bootstrap";
import moment from "moment";
import { fetchCurrentSchedule } from "../../services/scheduleService";
import { changeBooking } from "../../services/bookingService";
import { toast } from "react-toastify";
class ModalUpdateBooking extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedScheduleId: "",
      chosenDate: "", //chosenDate là để kiểm tra bên back end
      listSchedule: [],
      listTime: [],
      selectedTimeId: "",

      //những thông tin hiện tại của booking (chưa thay đổi)
      bookingId: "",
      bookingDate: "",
      reason: "",
      createdAt: "",
      timeId: "",
      timeEN: "",
      timeVI: "",

      //Thông tin bác sĩ
      doctorId: "",
      doctorName: "",
      degree_VI: "",
      degree_EN: "",

      clinicId: "",
      clinicVI: "",
      clinicEN: "",
      specialtyEN: "",
      specialtyVI: "",
    };
  }
  componentDidMount() {}

  getBookingFromBookingHistory = async (booking) => {
    await this.setState({
      bookingId: booking.id,
      bookingDate: booking.date,
      reason: booking.reason,
      createdAt: booking.createdAt,
      //timeId: selectedBooking.Schedule_Detail.Timeframe.id,
      timeEN: booking.Schedule_Detail.Timeframe.nameEN,
      timeVI: booking.Schedule_Detail.Timeframe.nameVI,

      //Thông tin bác sĩ
      doctorId: booking.Doctor.id,
      doctorName: booking.Doctor.username,
      degree_VI: booking.Doctor.Doctorinfo.degree_VI,
      degree_EN: booking.Doctor.Doctorinfo.degree_EN,

      clinicId: booking.Clinic.id,
      clinicVI: booking.Clinic.nameVI,
      clinicEN: booking.Clinic.nameEN,
      specialtyEN: booking.Doctor.Specialty.nameVI,
      specialtyVI: booking.Doctor.Specialty.nameEN,
    });
  };

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.language === prevProps.language) {
    }
    if (this.props.selectedBooking !== prevProps.selectedBooking) {
      let { show, selectedBooking } = this.props;
      console.log(selectedBooking);
      if (show === true) {
        await this.getBookingFromBookingHistory(selectedBooking);
        let { doctorId, clinicId } = this.state;
        await this.loadSchedule(doctorId, clinicId);
      }
    }
  }

  loadSchedule = async (doctorId, clinicId) => {
    try {
      let res = await fetchCurrentSchedule(doctorId, clinicId);
      if (res && +res.EC === 0) {
        this.setState({
          listSchedule: res.DT,
        });
        console.log("listSchedule", this.state.listSchedule);
      } else {
        console.log(res.EM);
        this.setState({
          schedule: {},
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  getScheduleDetail = async (scheduleId) => {
    //console.log(this.state.selectedScheduleId);
    let schedule = [];
    let { listSchedule } = this.state;
    schedule = listSchedule.filter((item) => {
      if (item.id === +scheduleId) {
        return true;
      }
      return false;
    });
    await this.setState({
      chosenDate: schedule[0].date,
      listTime: schedule[0].Schedule_Details,
    });
    //console.log(schedule[0]);
  };

  handleOnchangeScheduleDate = async (eventScheduleId) => {
    //khi chọn ngày khác thì set selectedTimeId lại rỗng để ko lưu value cũ
    await this.setState({
      selectedScheduleId: eventScheduleId,
      selectedTimeId: "",
    });
    if (this.state.selectedScheduleId !== "")
      this.getScheduleDetail(this.state.selectedScheduleId);
  };

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  resetState = async () => {
    await this.setState({
      selectedScheduleId: "",
      selectedTimeId: "",
      // bookingDate: "",
      // timeVI: "",
      // reason: "",
    });
  };

  //scheduleDetail là time
  handleOnchangeTime = async (eventTimeId) => {
    await this.setState({
      selectedTimeId: eventTimeId,
    });
    //console.log("this.state.selectedTimeId", this.state.selectedTimeId);
  };

  handleOnchangeReason = async (eventReason) => {
    await this.setState({ reason: eventReason });
  };

  //Cần bookingId, scheduleDetailId, reason để cập nhật, scheduleId để kiểm tra
  changeCurrentBooking = async (
    bookingId,
    chosenDate,
    scheduleDetailId,
    reason
  ) => {
    try {
      if (!chosenDate) {
        toast.error("Bạn chưa chọn ngày khám");
        return;
      }
      if (!scheduleDetailId) {
        toast.error("Bạn chưa thời gian");
        return;
      }
      if (!reason) {
        toast.error("Bạn chưa nhập lý do khám");
        return;
      }

      let res = await changeBooking({
        bookingId: bookingId,
        chosenDate: chosenDate,
        scheduleDetailId: scheduleDetailId,
        reason: reason,
      });
      console.log("res", res.DT);
      if (res && +res.EC === 0) {
        toast.success(res.EM);
        this.resetState();
        this.props.handleClose(res.DT);
      } else toast.error(res.EM);
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    let {
      bookingId,
      timeId,
      clinicId,

      bookingDate,
      reason,
      //address,
      createdAt,
      //timeEN,
      timeVI,

      //Thông tin bác sĩ
      doctorName,
      degree_VI,
      //degree_EN,
      clinicVI,
      // clinicEN,
      // specialtyEN,
      specialtyVI,

      listSchedule,
      selectedScheduleId,
      listTime,
      selectedTimeId,
      chosenDate,
    } = this.state;
    // console.log(this.props.selectedBooking, bookingDate);
    return (
      <Modal
        show={this.props.show}
        onHide={this.props.handleClose}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Thông tin lịch hẹn</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="appointment-info container">
            <div className="doctor-info row">
              <div
                className="col-6"
                style={{ borderRight: "0.1px solid #dee2e6" }}
              >
                <h5>Thông tin bác sĩ</h5>
                <div className="form-group mt-2">
                  <label>Bác sĩ:</label>
                  <input
                    className="form-control"
                    type="text"
                    value={`${degree_VI} ${doctorName}`}
                    disabled
                  />
                </div>
                <div className="form-group mt-2">
                  <label>Chuyên khoa:</label>
                  <input
                    className="form-control"
                    type="text"
                    value={specialtyVI}
                    disabled
                  />
                </div>

                <div className="form-group mt-2">
                  <label>Phòng khám:</label>
                  <input
                    className="form-control"
                    type="text"
                    value={clinicVI}
                    disabled
                  />
                </div>
              </div>
              <div className="col-6 ">
                <h5>Cập nhật lịch hẹn</h5>
                <div className="row mt-2">
                  <div className="col-6 form-group ">
                    <label>Ngày hẹn: </label>
                    <input
                      className="form-control"
                      type="text"
                      value={this.capitalizeFirstLetter(
                        moment(bookingDate).format("dddd - DD/MM/YYYY")
                      )}
                      disabled
                    />
                  </div>
                  <div className="col-6 form-group">
                    <label>Giờ hẹn: </label>
                    <input
                      className="form-control"
                      type="text"
                      value={timeVI}
                      disabled
                    />
                  </div>
                  <div className="col-12 form-group  mt-2">
                    <label>Chọn ngày cập nhật:</label>
                    <select
                      className="form-control"
                      onChange={(event) => {
                        this.handleOnchangeScheduleDate(event.target.value);
                      }}
                      value={selectedScheduleId}
                    >
                      {listSchedule && listSchedule.length === 0 ? (
                        <option value="" disabled>
                          Bác sĩ chưa có lịch khám khác{" "}
                        </option>
                      ) : (
                        <option value="" disabled>
                          Vui lòng chọn ngày
                        </option>
                      )}

                      {listSchedule &&
                        listSchedule.length > 0 &&
                        listSchedule.map((schedule, index) => {
                          return (
                            <option
                              key={`schedule-date-${index}`}
                              value={schedule.id}
                            >
                              {this.capitalizeFirstLetter(
                                moment(schedule.date).format(
                                  "dddd - DD/MM/YYYY"
                                )
                              )}
                            </option>
                          );
                        })}
                    </select>
                  </div>
                  <div className="col-12 form-group  mt-2">
                    <label>Giờ khám hiện có: </label>
                    <select
                      className="form-control"
                      value={selectedTimeId}
                      onChange={(event) => {
                        this.handleOnchangeTime(event.target.value);
                      }}
                    >
                      <option value={""} disabled>
                        Vui lòng chọn giờ khám
                      </option>
                      {listTime &&
                        listTime.length > 0 &&
                        listTime.map((item, index) => {
                          return (
                            <option key={index} value={item.id}>
                              {item.Timeframe.nameVI}
                            </option>
                          );
                        })}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <hr />
            <div className="patient-info row">
              <h5>Thông tin cá nhân</h5>

              <div className="patient-reason col-12 form-group">
                <label>Lý do khám bệnh:</label>
                <textarea
                  className="form-control"
                  type="text"
                  onChange={(event) => {
                    this.handleOnchangeReason(event.target.value);
                  }}
                  value={reason}
                ></textarea>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              this.resetState();
              this.props.handleClose();
            }}
          >
            Thoát
          </Button>
          <Button
            variant="warning"
            onClick={() => {
              this.changeCurrentBooking(
                bookingId,
                chosenDate,
                selectedTimeId,
                reason
              );
            }}
          >
            Cập nhật
          </Button>
        </Modal.Footer>
      </Modal>
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

export default connect(mapStateToProps, mapDispatchToProps)(ModalUpdateBooking);
