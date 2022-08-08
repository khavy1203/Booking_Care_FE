// import { Password } from "@mui/icons-material";
import React, { Component } from "react";
// import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import { Button, Modal } from "react-bootstrap";
import "./ManageClinic.css";
import _ from "lodash";
import { toast } from "react-toastify";
import { storage } from "../../../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {
  fetchAllClinics,
  deleteClinic,
  createNewClinic,
  updateCurrentClinic,
} from "../../../services/clinicService";
import { Link } from "react-router-dom";
import { SiZalo } from "react-icons/si";
const mdParser = new MarkdownIt(/* Markdown-it options */);

class ModalUpdateClinic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clinicData: {},
      clinicDataDefault: {
        phoneContact: "",
        nameVI: "",
        nameEN: "",
        addressVI: "",
        addressEN: "",
        descriptionMarkdown_VI: "",
        descriptionMarkdown_EN: "",
        image: "",
        descriptionHTML_EN: "",
        descriptionHTML_VI: "",
        provinceId: "",
        districtId: "",
        wardId: "",
        linkfile: "",
        status: "",
      },
      validInput: {},
      validInputDefault: {
        nameVI: true,
        nameEN: true,
        addressVI: true,
        addressEN: true,
        provinceId: true,
        districtId: true,
        wardId: true,
        linkfile: true,
        status: true,
      },
      file: "",
      per: null, //tiến độ upload file lên firebase, per = 100 thì cho phép mở nút tạo/cập nhật user

      lstWard: [],
      lstDistrict: [],
      lstProvince: [],
    };
  }

  componentDidMount() {
    this.setState({
      validInput: this.state.validInputDefault,
      clinicData: this.state.clinicDataDefault,
    });

    this.fetchProvince();
  }

  fetchProvince = () => {
    fetch("https://provinces.open-api.vn/api/", {
      method: "GET", // or 'PUT'
    })
      .then((response) => response.json())
      .then((actualData) => {
        this.setState({
          lstProvince: actualData,
        });
      })
      .catch((err) => {
        console.log(err.message);
      })
      .finally(() => {
        // setLoading(false);
      });
  };
  fetchDistrict = () => {
    fetch("https://provinces.open-api.vn/api/d", {
      method: "GET", // or 'PUT'
    })
      .then((response) => response.json())
      .then((actualData) => {
        console.log("check actual Data", actualData);
        let lstDistrictOfProvince = actualData.filter(
          (item) => item.province_code === +this.state.clinicData.provinceId
        );
        this.setState({ lstDistrict: lstDistrictOfProvince });
      })
      .catch((err) => {
        console.log(err.message);
      })
      .finally(() => {
        // setLoading(false);
      });
  };
  fetchWard = () => {
    fetch("https://provinces.open-api.vn/api/w", {
      method: "GET", // or 'PUT'
    })
      .then((response) => response.json())
      .then((actualData) => {
        console.log("check actual Data", actualData);
        let lstWardOfDistrict = actualData.filter(
          (item) => item.district_code === +this.state.clinicData.districtId
        );
        this.setState({ lstWard: lstWardOfDistrict });
      })
      .catch((err) => {
        console.log(err.message);
      })
      .finally(() => {
        // setLoading(false);
      });
  };

  async componentDidUpdate(prevProps, prevState) {
    if (prevProps.dataModal !== this.props.dataModal) {
      this.setState({ clinicData: this.props.dataModal });
    }
    if (prevState.clinicData.provinceId !== this.state.clinicData.provinceId) {
      //xử lý cập nhật lại dữ liệu, fetch lại data cho huyện
      this.setState({ lstWard: {} });
      this.fetchDistrict();
    }
    if (prevState.clinicData.districtId !== this.state.clinicData.districtId) {
      //xử lý cập nhật lại dữ liệu, fetch lại data cho huyện
      this.fetchWard();
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
            let _clinicData = _.cloneDeep(this.state.clinicData);
            _clinicData["image"] = downloadURL;
            this.setState({ clinicData: _clinicData });
          }
        );
      }
    );
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

  handleOnchangImage = (event) => {
    let data = event.target.files; //list các file
    let getFile = data[0];
    if (getFile) {
      this.setState({ file: getFile });
    }
  };

  handleOnchangeInput = (value, name) => {
    let _clinicData = _.cloneDeep(this.state.clinicData);
    _clinicData[name] = value;
    this.setState({ clinicData: _clinicData });
  };

  checkValidateInput = () => {
    this.setState({ validInput: this.state.validInputDefault });
    let array = [
      "nameVI",
      "addressVI",
      "nameEN",
      "addressEN",
      "provinceId",
      "districtId",
      "wardId",
    ];

    for (let i = 0; i < array.length; i++) {
      if (!this.state.clinicData[array[i]]) {
        //set lai gia tri input bang false khi gia tri trong
        let _validInput = _.cloneDeep(this.state.validInputDefault);
        _validInput[array[i]] = false;
        this.setState({ validInput: _validInput });
        return false;
      }
    }
    return true;
  };

  handleUpdateClinic = async () => {
    let check = this.checkValidateInput();
    console.log(
      "kiểm tra check trong update clinic ",
      check,
      this.state.validInput
    );
    if (check) {
      console.log("check data>>>", this.state.clinicData);
      let res = await updateCurrentClinic(this.state.clinicData);
      if (res && +res.EC === 0) {
        toast.success(res.EM);
        this.props.handleClose();
      } else {
        toast.error(res.EM);
      }
    }
  };
  handleButtonStatusClinic = () => {
    let _clinicData = _.cloneDeep(this.state.clinicData);
    _clinicData["status"] = this.state.clinicData.status === 1 ? 0 : 1;
    this.setState({ clinicData: _clinicData });
    console.log(" check clinic data >>>", this.state.clinicData);
  };
  render() {
    console.log("check clinic data >>>", this.state.clinicData);
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
            <span>Cập nhật phòng khám</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container row content-body">
            <div className="add-new-specialty row">
              <div className="col-12 row">
                <div className="col-6 form-group">
                  <label>Tên phòng khám (VI) </label>
                  <input
                    className={
                      this.state.validInput.nameVI
                        ? "form-control"
                        : "form-control is-invalid"
                    }
                    type="text"
                    value={this.state.clinicData.nameVI}
                    onChange={(event) =>
                      this.handleOnchangeInput(event.target.value, "nameVI")
                    }
                  />
                </div>
                <div className="col-6 form-group">
                  <label>Tên phòng khám (EN) </label>
                  <input
                    className={
                      this.state.validInput.nameEN
                        ? "form-control"
                        : "form-control is-invalid"
                    }
                    type="text"
                    value={this.state.clinicData.nameEN}
                    onChange={(event) =>
                      this.handleOnchangeInput(event.target.value, "nameEN")
                    }
                  />
                </div>
              </div>
              <div className="col-12 row">
                <div className="col-6 form-group">
                  <label>Địa chỉ phòng khám (VI)</label>
                  <input
                    className={
                      this.state.validInput.addressVI
                        ? "form-control"
                        : "form-control is-invalid"
                    }
                    type="text"
                    value={this.state.clinicData.addressVI}
                    onChange={(event) =>
                      this.handleOnchangeInput(event.target.value, "addressVI")
                    }
                  />
                </div>
                <div className="col-6 form-group">
                  <label>Địa chỉ phòng khám (EN)</label>
                  <input
                    className={
                      this.state.validInput.addressEN
                        ? "form-control"
                        : "form-control is-invalid"
                    }
                    type="text"
                    value={this.state.clinicData.addressEN}
                    onChange={(event) =>
                      this.handleOnchangeInput(event.target.value, "addressEN")
                    }
                  />
                </div>
              </div>
              <div className="form-group col-4 address">
                <label htmlFor="exampleFormControlSelect1">
                  Tỉnh/Thành Phố
                </label>
                <select
                  className={
                    this.state.validInput.provinceId
                      ? "form-control"
                      : "form-control is-invalid"
                  }
                  id="exampleFormControlSelect1"
                  onChange={(event) =>
                    this.handleOnchangeInput(event.target.value, "provinceId")
                  }
                  value={clinicData.provinceId ? clinicData.provinceId : ""}
                >
                  <option value="">Vui lòng chọn Tỉnh/Thành Phố</option>
                  {this.state.lstProvince.length > 0 &&
                    this.state.lstProvince.map((item, index) => {
                      return (
                        <option key={`province-${index}`} value={item.code}>
                          {item.name}
                        </option>
                      );
                    })}
                </select>
              </div>
              <div className="form-group col-4 address">
                <label htmlFor="exampleFormControlSelect2">Quận/huyện</label>
                <select
                  className={
                    this.state.validInput.districtId
                      ? "form-control"
                      : "form-control is-invalid"
                  }
                  id="exampleFormControlSelect2"
                  onChange={(event) =>
                    this.handleOnchangeInput(event.target.value, "districtId")
                  }
                  value={clinicData.districtId ? clinicData.districtId : ""}
                >
                  <option value="">Vui lòng chọn Quận/huyện</option>
                  {this.state.lstDistrict.length > 0 &&
                    this.state.lstDistrict.map((item, index) => {
                      return (
                        <option key={`distric-${index}`} value={item.code}>
                          {item.name}
                        </option>
                      );
                    })}
                </select>
              </div>
              <div className="form-group col-4 address">
                <label htmlFor="exampleFormControlSelect3">Xã/Phường</label>
                <select
                  className={
                    this.state.validInput.wardId
                      ? "form-control"
                      : "form-control is-invalid"
                  }
                  id="exampleFormControlSelect3"
                  onChange={(event) =>
                    this.handleOnchangeInput(event.target.value, "wardId")
                  }
                  value={clinicData.wardId ? clinicData.wardId : ""}
                >
                  <option value="">Vui lòng chọn Xã/phường</option>
                  {this.state.lstWard.length > 0 &&
                    this.state.lstWard.map((item, index) => {
                      return (
                        <option key={`ward-${index}`} value={item.code}>
                          {item.name}
                        </option>
                      );
                    })}
                </select>
              </div>
              <div className="col-12 row form-group mt-3">
                <div className="col-6 select-province">
                  <label>Ảnh phòng khám</label>
                  <input
                    className="form-control-file"
                    type="file"
                    onChange={(event) => {
                      this.handleOnchangImage(event);
                    }}
                  />
                  <div className="img-avatar">
                    <img
                      src={
                        clinicData.image
                          ? clinicData.image
                          : "https://image.shutterstock.com/z/stock-vector-drawings-design-house-no-color-334341113.jpg"
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="col-12 row">
                <div className="col-6">
                  <a
                    href={clinicData.linkfile ? clinicData.linkfile : "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {clinicData.linkfile
                      ? "Link file đính kèm"
                      : "Người dùng chưa upload file"}
                  </a>
                </div>
                <div className="col-6 form-group ">
                  <div className="col-10">
                    Số điện thoại liên hệ :
                    {clinicData.phoneContact
                      ? clinicData.phoneContact
                      : "Người dùng chưa có sđt"}{" "}
                  </div>
                  {clinicData.phoneContact && (
                    <a
                      href={`https://zalo.me/${clinicData.phoneContact}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="col-2"
                      style={{ color: "green", fontSize: 30 }}
                    >
                      <SiZalo value={{ height: "100%", width: "100%" }} />
                    </a>
                  )}
                </div>
              </div>
              {/* <div className="col-12 mt-3 form-group">
                                <label>Mô tả(VI))</label>
                                <MdEditor
                                    style={{ height: "300px" }}
                                    renderHTML={(text) => mdParser.render(text)}
                                    onChange={this.handleEditorChangeVI}
                                    value={this.state.clinicData.descriptionMarkdown_VI}
                                />
                            </div>
                            <div className="col-12  mt-3 form-group">
                                <label>Mô tả(EN)</label>
                                <MdEditor
                                    style={{ height: "300px" }}
                                    renderHTML={(text) => mdParser.render(text)}
                                    onChange={this.handleEditorChangeEN}
                                    value={this.state.clinicData.descriptionMarkdown_EN}
                                />
                            </div> */}
              <div className="col-12 col-sm-6 form-groupId mt-3">
                <label>
                  Trạng thái (<span className="red">*</span>) :
                </label>
                <select
                  className="form-select"
                  onChange={(event) =>
                    this.handleOnchangeInput(event.target.value, "status")
                  }
                  value={this.state.clinicData.status}
                >
                  {this.state.clinicData.status === 0 && (
                    <option value="0">Đợi duyệt</option>
                  )}
                  <option value="1">Hoạt động</option>
                  <option value="2">Tạm dừng</option>
                </select>
              </div>
            </div>
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
          <Button variant="primary" onClick={() => this.handleUpdateClinic()}>
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

export default connect(mapStateToProps, mapDispatchToProps)(ModalUpdateClinic);
