//video 82
import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import "./ManagePatient.scss";
import DatePicker from "../../../components/Input/DatePicker";
import {
  doctorFetchBooking,
  updateBooking,
} from "../../../services/bookingService";
import moment from "moment";
import { Button, Modal } from "react-bootstrap";
import { LANGUAGES } from "../../../utils";
import { toast } from "react-toastify";

class ManagePatient extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // currentDate: moment(new Date()).startOf("day").valueOf(),
      currentDate: new Date(),

      listBooking: [],
      isOpenConfirmModal: false,
      updatedBooking: {},

      bookingId: "",
      bookingStatusId: "",
      bookingStatusEN: "",
      bookingStatusVI: "",
      patientName: "",
      patientGender: 1,
      patientPhone: "",
      patientEmail: "",
      patientAddress: "",
      reason: "",
      time: "",

      note: "",
    };
  }
  componentDidMount() {
    let { currentDate } = this.state;
    //let formatedDate = moment(currentDate).format("DD/MM/YYYY");
    // console.log("currentDate", currentDate);
    // console.log("formatedDate", formatedDate);
    let formatedDate = currentDate.toISOString();
    this.loadBooking(formatedDate);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.language === prevProps.language) {
    }
    if (this.state.updatedBooking !== prevState.updatedBooking) {
      let { currentDate } = this.state;
      //let formatedDate = moment(currentDate).format("DD/MM/YYYY");
      this.loadBooking(currentDate);
    }
  }

  loadBooking = async (date) => {
    try {
      let res = await doctorFetchBooking(date);
      console.log("check booking", res.DT);
      if (res && +res.EC === 0) {
        this.setState({ listBooking: res.DT });
      }
    } catch (error) {
      console.log(error);
    }
  };

  handleOnchangeDatePicker = (date) => {
    this.setState(
      {
        currentDate: date[0],
      },
      () => {
        let { currentDate } = this.state;
        //let formatedDate = moment(currentDate).format("DD/MM/YYYY");
        this.loadBooking(currentDate);
      }
    );
    //console.log("handleOnchangeDatePicker", this.state.currentDate);
  };

  //Mở Modal xác nhận lịch hẹn
  handleOpenConfirmModal = (booking) => {
    this.setState({
      isOpenConfirmModal: true,
      updatedBooking: booking,

      bookingId: booking.id,
      bookingStatusId: booking.Bookingstatus.id,
      bookingStatusEN: booking.Bookingstatus.nameEN,
      bookingStatusVI: booking.Bookingstatus.nameVI,
      patientName: booking.Patient.username,
      patientGender: booking.Patient.genderId,
      patientPhone: booking.Patient.phone,
      patientEmail: booking.Patient.email,
      patientAddress: booking.Patient.address,
      reason: booking.reason,
      time: booking.Schedule_Detail.Timeframe.nameVI,
      note: booking.note,
    });
  };

  handleConfirm = async (bookingId, reqCode) => {
    try {
      if (!this.state.note) {
        toast.warn("Vui lòng nhập ghi chú");
        return;
      }
      let res = await updateBooking({
        bookingId: bookingId,
        reqCode: reqCode,
        note: this.state.note,
      });
      if (res && +res.EC === 0) {
        this.setState({ updatedBooking: res.DT });
        toast.success(res.EM);
        this.closeConfirmModal();
      } else {
        toast.warn(res.EM);
      }
    } catch (error) {
      console.log(error);
    }
  };

  closeConfirmModal = () => {
    this.setState({
      isOpenConfirmModal: false,
    });
  };

  handleOnchangeStatus = (value) => {
    this.setState({
      bookingStatusId: value,
    });
  };

  handleOnChangeNote = (note) => {
    this.setState({
      note: note,
    });
  };

  render() {
    let today = moment(new Date()).format("DD/MM/YYYY");
    let seletedDate = moment(this.state.currentDate).format("DD/MM/YYYY");
    console.log();
    let {
      listBooking,

      bookingId,
      bookingStatusId,
      bookingStatusEN,
      bookingStatusVI,
      patientName,
      patientGender,
      patientPhone,
      patientEmail,
      patientAddress,
      reason,
      time,
      note,
    } = this.state;
    let { language } = this.props;
    console.log("booking", bookingStatusId);
    let gender = "Nam";
    if (+patientGender === 1) {
      gender = "Nam";
    } else if (+patientGender === 2) {
      gender = "Nữ";
    } else {
      gender = "Khác";
    }
    return (
      <>
        <div className="manage-patient container mt-5">
          <h4 className="manage-patient-title ms-title my-3">
            Quản lý lịch hẹn của bệnh nhân
          </h4>
          <div className="manage-patient-content shadow p-3 mb-5 bg-white rounded">
            <div className="date-picker row">
              <div className="col-3 form-group">
                <label>Chọn ngày khám:</label>
                <DatePicker
                  className="form-control"
                  onChange={this.handleOnchangeDatePicker}
                  value={this.state.currentDate}
                />
              </div>
            </div>
            <div className="table-patient row mt-3">
              <div className="col-12 table-manage-patient">
                <table className="table table-bordered table-hover">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Thời gian</th>
                      <th>Họ tên</th>
                      <th>Giới tính</th>
                      <th>Trạng thái lịch hẹn</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listBooking &&
                      listBooking.length > 0 &&
                      listBooking.map((item, index) => {
                        return (
                          <>
                            <tr key={index}>
                              <td>{item.id}</td>
                              <td>
                                {language === LANGUAGES.VI
                                  ? item.Schedule_Detail.Timeframe.nameVI
                                  : item.Schedule_Detail.Timeframe.nameEN}
                              </td>
                              <td>{item.Patient.username}</td>
                              <td>
                                {language === LANGUAGES.VI
                                  ? item.Patient.Gender.nameVI
                                  : item.Patient.Gender.nameEN}
                              </td>
                              <td>
                                {language === LANGUAGES.VI
                                  ? item.Bookingstatus.nameVI
                                  : item.Bookingstatus.nameEN}
                              </td>

                              <td>
                                <button
                                  className="btn btn-primary m-2"
                                  onClick={() =>
                                    this.handleOpenConfirmModal(item)
                                  }
                                >
                                  {item.Bookingstatus.id === 4 &&
                                  today === seletedDate
                                    ? "Xác nhận"
                                    : "Xem thông tin"}
                                </button>
                                {item.Bookingstatus.id === 4 &&
                                today === seletedDate ? (
                                  <button
                                    className="btn btn-danger m-2"
                                    onClick={() =>
                                      this.handleConfirm(item.id, 5)
                                    }
                                  >
                                    Không đi khám
                                  </button>
                                ) : (
                                  <></>
                                )}
                              </td>
                            </tr>
                          </>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <Modal
          show={this.state.isOpenConfirmModal}
          onHide={this.closeConfirmModal}
          centered
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>Thông tin bệnh nhân</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="appointment-info container">
              <div className="patient-info row">
                <div className="patient-name col-4 form-group">
                  <label>Họ tên:</label>
                  <input
                    className="form-control"
                    type="text"
                    value={patientName}
                    disabled
                  />
                </div>
                <div className="patient-gender col-4 form-group">
                  <label>Giới tính:</label>
                  <input
                    className="form-control"
                    type="text"
                    value={gender}
                    disabled
                  />
                </div>
                <div className="patient-phone col-4 form-group">
                  <label>Số điện thoại:</label>
                  <input
                    className="form-control"
                    type="text"
                    value={patientPhone}
                    disabled
                  />
                </div>
                <div className="patient-email col-4 form-group">
                  <label>Email liên hệ:</label>
                  <input
                    className="form-control"
                    type="text"
                    value={patientEmail}
                    disabled
                  />
                </div>
                <div className="patient-address col-8 form-group">
                  <label>Địa chỉ:</label>
                  <input
                    className="form-control"
                    type="text"
                    value={patientAddress}
                    disabled
                  />
                </div>
                <div className="booking-time col-4 form-group">
                  <label>Ngày khám:</label>
                  <input
                    className="form-control"
                    type="text"
                    value={moment(this.state.date).format("dddd - DD/MM/YYYY")}
                    disabled
                  />
                </div>
                <div className="booking-time col-4 form-group">
                  <label>Giờ khám:</label>
                  <input
                    className="form-control"
                    type="text"
                    value={time}
                    disabled
                  />
                </div>
                <div className="patient-reason col-12 form-group">
                  <label>Lý do khám bệnh:</label>
                  <textarea
                    className="form-control"
                    type="text"
                    value={reason}
                    disabled
                  ></textarea>
                </div>
                <div className="booking-status col-4 form-group">
                  <label>Trạng thái lịch hẹn:</label>
                  <input
                    className="form-control"
                    type="text"
                    value={
                      language === LANGUAGES.VI
                        ? bookingStatusVI
                        : bookingStatusEN
                    }
                    disabled
                  />
                </div>
                <div className="booking-note col-12 form-group">
                  <label>Ghi chú:</label>
                  <textarea
                    className="form-control"
                    value={note}
                    onChange={(event) => {
                      this.handleOnChangeNote(event.target.value);
                    }}
                  ></textarea>
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.closeConfirmModal}>
              Thoát
            </Button>
            {bookingStatusId === 4 && today === seletedDate ? (
              <Button
                variant="primary"
                onClick={() => this.handleConfirm(bookingId, 4)}
              >
                Xác nhận đã khám
              </Button>
            ) : (
              <></>
            )}
          </Modal.Footer>
        </Modal>
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

export default connect(mapStateToProps, mapDispatchToProps)(ManagePatient);
