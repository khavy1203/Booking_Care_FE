//video 82, 85
//component này là một modal để điền thông tin đặt lịch
import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import "./BookingModal.scss";
import { Modal } from "reactstrap";
import ProfileDoctor from "../ProfileDoctor";
import _ from "lodash";
import { LANGUAGES } from "../../../../utils";
// import DatePicker from "../../../../components/Input/DatePicker";
import { createBooking } from "../../../../services/bookingService";
import { toast } from "react-toastify";
import validator from "validator";

class BookingModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      phone: "",
      email: "",
      address: "",
      // reason: "",
      // birthday: "",
      genderId: 1,
      doctorId: "",
      schedule_detail_id: "",
      date: "",
    };
  }
  async componentDidMount() {}

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.selectedSchedule !== prevProps.selectedSchedule) {
      if (
        this.props.selectedSchedule &&
        !_.isEmpty(this.props.selectedSchedule)
      ) {
        let { doctorId, date, id } = this.props.selectedSchedule;
        this.setState({
          doctorId: doctorId,
          date: date,
          schedule_detail_id: id,
        });
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
      let {
        username,
        phone,
        email,
        address,
        genderId,
        doctorId,
        date,
        schedule_detail_id,
      } = this.state;

      if (!this.checkName(username)) return;
      if (!this.checkEmail(email)) return;

      let obj = {
        ...this.state,
      };

      let res = await createBooking(obj);
      if (res && +res.EC === 0) {
        toast.success(res.EM);
        this.props.closeBookingModal();
      } else {
        toast.error(res.EM);
      }
      console.log(obj);
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
    let {
      isOpenModal,
      closeBookingModal,
      selectedSchedule,
      language,
      // doctorIdFromDoctorSchedule,
    } = this.props;
    let { doctorId } = this.state;
    console.log(this.state);
    return (
      <Modal
        isOpen={isOpenModal}
        // toggle={}
        className={"booking-modal-container"}
        size="lg"
        centered
      >
        <div className="booking-modal-content">
          <div className="booking-modal-header">
            <span className="left">
              <FormattedMessage id="patient.booking-modal.title" />
            </span>
            <span className="right" onClick={closeBookingModal}>
              <i className="fas fa-times"></i>
            </span>
          </div>
          <div className="booking-modal-body">
            <div className="doctor-info">
              <ProfileDoctor
                doctorId={doctorId}
                selectedSchedule={selectedSchedule}
                isShowDescriptionDoctor={false}
                isShowLinkDetail={false}
                isShowPrice={true}
              />
            </div>

            <div className="row">
              <div className="col-6 form-group">
                <label>
                  <FormattedMessage id="patient.booking-modal.name" />
                </label>
                <input
                  className="form-control"
                  type="text"
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
                  type="number"
                  className="form-control"
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
                  value={this.state.address}
                  onChange={(event) => {
                    this.handleOnchangeInput(event, "address");
                  }}
                />
              </div>
              {/* <div className="col-12 form-group">
                <label>Lý do khám</label>
                <input
                  type="text"
                  className="form-control"
                  value={this.state.reason}
                  onChange={(event) => {
                    this.handleOnchangeInput(event, "reason");
                  }}
                />
              </div>
              <div className="col-6 form-group">
                <label>Ngày sinh</label>
                <DatePicker
                  className="form-control"
                  onChange={this.handleOnchangeDatePicker}
                  value={this.state.birthday}
                />
              </div> */}
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
            </div>
          </div>
          <div className="booking-modal-footer">
            <button
              className="btn-booking-confirm"
              onClick={() => this.handleBookingConfirm()}
            >
              <FormattedMessage id="patient.booking-modal.confirm" />
            </button>
            <button className="btn-booking-cancel" onClick={closeBookingModal}>
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
