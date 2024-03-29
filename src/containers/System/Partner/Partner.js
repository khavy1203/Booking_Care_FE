import React, { Component } from "react";
import { connect } from "react-redux";
import "./Partner.scss";
import ReactPaginate from "react-paginate";
import _ from "lodash";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import {
  createUserDoctorsofClinic,
  getStatusOfClinic,
  fetchAllSpecialtysOfPartner,
  getDoctorsOfClinic,
} from "../../../services/partnerService";
import {
  getUserAccount,
  logoutUser,
  getUserById,
} from "../../../services/userService";

import { push } from "connected-react-router";
import * as actions from "../../../store/actions";
import ModalDeleteDoctorOfPartner from "./ModalDeleteDoctorOfParner";
import ModalUpdateDoctorOfPartner from "./ModalUpdateDoctorOfPartner";
import ModalUpdateInforClinic from "./ModalUpdateInforClinic";
import { ContactlessOutlined } from "@mui/icons-material";
class Partner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: "",
      tableFillter: {},
      //phần thêm user
      userDataCreate: {},
      dataChildDefaultCreate: {
        doctorEmail: "",
        description: "",
        idSpecialty: "",
        isValidEmail: true,
        isValidIdSpecial: true,
      },
      listChilds: {},
      lstSpecialties: {},
      //quản lý bác sĩ
      lstDoctorOfClinic: [],

      dataModalDelete: {},
      dataModalUpdate: {},
      isShowModalDelete: false,
      isShowModalUpdate: false,

      isShowModalUpdateClinic: false,
    };
  }
  componentDidMount() {
    this.fetchCookigetUserAccount();
    this.fetchSpecialty();
    this.setState({
      listChilds: {
        child1: this.state.dataChildDefaultCreate,
      },
    });
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.userDataCreate !== this.state.userDataCreate) {
      this.fetchDoctorOfClinic(this.state.userDataCreate.Clinic.id);
    }
    if (prevState.lstDoctorOfClinic !== this.state.lstDoctorOfClinic) {
      this.setState({ tableFillter: this.state.lstDoctorOfClinic });
    }
  }

  fetchDoctorOfClinic = async (clinnId) => {
    console.log("check user data >>.", this.state.userDataCreate);
    console.log(
      "check user data id clinic >>.",
      this.state.userDataCreate.Clinic.id
    );

    let res = await getDoctorsOfClinic(clinnId);
    if (res && +res.EC === 0) {
      this.setState({
        lstDoctorOfClinic: res.DT,
      });
    }
  };
  fetchCookigetUserAccount = async () => {
    let res = await getUserAccount();
    if (res && +res.EC === 0 && res.DT.decode) {
      console.log("check res.DT", res.DT.decode.email);

      let infoUser = await getUserById(res.DT.decode.id);
      if (infoUser && infoUser.EC === 0) {
        this.setState({
          userDataCreate: infoUser.DT,
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
  };

  fetchSpecialty = async () => {
    let res = await fetchAllSpecialtysOfPartner();
    console.log("check res", res);
    if (res && +res.EC === 0) {
      this.setState({
        lstSpecialties: res.DT,
      });
    }
  };
  fillerData = (e) => {
    if (e.target.value != "") {
      let isActive = 0;
      let check = false;
      let arrayFillter = [];

      if ("đang hoạt động".includes(e.target.value.toLowerCase())) isActive = 1;
      if ("tạm dừng".includes(e.target.value.toLowerCase())) isActive = 2;

      this.setState({ searchValue: e.target.value });
      if (this.state.lstDoctorOfClinic) {
        Object.entries(this.state.lstDoctorOfClinic).map(
          ([key1, child1], index) => {
            Object.entries(child1).map(([key2, child2], index) => {
              console.log("check key 2???", key2);
              if (key2 === "Users.Doctorinfo.active" && isActive !== 0) {
                //kiểm tra có active không, tại hiển thị là chuỗi mà truy vấn là integer
                if (child2 === isActive) {
                  arrayFillter.push(child1);
                }
                console.log(
                  "check isactive??? và arrayFillter",
                  isActive,
                  arrayFillter
                );

                return;
              }

              if (
                String(child2)
                  .toLowerCase()
                  .includes(e.target.value.toLowerCase())
              ) {
                console.log("child2 .", child2);
                check = true;
              } else {
                check = false;
              }
              if (check) {
                arrayFillter[key1] = child1;
              }
            });
          }
        );
        console.log("check arrayFillter", arrayFillter);

        this.setState({ tableFillter: arrayFillter });
      }
    } else {
      if (this.state.lstDoctorOfClinic) {
        this.setState({
          tableFillter: this.state.lstDoctorOfClinic,
          searchValue: e.target.value,
        });
      }
    }
  };
  handleOnchangeInput = (name, value, key) => {
    let _listChilds = _.cloneDeep(this.state.listChilds);
    _listChilds[key][name] = value;
    if (value && name === "doctorEmail") {
      _listChilds[key]["isValidEmail"] = true;
    } else if (value && name === "idSpecialty") {
      _listChilds[key]["isValidIdSpecial"] = true;
    }
    this.setState({ listChilds: _listChilds });
  };
  handleAddNewInput = () => {
    let _listChilds = _.cloneDeep(this.state.listChilds);
    console.log("check _listChilds", _listChilds);
    _listChilds[`child-${uuidv4()}`] = this.state.dataChildDefaultCreate;
    this.setState({ listChilds: _listChilds });
  };
  handleDeleteInput = (key) => {
    let _listChilds = _.cloneDeep(this.state.listChilds);
    delete _listChilds[key];
    this.setState({ listChilds: _listChilds });
  };
  buildDataToPersist = () => {
    console.log(
      "check userDataCreate clinic",
      this.state.userDataCreate.Clinic.id
    );
    let _listChilds = _.cloneDeep(this.state.listChilds);
    let result = [];
    Object.entries(_listChilds).map(([key, child], index) => {
      result.push({
        doctorEmail: child.doctorEmail,
        description: child.description,
        idSpecialty: child.idSpecialty,
        clinicId: this.state.userDataCreate
          ? this.state.userDataCreate.Clinic.id
          : "",
      });
    });
    return result;
  };
  fetchActiveClinic = async (id) => {
    let res = await getStatusOfClinic(id);
    if (res && res.EC === 0) {
      return res.DT;
    }
  };
  checkActiveClinic = async (userDataCreate) => {
    let check;
    if (userDataCreate && userDataCreate.Clinic) {
      let status = await this.fetchActiveClinic(userDataCreate.Clinic.id);
      console.log("check status in active clinic", status);
      if (status === 0) {
        toast.warn("Phòng khám bạn chưa dược kích hoạt");
        check = false;
      }
      if (+status === 2) {
        toast.warn("Phòng khám bạn đã tạm dừng hoạt động");
        check = false;
      }
      if (+status === 1) {
        check = true;
      }
    }
    return check;
  };
  handleModalClinicUpdateOpen = () => {
    this.setState({
      isShowModalUpdateClinic: true,
    });
  };
  handleModalClinicUpdateClose = () => {
    this.setState({
      isShowModalUpdateClinic: false,
    });
  };
  handleSave = async () => {
    let check = await this.checkActiveClinic(this.state.userDataCreate);
    console.log("check check ", check);
    if (check === true) {
      let invalidObj = Object.entries(this.state.listChilds).find(
        ([key, child], index) => {
          if (child && !child.doctorEmail) {
            toast.error("input Email doctor must not be empty...");
            let _listChilds = _.cloneDeep(this.state.listChilds);
            _listChilds[key]["isValidEmail"] = false;
            this.setState({ listChilds: _listChilds });
            return true;
          } else if (child && !child.idSpecialty) {
            toast.error("input Specialty doctor must not be empty...");
            let _listChilds = _.cloneDeep(this.state.listChilds);
            _listChilds[key]["isValidIdSpecial"] = false;
            this.setState({ listChilds: _listChilds });
            return true;
          }

          //tồn tại child và không tồn tại child.url, trả về object nếu điều kiện đúng
        }
      );
      if (!invalidObj) {
        //call api
        let data = this.buildDataToPersist();
        console.log("check data ", data);
        let res = await createUserDoctorsofClinic(data);
        if (res && res.EC === 0) {
          toast.success(res.EM); //hiện thông báo thêm role thành công
          this.fetchDoctorOfClinic(this.state.userDataCreate.Clinic.id);
        } else if (res && res.EC === 1) {
          let strEmail = res.DT.join(", ");
          toast.error(`${res.EM} : ${strEmail}`);
        }
      }
    }
  };
  handleDeleteDoctor = (item) => {
    this.setState({ isShowModalDelete: true, dataModalDelete: item });
  };
  handleModalUpdateDoctor = (item) => {
    this.setState({ isShowModalUpdate: true, dataModalUpdate: item });
  };
  handleModalDeleteDoctorOfClinicClose = () => {
    this.setState({ dataModalDelete: {} });
    this.setState({ isShowModalDelete: false });
    this.fetchDoctorOfClinic(this.state.userDataCreate.Clinic.id);
  };
  handleModalUpdateDoctorOfClinicClose = () => {
    this.setState({ dataModalUpdate: {} });
    this.setState({ isShowModalUpdate: false });
    this.fetchDoctorOfClinic(this.state.userDataCreate.Clinic.id);
  };
  render() {
    console.log("check lst user", this.state.lstDoctorOfClinic);
    console.log("check fillertable>> ", this.state.tableFillter);

    return (
      <div className="role-container">
        <div className="container">
          <div className="adding-roles mt-3">
            <div className="title-role">
              <h4>Thêm mới bác sĩ...</h4>
            </div>
            <div className="role-parent">
              {Object.entries(this.state.listChilds).map(
                ([key, child], index) => {
                  return (
                    <div className="row role-child" key={`child-${key}`}>
                      <div className={`col-5 form-group ${key}`}>
                        <lable>Email: </lable>
                        <input
                          type="text"
                          className={
                            child.isValidEmail
                              ? "form-control"
                              : "form-control is-invalid"
                          }
                          value={child.doctorEmail}
                          onChange={(event) =>
                            this.handleOnchangeInput(
                              "doctorEmail",
                              event.target.value,
                              key
                            )
                          }
                        />
                      </div>
                      <div className="col-5 form-group">
                        <lable>Description: </lable>
                        <input
                          type="text"
                          className="form-control"
                          value={child.description}
                          onChange={(event) =>
                            this.handleOnchangeInput(
                              "description",
                              event.target.value,
                              key
                            )
                          }
                        />
                      </div>
                      <div className="col-1 mt-4 actions">
                        <i
                          className="fa fa-plus-circle add"
                          onClick={() => this.handleAddNewInput()}
                        ></i>
                        {index >= 1 && (
                          <i
                            className="fa fa-trash-o delete"
                            onClick={() => this.handleDeleteInput(key)}
                          ></i>
                        )}
                      </div>
                      <div className="form-group col-4 ">
                        <label htmlFor="exampleFormControlSelect3">
                          Danh sách phòng khám
                        </label>
                        <select
                          className={
                            child.isValidIdSpecial
                              ? "form-control"
                              : "form-control is-invalid"
                          }
                          id="exampleFormControlSelect3"
                          onChange={(event) =>
                            this.handleOnchangeInput(
                              "idSpecialty",
                              event.target.value,
                              key
                            )
                          }
                          value={child.idSpecialty}
                        >
                          <option value="">
                            Vui lòng chọn chuyên khoa của bác sĩ
                          </option>
                          {this.state.lstSpecialties.length > 0 &&
                            this.state.lstSpecialties.map((item, index) => {
                              return (
                                <option
                                  key={`special-${index}`}
                                  value={item.id}
                                >
                                  {item.nameVI}
                                </option>
                              );
                            })}
                        </select>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>
          <div className="col-12 d-flex justify-content-between">
            <div>
              <button
                className="btn btn-success mt-3"
                onClick={() => this.handleSave()}
              >
                {" "}
                Save{" "}
              </button>
            </div>
            <div>
              <button
                className="btn btn-warning mt-3"
                onClick={() => this.handleModalClinicUpdateOpen()}
              >
                {" "}
                Thêm thông tin hiển thị phòng khám{" "}
              </button>
            </div>
          </div>

          <hr />
          <div className="col-12 row">
            <div className="mt-3 table-role col-6">
              <h4>Danh sách bác sĩ trong phòng khám của bạn: </h4>
            </div>
            <div className="mt-3 table-role col-6">
              <input
                type="text"
                className="form-control"
                placeholder="Search"
                value={this.state.searchValue}
                onChange={(event) => this.fillerData(event)}
              />
            </div>
          </div>

          <div className="manage-Specialtyy-container">
            <div className="Specialty-body">
              <table className="table table-bordered table-hover">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Email</th>
                    <th>Tên bác sĩ</th>
                    <th>Chuyên khoa</th>
                    <th>Tình trạng</th>
                  </tr>
                </thead>
                <tbody>
                  {/* thay this.state.lstDoctorOfClinic thành danh sách lọc thành table fillter */}
                  {this.state.tableFillter &&
                    this.state.tableFillter.length > 0 ? (
                    <>
                      {Object.entries(this.state.tableFillter).map(
                        ([key, child], index) => {
                          if (+child["Users.groupId"] === 2)
                            return (
                              <tr key={child["Users.id"]}>
                                <td>{index}</td>
                                <td>{child["Users.email"]}</td>
                                <td>{child["Users.username"]}</td>
                                <td>{child["Users.Specialty.nameVI"]}</td>
                                <td>
                                  {child["Users.Doctorinfo.active"] === 1
                                    ? "Đang hoạt động"
                                    : "Tạm dừng"}
                                </td>

                                <td>
                                  <button
                                    className="btn btn-warning m-2"
                                    onClick={() =>
                                      this.handleModalUpdateDoctor(child)
                                    }
                                  >
                                    <i
                                      className="fa fa-pencil"
                                      aria-hidden="true"
                                    ></i>
                                  </button>
                                  <button
                                    className="btn btn-danger"
                                    onClick={() =>
                                      this.handleDeleteDoctor(child)
                                    }
                                  >
                                    <i className="fa fa-trash"></i>
                                  </button>
                                </td>
                              </tr>
                            );
                        }
                      )}
                    </>
                  ) : (
                    <>
                      <tr>
                        <td>Không có Specialtys nào</td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
              <div className="footer">
                <ModalDeleteDoctorOfPartner
                  show={this.state.isShowModalDelete}
                  handleClose={this.handleModalDeleteDoctorOfClinicClose}
                  dataModal={this.state.dataModalDelete}
                />
                <ModalUpdateDoctorOfPartner
                  show={this.state.isShowModalUpdate}
                  handleClose={this.handleModalUpdateDoctorOfClinicClose}
                  dataModal={this.state.dataModalUpdate}
                  lstSpecial={this.state.lstSpecialties}
                />
                <ModalUpdateInforClinic
                  show={this.state.isShowModalUpdateClinic}
                  handleClose={this.handleModalClinicUpdateClose}
                  dataModal={this.state.userDataCreate}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Partner);
