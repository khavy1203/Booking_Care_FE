// import { Password } from "@mui/icons-material";
import { Component } from "react";
// import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { deleteUser } from "../../services/userService";
import { toast } from "react-toastify";

class ModalDeleteUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  confirmDeleteUser = async () => {
    let response = await deleteUser(this.props.dataModal); //ban đầu là xóa user nhưng thuận tiện truyền dữ liệu thì sài cách này đồng thời dataModal cũng là 1 user luôn
    if (response && +response.EC === 0) {
      this.props.handleClose();
      toast.success(response.EM);
    } else {
      toast.error(response.EM);
    }
  };
  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Comfirm delete User</Modal.Title>
        </Modal.Header>
        <Modal.Body>Woohoo, are you sure delete this user {this.props.dataModal.email}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.props.handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={() => { this.confirmDeleteUser() }} >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>

    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalDeleteUser);
