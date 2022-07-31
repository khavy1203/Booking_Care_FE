import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import { toast } from "react-toastify";

import * as actions from "../../store/actions";
import _ from 'lodash';

import "./Login.scss";
// import { FormattedMessage } from "react-intl";
import { newResetPassword } from "../../services/userService";
class NewPassword extends Component {
    // constructor để khai báo states
    constructor(props) {
        super(props);
        this.state = {
            userData: {},
            dataDefault: {
                password: "",
                confirmPassword: ""
            },
            validInput: {},
            validInputDefault: {
                password: true,
                confirmPassword: true
            }
        };
    }
    componentDidMount() {

        this.setState({
            validInput: this.state.validInputDefault,
            userData: this.state.dataDefault
        })

    }

    checkValidateInput = () => {
        // if (action === "UPDATE") return true;//update thi ko validation
        //create user
        this.setState({ validInput: this.state.validInputDefault });
        let array = ["password", "confirmPassword"];
        for (let i = 0; i < array.length; i++) {
            if (!this.state.userData[array[i]]) {
                //set lai gia tri input bang false khi gia tri trong
                let _validInput = _.cloneDeep(this.state.validInputDefault);
                _validInput[array[i]] = false;
                this.setState({ validInput: _validInput });
                return false;
            }
        }
        return true;
    };

    handleOnchangeInput = (value, name) => {
        let _userData = _.cloneDeep(this.state.userData);
        _userData[name] = value;
        this.setState({ userData: _userData });
    };
    newPassword = async () => {
        let check = this.checkValidateInput();
        if (this.state.password !== this.state.confirmPassword) {
            let _validInput = _.cloneDeep(this.state.validInputDefault);
            _validInput['password'] = false;
            _validInput['confirmPassword'] = false;

            this.setState({ validInput: _validInput });
            check = false;
        }
        if (check) {
            const queryString = window.location.search;
            const urlParams = new URLSearchParams(queryString);
            const id = urlParams.get('id');
            const hashemail = urlParams.get('email')
            let res = await newResetPassword(id, hashemail, this.state.userData.password);
            if (res && res.EC === 0) {
                toast.success(res.EM)
                const { navigate } = this.props;
                const redirectPath = "/login";
                navigate(`${redirectPath}`);
            }
        }

    }
    render() {
        return (
            <div className="login-backround ">
                <div className="container">
                    <div className="row d-flex justify-content-center">
                        <div className="col-md-4 col-md-offset-4">
                            <div className="panel panel-default">
                                <div className="panel-body">
                                    <div className="text-center">
                                        <h3>
                                            <i className="fa fa-unlock fa-4x" />
                                        </h3>
                                        <h2 className="text-center">Update New Password?</h2>
                                        <p>New password.</p>
                                        <div className="panel-body">

                                            <div className="form-group">
                                                <div className="input-group">
                                                    <span className="input-group-addon">
                                                        <i className="glyphicon glyphicon-envelope color-blue" />
                                                    </span>
                                                    <input
                                                        className={this.state.validInput.password
                                                            ? "form-control"
                                                            : "form-control is-invalid"
                                                        }
                                                        value={this.state.userData.password}
                                                        onChange={(event) => {
                                                            this.handleOnchangeInput(event.target.value, "password");
                                                        }}
                                                        id="password"
                                                        name="password"
                                                        placeholder="new password"
                                                        type="password"
                                                    />
                                                </div>
                                                <div className="input-group mt-3">
                                                    <span className="input-group-addon">
                                                        <i className="glyphicon glyphicon-envelope color-blue" />
                                                    </span>
                                                    <input
                                                        className={this.state.validInput.confirmPassword
                                                            ? "form-control"
                                                            : "form-control is-invalid"
                                                        }
                                                        value={this.state.userData.confirmPassword}
                                                        onChange={(event) => {
                                                            this.handleOnchangeInput(event.target.value, "confirmPassword");
                                                        }}
                                                        id="confirmPassword"
                                                        name="confirmPassword"
                                                        placeholder="confirmPassword"
                                                        type="password"
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <button className="btn btn-success mt-3"
                                                    onClick={() => this.newPassword()}
                                                >
                                                    Xác nhận
                                                </button>
                                            </div>


                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(NewPassword);
