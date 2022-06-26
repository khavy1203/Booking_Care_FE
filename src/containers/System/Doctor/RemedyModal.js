import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import "./RemedyModal.scss";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "react-bootstrap";

class RemedyModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  async componentDidMount() { }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.language === prevProps.language) {
    }
  }

  render() {
    //Mở cmt khi có dataTime
    // let { isOpenModal, closeRemedyModal, dataTime } = this.props;
    let { isOpenModal, closeRemedyModal, dataModal } = this.props;

    console.log("check state booking modal", this.state);
    return (
      <Modal
        isOpen={isOpenModal}
        className={"booking-modal-container"}
        size="md"
        centered
      >
        <div class="modal-header">
          <h5 class="modal-title">Gửi hóa đơn khám bệnh thành công</h5>
          <button
            onClick={closeRemedyModal}
            type="button"
            class="close"
            aria-label="Close"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>
        <ModalBody>
          <div className="row">
            <div className="col-6 form-group">
              <label>Email vệnh nhân</label>
              <input
                className="form-control"
                type="email"
                value={dataModal.email}
              />
            </div>
            <div className="col-6 form-group">
              <label>Chọn file đơn thuốc</label>
              <input className="form-control-file" type="file" />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={closeRemedyModal}>
            Send
          </Button>
          <Button color="secondary" onClick={closeRemedyModal}>
            Cancel
          </Button>
        </ModalFooter>
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

export default connect(mapStateToProps, mapDispatchToProps)(RemedyModal);
