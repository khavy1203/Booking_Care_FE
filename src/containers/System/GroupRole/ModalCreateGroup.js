// import { Password } from "@mui/icons-material";
import React, { Component } from "react";
// import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import { Button, Modal } from "react-bootstrap";
import "./ManageGroupRole";
import _ from 'lodash';
import { toast } from "react-toastify";
import { storage } from "../../../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { createNewGroup } from "../../../services/userService";

const mdParser = new MarkdownIt(/* Markdown-it options */);

class ModalCreateGroup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            groupData: {},
            specialtyDataDefault: {
                name: "",
                description: "",
            },
            validInput: {},
            validInputDefault: {
                name: true,
                description: true,
            },

        };
    }


    componentDidMount() {
        this.setState({
            validInput: this.state.validInputDefault,
        })
    }

    async componentDidUpdate(prevProps, prevState) {
    }

    handleOnchangeInput = (value, name) => {
        let _specialtyData = _.cloneDeep(this.state.groupData);
        _specialtyData[name] = value;
        this.setState({ groupData: _specialtyData });
    };


    checkValidateInput = () => {

        this.setState({ validInput: this.state.validInputDefault });
        let array = ["name", "description"];

        for (let i = 0; i < array.length; i++) {
            if (!this.state.groupData[array[i]]) {
                //set lai gia tri input bang false khi gia tri trong
                let _validInput = _.cloneDeep(this.state.validInputDefault);
                _validInput[array[i]] = false;
                this.setState({ validInput: _validInput });
                return false;

            }
        }
        return true;

    };

    handleCreateNewGroup = async () => {

        let check = this.checkValidateInput();
        if (check) {
            console.log("check data>>>", this.state.groupData)
            let res = await createNewGroup(this.state.groupData)
            if (res && +res.EC === 0) {
                toast.success(res.EM);
                this.props.handleClose();
            } else {
                toast.error(res.EM);
            }
        }

    };


    render() {
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
                            Tạo mới Group
                        </span>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="manage-specialty-container">
                        <div className="add-new-specialty row">
                            <div className="col-4 form-group">
                                <label>Tên group </label>
                                <input
                                    className={this.state.validInput.name
                                        ? "form-control"
                                        : "form-control is-invalid"
                                    }
                                    type="text"
                                    value={this.state.groupData.name}
                                    onChange={(event) => {
                                        this.handleOnchangeInput(event.target.value, "name");
                                    }}
                                />
                            </div>
                            <div className="col-8 form-group">
                                <label>Mô tả Group</label>
                                <textarea
                                    className={this.state.validInput.description
                                        ? "form-control"
                                        : "form-control is-invalid"
                                    }
                                    type="text"
                                    value={this.state.groupData.description}
                                    onChange={(event) => {
                                        this.handleOnchangeInput(event.target.value, "description");
                                    }}
                                    placeholder="Mô tả các quyền hạn của nhóm Group này"
                                />
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => {
                        this.props.handleClose()
                    }
                    }>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => this.handleCreateNewGroup()}>
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

export default connect(mapStateToProps, mapDispatchToProps)(ModalCreateGroup);