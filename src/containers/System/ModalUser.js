// import { Password } from "@mui/icons-material";
import React, { Component } from "react";
// import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import {
  fetchGroup,
  createNewUser,
  updateCurrentUser,
} from "../../services/userService";
import { Button, Modal } from "react-bootstrap";
import "./UserManage.scss";
import { toast } from "react-toastify";
import _ from "lodash";
import { CommonUtils } from "../../utils";
import { storage } from "../../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

class ModalUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //Huyên
      file: "", //để lấy file trong event
      url: "", //sau khi upload file lên firebase, firebase trả về url. Biến này để chứa url
      per: null, //tiến độ upload file lên firebase, per = 100 thì cho phép mở nút tạo/cập nhật user

      email: "",
      phone: "",
      username: "",
      password: "",
      address: "",
      genderId: "",
      groupId: "",
      userGroups: [],
      userData: {},
      validInput: {},
      defaultUserData: {
        email: "",
        phone: "",
        username: "",
        password: "",
        address: "",
        genderId: 1,
        groupId: "",
      },
      validInputDefault: {
        email: true,
        phone: true,
        username: true,
        password: true,
        address: true,
        genderId: true,
        groupId: true,
      },
    };
  }

  componentDidMount() {
    this.getGroups();
    this.setState({ validInput: this.state.validInputDefault });
  }

  async componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.action !== this.props.action ||
      prevProps.dataModalUpdate !== this.props.dataModalUpdate
    ) {
      //điều kiện update khi action thay đổi hoặc dữ liệu đổ vào modalupadate thay đổi
      if (this.props.action === "UPDATE") {
        //action cho update
        this.setState({
          userData: {
            ...this.props.dataModalUpdate,
            groupId:
              this.props.dataModalUpdate.Group &&
              this.props.dataModalUpdate.groupId
                ? this.props.dataModalUpdate.Group.id
                : "",
          },
        });
      } else {
        this.setUserDataDefault();
      }
    }

    //Huyên: nếu lấy dc file trong event (file trong state thay đổi)
    //thì gọi hàm uploadFile
    if (prevState.file !== this.state.file) {
      if (this.state.file) {
        await this.uploadFile();
      }
    }

    //Huyên: nếu upload thành công và lấy dc url trả về (url trong state thay đổi)
    //thì thêm trường image kèm giá trị url trong state đã lấy dc
    if (prevState.url !== this.state.url) {
      await this.setState({
        userData: { ...this.state.userData, image: this.state.url },
      });

      console.log(this.state.userData);
    }
  }

  //Huyên: hàm upload file lên firebase
  //dùng async await
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
            console.log("File available at", downloadURL);
            await this.setState({ url: downloadURL });
          }
        );
      }
    );
  };

  setUserDataDefault = () => {
    this.setState({
      userData: {
        ...this.state.defaultUserData,
        groupId:
          this.state.userGroups && this.state.userGroups.length > 0
            ? this.state.userGroups[0].id
            : "",
        genderId: 1,
        //gán lại giá trị khi đã update thành công
      },
    });
  };

  handleOnchangeInput = (value, name) => {
    let _userData = _.cloneDeep(this.state.userData);
    _userData[name] = value;
    this.setState({ userData: _userData });
  };

  getGroups = async () => {
    let res = await fetchGroup();
    if (res && +res.EC === 0) {
      this.setState({ userGroups: res.DT });
      let groupId = res.DT;
      if (groupId.length > 0) {
        this.setState({
          userData: { ...this.state.userData, groupId: groupId[0].id },
        }); //gán groupid cho create user
      }
    } else {
      toast.error(res.EM);
    }
  };
  checkValidateInput = () => {
    // if (action === "UPDATE") return true;//update thi ko validation
    //create user
    this.setState({ validInput: this.state.validInputDefault });
    let array = ["email", "phone", "username", "password", "groupId"];
    let check = true;
    for (let i = 0; i < array.length; i++) {
      if (!this.state.userData[array[i]]) {
        if (array[i] === "password" && this.props.action === "UPDATE") continue;
        //set lai gia tri input bang false khi gia tri trong
        let _validInput = _.cloneDeep(this.state.validInputDefault);
        _validInput[array[i]] = false;
        this.setState({ validInput: _validInput });
        check = false;
        break;
      }
    }
    return check;
  };

  handleConfirmUser = async () => {
    let check = this.checkValidateInput();
    // console.log("check validate input>>> ", check)
    // check điều kiện đúng ( không rỗng)
    if (check === true) {
      if (!this.state.userData["genderId"])
        this.setState({ userData: { ...this.state.userData, genderId: 1 } });
      let res =
        this.props.action === "CREATE"
          ? await createNewUser(this.state.userData)
          : await updateCurrentUser(this.state.userData);
      if (+res.EC === 0) {
        toast.success(res.EM);

        this.props.fetchUser();
        //set userData về giá trị mặc định
        this.setUserDataDefault();

        this.props.handleModalUserClose();

        //set lại giá trị group
      } else if (+res.EC !== 0) {
        let _validInput = _.cloneDeep(this.state.validInputDefault);
        _validInput[res.DT] = false;
        this.setState({
          validInput: _validInput,
        });
        toast.error(res.EM);
      }
    }
  };

  //Huyên: hàm chuyển file ảnh sang chuỗi base64
  // handleOnchangImage = async (event) => {
  //   let data = event.target.files; //list các file
  //   let file = data[0];
  //   if (file) {
  //     let base64 = await CommonUtils.getBase64(file);

  //     this.setState({
  //       userData: { ...this.state.userData, image: base64 },
  //     });
  //     console.log(this.state);
  //   }
  //   console.log(this.state.userData);
  // };

  //Huyên: lấy file từ event và setState cho file
  //nếu ko có async await thì hàm setState nó lấy giá trị khởi tạo/trước đó để setState
  //thay vì lấy giá trị trong event để setState
  //Nếu ko setState cho file thì hàm componentDidUpdate ở trên ko chạy dc
  handleOnchangImage = async (event) => {
    let data = event.target.files; //list các file
    let getFile = data[0];
    if (getFile) {
      await this.setState({ file: getFile });
    }
  };

  render() {
    let { action } = this.props;
    return (
      <Modal
        size="lg"
        show={this.props.show}
        onHide={this.props.handleModalUserClose}
        className="modal-user"
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            <span>
              {" "}
              {action === "CREATE" ? "Create new user" : "Edit a user"}{" "}
            </span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="content-body row">
            <div className="col-12 col-sm-6 form-groupId">
              <label>
                Email Address(<span className="red">*</span>) :
              </label>

              <input
                className={
                  this.state.validInput.email
                    ? "form-control"
                    : "form-control is-invalid"
                }
                type="email"
                readOnly={action === "UPDATE" ? true : false}
                value={this.state.userData.email}
                onChange={(event) =>
                  this.handleOnchangeInput(event.target.value, "email")
                }
              />
            </div>
            <div className="col-12 col-sm-6 form-groupId">
              <label>
                Phone Number(<span className="red">*</span>) :
              </label>
              <input
                className={
                  this.state.validInput.phone
                    ? "form-control"
                    : "form-control is-invalid"
                }
                type="text"
                value={this.state.userData.phone}
                onChange={(event) =>
                  this.handleOnchangeInput(event.target.value, "phone")
                }
              />
            </div>
            <div className="col-12 col-sm-6 form-groupId">
              <label>
                User Name (<span className="red">*</span>) :
              </label>
              <input
                className={
                  this.state.validInput.username
                    ? "form-control"
                    : "form-control is-invalid"
                }
                type="text"
                value={this.state.userData.username}
                onChange={(event) =>
                  this.handleOnchangeInput(event.target.value, "username")
                }
              />
            </div>
            <div className="col-12 col-sm-6 form-groupId">
              {action === "CREATE" && (
                <>
                  <label>
                    Password (<span className="red">*</span>) :
                  </label>
                  <input
                    className={
                      this.state.validInput.password
                        ? "form-control"
                        : "form-control is-invalid"
                    }
                    type="password"
                    value={this.state.userData.password}
                    onChange={(event) =>
                      this.handleOnchangeInput(event.target.value, "password")
                    }
                  />
                </>
              )}
            </div>
            <div className="col-12 form-groupId">
              <label>
                Address (<span className="red">*</span>) :
              </label>
              <input
                className={
                  this.state.validInput.address
                    ? "form-control"
                    : "form-control is-invalid"
                }
                type="text"
                value={this.state.userData.address}
                onChange={(event) =>
                  this.handleOnchangeInput(event.target.value, "address")
                }
              />
            </div>
            <div className="col-12 col-sm-6 form-groupId">
              <label>
                Gender (<span className="red">*</span>) :
              </label>
              <select
                className="form-select"
                onChange={(event) =>
                  this.handleOnchangeInput(event.target.value, "genderId")
                }
                value={this.state.userData.genderId}
              >
                <option value="1">Male</option>
                <option value="2">Female</option>
                <option value="3">Other</option>
              </select>
            </div>

            <div className="col-12 col-sm-6 form-groupId">
              <label>
                Group (<span className="red">*</span>) :
              </label>

              <select
                className="form-select"
                onChange={(event) =>
                  this.handleOnchangeInput(event.target.value, "groupId")
                }
                value={this.state.userData.groupId}
              >
                {this.state.userGroups.length > 0 &&
                  this.state.userGroups.map((item, index) => {
                    return (
                      <option key={`groupId-${index}`} value={item.id}>
                        {" "}
                        {item.name}
                      </option>
                    );
                  })}
              </select>
            </div>

            {/*  */}
            <div className="col-4 form-groupId">
              <label>Ảnh đại diện</label>
              <input
                className="form-control-file"
                type="file"
                onChange={(event) => {
                  this.handleOnchangImage(event);
                }}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.props.handleModalUserClose}>
            Close
          </Button>
          <Button
            className="btn-confirm"
            variant="primary"
            onClick={() => this.handleConfirmUser()}
            //Huyên: trong thời gian upload ko cho phép nhấn nút này, đủ per = 100 thì cho phép
            disabled={this.state.per !== null && this.state.per < 100}
          >
            {action === "CREATE" ? "Create" : "Update"}
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalUser);
