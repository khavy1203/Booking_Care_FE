// import { Password } from "@mui/icons-material";
import React, { Component } from "react";
// import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import {
  fetchGroup, createNewUser, updateCurrentUser
} from "../../services/userService";
import { Button, Modal } from 'react-bootstrap';
import './UserManage.scss'
import { toast } from 'react-toastify';
import _ from 'lodash';

class ModalUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      phone: '',
      username: '',
      password: '',
      address: '',
      genderId: '',
      groupId: '',
      userGroups: [],
      userData: {},
      validInput: {},
      defaultUserData: {
        email: '',
        phone: '',
        username: '',
        password: '',
        address: '',
        genderId: '',
        groupId: ''
      },
      validInputDefault: {
        email: true,
        phone: true,
        username: true,
        password: true,
        address: true,
        genderId: true,
        groupId: true
      }
    };
  }

  componentDidMount() {
    this.getGroups();
    this.setState({ validInput: this.state.validInputDefault });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.dataModalUpdate !== this.props.dataModalUpdate) {
      if (this.props.action === "UPDATE") {
        this.setState({
          userData: {
            ...this.props.dataModalUpdate,
            groupId: this.props.dataModalUpdate.Group && this.props.dataModalUpdate.groupId ? this.props.dataModalUpdate.Group.id : ""
          }
        });

      }
    }
  }
  handleOnchangeInput = (value, name) => {
    let _userData = _.cloneDeep(this.state.userData);
    _userData[name] = value;
    this.setState({ userData: _userData });
  }
  getGroups = async () => {
    let res = await fetchGroup();
    if (res && +res.EC === 0) {

      this.setState({ userGroups: res.DT });
      let groupId = res.DT;
      if (groupId.length > 0) {
        this.setState({ userData: { ...this.state.userData, groupId: groupId[0].id } })//gán groupid cho create user
      }
    }
    else {
      toast.error(res.EM);
    }
  }
  checkValidateInput = () => {
    // if (action === "UPDATE") return true;//update thi ko validation
    //create user
    this.setState({ validInput: this.state.validInputDefault });
    let array = ['email', 'phone', 'username', 'password', 'groupId'];
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
  }
  handleConfirmUser = async () => {
    let check = this.checkValidateInput();
    // console.log("check validate input>>> ", check)
    // check điều kiện đúng ( không rỗng)
    if (check === true) {
      if (!this.state.userData['genderId']) this.setState({ userData: { ...this.state.userData, genderId: 1 } });
      let res = this.props.action === "CREATE" ?
        await createNewUser(this.state.userData) : await updateCurrentUser(this.state.userData);
      if (+res.EC === 0) {
        toast.success(res.EM);

        this.props.fetchUser();
        this.setState({
          userData: {
            ...this.state.defaultUserData,
            groupId: this.state.userGroups && this.state.userGroups.length > 0 ? this.state.userGroups[0].id : '',
            genderId: 1
            //gán lại giá trị khi đã update thành công
          }

        });

        this.props.handleModalUserClose();

        //set lại giá trị group

      } else if (+res.EC !== 0) {
        let _validInput = _.cloneDeep(this.state.validInputDefault);
        _validInput[res.DT] = false;
        this.setState({
          validInput: _validInput
        });
        toast.error(res.EM);
      }
    }
  }
  render() {
    let { action } = this.props;
    console.log()
    return (
      <Modal size="lg" show={this.props.show} onHide={this.props.handleModalUserClose} className="modal-user">
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            <span> {action === "CREATE" ? "Create new user" : "Edit a user"} </span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="content-body row">
            <div className="col-12 col-sm-6 form-groupId">
              <label>Email Address(<span className="red">*</span>) :</label>

              <input className={this.state.validInput.email ? "form-control" : "form-control is-invalid"} type="email"
                readOnly={action === "UPDATE" ? true : false}
                value={this.state.userData.email}
                onChange={(event) => this.handleOnchangeInput(event.target.value, "email")}
              />


            </div>
            <div className="col-12 col-sm-6 form-groupId">
              <label>Phone Number(<span className="red">*</span>) :</label>
              <input className={this.state.validInput.phone ? "form-control" : "form-control is-invalid"}
                readOnly={action === "UPDATE" ? true : false}
                type="text"
                value={this.state.userData.phone}
                onChange={(event) => this.handleOnchangeInput(event.target.value, "phone")}
              />
            </div>
            <div className="col-12 col-sm-6 form-groupId">
              <label>User Name (<span className="red">*</span>) :</label>
              <input className={this.state.validInput.username ? "form-control" : "form-control is-invalid"}
                type="text"
                value={this.state.userData.username}
                onChange={(event) => this.handleOnchangeInput(event.target.value, "username")}
              />
            </div>
            <div className="col-12 col-sm-6 form-groupId">
              {
                action === "CREATE" &&
                <>
                  <label>
                    Password (<span className="red">*</span>) :
                  </label>
                  <input
                    className={this.state.validInput.password ? "form-control" : "form-control is-invalid"}
                    type="password"
                    value={this.state.userData.password}
                    onChange={(event) => this.handleOnchangeInput(event.target.value, "password")}
                  />
                </>
              }

            </div>
            <div className="col-12 form-groupId">
              <label>Address (<span className="red">*</span>) :</label>
              <input className={this.state.validInput.address ? "form-control" : "form-control is-invalid"} type="text" value={this.state.userData.address} onChange={(event) => this.handleOnchangeInput(event.target.value, "address")} />
            </div>
            <div className="col-12 col-sm-6 form-groupId">
              <label>Gender (<span className="red">*</span>) :</label>
              <select className="form-select"
                onChange={(event) => this.handleOnchangeInput(event.target.value, "genderId")}
                value={this.state.userData.genderId}
              >
                <option selected value="1">Male</option>
                <option value="2">Female</option>
                <option value="3">Other</option>
              </select>
            </div>

            <div className="col-12 col-sm-6 form-groupId">
              <label>Group (<span className="red">*</span>) :</label>

              <select className="form-select"
                onChange={(event) => this.handleOnchangeInput(event.target.value, "groupId")}
                value={this.state.userData.groupId}
              >
                {this.state.userGroups.length > 0 &&
                  this.state.userGroups.map((item, index) => {
                    return (
                      <option key={`groupId-${index}`} value={item.id}> {item.name}</option>
                    )

                  })
                }

              </select>
            </div>

          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.props.handleModalUserClose}>
            Close
          </Button>
          <Button variant="primary"
            onClick={() => this.handleConfirmUser()
            }>{action === "CREATE" ? "Create" : "Update"}</Button>
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
