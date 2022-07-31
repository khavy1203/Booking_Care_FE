//video 82
import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import "./ProfileUser.css";
// import "./ProfileUser.sass";
import HomeHeader from "../HomePage/HomeHeader";
import { toast } from "react-toastify";
import _ from "lodash";
import { storage } from "../../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {
  getUserAccount,
  logoutUser,
  updateInforUser,
  getUserById,
} from "../../services/userService";

import { push } from "connected-react-router";
import * as actions from "../../store/actions";
import { ImUpload2 } from "react-icons/im";
import ModalChangePassWord from "./ModalChangePassWord";
class ProfileUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowModalUpdatePassword: false,
      userData: {},
      userDataDecode: {},
      validInput: {},
      addressClinic: "",
      dataDefault: {
        email: "",
        password: "",
        username: "",
        address: "",
        phone: "",
        image: "",
        genderId: "",
      },
      validInputDefault: {
        email: true,
        password: true,
        username: true,
        address: true,
        phone: true,
        image: true,
        genderId: true,
      },

      file: "", //để lấy file trong event
      url: "", //sau khi upload file lên firebase, firebase trả về url. Biến này để chứa url
      per: null, //tiến độ upload file lên firebase, per = 100 thì cho phép mở nút tạo/cập nhật user
    };
  }

  componentDidMount() {
    this.setState({
      validInput: this.state.validInputDefault,
      userData: this.state.dataDefault,
    });
    this.fetchCookigetUserAccount();
    //lấy địa chỉ phòng khám
  }

  fetchCookigetUserAccount = async () => {
    let res = await getUserAccount();
    if (res && +res.EC === 0 && res.DT.decode) {
      console.log("check res.DT", res.DT);

      // get UserbyID

      this.setState({
        userDataDecode: res.DT.decode,
      });
      let infoUser = await getUserById(res.DT.decode.id);
      if (infoUser && infoUser.EC === 0) {
        this.setState({
          userData: infoUser.DT,
        });
      }
      this.props.userloginSuccess(res.DT.token);
    } else {
      this.props.userlogOut();
      await logoutUser(); //nếu ko có thì tiết hành clear cookie cũ đi( nếu tồn tại)

      const { navigate } = this.props;
      const redirectPath = "/login";
      navigate(`${redirectPath}`);
    }

    let userData = this.state.userData;

    if (this.state.userData && this.state.userData.Clinic) {
      this.setState({
        addressClinic:
          this.state.addressClinic + userData["Clinic"]["addressVI"],
      });
      this.fetchWard(userData["Clinic"]["wardId"]);
      this.fetchDistrict(userData["Clinic"]["districtId"]);
      this.fetchProvince(userData["Clinic"]["provinceId"]);
    }
  };

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevState.file !== this.state.file) {
      if (this.state.file) {
        await this.uploadFile();
      }
    }
  }

  fetchProvince = async (code) => {
    fetch(`https://provinces.open-api.vn/api/p/${code}`, {
      method: "GET", // or 'PUT'
    })
      .then((response) => response.json())
      .then((actualData) => {
        this.setState({
          addressClinic: this.state.addressClinic + " - " + actualData.name,
        });
      })
      .catch((err) => {
        console.log(err.message);
      })
      .finally(() => {
        // setLoading(false);
      });
  };
  fetchDistrict = async (code) => {
    fetch(`https://provinces.open-api.vn/api/d/${code}`, {
      method: "GET", // or 'PUT'
    })
      .then((response) => response.json())
      .then((actualData) => {
        this.setState({
          addressClinic: this.state.addressClinic + " - " + actualData.name,
        });
      })
      .catch((err) => {
        console.log(err.message);
      })
      .finally(() => {
        // setLoading(false);
      });
  };

  fetchWard = async (code) => {
    fetch(`https://provinces.open-api.vn/api/w/${code}`, {
      method: "GET", // or 'PUT'
    })
      .then((response) => response.json())
      .then((actualData) => {
        this.setState({
          addressClinic: this.state.addressClinic + " " + actualData.name,
        });
      })
      .catch((err) => {
        console.log(err.message);
      })
      .finally(() => {
        // setLoading(false);
      });
  };
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

  checkValidateInput = () => {
    // if (action === "UPDATE") return true;//update thi ko validation
    //create user
    this.setState({ validInput: this.state.validInputDefault });
    let array = ["email", "phone", "username", "genderId"];
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

  handleOnchangeImage = (event) => {
    let data = event.target.files; //list các file
    let getFile = data[0];
    if (getFile) {
      this.setState({ file: getFile });
    }
  };
  handleOnchangeInput = (value, name) => {
    let _userData = _.cloneDeep(this.state.userData);
    _userData[name] = value;
    this.setState({ userData: _userData });
  };

  updateUser = async () => {
    let check = this.checkValidateInput();
    console.log(
      "check valinput >>>",
      check,
      "check userDataUpdate>>> ",
      this.state.userData
    );
    if (check) {
      let res = await updateInforUser(this.state.userData);
      if (res && +res.EC === 0) {
        toast.success(res.EM);
        this.setState({
          data: this.state.dataDefault,
        });
      } else {
        toast.error(res.EM);
      }
    }
  };
  handleModalUpdatePasswordClose = () => {
    this.setState({ isShowModalUpdatePassword: false });
  };

  changePasswordUser = () => {
    this.setState({ isShowModalUpdatePassword: true });
  };
  render() {
    let { per, url, userData } = this.state;
    console.log("check userData>>>", userData);
    return (
      <>
        <HomeHeader />
        <div className="container">
          <div className="main-body">
            {/* Breadcrumb */}
            <nav aria-label="breadcrumb" className="main-breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <a href="/home">Home</a>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  User Profile
                </li>
              </ol>
            </nav>
            {/* /Breadcrumb */}
            <div className="row gutters-sm">
              <div className="col-md-4 mb-3">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex flex-column align-items-center text-center">
                      <img
                        src={
                          userData && userData.image
                            ? userData.image
                            : "https://bootdey.com/img/Content/avatar/avatar7.png"
                        }
                        alt="Admin"
                        className="rounded-circle"
                        width={150}
                      />
                      <div className="mt-3">
                        <h4>{userData ? userData.username : "Chưa có tên"}</h4>
                        {/* ràng buộc partner */}

                        {/* <p className="text-secondary mb-1">{userData && userData.Specialty ? userData.SpecialtynameVI : ""}</p>
                                                <p className="text-muted font-size-sm">
                                                    {userData && userData.Clinic ? userData.Clinic.nameVI : ""}
                                                </p> */}
                        <div className="row d-flex justify-content-center">
                          <div>
                            <label
                              onChange={(event) => {
                                this.handleOnchangeImage(event);
                              }}
                              htmlFor="formId"
                            >
                              <input type="file" id="formId" hidden />
                              <ImUpload2 style={{ fontSize: "25px" }} />
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-8">
                <div className="card mb-3">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-sm-3">
                        <h6 className="mb-0">Họ tên</h6>
                      </div>
                      <div className="col-sm-9 text-secondary">
                        <input
                          className={
                            this.state.validInput.username
                              ? "form-control"
                              : "form-control is-invalid"
                          }
                          type="text"
                          value={this.state.userData.username}
                          onChange={(event) => {
                            this.handleOnchangeInput(
                              event.target.value,
                              "username"
                            );
                          }}
                        />
                      </div>
                    </div>
                    <hr />
                    <div className="row">
                      <div className="col-sm-3">
                        <h6 className="mb-0">Email</h6>
                      </div>
                      <div className="col-sm-9 text-secondary">
                        <input
                          className={
                            this.state.validInput.email
                              ? "form-control"
                              : "form-control is-invalid"
                          }
                          type="text"
                          value={this.state.userData.email}
                          onChange={(event) => {
                            this.handleOnchangeInput(
                              event.target.value,
                              "email"
                            );
                          }}
                        />
                      </div>
                    </div>
                    <hr />
                    <div className="row">
                      <div className="col-sm-3">
                        <h6 className="mb-0">Điện thoại</h6>
                      </div>
                      <div className="col-sm-9 text-secondary">
                        <input
                          className={
                            this.state.validInput.phone
                              ? "form-control"
                              : "form-control is-invalid"
                          }
                          type="text"
                          value={this.state.userData.phone}
                          onChange={(event) => {
                            this.handleOnchangeInput(
                              event.target.value,
                              "phone"
                            );
                          }}
                        />
                      </div>
                    </div>
                    <hr />
                    <div className="row">
                      <div className="col-sm-3">
                        <h6 className="mb-0">Giới tính</h6>
                      </div>
                      <div className="col-sm-9 text-secondary">
                        <select
                          className={
                            this.state.validInput.genderId
                              ? "form-select"
                              : "form-select is-invalid"
                          }
                          onChange={(event) =>
                            this.handleOnchangeInput(
                              event.target.value,
                              "genderId"
                            )
                          }
                          value={this.state.userData.genderId}
                        >
                          <option value="">Vui lòng chọn giới tính</option>
                          <option value="1">Nam</option>
                          <option value="2">Nữ</option>
                        </select>
                      </div>
                    </div>
                    <hr />
                    <div className="row">
                      <div className="col-sm-3">
                        <h6 className="mb-0">Địa chỉ cá nhân</h6>
                      </div>
                      <div className="col-sm-9 text-secondary">
                        <input
                          className="form-control"
                          type="text"
                          value={this.state.userData.address}
                          onChange={(event) => {
                            this.handleOnchangeInput(
                              event.target.value,
                              "address"
                            );
                          }}
                        />
                      </div>
                    </div>
                    <hr />
                    {/* tạo điều kiện nếu là bác sĩ thì mới có những thông tin bên dưới */}
                    {userData && userData["groupId"] === 5 ? (
                      <>
                        <div className="row">
                          <div className="col-sm-3">
                            <h6 className="mb-0">Địa chỉ phòng khám</h6>
                          </div>
                          <div className="col-sm-9 text-secondary">
                            <input
                              className="form-control"
                              type="text"
                              value={this.state.addressClinic}
                              readOnly
                            />
                          </div>
                        </div>
                        <hr />
                        <div className="row">
                          <div className="col-sm-3">
                            <h6 className="mb-0">Chuyên khoa</h6>
                          </div>
                          <div className="col-sm-9 text-secondary">
                            <input
                              className="form-control"
                              type="text"
                              value={
                                userData && userData["Clinic"]
                                  ? userData["Specialty"]["nameVI"]
                                  : ""
                              }
                              onChange={(event) => {
                                this.handleOnchangeInput(
                                  event.target.value,
                                  "descriptionHTLM_VI"
                                );
                              }}
                              readOnly
                            />
                          </div>
                        </div>
                        <hr />
                        <div className="row">
                          <div className="col-sm-3">
                            <h6 className="mb-0">Phòng khám</h6>
                          </div>
                          <div className="col-sm-9 text-secondary">
                            <input
                              className="form-control"
                              type="text"
                              value={
                                userData && userData["Clinic"]
                                  ? userData["Clinic"]["nameVI"]
                                  : ""
                              }
                              readOnly
                            />
                          </div>
                        </div>
                      </>
                    ) : (
                      ""
                    )}

                    <hr />
                    <div className="row d-flex justify-content-between">
                      <div className="col-sm-6">
                        <button
                          className="btn btn-primary"
                          onClick={() => {
                            this.updateUser();
                          }}
                        >
                          Cập nhật thông tin
                        </button>
                      </div>
                      <div className="col-sm-6  d-flex justify-content-end">
                        <button
                          className="btn btn-primary"
                          onClick={() => {
                            this.changePasswordUser();
                          }}
                        >
                          Thay đổi mật khẩu
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ModalChangePassWord
          show={this.state.isShowModalUpdatePassword}
          handleClose={this.handleModalUpdatePasswordClose}
          dataModal={this.state.userData}
        />
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    language: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    navigate: (path) => dispatch(push(path)),
    userlogOut: () => dispatch(actions.userlogOut()),
    changeLanguageAppRedux: (language) => {
      dispatch(actions.changeLanguageApp(language));
    },
    userloginSuccess: (userInfo) =>
      dispatch(actions.userloginSuccess(userInfo)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileUser);
