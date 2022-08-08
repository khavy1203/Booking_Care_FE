import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import "./UpdateScheduleModal.scss";
import { Button, Modal } from "react-bootstrap";
import { LANGUAGES } from "../../../utils";

import {
  fetchScheduleDetail,
  deleteTime,
  updateMaxNumber,
} from "../../../services/scheduleService";
import { toast } from "react-toastify";
import moment from "moment";
class UpdateScheduleModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //scheduleId: -1,
      maxNumber: "",
      details: [],

      selectedDetail: {},
    };
  }
  componentDidMount() {
    //console.log("componentDidMount modal", this.props.selectedSchedule);
  }

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.language === prevProps.language) {
    }
    if (this.props.selectedSchedule !== prevProps.selectedSchedule) {
      await this.loadScheduleDetail(this.props.selectedSchedule.id);
      // this.setState({ details: this.props.selectedSchedule.Schedule_Details });
    }
  }

  loadScheduleDetail = async (scheduleId) => {
    try {
      let res = await fetchScheduleDetail(scheduleId);
      if (res && +res.EC === 0) {
        this.setState({
          details: res.DT,
        });
        //console.log(this.state.details);
      } else {
        console.log("Lỗi nạp schedule detail", res.EM);
      }
    } catch (error) {
      console.log(error);
    }
  };

  handleDeleteTime = async (scheduleDetail) => {
    let choose = window.confirm(
      `Bạn có muốn xóa bản ghi ${scheduleDetail.id} này?`
    );
    if (choose === true) {
      let res = await deleteTime(scheduleDetail.id);
      if (res && +res.EC === 0) {
        toast.success(res.EM);
        await this.loadScheduleDetail(this.props.selectedSchedule.id);
      } else {
        toast.error(res.EM);
      }
    }
  };

  handleMaxNumber = (event) => {
    this.setState({
      maxNumber: event.target.value,
    });
  };

  handleUpdateNumber = async () => {
    if (this.state.maxNumber <= 0) {
      toast.error("Invalid number!");
      return;
    }
    try {
      let data = {
        scheduleId: this.props.selectedSchedule.id,
        maxNumber: this.state.maxNumber,
      };
      let res = await updateMaxNumber(data);
      if (res && +res.EC === 0) {
        toast.success(res.EM);
        await this.loadScheduleDetail(this.props.selectedSchedule.id);
      } else {
        toast.error(res.EM);
      }
    } catch (error) {
      console.log(error);
    }
  };

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  render() {
    let { language, selectedSchedule } = this.props;
    let { details } = this.state;
    return (
      <Modal
        show={this.props.show}
        onHide={this.props.handleClose}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Cập nhật kế hoạch{" "}
            {`${this.capitalizeFirstLetter(
              moment(selectedSchedule.date).locale("vi").format("dddd")
            )} - ${moment(selectedSchedule.date).format("DD/MM/YYYY")}`}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-4">
              <input
                className="form-control"
                type="number"
                value={this.state.maxNumber}
                onChange={(event) => {
                  this.handleMaxNumber(event);
                }}
                placeholder={"Cập nhật số lượng khám tối đa"}
              />
            </div>
            <div className="col-2">
              <button
                className="btn btn-warning"
                onClick={() => this.handleUpdateNumber()}
              >
                Cập nhật
              </button>
            </div>
          </div>

          <table className="table table-bordered table-hover mt-3">
            <thead>
              <tr>
                <th>ID</th>
                <th>Giờ khám</th>
                <th>Số lượng lịch hẹn hiện có</th>
                <th>Số lượng khám tối đa</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {details &&
                details.length > 0 &&
                details.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td>{item.id}</td>
                      <td>
                        {language === LANGUAGES.VI
                          ? item.Timeframe.nameVI
                          : item.Timeframe.nameEN}
                      </td>
                      <td>{item.currentNumber}</td>
                      <td>{item.maxNumber}</td>
                      <td>
                        <button
                          className="btn btn-danger m-2"
                          onClick={() => this.handleDeleteTime(item)}
                        >
                          <i className="fa fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.props.handleClose}>
            Thoát
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UpdateScheduleModal);
