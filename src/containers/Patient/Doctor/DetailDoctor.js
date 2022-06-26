//Component trang chi tiết bác sĩ
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import HomeHeader from "../../HomePage/HomeHeader";
import "./DetailDoctor.scss";
import DoctorSchedule from "./DoctorSchedule";
import DoctorExtraInfo from "./DoctorExtraInfo";
import { fetchInfoDoctor } from "../../../services/doctorService";
// import { fetchSchedule } from "../../../services/scheduleService";
import { LANGUAGES } from "../../../utils";
class DetailDoctor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detailDoctor: {},
      currentDoctorId: -1,
    };
  }
  async componentDidMount() {
    //điều kiện để ứng dụng ko bao giờ chết
    if (
      this.props.match &&
      this.props.match.params &&
      this.props.match.params.id
    ) {
      let id = this.props.match.params.id;
      this.setState({
        currentDoctorId: id,
      });
      this.loadInfoDoctor(id);
      // this.loadSchedule(id);
    }
  }

  loadInfoDoctor = async (id) => {
    try {
      let res = await fetchInfoDoctor(id);
      if (res && +res.EC === 0) {
        this.setState({ detailDoctor: res.DT });
      } else {
        console.log(res.EM);
      }
    } catch (error) {
      console.log(error);
    }
  };

  componentDidUpdate(prevProps, prevState, snapshot) {}

  render() {
    let { detailDoctor } = this.state;
    let { language } = this.props;
    let nameVi = `Bác sĩ ${detailDoctor.username}`;
    let nameEn = `Doctor ${detailDoctor.username}`;
    return (
      <Fragment>
        <HomeHeader isShowBanner={false} />
        <div className="doctor-detail-container">
          <div className="intro-doctor">
            <div
              className="content-left"
              style={{
                backgroundImage: `url(${
                  detailDoctor && detailDoctor.image ? detailDoctor.image : ""
                })`,
              }}
            ></div>
            <div className="content-right">
              <div className="up">
                {language === LANGUAGES.VI ? nameVi : nameEn}
              </div>
              <div className="down">
                <span>Duis excepteur tempor dolor nulla esse laborum sit.</span>
              </div>
            </div>
          </div>
          <div className="schedule-doctor">
            <div className="content-left">
              <DoctorSchedule doctorIdFromParent={this.state.currentDoctorId} />
            </div>
            <div className="content-right">
              <DoctorExtraInfo
                doctorIdFromParent={this.state.currentDoctorId}
              />
            </div>
          </div>
          <div className="detail-info-doctor">
            {/* dangerouslySetInnerHTML={{
                __html: "<p>First &middot; Second</p>",
              }} */}
            <div>
              Reprehenderit cupidatat nostrud aute consectetur ad nisi
              consectetur adipisicing eiusmod in anim ex. Velit aliqua mollit
              cillum nulla nostrud ea in minim Lorem pariatur id incididunt
              Lorem eu. Officia laboris amet cupidatat proident proident velit
              adipisicing dolore. Laboris id laborum ipsum non est consectetur
              non. Ex irure sint excepteur aliquip sit. Ea ipsum consectetur
              deserunt fugiat non. Aliqua proident fugiat dolore officia aute
              duis pariatur enim tempor. Dolor aliqua dolor labore sint. Fugiat
              est dolore aliqua do enim eu exercitation enim ex proident eiusmod
              et. Est laboris nostrud ut excepteur commodo consequat esse
              excepteur irure cillum in. Quis consequat adipisicing elit
              occaecat pariatur do elit tempor qui proident. Ad consequat culpa
              ut dolor irure aute sint aliqua id ipsum. Cillum commodo in
              proident pariatur ipsum culpa voluptate in. Officia ad adipisicing
              incididunt laboris elit in est cupidatat id irure et. Esse officia
              enim labore dolor aute culpa ullamco et esse officia incididunt
              et. Veniam nisi sit deserunt dolore sunt velit nostrud ea ea aute
              adipisicing cupidatat reprehenderit ex. Do et eu aute sit non
              adipisicing mollit deserunt voluptate Lorem exercitation consequat
              laborum Lorem. Sit sit ea dolore irure occaecat id minim dolore et
              consectetur adipisicing tempor. Consectetur magna officia aute
              amet.
            </div>
          </div>
          <div className="comment-doctor">comment-doctor</div>
        </div>
      </Fragment>
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailDoctor);
