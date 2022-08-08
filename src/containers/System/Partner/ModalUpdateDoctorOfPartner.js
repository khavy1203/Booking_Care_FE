// import { Password } from "@mui/icons-material";
import React, { Component } from "react";
// import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import { Button, Modal } from "react-bootstrap";
import "./Partner";
import _ from "lodash";
import { toast } from "react-toastify";
import { storage } from "../../../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { FormattedMessage } from "react-intl";
// import Select from "react-select";
import {
  createUserDoctorsofClinic,
  getStatusOfClinic,
  fetchAllSpecialtysOfPartner,
  getDoctorsOfClinic,
  updateDoctorOfClinic,
} from "../../../services/partnerService";

const mdParser = new MarkdownIt(/* Markdown-it options */);

class ModalUpdateDoctorOfPartner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      doctorData: {},
      lstSpecial: [],
      doctorDataDefault: {
        username: "", //yêu cầu cần thêm họ và tên của Bác sĩ
        idUser: "",
        phone: "",
        specialIdUser: "",
        idDoctorInfo: "",
        introductionVI: "",
        noteVI: "",
        paymentVI: "",
        descriptionHTLM_VI: "",
        descriptionMarkdown_VI: "",
        degree_VI: "",
        introductionEN: "",
        noteEN: "",
        paymentEN: "",
        descriptionHTLM_EN: "",
        descriptionMarkdown_EN: "",
        degree_EN: "",
        price: "",
        active: "",
        linkfile: "",
      },
      validInput: {},
      validInputDefault: {
        username: true, //yêu cầu cần thêm họ và tên của Bác sĩ
        idUser: true,
        phone: true,
        specialIdUser: true,
        idDoctorInfo: true,
        introductionVI: true,
        noteVI: true,
        paymentVI: true,
        descriptionHTLM_VI: true,
        descriptionMarkdown_VI: true,
        degree_VI: true,
        introductionEN: true,
        noteEN: true,
        paymentEN: true,
        descriptionHTLM_EN: true,
        descriptionMarkdown_EN: true,
        degree_EN: true,
        price: true,
        active: true,
        linkfile: true,
      },
      file: "",
      per: null, //tiến độ upload file lên firebase, per = 100 thì cho phép mở nút tạo/cập nhật user
    };
  }

  componentDidMount() {
    this.setState({
      validInput: this.state.validInputDefault,
      doctorData: this.state.doctorDataDefault,
    });
  }

  async componentDidUpdate(prevProps, prevState) {
    let dataUpdate = this.props.dataModal;
    if (prevProps.dataModal !== this.props.dataModal) {
      console.log("check prop data Modal >>>", this.props.dataModal);
      let _doctorData = _.cloneDeep(this.state.doctorData);
      _doctorData["username"] = dataUpdate["Users.username"];
      _doctorData["idUser"] = dataUpdate["Users.id"];
      _doctorData["phone"] = dataUpdate["Users.phone"];
      _doctorData["idDoctorInfo"] = dataUpdate["Users.Doctorinfo.id"];
      _doctorData["specialIdUser"] = dataUpdate["Users.Specialty.id"];
      _doctorData["introductionVI"] =
        dataUpdate["Users.Doctorinfo.introductionVI"];
      _doctorData["noteVI"] = dataUpdate["Users.Doctorinfo.noteVI"];
      _doctorData["paymentVI"] = dataUpdate["Users.Doctorinfo.paymentVI"];
      _doctorData["descriptionHTLM_VI"] =
        dataUpdate["Users.Doctorinfo.descriptionHTLM_VI"];
      _doctorData["descriptionMarkdown_VI"] =
        dataUpdate["Users.Doctorinfo.descriptionMarkdown_VI"];
      _doctorData["degree_VI"] = dataUpdate["Users.Doctorinfo.degree_VI"];
      _doctorData["introductionEN"] =
        dataUpdate["Users.Doctorinfo.introductionEN"];
      _doctorData["noteEN"] = dataUpdate["Users.Doctorinfo.noteEN"];
      _doctorData["paymentEN"] = dataUpdate["Users.Doctorinfo.paymentEN"];
      _doctorData["descriptionHTLM_EN"] =
        dataUpdate["Users.Doctorinfo.descriptionHTLM_EN"];
      _doctorData["descriptionMarkdown_EN"] =
        dataUpdate["Users.Doctorinfo.descriptionMarkdown_EN"];
      _doctorData["degree_EN"] = dataUpdate["Users.Doctorinfo.degree_EN"];
      _doctorData["price"] = dataUpdate["Users.Doctorinfo.price"];
      _doctorData["active"] = dataUpdate["Users.Doctorinfo.active"];
      _doctorData["linkfile"] = dataUpdate["Users.Doctorinfo.linkfile"];
      this.setState({
        doctorData: _doctorData,
      });
    }

    if (prevProps.lstSpecial !== this.props.lstSpecial) {
      this.setState({
        lstSpecial: this.props.lstSpecial,
      });
    }
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
            let _doctorData = _.cloneDeep(this.state.doctorData);
            _doctorData["linkfile"] = downloadURL;
            this.setState({ doctorData: _doctorData });
          }
        );
      }
    );
  };

  handleEditorChangeVI = ({ html, text }) => {
    let _doctorData = _.cloneDeep(this.state.doctorData);
    _doctorData["descriptionMarkdown_VI"] = text;
    _doctorData["descriptionHTML_VI"] = html;
    this.setState({ doctorData: _doctorData });
  };

  handleEditorChangeEN = ({ html, text }) => {
    let _doctorData = _.cloneDeep(this.state.doctorData);
    _doctorData["descriptionMarkdown_EN"] = text;
    _doctorData["descriptionHTML_EN"] = html;
    this.setState({ doctorData: _doctorData });
  };

  handleOnchangImage = (event) => {
    let data = event.target.files; //list các file
    let getFile = data[0];
    if (getFile) {
      this.setState({ file: getFile });
    }
  };

  handleOnchangeInput = (value, name) => {
    let _doctorData = _.cloneDeep(this.state.doctorData);
    _doctorData[name] = value;
    this.setState({ doctorData: _doctorData });
  };

  checkValidateInput = () => {
    this.setState({ validInput: this.state.validInputDefault });
    let array = ["specialIdUser", "active", "username", "phone"];

    for (let i = 0; i < array.length; i++) {
      if (!this.state.doctorData[array[i]]) {
        //set lai gia tri input bang false khi gia tri trong
        let _validInput = _.cloneDeep(this.state.validInputDefault);
        _validInput[array[i]] = false;
        this.setState({ validInput: _validInput });
        return false;
      }
    }
    return true;
  };

  handleUpdateDoctorOfClinic = async () => {
    let check = this.checkValidateInput();
    console.log("check data>>>", this.state.doctorData);

    if (check) {
      let res = await updateDoctorOfClinic(this.state.doctorData);
      if (res && +res.EC === 0) {
        toast.success(res.EM);
        this.setState({
          doctorData: this.state.doctorDataDefault,
        });

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
            <span>Cập nhật thông tin bác sĩ</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="more-info">
            <div className="info-top row">
              <div className="col-6 form-group">
                <label>Chuyên khoa (chỉ dành cho bác sĩ)*:</label>
                {this.state.doctorData ? (
                  <select
                    className={
                      this.state.validInput.specialIdUser
                        ? "form-control"
                        : "form-control is-invalid"
                    }
                    id="exampleFormControlSelect3"
                    onChange={(event) => {
                      this.handleOnchangeInput(
                        event.target.value,
                        "specialIdUser"
                      );
                    }}
                    value={this.state.doctorData.specialIdUser}
                  >
                    <option value="">Chọn chuyên khoa</option>
                    {this.state.lstSpecial.length > 0 &&
                      this.state.lstSpecial.map((item, index) => {
                        return (
                          <option key={`special-${index}`} value={item.id}>
                            {item.nameVI}
                          </option>
                        );
                      })}
                  </select>
                ) : (
                  <input className="form-control" readOnly type="text" />
                )}
              </div>
              <div className="col-6 form-group row">
                <div class="form-group col-8 ">
                  <label
                    for="exampleFormControlFile4"
                    className="noice-dowload"
                  >
                    File nén đính kèm (tài liệu và thông tin bác sĩ)
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
                      this.handleOnchangImage(event);
                    }}
                  />
                </div>
                <div class="form-group col-4">
                  <label for="exampleFormControlFile5">Link file: </label>
                  <a
                    target="_blank"
                    href={
                      this.state.doctorData
                        ? this.state.doctorData.linkfile
                        : "#"
                    }
                  >
                    {this.state.doctorData && this.state.doctorData.linkfile
                      ? " Bấm để lấy file"
                      : " Chưa cập nhật link file"}
                  </a>
                </div>
              </div>
            </div>

            <div className="info-center">
              <div className="info-doctor row form-group">
                <div className="intro-doctor-vi col-6">
                  <label>
                    {/* <FormattedMessage id="admin.manage-doctor.intro" /> */}
                    Họ tên bác sĩ
                  </label>
                  <input
                    className={
                      this.state.validInput.username
                        ? "form-control"
                        : "form-control is-invalid"
                    }
                    type="text"
                    value={this.state.doctorData.username}
                    onChange={(event) => {
                      this.handleOnchangeInput(event.target.value, "username");
                    }}
                  />
                </div>
                <div className="intro-doctor-vi col-6">
                  <label>
                    {/* <FormattedMessage id="admin.manage-doctor.intro" /> */}
                    Số điện thoại
                  </label>
                  <input
                    className={
                      this.state.validInput.phone
                        ? "form-control"
                        : "form-control is-invalid"
                    }
                    type="text"
                    value={this.state.doctorData.phone}
                    onChange={(event) => {
                      this.handleOnchangeInput(event.target.value, "phone");
                    }}
                  />
                </div>
              </div>
              <div className="info-doctor row form-group">
                <div className="intro-doctor-vi col-6">
                  <label>
                    {/* <FormattedMessage id="admin.manage-doctor.intro" /> */}
                    Thông tin giới thiệu (VI)
                  </label>
                  <textarea
                    className="form-control"
                    type="text"
                    value={this.state.doctorData.introductionVI}
                    onChange={(event) => {
                      this.handleOnchangeInput(
                        event.target.value,
                        "introductionVI"
                      );
                    }}
                  ></textarea>
                </div>
                <div className="intro-doctor-en col-6">
                  <label>
                    {/* <FormattedMessage id="admin.manage-doctor.intro" /> */}
                    Thông tin giới thiệu (EN)
                  </label>
                  <textarea
                    className="form-control"
                    type="text"
                    value={this.state.doctorData.introductionEN}
                    onChange={(event) => {
                      this.handleOnchangeInput(
                        event.target.value,
                        "introductionEN"
                      );
                    }}
                  ></textarea>
                </div>
              </div>

              <div className="info-price">
                <div className="doctor-price row form-group">
                  <div className="col-3">
                    <label>Giá khám (VND)</label>
                    <input
                      className="form-control"
                      type="text"
                      value={this.state.doctorData.price}
                      onChange={(event) => {
                        this.handleOnchangeInput(event.target.value, "price");
                      }}
                      placeholder="Cần nhập giá khám"
                    />
                  </div>
                  <div className="col-3">
                    <label>Chức vụ(VI)</label>
                    <select
                      className="form-select "
                      onChange={(event) => {
                        this.handleOnchangeInput(
                          event.target.value,
                          "degree_VI"
                        );
                      }}
                      value={this.state.doctorData.degree_VI}
                    >
                      <option value="Thạc sĩ">Thạc sĩ</option>
                      <option value="Tiến sĩ">Tiến sĩ</option>
                      <option value="Thầy thuốc ưu tú">Thầy thuốc ưu tú</option>
                      <option value="Thầy thuốc nhân dân">
                        Thầy thuốc nhân dân
                      </option>
                    </select>
                  </div>

                  <div className="col-3">
                    <label>Chức vụ(EN)</label>
                    <select
                      className="form-select "
                      onChange={(event) => {
                        this.handleOnchangeInput(
                          event.target.value,
                          "degree_EN"
                        );
                      }}
                      value={this.state.doctorData.degree_EN}
                    >
                      <option value="Thạc sĩ">Thạc sĩ</option>
                      <option value="Tiến sĩ">Tiến sĩ</option>
                      <option value="Thầy thuốc ưu tú">Thầy thuốc ưu tú</option>
                      <option value="Thầy thuốc nhân dân">
                        Thầy thuốc nhân dân
                      </option>
                    </select>
                  </div>
                </div>
                <div className="doctor-payment row form-group">
                  <div className=" col-6 form-group">
                    <label>Phương thức thanh toán (VI)</label>
                    <input
                      className="form-control"
                      type="text"
                      value={this.state.doctorData.paymentVI}
                      onChange={(event) => {
                        this.handleOnchangeInput(
                          event.target.value,
                          "paymentVI"
                        );
                      }}
                    />
                  </div>
                  <div className="col-6 form-group">
                    <label>Phương thức thanh toán (EN)</label>
                    <input
                      className="form-control"
                      type="text"
                      value={this.state.doctorData.paymentEN}
                      onChange={(event) => {
                        this.handleOnchangeInput(
                          event.target.value,
                          "paymentEN"
                        );
                      }}
                    />
                  </div>
                </div>
                <div className="doctor-note row form-group">
                  <div className="col-6  form-group">
                    <label>Ghi chú (VI)</label>
                    <input
                      className="form-control"
                      type="text"
                      value={this.state.doctorData.noteVI}
                      onChange={(event) => {
                        this.handleOnchangeInput(event.target.value, "noteVI");
                      }}
                    />
                  </div>
                  <div className=" col-6 form-group">
                    <label>Ghi chú (EN)</label>
                    <input
                      className="form-control"
                      type="text"
                      value={this.state.doctorData.noteEN}
                      onChange={(event) => {
                        this.handleOnchangeInput(event.target.value, "noteEN");
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="info-bottom">
            <div className="manage-doctor-editor-vi form-group">
              <label>Mô tả bác sĩ (VI)</label>
              <MdEditor
                style={{ height: "500px" }}
                renderHTML={(text) => mdParser.render(text)}
                onChange={this.handleEditorChangeVI}
                value={this.state.doctorData.descriptionMarkdown_VI}
              />
            </div>
            <div className="manage-doctor-editor-en form-group">
              <label>Mô tả bác sĩ (EN)</label>
              <MdEditor
                style={{ height: "500px" }}
                renderHTML={(text) => mdParser.render(text)}
                onChange={this.handleEditorChangeEN}
                value={this.state.doctorData.descriptionMarkdown_EN}
              />
            </div>
          </div>
          <div className="col-12 col-sm-6 form-groupId mt-3">
            <label>
              Trạng thái (<span className="red">*</span>) :
            </label>
            <select
              className={
                this.state.validInput.active
                  ? "form-select"
                  : "form-select is-invalid"
              }
              onChange={(event) =>
                this.handleOnchangeInput(event.target.value, "active")
              }
              value={this.state.doctorData.active}
            >
              <option value="">
                Vui lòng chọn trạng thái hoạt động của bác sĩ
              </option>
              <option value="1">Hoạt động</option>
              <option value="2">Tạm dừng</option>
            </select>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              // this.setUserDataDefault();
              this.props.handleClose();
            }}
          >
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => this.handleUpdateDoctorOfClinic()}
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
)(ModalUpdateDoctorOfPartner);
