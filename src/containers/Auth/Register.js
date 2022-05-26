import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import './Register.scss';
import * as actions from "../../store/actions";
import { toast } from 'react-toastify';
// import { FormattedMessage } from "react-intl";
class Register extends Component {
    // constructor để khai báo states
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            phone: "",
            username: "",
            password: "",
            confirmpassword: "",
            defaultValidInput: {
                isInvalidEmail: true,
                isInvalidPhone: true,
                isInvalidUsername: true,
                isInvalidPassword: true,
                isInvalidConfirmpassword: true
            },
            objCheckInput: {
                isInvalidEmail: true,
                isInvalidPhone: true,
                isInvalidUsername: true,
                isInvalidPassword: true,
                isInvalidConfirmpassword: true
            }
        };
    }
    componentDidMount() {
        console.log("check object >>>", this.state.objCheckInput)
    }
    checkValidation = () => {

        this.setState({ objCheckInput: { ...this.state.defaultValidInput } })
        if (!this.state.email) {
            toast.warn("Please enter an email address");
            this.setState({ objCheckInput: "khongnhandcgi" });
            return false;
        }
        var re = /\S+@\S+\.\S+/;
        if (!re.test(this.state.email)) {
            toast.warn("pls enter ****@gmail.com");
            this.setState({ objCheckInput: { ...this.state.defaultValidInput, isInvalidEmail: false } });
            return false;
        }

        if (!this.state.phone) {
            toast.warn("Please enter a phone number");
            this.setState({ objCheckInput: { ...this.state.defaultValidInput, isInvalidPhone: false } });
            return false;
        }
        if (!this.state.username) {
            toast.warn("Please enter a username");
            this.setState({ objCheckInput: { ...this.state.defaultValidInput, isInvalidUsername: false } });
            return false;
        }
        if (!this.state.password) {

            toast.warn("Please enter a password");
            this.setState({ objCheckInput: { ...this.state.defaultValidInput, isInvalidPassword: false } });
            return false;
        }
        if (!this.state.confirmpassword) {
            toast.warn("Please enter a confirmpassword");
            this.setState({ objCheckInput: { ...this.state.defaultValidInput, isInvalidConfirmpassword: false } });
            return false;
        }
        if (this.state.password !== this.state.confirmpassword) {
            toast.warn("Please enter a confirmpassword match the password");
            this.setState({ objCheckInput: { ...this.state.defaultValidInput, isInvalidConfirmpassword: false } });
            return false;
        }

        return true;
    };


    setEmail = (event) => {
        this.setState({ email: event.target.value });
        // console.log(event.target.value);
    };
    setPhone = (event) => {
        this.setState({ phone: event.target.value });
        // console.log(event.target.value);
    };
    setName = (event) => {
        this.setState({ username: event.target.value });
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


    handleRegister = async () => {
        this.checkValidation();
    };

    handleHaveAccount() {

    };

    render() {
        return (
            <div className="register-container mt-3">
                <div className="container">
                    <div className="row p-3">
                        <div className="content-left col-12 col-sm-7 text-center text-sm-start ">
                            <div className="brand display-6">DEV</div>
                            <div className="detail d-none d-sm-block">
                                Nguồn cảm hứng thế hệ trẻ
                            </div>
                        </div>
                        <div className="content-right col-12 col-sm-5 gap-3 p-3 d-flex flex-column bg-white">
                            <div className="form-group">
                                <label htmlFor="Email" className="col-form-label">Email:</label>
                                <input type="email" required value={this.state.email} onChange={(event) => { this.setEmail(event) }} className={this.state.objCheckInput.isInvalidEmail == true ? 'form-control' : 'form-control is-invalid'} placeholder="Email address or phone number" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="Phone" className="col-form-label">Phone Number:</label>
                                <input type="phone" required className={this.state.objCheckInput.isInvalidPhone ? "form-control" : "form-control is-invalid"} value={this.state.phone} onChange={(event) => { this.setPhone(event) }} placeholder="Phone Number" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="User Name" className="col-form-label">User Name:</label>
                                <input type="text" required className={this.state.objCheckInput.isInvalidUsername ? "form-control" : "form-control is-invalid"} value={this.state.username} onChange={(event) => { this.setName(event) }} placeholder="User Name" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="Password" className="col-form-label">Password:</label>
                                <input type="password" required className={this.state.objCheckInput.isInvalidPassword ? "form-control" : "form-control is-invalid"} value={this.state.password} onChange={(event) => { this.setPassword(event) }} placeholder="Password" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="Re-enter Password" className="col-form-label">Re-enter Password:</label>
                                <input type="password" required className={this.state.objCheckInput.isInvalidConfirmpassword ? "form-control" : "form-control is-invalid"} value={this.state.confirmpassword} onChange={(event) => { this.setConfirmpassword(event) }} placeholder="Re-enter Password" />
                            </div>
                            <button className="btn btn-primary" type="submit" onClick={() => this.handleRegister()}>Register</button>

                            <hr />
                            <div className="text-center">
                                <button className="btn btn-success" onClick={() => this.handleHaveAccount()}>Already've  an account. Login
                                </button>

                            </div>

                        </div>
                    </div>

                </div >
            </div >
        );
    }
}
const mapStateToProps = (state) => {
    return {
        language: state.app.language,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        navigate: (path) => dispatch(push(path)),
        // adminLoginSuccess: (adminInfo) =>
        //   dispatch(actions.adminLoginSuccess(adminInfo)),
        // adminLoginFail: () => dispatch(actions.adminLoginFail()),

        // userLoginFail: () => dispatch(actions.adminLoginFail()),
        // userloginSuccess: (userInfo) =>
        //   dispatch(actions.userloginSuccess(userInfo)),
        userloginSuccess: (userInfo) =>
            dispatch(actions.userloginSuccess(userInfo)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Register);