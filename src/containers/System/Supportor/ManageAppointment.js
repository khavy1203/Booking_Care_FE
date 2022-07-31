import React, { Component } from "react";
import { connect } from "react-redux";
import "./ManageAppointment.scss";
//import { FormattedMessage } from "react-intl";
import {
  partnerFetchBooking,
  updateBooking,
} from "../../../services/bookingService";
import moment from "moment";
import { Button, Modal } from "react-bootstrap";
import { LANGUAGES } from "../../../utils";

class ManageAppointment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //Thông tin bệnh nhân
      patientName: "",
      patientPhone: "",
      patientEmail: "",
      bookingDate: "",
      reason: "",
      address: "",
      timeEN: "",
      timeVI: "",
      createdAt: "",

      //Thông tin bác sĩ
      doctorName: "",
      degree_VI: "",
      degree_EN: "",
      clinicVI: "",
      clinicEN: "",
      specialtyEN: "",
      specialtyVI: "",

      isOpenReviewModal: false,
      isOpenCancelModal: false,
      isOpenConfirmModal: false,

      rowCount: 0,
      selectedTab: 1,
      listBooking: [],
      selectedBooking: {},
      updatedBooking: {},
    };
  }

  componentDidMount() {
    this.loadBooking(this.state.selectedTab);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.language === prevProps.language) {
    }

    //mỗi khi chọn Tab sẽ cần nạp lại danh sách booking theo Tab được chọn
    if (this.state.selectedTab !== prevState.selectedTab) {
      this.loadBooking(this.state.selectedTab);
    }

    //mỗi khi cập nhật trạng thái của 1 lịch hẹn thì sẽ rerender lại và lấy danh sách mới
    if (this.state.updatedBooking !== prevState.updatedBooking) {
      this.loadBooking(this.state.selectedTab);
    }
  }

  //mỗi khi chọn Tab thì sẽ gọi hàm này
  loadBooking = async (selectedTab) => {
    try {
      let res = await partnerFetchBooking(selectedTab);
      console.log("check booking", res.DT);
      if (res && +res.EC === 0) {
        this.setState({ listBooking: res.DT.rows, rowCount: res.DT.count });
      }
    } catch (error) {
      console.log(error);
    }
  };

  //hàm cập nhật trạng thái booking
  updateStatusBooking = async (data) => {
    try {
      console.log("check dât", data);
      let res = await updateBooking(data);
      console.log("check updated booking", res.DT);
      if (res && +res.EC === 0) {
        this.setState({ updatedBooking: res.DT });
      }
    } catch (error) {
      console.log(error);
    }
  };

  //Hàm chuyển trạng thái booking từ new -> chờ xác nhận
  handleNewToNeedConfirm = async (bookingId, reqCode) => {
    await this.updateStatusBooking({ bookingId: bookingId, reqCode: reqCode });
  };

  //Mở modal hủy lịch hẹn
  handleOpenCancelModal = (booking) => {
    this.setState({ selectedBooking: booking, isOpenCancelModal: true });
  };
  //Hàm chuyển trạng thái booking sang hủy
  handleCancel = async (bookingId, reqCode) => {
    await this.updateStatusBooking({ bookingId: bookingId, reqCode: reqCode });
    this.closeCancelModal();
  };
  //Đóng model hủy lịch hẹn
  closeCancelModal = () => {
    this.setState({
      isOpenCancelModal: false,
    });
  };

  //Mở Modal xem thông tin
  handleOpenReviewModal = (booking) => {
    this.setState({
      selectedBooking: booking,
      //Thông tin bệnh nhân
      patientName: booking.Patient.username,
      patientPhone: booking.Patient.phone,
      patientEmail: booking.Patient.email,
      bookingDate: booking.date,
      reason: booking.reason,
      address: booking.Patient.address,
      createdAt: booking.createdAt,
      timeEN: booking.Schedule_Detail.Timeframe.nameEN,
      timeVI: booking.Schedule_Detail.Timeframe.nameVI,

      //Thông tin bác sĩ
      doctorName: booking.Doctor.username,
      degree_VI: booking.Doctor.Doctorinfo.degree_VI,
      degree_EN: booking.Doctor.Doctorinfo.degree_EN,
      clinicVI: booking.Clinic.nameVI,
      clinicEN: booking.Clinic.nameEN,
      specialtyEN: booking.Doctor.Specialty.nameVI,
      specialtyVI: booking.Doctor.Specialty.nameEN,

      isOpenReviewModal: true,
    });
  };
  //Đóng Modal xem thông tin
  closeReviewModal = () => {
    this.setState({
      isOpenReviewModal: false,
    });
  };

  //Mở Modal xác nhận lịch hẹn
  handleOpenConfirmModal = (booking) => {
    this.setState({
      selectedBooking: booking,

      //Thông tin bệnh nhân
      patientName: booking.Patient.username,
      patientPhone: booking.Patient.phone,
      patientEmail: booking.Patient.email,
      bookingDate: booking.date,
      reason: booking.reason,
      address: booking.Patient.address,
      createdAt: booking.createdAt,
      timeEN: booking.Schedule_Detail.Timeframe.nameEN,
      timeVI: booking.Schedule_Detail.Timeframe.nameVI,

      //Thông tin bác sĩ
      doctorName: booking.Doctor.username,
      degree_VI: booking.Doctor.Doctorinfo.degree_VI,
      degree_EN: booking.Doctor.Doctorinfo.degree_EN,
      clinicVI: booking.Clinic.nameVI,
      clinicEN: booking.Clinic.nameEN,
      specialtyEN: booking.Doctor.Specialty.nameVI,
      specialtyVI: booking.Doctor.Specialty.nameEN,

      isOpenConfirmModal: true,
    });
  };
  //Hàm chuyển trạng thái booking từ chờ xác nhận -> đã xác nhận
  handleConfirm = async (bookingId, reqCode) => {
    await this.updateStatusBooking({ bookingId: bookingId, reqCode: reqCode });
    this.closeConfirmModal();
  };
  //Đóng model hủy lịch hẹn
  closeConfirmModal = () => {
    this.setState({
      isOpenConfirmModal: false,
    });
  };

  render() {
    let {
      selectedTab,
      rowCount,
      listBooking,
      selectedBooking,

      //Thông tin bệnh nhân
      patientName,
      patientPhone,
      patientEmail,
      bookingDate,
      reason,
      address,
      createdAt,
      timeEN,
      timeVI,

      //Thông tin bác sĩ
      doctorName,
      degree_VI,
      degree_EN,
      clinicVI,
      clinicEN,
      specialtyEN,
      specialtyVI,
    } = this.state;
    //console.log(selectedBooking);
    let { language } = this.props;
    return (
      <div className="appointment container mt-5">
        <h4 className="appointment-title ms-title my-3">
          Quản lý lịch hẹn của bệnh nhân
        </h4>
        <div className="appointment-content p-3 shadow p-3 mb-5 bg-white rounded">
          <div className="appointment-tabs">
            <div
              className={selectedTab === 1 ? "tab active" : "tab new"}
              onClick={() => {
                this.setState({ selectedTab: 1 });
              }}
            >
              Bệnh nhân mới {selectedTab === 1 ? `(${rowCount})` : ""}
            </div>
            <div
              className={selectedTab === 2 ? "tab active" : "tab"}
              onClick={() => {
                this.setState({ selectedTab: 2 });
              }}
            >
              Cần xác nhận {selectedTab === 2 ? `(${rowCount})` : ""}
            </div>
            <div
              className={selectedTab === 4 ? "tab active" : "tab"}
              onClick={() => {
                this.setState({ selectedTab: 4 });
              }}
            >
              Đã xác nhận {selectedTab === 4 ? `(${rowCount})` : ""}
            </div>
            <div
              className={selectedTab === 3 ? "tab active" : "tab"}
              onClick={() => {
                this.setState({ selectedTab: 3 });
              }}
            >
              Hủy {selectedTab === 3 ? `(${rowCount})` : ""}
            </div>
          </div>
          <div className="appointment-table">
            <table className="table table-bordered table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Họ tên</th>
                  <th>Số điện thoại</th>
                  <th>Email</th>
                  <th>Ngày cập nhật</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {listBooking &&
                  listBooking.length > 0 &&
                  listBooking.map((item, index) => {
                    let bookDate = moment(item.updatedAt).format("DD/MM/YYYY");
                    let bookHour = moment(item.updatedAt).format("HH:mm");
                    return (
                      <tr key={index}>
                        <td>{item.id}</td>
                        <td>{item.Patient.username}</td>
                        <td>{item.Patient.phone}</td>
                        <td>{item.Patient.email}</td>
                        <td>{`${bookDate} - ${bookHour}`}</td>
                        <td>
                          {selectedTab === 1 && (
                            <>
                              <button
                                className="btn btn-primary m-2"
                                onClick={() =>
                                  this.handleNewToNeedConfirm(item.id, 1)
                                }
                              >
                                Tiếp nhận
                              </button>
                            </>
                          )}
                          {selectedTab === 2 && (
                            <>
                              <button
                                className="btn btn-primary m-2"
                                onClick={() =>
                                  this.handleOpenConfirmModal(item)
                                }
                              >
                                Xác nhận
                              </button>
                              <button
                                className="btn btn-danger"
                                onClick={() => this.handleOpenCancelModal(item)}
                              >
                                Hủy
                              </button>
                            </>
                          )}
                          {selectedTab === 4 && (
                            <>
                              <button
                                className="btn btn-primary m-2"
                                onClick={() => this.handleOpenReviewModal(item)}
                              >
                                Xem thông tin
                              </button>

                              <button
                                className="btn btn-danger"
                                onClick={() => this.handleOpenCancelModal(item)}
                              >
                                Hủy
                              </button>
                            </>
                          )}
                          {selectedTab === 3 && (
                            <>
                              <button
                                className="btn btn-primary"
                                onClick={() => this.handleOpenReviewModal(item)}
                              >
                                Xem thông tin
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal hủy lịch hẹn */}
        <Modal
          show={this.state.isOpenCancelModal}
          onHide={this.closeCancelModal}
        >
          {/* <Modal.Header closeButton>
            <Modal.Title>Thông tin lịch hẹn</Modal.Title>
          </Modal.Header> */}
          <Modal.Body>Xác nhận hủy lịch hẹn này?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.closeCancelModal}>
              Thoát
            </Button>
            <Button
              variant="primary"
              onClick={() => this.handleCancel(selectedBooking.id, 2)}
            >
              Xác nhận
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal xem thông tin */}
        <Modal
          show={this.state.isOpenReviewModal}
          onHide={this.closeReviewModal}
          centered
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>Thông tin lịch hẹn</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="appointment-info container">
              <div className="patient-info row">
                <h5>Thông tin bệnh nhân</h5>
                <div className="patient-name col-4 form-group">
                  <label>Họ tên:</label>
                  <input
                    className="form-control"
                    type="text"
                    value={patientName}
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
                <div className="patient-address col-4 form-group">
                  <label>Địa chỉ:</label>
                  <input
                    className="form-control"
                    type="text"
                    value={address}
                    disabled
                  />
                </div>
                <div className="patient-createdAt col-4 form-group">
                  <label>Ngày tạo lịch hẹn :</label>
                  <input
                    className="form-control"
                    type="text"
                    value={`${moment(createdAt).format(
                      "DD/MM/YYYY"
                    )} - ${moment(createdAt).format("HH:mm")}`}
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
              </div>
              <hr />
              <div className="doctor-info row">
                <h5>Thông tin khám bệnh</h5>
                <div className="patient-booking-date col-3 form-group">
                  <label>Ngày hẹn khám bệnh: </label>
                  <input
                    className="form-control"
                    type="text"
                    value={moment(bookingDate).format("dddd - DD/MM/YYYY")}
                    disabled
                  />
                </div>
                <div className="patient-time col-3 form-group">
                  <label>Giờ hẹn: </label>
                  <input
                    className="form-control"
                    type="text"
                    value={language === LANGUAGES.VI ? timeVI : timeEN}
                    disabled
                  />
                </div>
                <div className="doctor-specialty col-6 form-group">
                  <label>Khám chuyên khoa:</label>
                  <input
                    className="form-control"
                    type="text"
                    value={
                      language === LANGUAGES.VI
                        ? `${specialtyVI}`
                        : `${specialtyEN}`
                    }
                    disabled
                  />
                </div>
                <div className="doctor-name col-6 form-group">
                  <label>Bác sĩ:</label>
                  <input
                    className="form-control"
                    type="text"
                    value={
                      language === LANGUAGES.VI
                        ? `${degree_VI} ${doctorName}`
                        : `${degree_EN} ${doctorName}`
                    }
                    disabled
                  />
                </div>
                <div className="patient-phone col-6 form-group">
                  <label>Khám tại:</label>
                  <input
                    className="form-control"
                    type="text"
                    value={
                      language === LANGUAGES.VI ? `${clinicVI}` : `${clinicEN}`
                    }
                    disabled
                  />
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="warning" onClick={this.closeReviewModal}>
              Thoát
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal Xác nhận lịch hẹn */}
        <Modal
          show={this.state.isOpenConfirmModal}
          onHide={this.closeConfirmModal}
          centered
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>Xác nhận lịch hẹn</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="appointment-info container">
              <div className="patient-info row">
                <h5>Thông tin bệnh nhân</h5>
                <div className="patient-name col-4 form-group">
                  <label>Họ tên:</label>
                  <input
                    className="form-control"
                    type="text"
                    value={patientName}
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
                <div className="patient-address col-4 form-group">
                  <label>Địa chỉ:</label>
                  <input
                    className="form-control"
                    type="text"
                    value={address}
                    disabled
                  />
                </div>
                <div className="patient-createdAt col-4 form-group">
                  <label>Ngày tạo lịch hẹn :</label>
                  <input
                    className="form-control"
                    type="text"
                    value={`${moment(createdAt).format(
                      "DD/MM/YYYY"
                    )} - ${moment(createdAt).format("HH:mm")}`}
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
              </div>
              <hr />
              <div className="doctor-info row">
                <h5>Thông tin khám bệnh</h5>
                <div className="patient-booking-date col-3 form-group">
                  <label>Ngày hẹn khám bệnh: </label>
                  <input
                    className="form-control"
                    type="text"
                    value={bookingDate}
                    disabled
                  />
                </div>
                <div className="patient-time col-3 form-group">
                  <label>Giờ hẹn: </label>
                  <input
                    className="form-control"
                    type="text"
                    value={language === LANGUAGES.VI ? timeVI : timeEN}
                    disabled
                  />
                </div>
                <div className="doctor-specialty col-6 form-group">
                  <label>Khám chuyên khoa:</label>
                  <input
                    className="form-control"
                    type="text"
                    value={
                      language === LANGUAGES.VI
                        ? `${specialtyVI}`
                        : `${specialtyEN}`
                    }
                    disabled
                  />
                </div>
                <div className="doctor-name col-6 form-group">
                  <label>Bác sĩ:</label>
                  <input
                    className="form-control"
                    type="text"
                    value={
                      language === LANGUAGES.VI
                        ? `${degree_VI} ${doctorName}`
                        : `${degree_EN} ${doctorName}`
                    }
                    disabled
                  />
                </div>
                <div className="patient-phone col-6 form-group">
                  <label>Khám tại:</label>
                  <input
                    className="form-control"
                    type="text"
                    value={
                      language === LANGUAGES.VI ? `${clinicVI}` : `${clinicEN}`
                    }
                    disabled
                  />
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.closeConfirmModal}>
              Hủy
            </Button>
            <Button
              variant="primary"
              onClick={() => this.handleConfirm(selectedBooking.id, 3)}
            >
              Xác nhận
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(ManageAppointment);
