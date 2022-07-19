// import { Password } from "@mui/icons-material";
import React, { Component } from "react";
// import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import { Button, Modal } from "react-bootstrap";
import "../Clinic/ManageClinic.css";
import _ from 'lodash';
import { toast } from "react-toastify";
import { storage } from "../../../firebase";
import { addImformationClinic } from "../../../services/partnerService";
import { getClinic } from "../../../services/clinicService";
const mdParser = new MarkdownIt(/* Markdown-it options */);

class ModalUpdateInforClinic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            clinicData: {},
            clinicDataDefault: {
            },
            validInput: {},
            validInputDefault: {
            },
        };
    }


    componentDidMount() {

    }
    async componentDidUpdate(prevProps, prevState) {
        if (prevProps.dataModal !== this.props.dataModal) {
            this.setState({ clinicData: this.props.dataModal })
        }
    }
    // getClinicId = async () => {
    //     console.log("check clinicData ", this.state.clinicData.id)
    //     let res = await getClinic(+this.state.clinicData.id);
    //     if (res && +res.EC === 0) {
    //         this.setState({ clinicData: res.DT.clinic })
    //         toast.success("Cập nhật dữ liệu thành công")
    //     } else {
    //         toast.error(res.EM)
    //     }
    // }
    addImformationOfPartner = async () => {
        let res = await addImformationClinic(this.state.clinicData);
        if (res && +res.EC === 0) {
            toast.success('Cập nhật dữ liệu thành công')
            // this.getClinicId();//cập nhật lại dữ liệu mới
            this.props.handleClose();

        } else {
            toast.error(res.EM)
        }
    }
    handleEditorChangeVI = ({ html, text }) => {
        let _clinicData = _.cloneDeep(this.state.clinicData);
        _clinicData["descriptionMarkdown_VI"] = text;
        _clinicData["descriptionHTML_VI"] = html;
        this.setState({ clinicData: _clinicData });
    };

    handleEditorChangeEN = ({ html, text }) => {
        let _clinicData = _.cloneDeep(this.state.clinicData);
        _clinicData["descriptionMarkdown_EN"] = text;
        _clinicData["descriptionHTML_EN"] = html;
        this.setState({ clinicData: _clinicData });

    };


    render() {
        console.log("check clinic data >>>", this.state.clinicData)
        console.log("check props và clinicdata hiện tại đã cập nhật chưa", this.props.dataModal, this.state.clinicData)
        let { clinicData } = this.state;
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
                            Cập nhật phòng khám: {clinicData?.nameVI}
                        </span>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="container row content-body" >
                        <div className="add-new-specialty row">
                            <div className="col-12 mt-3 form-group">
                                <label>Mô tả(VI))</label>
                                <MdEditor
                                    style={{ height: "500px" }}
                                    renderHTML={(text) => mdParser.render(text)}
                                    onChange={this.handleEditorChangeVI}
                                    value={this.state.clinicData?.descriptionMarkdown_VI}
                                />
                            </div>
                            <div className="col-12  mt-3 form-group">
                                <label>Mô tả(EN)</label>
                                <MdEditor
                                    style={{ height: "500px" }}
                                    renderHTML={(text) => mdParser.render(text)}
                                    onChange={this.handleEditorChangeEN}
                                    value={this.state.clinicData?.descriptionMarkdown_EN}
                                />
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => {
                        this.props.handleClose();
                    }}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => this.addImformationOfPartner()}>
                        Update
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

export default connect(mapStateToProps, mapDispatchToProps)(ModalUpdateInforClinic);