// import { Password } from "@mui/icons-material";
import { Component } from "react";
// import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
class ModalDeleteSpecialty extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    render() {
        return (
            <Modal show={this.props.show} onHide={this.props.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Comfirm delete Clinic</Modal.Title>
                </Modal.Header>
                <Modal.Body>Woohoo, are you sure delete this clinic :  {this.props.dataModal.nameVI}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.props.handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={this.props.confirmDeleteClinic}>
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

export default connect(mapStateToProps, mapDispatchToProps)(ModalDeleteSpecialty);
