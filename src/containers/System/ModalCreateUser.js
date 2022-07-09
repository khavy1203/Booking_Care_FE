// import { Password } from "@mui/icons-material";
import React, { Component } from "react";
// import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import MarkdownIt from "markdown-it";
import { Button, Modal } from "react-bootstrap";
import "./UserManage.scss";
import _ from 'lodash';
import { toast } from "react-toastify";
import { createNewUser } from "../../services/userService";
import { fetchGroup } from "../../services/userService";
import { fetchAllClinicsNoPage } from "../../services/clinicService";
import { fetchAllSpecialtysNoPage } from "../../services/specialtyService";
import { storage } from "../../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
class ModalCreateUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lstGroup: [],
            lstClinic: [],
            lstSpecial: [],
            userData: {},
            userDataDefault: {
                email: "",
                username: "",
                address: "",
                phone: "",
                image: "",
                genderId: 1,
                groupId: 3,
                clinicId: 0,
                specialtyId: 0,
            },
            validInput: {},
            validInputDefault: {
                email: true,
                username: true,
                address: true,
                image: true,
                phone: true,
                genderId: true,
                groupId: true,
                clinicId: true,
                specialtyId: true
            },
            file: "",
            per: null,
        };
    }


    componentDidMount() {

        this.fetchClinic();
        this.fetchSpecialty();
        this.fetchGroupUpdate();
        this.setState({
            validInput: this.state.validInputDefault,
            userData: this.state.userDataDefault
        })

    }
    //fetch ds chuyên khoa
    fetchSpecialty = async () => {
        let res = await fetchAllSpecialtysNoPage();
        if (res && +res.EC === 0) {
            this.setState({
                lstSpecial: res.DT,
            })
        }
    }

    //fetch ds phòng khám
    fetchClinic = async () => {
        let res = await fetchAllClinicsNoPage();
        if (res && +res.EC === 0) {
            this.setState({
                lstClinic: res.DT,
            })
        }
    }
    //fetch ds các group fetchGroup
    fetchGroupUpdate = async () => {
        let res = await fetchGroup();
        if (res && +res.EC === 0) {
            this.setState({
                lstGroup: res.DT,
            })
        }
    }

    async componentDidUpdate(prevProps, prevState) {
        if (prevState.file !== this.state.file) {
            if (this.state.file) {
                await this.uploadFile();
            }
        }




    }
    uploadFile = async () => {
        let { file } = this.state;
        const name = new Date().getTime() + file.name;
        const storageRef = ref(storage, name);

        const uploadTask = uploadBytesResumable(storageRef, file);

        // Register three observers:
        // 1. 'state_changed' observer, called any time the state changes
        // 2. Error observer, called on failure
        // 3. Completion observer, called on successful completion
        await uploadTask.on(
            "state_changed",
            async (snapshot) => {
                console.log(snapshot);
                // Observe state change events such as progress, pause, and resume
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log("Upload is " + progress + "% done");
                await this.setState({ per: progress });
                switch (snapshot.state) {
                    case "paused":
                        console.log("Upload is paused");
                        break;
                    case "running":
                        console.log("Upload is running");
                        break;
                    default:
                        break;
                }
            },
            (error) => {
                // Handle unsuccessful uploads
            },
            async () => {
                // Handle successful uploads on complete
                // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                await getDownloadURL(uploadTask.snapshot.ref).then(
                    async (downloadURL) => {
                        let _userData = _.cloneDeep(this.state.userData);
                        _userData["image"] = downloadURL;
                        this.setState({ userData: _userData });
                    }
                );
            }
        );
    };
    handleOnchangImage = (event) => {
        let data = event.target.files; //list các file
        let getFile = data[0];
        if (getFile) {
            this.setState({ file: getFile });
        }
    }

    handleOnchangeInput = (value, name) => {
        let _userData = _.cloneDeep(this.state.userData);
        _userData[name] = value;
        this.setState({ userData: _userData });
    };
    checkValidateInput = () => {

        this.setState({ validInput: this.state.validInputDefault });
        let array = ["email", "phone"];

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
    handleCreateUser = async () => {
        let check = this.checkValidateInput();
        if (check) {
            // console.log("check data>>>", this.state.userData)
            let res = await createNewUser(this.state.userData)
            if (res && +res.EC === 0) {
                toast.success(res.EM);
                this.setState({
                    userData: this.state.userDataDefault,
                    validInput: this.state.validInputDefault
                })

                this.props.handleClose();
            } else {
                toast.error(res.EM);
                this.setState({
                    validInput: this.state.validInputDefault
                })
            }
        }
    };

    render() {
        console.log("check img ", this.state.userData.image)
        return (
            <Modal
                size="lg"
                show={this.props.show}
                onHide={this.props.handleClose}
                className="modal-user"
            >
                <Modal.Header closeButton onClick={() => this.props.handleClose()}>
                    <Modal.Title id="contained-modal-title-vcenter">
                        <span>
                            Create User
                        </span>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="manage-user-container">
                        <div className="add-new-user row">

                            <div className="col-12 row  mt-4">
                                <div className="col-6 form-group">
                                    <label>Email:</label>
                                    <input
                                        className={this.state.validInput.email
                                            ? "form-control"
                                            : "form-control is-invalid"
                                        }
                                        type="text"
                                        value={this.state.userData.email}
                                        onChange={(event) => {
                                            this.handleOnchangeInput(event.target.value, "email");
                                        }}

                                    />
                                </div>
                                <div className="col-6 form-group">
                                    <label>Họ và tên:</label>
                                    <input
                                        className={this.state.validInput.username
                                            ? "form-control"
                                            : "form-control is-invalid"
                                        }
                                        type="text"
                                        value={this.state.userData.username}
                                        onChange={(event) => {
                                            this.handleOnchangeInput(event.target.value, "username");
                                        }}
                                    />
                                </div>

                            </div>
                            <div className="col-12 row  mt-4">
                                <div className="col-4 form-group">
                                    <label>Số điện thoại:</label>
                                    <input
                                        className={this.state.validInput.phone
                                            ? "form-control"
                                            : "form-control is-invalid"
                                        }
                                        type="text"
                                        value={this.state.userData.phone}
                                        onChange={(event) => {
                                            this.handleOnchangeInput(event.target.value, "phone");
                                        }}
                                    />
                                </div>
                                <div className="col-8 form-group">
                                    <label>Địa chỉ:</label>
                                    <input
                                        className={this.state.validInput.address
                                            ? "form-control"
                                            : "form-control is-invalid"
                                        }
                                        type="text"
                                        value={this.state.userData.address}
                                        onChange={(event) => {
                                            this.handleOnchangeInput(event.target.value, "address");
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="col-12 row  mt-4">
                                <div className="col-4 form-group">
                                    <label>Chuyên khoa (chỉ dành cho bác sĩ)*:</label>
                                    {
                                        this.state.userData && +this.state.userData.groupId === 2 ?
                                            <select
                                                className={this.state.validInput.specialtyId
                                                    ? "form-control"
                                                    : "form-control is-invalid"
                                                }
                                                id="exampleFormControlSelect3"
                                                onChange={(event) => {
                                                    this.handleOnchangeInput(event.target.value, "specialtyId");
                                                }}
                                                value={this.state.userData.specialtyId}
                                            >

                                                <option value="">Chọn chuyên khoa</option>
                                                {this.state.lstSpecial.length > 0 && this.state.lstSpecial.map((item, index) => {
                                                    return (
                                                        <option
                                                            key={`special-${index}`}
                                                            value={item.id}
                                                        >{item.nameVI}</option>
                                                    )
                                                })}
                                            </select>
                                            :
                                            <input
                                                className="form-control"
                                                readOnly
                                                type="text"
                                            />
                                    }

                                </div>
                                <div className="col-4 form-group">
                                    <label>Phòng khám (chỉ dành cho bác sĩ)*:</label>
                                    {
                                        this.state.userData && +this.state.userData.groupId === 2 ?
                                            <select
                                                className={this.state.validInput.clinicId
                                                    ? "form-control"
                                                    : "form-control is-invalid"
                                                }
                                                id="exampleFormControlSelect3"
                                                onChange={(event) => {
                                                    this.handleOnchangeInput(event.target.value, "clinicId");
                                                }}
                                                value={this.state.userData.clinicId}


                                            >
                                                <option value="">Chọn phòng khám</option>
                                                {this.state.lstClinic.length > 0 && this.state.lstClinic.map((item, index) => {
                                                    return (
                                                        <option
                                                            key={`clinic-${index}`}
                                                            value={item.id}
                                                        >{item.nameVI}</option>
                                                    )
                                                })}
                                            </select>
                                            :
                                            <input
                                                className="form-control"
                                                readOnly
                                                type="text"
                                            />
                                    }

                                </div>
                                <div className="col-4 form-group">
                                    <label>Group:</label>
                                    <select
                                        className={this.state.validInput.groupId
                                            ? "form-control"
                                            : "form-control is-invalid"
                                        }
                                        id="exampleFormControlSelect3"
                                        onChange={(event) => {
                                            this.handleOnchangeInput(event.target.value, "groupId");
                                        }}
                                        value={this.state.userData.groupId}


                                    >
                                        <option value="">Chọn nhóm quyền</option>
                                        {this.state.lstGroup.length > 0 && this.state.lstGroup.map((item, index) => {
                                            return (
                                                <option
                                                    key={`special-${index}`}
                                                    value={item.id}
                                                >{item.name}</option>
                                            )
                                        })}
                                    </select>
                                </div>
                                <div className="col-12 row mt-4">
                                    <div className="col-5">
                                        <label>Giới tính:</label>
                                        <select
                                            className={this.state.validInput.genderId
                                                ? "form-control"
                                                : "form-control is-invalid"
                                            }
                                            id="exampleFormControlSelect3"
                                            onChange={(event) => {
                                                this.handleOnchangeInput(event.target.value, "genderId");
                                            }}
                                            value={this.state.userData.genderId}


                                        >
                                            <option value="1">Nam</option>
                                            <option value="2">Nữ</option>
                                            <option value="3">Khác</option>

                                        </select>
                                    </div>

                                    <div className="img-avatar form-group my-3 col-2">
                                        <label>Ảnh đại diện:</label>
                                        <input
                                            className="form-control-file"
                                            type="file"
                                            onChange={(event) => {
                                                this.handleOnchangImage(event);
                                            }}
                                        />
                                        < img src={this.state.userData.image ? this.state.userData.image : 'https://image.shutterstock.com/z/stock-vector-drawings-design-house-no-color-334341113.jpg'} />
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => {
                        // this.setUserDataDefault();
                        this.props.handleClose()
                    }
                    }>
                        Close
                    </Button>
                    <Button variant="primary" disabled={this.state.userData.image === undefined} onClick={() => this.handleCreateUser()}>
                        Create new user
                    </Button>
                </Modal.Footer>
            </Modal >
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.user.isLoggedIn,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalCreateUser);