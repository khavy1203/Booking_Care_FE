//video 82, 85
//component này là một modal để điền thông tin đặt lịch
import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import "./BookingModal.scss";
import { Modal } from "reactstrap";
import ProfileDoctor from "../ProfileDoctor";
import _ from "lodash";
import DatePicker from "../../../../components/Input/DatePicker";

class BookingModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fullName: "",
      phoneNumber: "",
      email: "",
      address: "",
      // reason: "",
      // birthday: "",
      gender: "",
      doctorId: "",
    };
  }
  async componentDidMount() {}

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.language === prevProps.language) {
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

  handleOnchangeDatePicker = (date) => {
    this.setState({
      birthday: date[0],
    });
  };

  render() {
    let {
      isOpenModal,
      closeBookingModal,
      dataTime,
      doctorIdFromDoctorSchedule,
    } = this.props;
    let doctorId = doctorIdFromDoctorSchedule ? doctorIdFromDoctorSchedule : "";
    console.log("booking modal, dataTime", dataTime);
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
            <span className="left">Thông tin đặt lịch khám bệnh</span>
            <span className="right" onClick={closeBookingModal}>
              <i className="fas fa-times"></i>
            </span>
          </div>
          <div className="booking-modal-body">
            <div className="doctor-info">
              {/* Mở cmt khi lấy dc doctorId trong dataTime*/}
              {/* <ProfileDoctor doctorId={doctorId} isShowDescriptionDoctor={false}
                dataTime={dataTime}
                isShowLinkDetail={true}
                isShowPrice={false} /> */}

              {/* Sài tạm */}
              <ProfileDoctor
                doctorId={doctorId}
                dataTime={dataTime}
                isShowDescriptionDoctor={false}
                isShowLinkDetail={false}
                isShowPrice={true}
              />
            </div>

            <div className="row">
              <div className="col-6 form-group">
                <label>Họ tên</label>
                <input
                  className="form-control"
                  type="text"
                  value={this.state.fullName}
                  onChange={(event) => {
                    this.handleOnchangeInput(event, "fullName");
                  }}
                />
              </div>
              <div className="col-6 form-group">
                <label>Số điện thoại</label>
                <input
                  type="number"
                  className="form-control"
                  value={this.state.phoneNumber}
                  onChange={(event) => {
                    this.handleOnchangeInput(event, "phoneNumber");
                  }}
                />
              </div>
              <div className="col-6 form-group">
                <label>Địa chỉ email</label>
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
                <label>Điện chỉ liên hệ</label>
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
                <label>Giới tính</label>
                <input className="form-control" />
              </div>
            </div>
          </div>
          <div className="booking-modal-footer">
            <button className="btn-booking-confirm" onClick={closeBookingModal}>
              Xác nhận
            </button>
            <button className="btn-booking-cancel" onClick={closeBookingModal}>
              Hủy
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
