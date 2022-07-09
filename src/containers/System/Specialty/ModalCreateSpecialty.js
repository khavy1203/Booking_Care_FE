// import { Password } from "@mui/icons-material";
import React, { Component } from "react";
// import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import { Button, Modal } from "react-bootstrap";
import "./ModalSpecialty.scss";
import _ from 'lodash';
import { toast } from "react-toastify";
import { storage } from "../../../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { fetchAllSpecialties, deleteSpecialty, createNewSpecialty, updateCurrentSpecialty } from "../../../services/specialtyService";

const mdParser = new MarkdownIt(/* Markdown-it options */);

class ModalCreateSpecialty extends Component {
    constructor(props) {
        super(props);
        this.state = {
            specialtyData: {},
            specialtyDataDefault: {
                nameVI: "",
                descriptionHTML_VI: "",
                descriptionMarkdown_VI: "",

                nameEN: "",
                descriptionHTML_EN: "",
                descriptionMarkdown_EN: "",
                status: ""
            },
            validInput: {},
            validInputDefault: {
                nameVI: true,
                descriptionHTML_VI: true,
                descriptionMarkdown_VI: true,

                nameEN: true,
                descriptionHTML_EN: true,
                descriptionMarkdown_EN: true,
                status: true,
            },
            file: "",
            per: null, //tiến độ upload file lên firebase, per = 100 thì cho phép mở nút tạo/cập nhật user
        };
    }


    componentDidMount() {

        this.setState({
            validInput: this.state.validInputDefault,
            specialtyData: this.state.specialtyDataDefault
        })

    }

    async componentDidUpdate(prevProps, prevState) {

        // if (prevProps.dataModal !== this.props.dataModal) {
        //     this.setState({ specialtyData: this.props.dataModal })
        // }

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
                        let _specialtyData = _.cloneDeep(this.state.specialtyData);
                        _specialtyData["image"] = downloadURL;
                        this.setState({ specialtyData: _specialtyData });
                    }
                );
            }
        );
    };

    handleEditorChangeVI = ({ html, text }) => {
        let _specialtyData = _.cloneDeep(this.state.specialtyData);
        _specialtyData["descriptionMarkdown_VI"] = text;
        _specialtyData["descriptionHTML_VI"] = html;
        this.setState({ specialtyData: _specialtyData });
    };

    handleEditorChangeEN = ({ html, text }) => {
        let _specialtyData = _.cloneDeep(this.state.specialtyData);
        _specialtyData["descriptionMarkdown_EN"] = text;
        _specialtyData["descriptionHTML_EN"] = html;
        this.setState({ specialtyData: _specialtyData });

    };



    handleOnchangImage = (event) => {
        let data = event.target.files; //list các file
        let getFile = data[0];
        if (getFile) {
            this.setState({ file: getFile });
        }
    }

    handleOnchangeInput = (value, name) => {
        let _specialtyData = _.cloneDeep(this.state.specialtyData);
        _specialtyData[name] = value;
        this.setState({ specialtyData: _specialtyData });
    };


    checkValidateInput = () => {

        this.setState({ validInput: this.state.validInputDefault });
        let array = ["nameVI", "nameEN"];

        for (let i = 0; i < array.length; i++) {
            if (!this.state.specialtyData[array[i]]) {
                //set lai gia tri input bang false khi gia tri trong
                let _validInput = _.cloneDeep(this.state.validInputDefault);
                _validInput[array[i]] = false;
                this.setState({ validInput: _validInput });
                return false;

            }
        }
        return true;

    };

    handleCreateNewSpecialty = async () => {
        let check = this.checkValidateInput();
        console.log("kiểm tra check trong update specialty ", check, this.state.validInput);
        if (check) {
            console.log("check data>>>", this.state.specialtyData)
            let res = await createNewSpecialty(this.state.specialtyData)
            if (res && +res.EC === 0) {
                toast.success(res.EM);
                this.setState({
                    specialtyData: this.state.specialtyDataDefault
                })

                this.props.handleClose();
            } else {
                toast.error(res.EM);
            }
        }
    };

    render() {
        // console.log("check specialty data >>>", this.state.specialtyData)
        // let { specialtyData } = this.state;
        console.log("check img ", this.state.specialtyData.image)
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
                            Tạo mới chuyên khoa
                        </span>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="manage-specialty-container">
                        <div className="ms-title">Quản lý chuyên khoa</div>
                        <div className="add-new-specialty row">
                            <div className="col-4 form-group">
                                <label>Tên chuyên khoa (VI)</label>
                                <input
                                    className={this.state.validInput.nameVI
                                        ? "form-control"
                                        : "form-control is-invalid"
                                    }
                                    type="text"
                                    value={this.state.specialtyData.nameVI}
                                    onChange={(event) => {
                                        this.handleOnchangeInput(event.target.value, "nameVI");
                                    }}
                                />
                            </div>
                            <div className="col-4 form-group">
                                <label>Tên chuyên khoa (EN)</label>
                                <input
                                    className={this.state.validInput.nameEN
                                        ? "form-control"
                                        : "form-control is-invalid"
                                    }
                                    type="text"
                                    value={this.state.specialtyData.nameEN}
                                    onChange={(event) => {
                                        this.handleOnchangeInput(event.target.value, "nameEN");
                                    }}
                                />
                            </div>
                            <div className="col-4 form-group">
                                <label>Ảnh chuyên khoa</label>
                                <input
                                    className="form-control-file"
                                    type="file"
                                    onChange={(event) => {
                                        this.handleOnchangImage(event);
                                    }}
                                />
                                <div className="img-avatar">
                                    < img src={this.state.specialtyData.image ? this.state.specialtyData.image : 'https://image.shutterstock.com/z/stock-vector-drawings-design-house-no-color-334341113.jpg'} />
                                </div>
                            </div>
                            <div className="col-12 form-group">
                                <label>Mô tả (VI)</label>
                                <MdEditor
                                    style={{ height: "300px" }}
                                    renderHTML={(text) => mdParser.render(text)}
                                    onChange={this.handleEditorChangeVI}
                                    value={this.state.specialtyData.descriptionMarkdown_VI}
                                />
                            </div>
                            <div className="col-12 form-group">
                                <label>Mô tả (EN)</label>
                                <MdEditor
                                    style={{ height: "300px" }}
                                    renderHTML={(text) => mdParser.render(text)}
                                    onChange={this.handleEditorChangeEN}
                                    value={this.state.specialtyData.descriptionMarkdown_EN}
                                />
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
                    <Button variant="primary" disabled={this.state.specialtyData.image === undefined} onClick={() => this.handleCreateNewSpecialty()}>
                        Create
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

export default connect(mapStateToProps, mapDispatchToProps)(ModalCreateSpecialty);