//video 82
import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import "./DoctorExtraInfo.scss";

class DoctorExtraInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowDetailInfo: false,
    };
  }
  componentDidMount() {}

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.language === prevProps.language) {
    }
  }

  showHideDetailInfo = (status) => {
    this.setState({
      isShowDetailInfo: status,
    });
  };

  render() {
    let { isShowDetailInfo } = this.state;
    return (
      <div className="doctor-extra-info-container">
        <div className="content-up">
          <div className="text-address">ĐỊA CHỈ KHÁM</div>
          <div className="name-clinic">Phòng Khám Chuyên Khoa Da Liễu</div>
          <div className="detail-adress">
            207 Phố Huế - Hai Bà Trưng - Hà Nội
          </div>
        </div>
        <div className="content-down">
          {isShowDetailInfo === false && (
            <div className="short-info">
              GIÁ KHÁM: 300.000đ.{" "}
              <span
                onClick={() => {
                  this.showHideDetailInfo(true);
                }}
              >
                Xem chi tiết
              </span>
            </div>
          )}

          {isShowDetailInfo === true && (
            <>
              <div className="title-price">GIÁ KHÁM:</div>
              <div className="detail-info">
                <div className="price">
                  <span className="left">Giá khám</span>
                  <span className="right">300.000đ</span>
                </div>
                <div className="note">
                  Giá khám chưa bao gồm chi phí chụp chiếu, xét nghiệm
                </div>
              </div>

              <div className="payment">
                Phòng khám có thanh toán bằng hình thức tiền mặt và quẹt thẻ
              </div>
              <div className="hide-price">
                <span
                  onClick={() => {
                    this.showHideDetailInfo(false);
                  }}
                >
                  Ẩn bảng giá
                </span>
              </div>
            </>
          )}
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

export default connect(mapStateToProps, mapDispatchToProps)(DoctorExtraInfo);
