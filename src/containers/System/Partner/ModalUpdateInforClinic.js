// import { Password } from "@mui/icons-material";
import React, { Component } from "react";
// import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import { Rings } from 'react-loader-spinner';

import { Button, Modal } from "react-bootstrap";
import "../Clinic/ManageClinic.css";
import _ from "lodash";
import { toast } from "react-toastify";
import { storage } from "../../../firebase";
import { addImformationClinic } from "../../../services/partnerService";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { getClinic } from "../../../services/clinicService";
const mdParser = new MarkdownIt(/* Markdown-it options */);


class ModalUpdateInforClinic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clinicData: {},
      clinicDataDefault: {},
      validInput: {},
      validInputDefault: {},
      // userData: {},//mục đích là dùng để lấy img của icon user

      image: "",//image panel
      imgIconUser: "",
      per: null,
    };
  }

  componentDidMount() { }
  async componentDidUpdate(prevProps, prevState) {
    if (prevProps.dataModal !== this.props.dataModal) {
      this.setState({
        clinicData: {
          ...this.props.dataModal.Clinic,
          imgIconUser: this.props.dataModal.image,//llấy img của thằng User
          idUser: this.props.dataModal.id,
        },

      });
    }
    if (prevState.image !== this.state.image) {
      if (this.state.image) {
        await this.uploadFile("image");
      }

    }
    if (prevState.imgIconUser !== this.state.imgIconUser) {
      if (this.state.imgIconUser) {
        console.log("check imgIconUser >>>", this.state.imgIconUser)
        await this.uploadFile("imgIconUser");
      }

    }
  }
  addImformationOfPartner = async () => {
    let res = await addImformationClinic(this.state.clinicData);
    if (res && +res.EC === 0) {
      toast.success("Cập nhật dữ liệu thành công");
      // this.getClinicId();//cập nhật lại dữ liệu mới
      this.props.handleClose();
    } else {
      toast.error(res.EM);
    }
  };
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

  uploadFile = async (attributeImg) => {
    let file = "";
    if (attributeImg === "image") {
      file = this.state.image;
    } else if (attributeImg === "imgIconUser") {
      file = this.state.imgIconUser;
    }
    ;

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
            let _clinicData = _.cloneDeep(this.state.clinicData);
            _clinicData[attributeImg] = downloadURL;
            this.setState({ clinicData: _clinicData });

          }
        );
      }
    );
  };

  handleOnchangImage = (event, _imgVariable) => {
    let data = event.target.files; //list các image
    let getFile = data[0];
    console.log("name get file và file>>>", _imgVariable, getFile);
    if (getFile) {
      this.setState({ [_imgVariable]: getFile });//image
    }
  };
  handleOnchangeInput = (value, name) => {
    let _clinicData = _.cloneDeep(this.state.clinicData);
    _clinicData[name] = value;
    this.setState({ clinicData: _clinicData });
  };
  render() {
    console.log(
      "check props và clinicdata hiện tại đã cập nhật chưa",
      this.props.dataModal,
      this.state.clinicData,

    );
    console.log("check 2 img>>>", this.state.image, this.state.imgIconUser)
    console.log("check per>>>", this.state.per)

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
            <span>Cập nhật phòng khám: {clinicData?.nameVI}</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>

          <div className="container row content-body">
            <div className="add-new-specialty row">
              <div className="col-12 row  ">
                <div className="col-6 form-group ">
                  <div class="form-group ">
                    <label
                      for="exampleFormControlFile4"
                      className="noice-dowload"
                    >
                      Hình ảnh trên Panel của Phòng Khám
                    </label>
                    <input
                      className={
                        this.state.validInput.url
                          ? "form-control"
                          : "form-control is-invalid"
                      }
                      type="file"
                      class="form-control-file"
                      id="exampleFormControlFile4"
                      onChange={(event) => {
                        this.handleOnchangImage(event, "image");
                      }}
                    />
                  </div>
                  <div>
                    <img
                      src={
                        this.state.clinicData
                          ? this.state.clinicData.image
                          : "https://image.shutterstock.com/z/stock-vector-drawings-design-house-no-color-334341113.jpg"
                      }
                      width={100}
                      height={100}
                    />
                  </div>
                </div>
                <div className="col-6 form-group ">
                  <div class="form-group ">
                    <label
                      for="exampleFormControlFile4"
                      className="noice-dowload"
                    >
                      Hình ảnh trên Icon trên giao diện tìm phòng khám
                    </label>
                    <input
                      className={
                        this.state.validInput.url
                          ? "form-control"
                          : "form-control is-invalid"
                      }
                      type="file"
                      class="form-control-file"
                      id="exampleFormControlFile4"
                      onChange={(event) => {
                        this.handleOnchangImage(event, "imgIconUser");
                      }}
                    />
                  </div>
                  <div>
                    <img
                      src={
                        this.state.clinicData
                          ? this.state.clinicData.imgIconUser
                          : "https://image.shutterstock.com/z/stock-vector-drawings-design-house-no-color-334341113.jpg"
                      }
                      width={100}
                      height={100}
                    />
                  </div>
                </div>
              </div>
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
              <div className="col-12  mt-3 form-group">
                <label className="col-12">
                  Mô tả thời gian làm việc :
                  <textarea
                    value={this.state.clinicData?.timework}
                    placeholder={
                      "Vui lòng nhập một cách khái quát về thời gian làm việc..."
                    }
                    onChange={(event) =>
                      this.handleOnchangeInput(event.target.value, "timework")
                    }
                    style={{ width: "100%", height: "100%" }}
                  />
                </label>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          {
            this.state.per > 0 && this.state.per < 100 &&
            <>
              <div className="loading-container">
                <Rings
                  height={50}
                  with={50}
                  color='#1877f2'
                  ariaLabel='loading-indicator'
                />
                <div>Loading data...</div>
              </div>
            </>

          }
          <Button
            variant="secondary"
            onClick={() => {
              this.props.handleClose();
            }}
          >
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => this.addImformationOfPartner()}
          >

            Update
          </Button>
        </Modal.Footer>
      </Modal>
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModalUpdateInforClinic);
