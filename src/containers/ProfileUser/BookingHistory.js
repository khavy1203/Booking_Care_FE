//video 82
import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import HomeHeader from "../HomePage/HomeHeader";
import { Link } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import {
  patientFetchBooking,
  updateBooking,
} from "../../services/bookingService";

import moment from "moment";
import { toast } from "react-toastify";
import ModalUpdateBooking from "./ModalUpdateBooking";
import ModalCancelBooking from "./ModalCancelBooking";

class BookingHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpenReviewModal: false,
      isOpenUpdateModal: false,
      isOpenCancelModal: false,

      selectedBooking: {},
      listBooking: [],
      rowCount: "",

      //Thông tin bệnh nhân
      bookingDate: "",
      reason: "",
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

      bookingStatusId: "",
      note: "",
    };
  }
  async componentDidMount() {
    await this.loadBooking();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {}

  loadBooking = async () => {
    try {
      let res = await patientFetchBooking();
      //console.log("check booking", res.DT);
      if (res && +res.EC === 0) {
        this.setState({
          listBooking: res.DT.rows,
          rowCount: res.DT.count,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  //Đóng Modal xem thông tin
  closeReviewModal = () => {
    this.setState({
      isOpenReviewModal: false,
    });
  };

  handleOpenReviewModal = (booking) => {
    this.setState({
      //Thông tin bệnh nhân
      bookingDate: booking.date,
      reason: booking.reason,
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

      bookingStatusId: booking.Bookingstatus.id,
      note: booking.note,

      isOpenReviewModal: true,
    });
  };

  handleOpenCancelModal = async (booking) => {
    await this.setState({
      selectedBooking: booking,
      isOpenCancelModal: true,
    });
  };

  handleCloseCancelModal = async (resultFromModal) => {
    await this.setState({
      isOpenCancelModal: false,
      //selectedBooking: {},
    });
    if (resultFromModal) {
      await this.loadBooking();
    }
  };

  // handleClickCancel = async (booking) => {
  //   let choose = window.confirm(`Bạn có muốn hủy lịch hẹn ${booking.id} này?`);
  //   if (choose === true) {
  //     let res = await updateBooking({ bookingId: booking.id, reqCode: 2 });
  //     //console.log("handleClickCancel", res.DT);
  //     if (res && +res.EC === 0) {
  //       toast.success(res.EM);
  //       await this.loadBooking();
  //     } else {
  //       toast.error(res.EM);
  //     }
  //   }
  // };

  handleCloseUpdateModal = async (updatedBookingFromModal) => {
    await this.setState({
      isOpenUpdateModal: false,
      //selectedBooking: {},
    });
    if (updatedBookingFromModal) {
      await this.loadBooking();
    }
  };

  handleOpenUpdateModal = async (booking) => {
    //console.log(booking);
    await this.setState({
      selectedBooking: booking,
      isOpenUpdateModal: true,
    });
  };

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  render() {
    let {
      selectedBooking,
      listBooking,
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
      bookingStatusId,
      note,
    } = this.state;
    return (
      <div>
        <HomeHeader />
        <div className="container">
          <div className="main-body">
            {/* Breadcrumb */}
            <nav aria-label="breadcrumb" className="main-breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/home">Home</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  <Link to="/user-profile">User Profile</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Lịch sử khám bệnh
                </li>
              </ol>
            </nav>
            {/* /Breadcrumb */}
          </div>
          <div className="table-patient row">
            <div className="col-12 table-manage-patient">
              <table className="table table-bordered table-hover">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Ngày hẹn</th>
                    <th>Giờ hẹn</th>
                    <th>Trạng thái</th>
                    <th>Ngày tạo</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {listBooking &&
                    listBooking.length > 0 &&
                    listBooking.map((item, index) => {
                      let createDate = this.capitalizeFirstLetter(
                        moment(item.createdAt)
                          .locale("vi")
                          .format("dddd - DD/MM/YYYY")
                      );
                      // let createDay = this.capitalizeFirstLetter(
                      //   moment(item.createdAt).locale("vi").format("dddd")
                      // );

                      let bookDate = this.capitalizeFirstLetter(
                        moment(item.date)
                          .locale("vi")
                          .format("dddd - DD/MM/YYYY")
                      );
                      // let bookDay = this.capitalizeFirstLetter(
                      //   moment(item.date).locale("vi").format("dddd")
                      //);
                      return (
                        <tr key={index}>
                          <th>{item.id}</th>

                          <th>{`${bookDate}`}</th>
                          <th>{item.Schedule_Detail.Timeframe.nameVI}</th>

                          <th>{item.Bookingstatus.nameVI}</th>
                          <th>{`${createDate}`}</th>

                          <td>
                            <button
                              className="btn btn-primary m-2"
                              onClick={() => this.handleOpenReviewModal(item)}
                            >
                              Thông tin
                            </button>
                            {item.Bookingstatus.id < 3 ? (
                              <>
                                <button
                                  className="btn btn-warning m-2"
                                  onClick={() =>
                                    this.handleOpenUpdateModal(item)
                                  }
                                >
                                  Cập nhật
                                </button>
                              </>
                            ) : (
                              <></>
                            )}
                            {item.Bookingstatus.id < 3 ||
                            item.Bookingstatus.id === 4 ? (
                              <button
                                className="btn btn-danger m-2"
                                onClick={() => this.handleOpenCancelModal(item)}
                              >
                                Hủy
                              </button>
                            ) : (
                              <></>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
          <div className="row d-flex justify-content-end">
            <div className="col-1">
              <button className="btn btn-primary">
                <Link
                  to="/user-profile"
                  style={{ textDecoration: "none", color: "white" }}
                >
                  Quay về
                </Link>
              </button>
            </div>
          </div>
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
                  <h5>Thông tin cá nhân</h5>

                  <div className="patient-createdAt col-4 form-group">
                    <label>Ngày đặt lịch:</label>
                    <input
                      className="form-control"
                      type="text"
                      value={`${this.capitalizeFirstLetter(
                        moment(createdAt).format("dddd - DD/MM/YYYY")
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
                      value={this.capitalizeFirstLetter(
                        moment(bookingDate).format("dddd - DD/MM/YYYY")
                      )}
                      disabled
                    />
                  </div>
                  <div className="patient-time col-3 form-group">
                    <label>Giờ hẹn: </label>
                    <input
                      className="form-control"
                      type="text"
                      value={timeVI}
                      disabled
                    />
                  </div>
                  <div className="doctor-specialty col-6 form-group">
                    <label>Khám chuyên khoa:</label>
                    <input
                      className="form-control"
                      type="text"
                      value={specialtyVI}
                      disabled
                    />
                  </div>
                  <div className="doctor-name col-6 form-group">
                    <label>Bác sĩ:</label>
                    <input
                      className="form-control"
                      type="text"
                      value={`${degree_VI} ${doctorName}`}
                      disabled
                    />
                  </div>
                  <div className="patient-phone col-6 form-group">
                    <label>Khám tại:</label>
                    <input
                      className="form-control"
                      type="text"
                      value={clinicVI}
                      disabled
                    />
                  </div>
                  <div className="patient-phone col-12 form-group">
                    <label>
                      {bookingStatusId === 3 ? "Lý do hủy:" : "Ghi chú:"}
                    </label>
                    <textarea
                      className="form-control"
                      value={note}
                      disabled
                    ></textarea>
                  </div>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={this.closeReviewModal}>
                Thoát
              </Button>
            </Modal.Footer>
          </Modal>
          <ModalUpdateBooking
            show={this.state.isOpenUpdateModal}
            handleClose={this.handleCloseUpdateModal}
            selectedBooking={selectedBooking}
          ></ModalUpdateBooking>
          <ModalCancelBooking
            showModalCancel={this.state.isOpenCancelModal}
            closeModalCancel={this.handleCloseCancelModal}
            selectedBooking={selectedBooking}
          />
        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(BookingHistory);
