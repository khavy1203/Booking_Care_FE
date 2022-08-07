import React, { Component } from "react";
import { connect } from "react-redux";
import "./ManageSchedule.scss";
import { FormattedMessage } from "react-intl";
import { LANGUAGES, dateFormat } from "../../../utils";
import DatePicker from "../../../components/Input/DatePicker";
import { fetchAllTimes } from "../../../services/timeframeService";
import { toast } from "react-toastify";
import moment from "moment";
import "moment/locale/vi";
import {
  createNewSchedule,
  fetchScheduleForTable,
  deleteSchedule,
} from "../../../services/scheduleService";
import UpdateScheduleModal from "./UpdateScheduleModal";

class ManageSchedule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentDate: "",
      maxNumber: "",
      times: [],

      //Huyên: dưới này là cho table và update
      listSchedule: [],
      selectedSchedule: {},
      isOpenUpdateModal: false,
    };
  }

  componentDidMount() {
    this.getTimes();
    this.loadSchedule();
  }

  getTimes = async () => {
    let res = await fetchAllTimes();
    if (res && +res.EC === 0) {
      let data = res.DT;
      //gắn thêm isSelected để làm chức năng chọn btn giờ
      if (data && data.length > 0) {
        data = data.map((item) => ({
          ...item,
          isSelected: false,
          // maxPatient: "",
        }));
      }
      this.setState({
        times: data,
      });
      // console.log(data);
    } else {
      toast.error(res.EM);
    }
  };

  handleOnchangeDatePicker = (date) => {
    this.setState({
      currentDate: date[0],
    });
    console.log(
      "this.state.currentDate)",
      new Date(this.state.currentDate).getTime()
    );
    // console.log("javascript", new Date(this.state.currentDate));
    // console.log("DatePicker", date[0]);
  };

  handleClickBtnTime = (time) => {
    let { times } = this.state;
    if (times && times.length > 0) {
      times = times.map((item) => {
        if (item.id === time.id) {
          item.isSelected = !time.isSelected;
        }
        return item;
      });
      this.setState({
        times: times,
      });
    }
  };

  // resetInput = () => {
  //   let { times } = this.state;
  //   if (times && times.length > 0) {
  //     times = times.map((item) => {
  //       item.isSelected = false;
  //       return item;
  //     });
  //     this.setState({
  //       times: times,
  //     });
  //   }
  // };

  handleSaveSchedule = async () => {
    let { times, currentDate, maxNumber } = this.state;
    let result = {};

    if (!currentDate) {
      toast.error("Invalid date!");
      return;
    }

    if (maxNumber <= 0) {
      toast.error("Invalid number!");
      return;
    }

    // if (maxNumber > 5) {
    //   toast.error("Không vượt quá 5!");
    //   return;
    // }
    //format ngày (kiểu object) sang string
    //let formatedDate = moment(currentDate).format(dateFormat.SEND_TO_SERVER);

    //kieu timestamp
    //let formatedDate = new Date(currentDate).getTime();
    //console.log("formatedDate", formatedDate);
    let formatedDate = moment(currentDate).toISOString();
    if (times && times.length > 0) {
      //lọc các thời gian dc chọn
      let selectedTimeList = times.filter((item) => item.isSelected === true);

      if (selectedTimeList && selectedTimeList.length > 0) {
        result.date = formatedDate;

        //timeDetail chứa thời gian và số lượng khám
        let timeDetail = [];
        selectedTimeList.map((time) => {
          let object = {};
          object.timeframeId = time.id;
          object.maxNumber = maxNumber;
          timeDetail.push(object);
        });
        result.timeDetail = timeDetail;

        let res = await createNewSchedule(result);
        if (res && +res.EC === 0) {
          toast.success(res.EM);
          // this.resetInput();
          await this.loadSchedule();
        } else {
          toast.error(res.EM);
          // this.resetInput();
        }
        // console.log("response", res);
      } else {
        toast.error("Invalid selected time!");
        return;
      }
    }
  };

  handleMaxNumber = (event) => {
    this.setState({
      maxNumber: event.target.value.replace(/\D/g, ""),
    });
  };

  //Các hàm dưới này dùng cho table và xóa kế hoạch

  loadSchedule = async () => {
    try {
      let res = await fetchScheduleForTable();
      if (res && +res.EC === 0) {
        this.setState({
          listSchedule: res.DT,
        });
        console.log(this.state.listSchedule);
      } else {
        console.log("Lỗi nạp schedule", res.EM);
      }
    } catch (error) {
      console.log(error);
    }
  };

  handleOpenUpdateModal = (schedule) => {
    this.setState({
      isOpenUpdateModal: true,
      selectedSchedule: schedule,
    });
  };
  handleCloseUpdateModal = () => {
    this.setState({
      isOpenUpdateModal: false,
    });
  };

  handleDeleteSchedule = async (schedule) => {
    let choose = window.confirm(`Bạn có muốn xóa bản ghi ${schedule.id} này?`);
    if (choose === true) {
      let res = await deleteSchedule(schedule.id);
      console.log("handleDeleteSchedule", res.DT);
      if (res && (+res.EC === 0 || +res.EC === 3)) {
        toast.success(res.EM);
        await this.loadSchedule();
      } else {
        toast.error(res.EM);
      }
    }
  };

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  render() {
    let yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
    let { language } = this.props;
    let { times, maxNumber, listSchedule } = this.state;

    return (
      <div className="manage-schedule-container">
        <div className="m-s-title">
          <FormattedMessage id={"manage-schedule.title"} />
        </div>
        <div className="container">
          <div className="schedule-date row">
            <h5>Thêm kế hoạch khám bệnh</h5>
            <div className="col-6 form-group">
              <label>
                <FormattedMessage id={"manage-schedule.choose-date"} />
              </label>
              <DatePicker
                className="form-control"
                onChange={this.handleOnchangeDatePicker}
                value={this.state.currentDate}
                minDate={yesterday}
              />
            </div>
            <div className="max-patient col-6 form-group">
              <label>Số lượng khám:</label>
              <input
                className="form-control"
                type="text"
                pattern="[0-9]*"
                value={maxNumber}
                onChange={(event) => {
                  this.handleMaxNumber(event);
                }}
              />
            </div>
          </div>
          <div className="schedule-time">
            <div className="col-12 pick-hour-container">
              {times &&
                times.length > 0 &&
                times.map((item, index) => {
                  return (
                    <div className="btn-container" key={index}>
                      <button
                        onClick={() => this.handleClickBtnTime(item)}
                        className={
                          item.isSelected === true
                            ? "btn btn-schedule active"
                            : "btn btn-schedule"
                        }
                      >
                        {language === LANGUAGES.VI ? item.nameVI : item.nameEN}
                      </button>
                    </div>
                  );
                })}
            </div>
          </div>
          <div className="schedule-btn-save row">
            <div className="col-12 form-group">
              <button
                onClick={() => {
                  this.handleSaveSchedule();
                }}
                className="btn btn-primary btn-save-schedule"
              >
                <FormattedMessage id={"manage-schedule.save"} />
              </button>
            </div>
          </div>
        </div>

        <div className="container ">
          <hr />
          <h5>Danh sách kế hoạch khám bệnh</h5>
          <div className="table-patient row mt-3">
            <div className="col-12 table-manage-patient ">
              <table className="table table-bordered table-hover">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Ngày khám bệnh</th>
                    <th>Ngày tạo kế hoạch</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {listSchedule &&
                    listSchedule.length > 0 &&
                    listSchedule.map((item, index) => {
                      let dayOfWeak = this.capitalizeFirstLetter(
                        moment(item.date).locale("vi").format("dddd")
                      );
                      let scheduleDate = moment(item.date).format("DD/MM/YYYY");

                      let createdAtDay = this.capitalizeFirstLetter(
                        moment(item.createdAt).locale("vi").format("dddd")
                      );
                      let createdAt = moment(item.createdAt).format(
                        "DD/MM/YYYY"
                      );
                      return (
                        <tr key={index}>
                          <td>{item.id}</td>
                          <td>{`${dayOfWeak} - ${scheduleDate}`}</td>
                          <td>{`${createdAtDay} - ${createdAt}`}</td>

                          <td>
                            <button
                              className="btn btn-warning m-2"
                              onClick={() => this.handleOpenUpdateModal(item)}
                            >
                              <i
                                className="fa fa-pencil"
                                aria-hidden="true"
                              ></i>
                            </button>

                            <button
                              className="btn btn-danger m-2"
                              onClick={() => this.handleDeleteSchedule(item)}
                            >
                              <i className="fa fa-trash"></i>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <UpdateScheduleModal
          show={this.state.isOpenUpdateModal}
          handleClose={this.handleCloseUpdateModal}
          selectedSchedule={this.state.selectedSchedule}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    // userInfo: state.user.userInfo,
    language: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageSchedule);
