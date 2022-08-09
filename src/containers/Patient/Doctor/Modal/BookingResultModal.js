//video 82
import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";

class BookingResult extends Component {
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
      <Modal
        show={this.props.openResultModal}
        onHide={this.props.closeResultModal}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Đặt lịch khám bệnh thành công!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container"></div>
          <p>Cảm ơn bạn đã đặt lịch khám từ VigorDoctor.</p>
          <p>
            Hệ thống đã ghi nhận lịch hẹn. Phòng khám sẽ gọi điện xác nhận trong
            thời gian 24h kể từ khi đặt lịch.
          </p>
          <p>
            Bạn có thể xem lại lịch hẹn vừa đặt tại trang thông tin cá nhân và
            thay đổi lịch hẹn trong thời gian chờ xác nhận.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.props.closeResultModal}>
            Thoát
          </Button>
          <Button variant="primary">
            <Link
              style={{ textDecoration: "none", color: "white" }}
              to="/booking-history"
            >
              Xem lịch hẹn
            </Link>
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

export default connect(mapStateToProps, mapDispatchToProps)(BookingResult);
