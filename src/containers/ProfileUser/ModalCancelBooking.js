//video 82
import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { Button, Modal } from "react-bootstrap";
import moment from "moment";
import { fetchCurrentSchedule } from "../../services/scheduleService";
import { changeBooking, updateBooking } from "../../services/bookingService";
import { toast } from "react-toastify";
class ModalCancelBooking extends Component {
  constructor(props) {
    super(props);
    this.state = {
      note: "",
    };
  }
  componentDidMount() {}

  async componentDidUpdate(prevProps, prevState, snapshot) {}

  handleClickCancel = async (booking) => {
    if (!this.state.note) {
      toast.warn("Vui lòng nhập lý do hủy lịch hẹn");
      return;
    }

    let res = await updateBooking({
      bookingId: booking.id,
      reqCode: 2,
      note: this.state.note,
    });
    //console.log("handleClickCancel", res.DT);
    if (res && +res.EC === 0) {
      toast.success(res.EM);
      this.props.closeModalCancel(res.DT);
    } else {
      toast.error(res.EM);
    }
  };

  render() {
    let { selectedBooking } = this.props;
    return (
      <Modal
        show={this.props.showModalCancel}
        onHide={this.props.closeModalCancel}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận hủy lịch hẹn</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            <div className="form-group">
              <textarea
                className="form-control"
                placeholder="Xin vui lòng nhập lý do hủy lịch hẹn của bạn..."
                value={this.state.note}
                onChange={(event) => {
                  this.setState({ note: event.target.value });
                }}
              ></textarea>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.props.closeModalCancel}>
            Thoát
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              this.handleClickCancel(selectedBooking);
            }}
          >
            Xác nhận hủy
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

export default connect(mapStateToProps, mapDispatchToProps)(ModalCancelBooking);
