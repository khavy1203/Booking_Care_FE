//video 82
import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import "./DoctorContact.scss";
import HomeHeader from "../HomePage/HomeHeader";
class DoctorContact extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {}

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.language === prevProps.language) {
    }
  }

  render() {
    return (
      <>
        <HomeHeader />
        <div className="contact-container">
          <div className="form-contact">
            <div className="contact-title">Hợp tác cùng BookingCare</div>
            <div className="contact-text">
              Chúng tôi rất hân hạnh được hợp tác với bác sĩ và cơ sở y tế. Vui
              lòng gửi thông tin, chúng tôi sẽ liên hệ lại trong thời gian sớm
              nhất.
            </div>
            <div className="contact-input form-group col-6">
              <label>Họ và tên</label>
              <input className="name form-control" placeholder="Bắt buộc" />
            </div>
            <div className="contact-input form-group col-6">
              <label>Email</label>
              <input className="email form-control" placeholder="Bắt buộc" />
            </div>
            <div className="contact-input form-group col-6">
              <label>Số điện thoại</label>
              <input className="phone form-control" placeholder="Bắt buộc" />
            </div>

            <div className="contact-input form-group col-6">
              <label>Mật khẩu</label>
              <input className="password form-control" placeholder="Bắt buộc" />
            </div>
            <div className="contact-input form-group col-6">
              <label>Xác nhận mật khẩu</label>
              <input
                className="confirm-password form-control"
                placeholder="Bắt buộc"
              />
            </div>
            <div className="contact-input form-group gender">
              <div class="custom-control custom-radio">
                <input
                  type="radio"
                  id="customRadio1"
                  name="customRadio"
                  class="custom-control-input"
                  defaultChecked
                  // value={1}
                />
                <label class="custom-control-label" for="customRadio1">
                  Nam
                </label>
              </div>
              <div class="custom-control custom-radio">
                <input
                  type="radio"
                  id="customRadio2"
                  name="customRadio"
                  class="custom-control-input"
                  // value={2}
                />
                <label class="custom-control-label" for="customRadio2">
                  Nữ
                </label>
              </div>
              <div class="custom-control custom-radio">
                <input
                  type="radio"
                  id="customRadio3"
                  name="customRadio"
                  class="custom-control-input"
                  // value={3}
                />
                <label class="custom-control-label" for="customRadio3">
                  Khác
                </label>
              </div>
            </div>
            <div className="contact-input form-group">
              <label>Địa chỉ</label>
              <input className="address form-control" placeholder="Bắt buộc" />
            </div>

            <div className="contact-input form-group">
              <button className="btn btn-primary btn-save-schedule">
                Đăng ký hợp tác
              </button>
            </div>
          </div>
        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(DoctorContact);
