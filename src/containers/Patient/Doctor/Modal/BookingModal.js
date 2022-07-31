//video 82, 85
//component này là một modal để điền thông tin đặt lịch
import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import "./BookingModal.scss";
import { Modal } from "react-bootstrap";
import ProfileDoctor from "../ProfileDoctor";
import _ from "lodash";
import { LANGUAGES } from "../../../../utils";
// import DatePicker from "../../../../components/Input/DatePicker";
import { createBooking } from "../../../../services/bookingService";
import { toast } from "react-toastify";
import validator from "validator";

//Cấu trúc Bookings[
//doctorId
//patientId
//schedule_detailId
//date
//reason
//]

class BookingModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //Các biến lấy ra cookie, chỉ hiển thị để bệnh nhân kiểm tra
      patientId: "", //id của bệnh nhân để tạo booking
      username: "",
      phone: "",
      email: "",
      address: "",
      genderId: 1,

      //Các biến lấy từ props
      doctorId: "", //lấy từ props DetailDoctor, để tạo booking
      scheduleDetailId: "", //lấy từ props selectedSchedule, để tạo booking
      date: "", //lấy từ props selectedSchedule, để tạo booking
      clinicId: "", //lấy từ props DetailDoctor, để tạo booking

      //lý do khám bệnh
      reason: "",
    };
  }
  componentDidMount() {}

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.selectedSchedule !== prevProps.selectedSchedule) {
      if (
        this.props.selectedSchedule &&
        !_.isEmpty(this.props.selectedSchedule)
      ) {
        let { date, id } = this.props.selectedSchedule;
        let doctorId = this.props.DetailDoctor.id;
        let clinicId = this.props.DetailDoctor.clinicId;
        this.setState({
          doctorId: doctorId,
          date: date,
          scheduleDetailId: id,
          clinicId: clinicId,
        });
      }
    }
    if (this.props.PatientData !== prevProps.PatientData) {
      if (this.props.PatientData && !_.isEmpty(this.props.PatientData)) {
        this.setState({
          patientId: this.props.PatientData.id,
          username: this.props.PatientData.username,
          phone: this.props.PatientData.phone,
          email: this.props.PatientData.email,
          address: this.props.PatientData.address,
          genderId: this.props.PatientData.genderId,
        });
        console.log(this.props.PatientData);
      }
    }
  }

  handleOnchangeInput = (event, id) => {
    let valueInput = event.target.value;
    let stateCopy = { ...this.state };
    stateCopy[id] = valueInput;
    this.setState({
      ...stateCopy,
    });
  };

  // handleOnchangeDatePicker = (date) => {
  //   this.setState({
  //     birthday: date[0],
  //   });
  // };

  handleBookingConfirm = async () => {
    try {
      // let {
      //   username,
      //   phone,
      //   email,
      //   address,
      //   genderId,
      //   doctorId,
      //   date,
      //   scheduleDetailId,
      // } = this.state;

      // if (!this.checkName(username)) return;
      // if (!this.checkEmail(email)) return;

      // let obj = {
      //   ...this.state,
      // };

      let { patientId, doctorId, scheduleDetailId, reason, date, clinicId } =
        this.state;
      let bookingData = {
        patientId,
        doctorId,
        scheduleDetailId,
        reason,
        date,
        clinicId,
      };
      let res = await createBooking(bookingData);
      if (res && +res.EC === 0) {
        toast.success(res.EM);
        this.props.handleClose();
      } else {
        toast.error(res.EM);
      }
      console.log(bookingData);
    } catch (error) {
      console.log(error);
    }
  };

  checkName = (value) => {
    if (validator.isEmpty(value)) {
      toast.error("Vui lòng nhập họ và tên");
      return false;
    }
    if (!validator.isAlpha(value, "vi-VN", { ignore: " " })) {
      toast.error("họ và tên không phù hợp");
      return false;
    }
    return true;
  };

  checkEmail = (value) => {
    if (validator.isEmpty(value)) {
      toast.error("Vui lòng nhập email");
      return false;
    }
    if (!validator.isEmail(value)) {
      toast.error("email không phù hợp");
      return false;
    }
    return true;
  };

  render() {
    let { DetailDoctor, selectedSchedule, language } = this.props;
    //let { doctorId } = this.state;
    //console.log(DetailDoctor);
    return (
      <Modal
        show={this.props.show}
        className={"booking-modal-container"}
        size="lg"
        centered
      >
        <div className="booking-modal-content">
          <div className="booking-modal-header">
            <span className="left">
              <FormattedMessage id="patient.booking-modal.title" />
            </span>
            <span className="right" onClick={this.props.handleClose}>
              <i className="fas fa-times"></i>
            </span>
          </div>
          <div className="booking-modal-body">
            <div className="doctor-info">
              <ProfileDoctor
                DetailDoctor={DetailDoctor}
                selectedSchedule={selectedSchedule}
                // isShowDescriptionDoctor={false}
                // isShowLinkDetail={false}
                // isShowPrice={true}
              />
            </div>

            <div className="row mt-3">
              <div className="col-6 form-group">
                <label>
                  <FormattedMessage id="patient.booking-modal.name" />
                </label>
                <input
                  className="form-control"
                  type="text"
                  // value={PatientData.username}
                  value={this.state.username}
                  onChange={(event) => {
                    this.handleOnchangeInput(event, "username");
                  }}
                />
              </div>
              <div className="col-6 form-group">
                <label>
                  <FormattedMessage id="patient.booking-modal.phone" />
                </label>
                <input
                  type="text"
                  className="form-control"
                  //value={PatientData.phone}
                  value={this.state.phone}
                  onChange={(event) => {
                    this.handleOnchangeInput(event, "phone");
                  }}
                />
              </div>
              <div className="col-6 form-group">
                <label>
                  <FormattedMessage id="patient.booking-modal.email" />
                </label>
                <input
                  type="text"
                  className="form-control"
                  //value={PatientData.email}
                  value={this.state.email}
                  onChange={(event) => {
                    this.handleOnchangeInput(event, "email");
                  }}
                />
              </div>
              <div className="col-6 form-group">
                <label>
                  <FormattedMessage id="patient.booking-modal.address" />
                </label>
                <input
                  type="text"
                  className="form-control"
                  //value={PatientData.address}
                  value={this.state.address}
                  onChange={(event) => {
                    this.handleOnchangeInput(event, "address");
                  }}
                />
              </div>
              <div className="col-6 form-group">
                <label>
                  <FormattedMessage id="patient.booking-modal.gender" />
                </label>
                <select
                  className="form-control"
                  onChange={(event) =>
                    this.handleOnchangeInput(event, "genderId")
                  }
                  value={this.state.genderId}
                >
                  <option value="1">
                    {language === LANGUAGES.VI ? "Nam" : "Male"}
                  </option>
                  <option value="2">
                    {language === LANGUAGES.VI ? "Nữ" : "Female"}
                  </option>
                  <option value="3">
                    {language === LANGUAGES.VI ? "Khác" : "Other"}
                  </option>
                </select>
              </div>
              <div className="col-12 form-group">
                <label>Lý do khám</label>
                <div className="form-outline">
                  <textarea
                    className="form-control"
                    id="textAreaExample1"
                    rows="4"
                    value={this.state.reason}
                    onChange={(event) => {
                      this.handleOnchangeInput(event, "reason");
                    }}
                  ></textarea>
                </div>
              </div>
              {/* <div className="col-6 form-group">
                <label>Ngày sinh</label>
                <DatePicker
                  className="form-control"
                  onChange={this.handleOnchangeDatePicker}
                  value={this.state.birthday}
                />
              </div> */}
            </div>
          </div>
          <div className="booking-modal-footer">
            <button
              className="btn-booking-confirm"
              onClick={() => this.handleBookingConfirm()}
            >
              <FormattedMessage id="patient.booking-modal.confirm" />
            </button>
            <button
              className="btn-booking-cancel"
              onClick={this.props.handleClose}
            >
              <FormattedMessage id="patient.booking-modal.cancel" />
            </button>
          </div>
        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(BookingModal);
