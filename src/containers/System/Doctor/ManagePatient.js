//video 82
import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import "./ManagePatient.scss";
import DatePicker from "../../../components/Input/DatePicker";
import RemedyModal from "./RemedyModal";
import moment from "moment";
class ManagePatient extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentDate: moment(new Date()).startOf("day").valueOf,
      dataPatient: [],
      isOpenRemedyModal: false,
      dataModal: {},
    };
  }
  componentDidMount() {}

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.language === prevProps.language) {
    }
  }

  handleOnchangeDatePicker = (date) => {
    this.setState({
      currentDate: date[0],
    });
  };

  handleBtnConfirm = () => {
    let data = {
      doctorId: "d1",
      patientId: "p1",
      email: "p1@gmail.com",
    };
    this.setState({ isOpenRemedyModal: true, dataModal: data });
  };

  closeRemedyModal = () => {
    this.setState({
      isOpenRemedyModal: false,
      dataModal: {},
    });
  };

  render() {
    let { dataPatient, isOpenRemedyModal, dataModal } = this.state;
    return (
      <>
        <div className="manage-patient-container">
          <div className="m-p-title">Quản lý bệnh nhân</div>
          <div className="manage-patient-body row">
            <div className="col-4 form-group">
              <label>Chọn ngày khám</label>
              <DatePicker
                className="form-control"
                onChange={this.handleOnchangeDatePicker}
                value={this.state.currentDate}
              />
            </div>
            <div className="col-12 table-manage-patient">
              <table style={{ width: "100%" }}>
                <tr>
                  <th>STT</th>
                  <th>Thời gian</th>
                  <th>Họ và tên</th>
                  <th>Địa chỉ</th>
                  <th>Giới tính</th>
                  <th>Actions</th>
                </tr>
                <tr>
                  <td>1</td>
                  <td>8:00 - 9:00</td>
                  <td>patient one</td>
                  <td>bla bla bla</td>
                  <td>Male</td>
                  <td>
                    <button
                      className="mp-btn-confirm"
                      onClick={() => {
                        this.handleBtnConfirm();
                      }}
                    >
                      Xác nhận
                    </button>
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </div>
        <RemedyModal
          isOpenModal={isOpenRemedyModal}
          dataModal={dataModal}
          closeRemedyModal={this.closeRemedyModal}
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

export default connect(mapStateToProps, mapDispatchToProps)(ManagePatient);
