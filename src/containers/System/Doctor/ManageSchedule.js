import React, { Component } from "react";
import { connect } from "react-redux";
import "./ManageSchedule.scss";
import { FormattedMessage } from "react-intl";
import { LANGUAGES, dateFormat } from "../../../utils";
import DatePicker from "../../../components/Input/DatePicker";
import { fetchAllTimes } from "../../../services/timeframeService";
import { toast } from "react-toastify";
import moment from "moment";
import { createNewSchedule } from "../../../services/scheduleService";
// const options = [
//   { value: "chocolate", label: "Chocolate" },
//   { value: "strawberry", label: "Strawberry" },
//   { value: "vanilla", label: "Vanilla" },
// ];

class ManageSchedule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentDate: "",
      maxNumber: "",
      times: [],
    };
  }

  componentDidMount() {
    this.getTimes();
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
    // let { userInfo } = this.props;
    let result = {};

    if (!currentDate) {
      toast.error("Invalid date!");
      return;
    }

    if (maxNumber <= 0) {
      toast.error("Invalid number!");
      return;
    }

    //format ngày (kiểu object) sang string
    //    let formatedDate = moment(currentDate).format(dateFormat.SEND_TO_SERVER);

    //kieu timestamp
    let formatedDate = new Date(currentDate).getTime();

    if (times && times.length > 0) {
      //lọc các thời gian dc chọn
      let selectedTimeList = times.filter((item) => item.isSelected === true);

      if (selectedTimeList && selectedTimeList.length > 0) {
        //kiểm tra có thời gian nào dc chọn mà có số lượng khám <= 0
        // let timeNoMaxPatient = selectedTimeList.find((item) => {
        //   return item.maxPatient <= 0;
        // });
        //nếu tìm được thì báo lỗi
        // if (timeNoMaxPatient) {
        //   toast.error("Invalid maximum number of patients!");
        //   return;
        // }

        // result.email = userInfo.account.email;
        // result.groupId = userInfo.account.groupWithRoles.id;
        result.date = "" + formatedDate;

        //timeDetail chứa thời gian và số lượng khám
        let timeDetail = [];
        selectedTimeList.map((time) => {
          let object = {};
          object.timeframeId = time.id;
          // object.maxNumber = time.maxPatient;
          object.maxNumber = maxNumber;
          timeDetail.push(object);
        });
        result.timeDetail = timeDetail;

        let res = await createNewSchedule(result);
        if (res && +res.EC === 0) {
          toast.success(res.EM);
          // this.resetInput();
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

  // handleMaxPatient = (event, time) => {
  //   let { times } = this.state;
  //   if (times && times.length > 0) {
  //     times = times.map((item) => {
  //       if (item.id === time.id) {
  //         item.maxPatient = +event.target.value;
  //       }
  //       return item;
  //     });
  //     this.setState({
  //       times: times,
  //     });
  //   }
  // };

  handleMaxNumber = (event) => {
    this.setState({
      maxNumber: event.target.value,
    });
  };

  render() {
    let yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
    let { language } = this.props;
    let { times, maxNumber } = this.state;
    return (
      <div className="manage-schedule-container">
        <div className="m-s-title">
          <FormattedMessage id={"manage-schedule.title"} />
        </div>
        <div className="container">
          <div className="schedule-date row">
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
              <label>số lượng khám:</label>
              <input
                className="form-control"
                type="number"
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
                      {/* 
                      {item.isSelected === true && (
                        <div className="max-patient">
                          <label>số lượng khám:</label>
                          <input
                            type="number"
                            value={item.maxPatient}
                            onChange={(event) => {
                              this.handleMaxPatient(event, item);
                            }}
                          />
                        </div>
                      )}
                       */}
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
