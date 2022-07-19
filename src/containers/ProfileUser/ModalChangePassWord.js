// import { Password } from "@mui/icons-material";
import { Component } from "react";
// import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { updatePassword } from "../../services/userService";
import { toast } from "react-toastify";

class ModalChangePassWord extends Component {
    constructor(props) {
        super(props);
        this.state = {
            oldpassword: "",
            password: "",
            confirmpassword: "",
            defaultValidInput: {
                isInvalidOldPassword: true,
                isInvalidPassword: true,
                isInvalidConfirmpassword: true
            },
            objCheckInput: {

                isInvalidOldPassword: true,
                isInvalidPassword: true,
                isInvalidConfirmpassword: true
            }
        };
    }
    checkValidation = () => {

        this.setState({ objCheckInput: { ...this.state.defaultValidInput } })


        if (!this.state.oldpassword) {

            toast.warn("Please enter a password");
            this.setState({ objCheckInput: { ...this.state.defaultValidInput, isInvalidOldPassword: false } });
            return false;
        }

        if (!this.state.password) {
            toast.warn("Please enter a password");
            this.setState({ objCheckInput: { ...this.state.defaultValidInput, isInvalidPassword: false } });
            return false;
        }
        if (!this.state.confirmpassword) {
            toast.warn("Please enter a confirm password ");
            this.setState({ objCheckInput: { ...this.state.defaultValidInput, isInvalidConfirmpassword: false } });
            return false;
        }
        //kiểm tra độ dài
        if (this.state.oldpassword.length < 6) {
            toast.warn("Please enter a password more than 6 character");
            this.setState({ objCheckInput: { ...this.state.defaultValidInput, isInvalidOldPassword: false } });
            return false;
        }

        if (this.state.password.length < 6) {
            toast.warn("Please enter a password more than 6 character");
            this.setState({ objCheckInput: { ...this.state.defaultValidInput, isInvalidPassword: false } });
            return false;
        }
        if (this.state.confirmpassword.length < 6) {
            toast.warn("Please enter a password more than 6 character");
            this.setState({ objCheckInput: { ...this.state.defaultValidInput, isInvalidConfirmpassword: false } });
            return false;
        }

        if (this.state.password !== this.state.confirmpassword) {
            toast.warn("Please enter a confirmpassword match the password");
            this.setState({ objCheckInput: { ...this.state.defaultValidInput, isInvalidPassword: false } });
            return false;
        }

        return true;
    };
    setOldPassword = (event) => {
        this.setState({ oldpassword: event.target.value });
        // console.log(event.target.value);
    };
    setPassword = (event) => {
        this.setState({ password: event.target.value });
        // console.log(event.target.value);
    };

    setConfirmpassword = (event) => {
        this.setState({ confirmpassword: event.target.value });
        // console.log(event.target.value);
    };

    confirmChangePassWord = async () => {
        if (this.checkValidation()) {

            let response = await updatePassword({
                id: this.props.dataModal ? this.props.dataModal.id : 0,
                oldpassword: this.state.oldpassword,
                newpassword: this.state.password
            });
            if (response && +response.EC === 0) {

                this.props.handleClose();
                toast.success("Cập nhật mật khẩu mới thành công .");
                this.setState({
                    oldpassword: "",
                    password: "",
                    confirmpassword: "",
                })
            } else {
                toast.error(response.EM);
            }
        }

    }

    render() {
        console.log("check props user>>", this.props)
        return (
            <Modal show={this.props.show} onHide={this.props.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{`Thay đổi mật khẩu người dùng : ${this.props.dataModal.username}. `}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="container">
                        <div className="row d-flex justify-content-center">
                            <div className="col-12 gap-3 p-3 d-flex flex-column bg-white">
                                <div className="form-group">
                                    <label htmlFor="OldPassword" className="col-form-label">Old Password:</label>
                                    <input
                                        type="password"
                                        required
                                        className={this.state.objCheckInput.isInvalidOldPassword ? "form-control" : "form-control is-invalid"}
                                        value={this.state.oldpassword} onChange={(event) => { this.setOldPassword(event) }} placeholder="Old Password" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="Password" className="col-form-label">Password:</label>
                                    <input type="password" required className={this.state.objCheckInput.isInvalidPassword ? "form-control" : "form-control is-invalid"} value={this.state.password} onChange={(event) => { this.setPassword(event) }} placeholder="Password" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="Re-enter Password" className="col-form-label">Re-enter Password:</label>
                                    <input type="password" required className={this.state.objCheckInput.isInvalidConfirmpassword ? "form-control" : "form-control is-invalid"} value={this.state.confirmpassword} onChange={(event) => { this.setConfirmpassword(event) }} placeholder="Re-enter Password" />
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.props.handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => this.confirmChangePassWord(this.props.dataModal)}>
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

export default connect(mapStateToProps, mapDispatchToProps)(ModalChangePassWord);