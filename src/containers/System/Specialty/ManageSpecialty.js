//video 90
import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import "./ManageSpecialty.scss";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import { CommonUtils } from "../../../utils";
import "../UserManage.scss";

import { fetchAllClinics, deleteClinic, createNewClinic, updateCurrentClinic } from "../../../services/clinicService";
import { fetchProvinces } from "../../../services/provinceService";

import ReactPaginate from "react-paginate";
import ModalDeleteSpecialty from "./ModalDeleteSpecialty";
import _ from 'lodash';
import { toast } from "react-toastify";

const mdParser = new MarkdownIt(/* Markdown-it options */);

class ManageClinic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // name: "",
      // address: "",
      preview: "",//url img
      selectedFile: "",//selected file

      descriptionMarkdown_VI: "",
      descriptionHTML_VI: "",
      descriptionMarkdown_EN: "",
      descriptionHTML_EN: "",
      proviceId: "",

      listClinics: [],
      listProvinces: [],

      currentPage: 1,
      currentLimit: 7,
      totalPage: 0,
      preview: undefined,//url img
      selectedFile: undefined,//selected file

      clinicData: {},


      isShowModalDelete: false,
      dataModalDelete: {},

      validInput: {},
      validInputDefault: {
        nameVI: true,
        addressVI: true,
        nameEN: true,
        addressEN: true,
        provinceId: true
      },

      clinicDataUpdate: {},
      showUpdateActive: false,
    };
  }

  componentDidMount() {
    this.fetchClinics();//mục đích lấy cookie set lại cho localStorage
    this.getProvinces();// lấy Provinces
    this.setState({ validInput: this.state.validInputDefault });// set giá trị input
  }

  componentDidUpdate(prevProps, prevState) {

    if (prevState.selectedFile !== this.state.selectedFile) {//thay đổi state file
      if (!this.state.selectedFile) {
        this.setState({ preview: undefined });
        return
      }
      const objectUrl = URL.createObjectURL(this.state.selectedFile)
      this.setState({ preview: objectUrl });
      console.log("check objectUrl: ", objectUrl)
      // free memory when ever this component is unmounted
      return () => {
        URL.revokeObjectURL(objectUrl);
      }
    }
  }



  setClinicDataDefault = () => {
    this.setState({
      clinicData: {
        nameVI: "",
        nameEN: "",
        addressVI: "",
        addressEN: "",
        provinceId: ""
      },
      descriptionMarkdown_VI: "",
      descriptionHTML_VI: "",
      descriptionMarkdown_EN: "",
      descriptionHTML_EN: "",
      preview: undefined,//url img
      selectedFile: undefined,//selected file
      showUpdateActive: false
    });
  }
  setClinicDataItem = (item) => {
    let imageBase64 = "";
    if (item.image) {
      imageBase64 = new Buffer(item.image, "base64").toString(
        "binary"
      );
    }
    this.setState({
      clinicData: {
        id: item.id,
        nameVI: item.nameVI,
        nameEN: item.nameEN,
        addressVI: item.addressVI,
        addressEN: item.addressEN,
        provinceId: item.provinceId
      },
      descriptionMarkdown_VI: item.descriptionMarkdown_VI,
      descriptionHTML_VI: item.descriptionHTML_VI,
      descriptionMarkdown_EN: item.descriptionMarkdown_EN,
      descriptionHTML_EN: item.descriptionHTML_EN,
      preview: imageBase64,//url img
      selectedFile: undefined,//selected file
      showUpdateActive: true
    });

  }

  getProvinces = async () => {
    let res = await fetchProvinces();
    if (res && +res.EC === 0) {
      this.setState({ listProvinces: res.DT });
    } else {
      toast.error(res.EM);
    }
  }

  fetchClinics = async () => {
    let response = await fetchAllClinics(
      this.state.currentPage,
      this.state.currentLimit
    );

    if (response && +response.EC === 0) {
      this.setState({ totalPage: response.DT.totalPages });
      this.setState({ listClinics: response.DT.clinics });
    }
  };


  handlePageClick = async (event) => {
    this.setState({ currentPage: event.selected + 1 }); // lỗi bất đồng bộ, cách fix thêm chỉ số vào fetchUser
    await this.fetchClinics();
  };


  handleEditorChangeVI = ({ html, text }) => {
    this.setState({
      descriptionMarkdown_VI: text,
      descriptionHTML_VI: html,
    });
  };

  handleEditorChangeEN = ({ html, text }) => {
    this.setState({
      descriptionMarkdown_EN: text,
      descriptionHTML_EN: html,
    });
  };



  handleOnchangImage = async (event) => {
    if (!event.target.files || event.target.files.length === 0) {
      this.setState({ selectedFile: undefined });
      return
    }
    else {
      let data = event.target.files; //list các file
      let file = data[0];

      if (file) {// cần setting file nhập vào dữ liệu là 1 file ảnh
        let base64 = await CommonUtils.getBase64(file);
        this.setState({
          clinicData: { ...this.state.clinicData, image: base64 },
          selectedFile: file
        });
        console.log(this.state);
      }
    }
  };



  handleDeleteClinic = (item) => {
    this.setState({ dataModalDelete: item });
    this.setState({ isShowModalDelete: true });
  }

  handleModalClinicClose = () => {
    this.setState({ dataModalDelete: {} });
    this.setState({ isShowModalDelete: false });
  }


  confirmDeleteClinic = async () => {
    let response = await deleteClinic(this.state.dataModalDelete); //ban đầu là xóa user nhưng thuận tiện truyền dữ liệu thì sài cách này đồng thời dataModal cũng là 1 user luôn
    if (response && +response.EC === 0) {
      await this.fetchClinics();
      this.setState({ isShowModalDelete: false });
    } else {
      toast.error(response.EM);
    }
  }

  handleOnchangeInput = (value, name) => {
    let _clinicData = _.cloneDeep(this.state.clinicData);
    _clinicData[name] = value;
    this.setState({ clinicData: _clinicData });
  };

  checkValidateInput = () => {

    this.setState({ validInput: this.state.validInputDefault });
    let array = ["nameVI", "addressVI", "nameEN", "addressEN", "provinceId"];
    let check = true;
    for (let i = 0; i < array.length; i++) {
      if (!this.state.clinicData[array[i]]) {
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


  handleCreateAndUpdateClinic = async () => {
    let check = this.checkValidateInput();

    if (check) {

      this.state.clinicData['descriptionMarkdown_VI'] = this.state.descriptionMarkdown_VI;
      this.state.clinicData['descriptionHTML_VI'] = this.state.descriptionHTML_VI;
      this.state.clinicData['descriptionMarkdown_EN'] = this.state.descriptionMarkdown_EN;
      this.state.clinicData['descriptionHTML_EN'] = this.state.descriptionHTML_EN;
      console.log("check clinic", this.state.clinicData)

      let res = this.state.showUpdateActive ?
        await updateCurrentClinic(this.state.clinicData)
        :
        await createNewClinic(this.state.clinicData);
      if (res && +res.EC === 0) {
        toast.success(res.EM);

        this.fetchClinics();

        this.setClinicDataDefault();

      } else {
        toast.error(res.EM);
      }
      console.log("check province in data", this.state.clinicData)
    }

  };

  handleResetToFormCreate = () => {
    this.setClinicDataDefault();

  }
  handUpdateClinic = (item) => {
    this.setClinicDataItem(item);
  }
  render() {
    return (
      <>
        <div className="manage-specialty-container">
          <div className="ms-title">Quản lý phòng khám</div>
          <div className="add-new-specialty row">
            <div className="col-12 row">
              <div className="col-6 form-group">
                <label>Tên phòng khám (VI) </label>
                <input
                  className={this.state.validInput.nameVI
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
                  className={this.state.validInput.nameEN
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
                <label>Địa chỉ phòng khám</label>
                <input
                  className={this.state.validInput.addressVI
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
                <label>Địa chỉ phòng khám</label>
                <input
                  className={this.state.validInput.addressEN
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
                  < img src={this.state.preview ? this.state.preview : 'https://image.shutterstock.com/z/stock-vector-drawings-design-house-no-color-334341113.jpg'} />
                </div>
              </div>
              <div className="col-6 ">
                <label>Select Group: (<span className="red"> * </span>)</label>

                <select value={this.state.clinicData.provinceId} className={this.state.validInput.provinceId
                  ? "form-select"
                  : "form-select is-invalid"
                }
                  onChange={(event) => this.handleOnchangeInput(event.target.value, "provinceId")}
                >
                  <option value=''>Please select your provinces</option>
                  {this.state.listProvinces.length > 0 && this.state.listProvinces.map((item, index) => {
                    return (
                      <option
                        key={`group-${index}`}
                        value={item.id}
                      >{item.nameVI}</option>
                    )
                  })}
                </select>
              </div>
            </div>


            <div className="col-12 mt-3 form-group">
              <label>Mô tả _EN)</label>
              <MdEditor
                style={{ height: "300px" }}
                renderHTML={(text) => mdParser.render(text)}
                onChange={this.handleEditorChangeVI}
                value={this.state.descriptionMarkdown_VI}
              />
            </div>
            <div className="col-12  mt-3 form-group">
              <label>Mô tả (EN)</label>
              <MdEditor
                style={{ height: "300px" }}
                renderHTML={(text) => mdParser.render(text)}
                onChange={this.handleEditorChangeEN}
                value={this.state.descriptionMarkdown_EN}
              />
            </div>
            <div className="col-12">
              <button
                className={this.state.showUpdateActive ? "btn btn-warning my-3 " : "btn btn-success my-3"}
                onClick={() => {
                  this.handleCreateAndUpdateClinic();
                }}
              >
                {this.state.showUpdateActive ? "Update Clinic" : "Create Clinic"}
              </button>

              <button
                className="btn btn-success my-3 offset-1"
                hidden={this.state.showUpdateActive === false}
                onClick={() => {
                  this.handleResetToFormCreate();
                }}
              >
                {this.state.showUpdateActive ? "Clear and Create Form" : ""}
              </button>
            </div>
          </div>
          <div className="Clinic-body">
            <table className="table table-bordered table-hover">
              <thead>
                <tr>
                  <th >No</th>
                  <th  >Tên</th>
                  <th className="col-5">Địa chỉ</th>
                  <th >Tỉnh</th>
                </tr>
              </thead>
              <tbody>
                {this.state.listClinics && this.state.listClinics.length > 0 ? (
                  <>
                    {this.state.listClinics.map((item, index) => {
                      return (
                        <tr key={`row-${index}`}>
                          <td>
                            {(this.state.currentPage - 1) *
                              this.state.currentLimit +
                              index +
                              1}
                          </td>
                          <td>{item.nameVI}</td>
                          <td>{item.addressVI}</td>
                          <td>{item.provinceId ? item.Province.nameVI : ""}</td>
                          <td>
                            <button
                              className="btn btn-warning m-2"
                              onClick={() => this.handUpdateClinic(item)}
                            >
                              <i
                                className="fa fa-pencil"
                                aria-hidden="true"
                              ></i>
                            </button>
                            <button
                              className="btn btn-danger"
                              onClick={() => this.handleDeleteClinic(item)}
                            >
                              <i className="fa fa-trash"></i>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </>
                ) : (
                  <>
                    <tr>
                      <td>Không có Clinics nào</td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
            <div className="footer">
              {this.state.totalPage > 0 && (
                <ReactPaginate
                  nextLabel="next >"
                  onPageChange={this.handlePageClick}
                  pageRangeDisplayed={3}
                  marginPagesDisplayed={2}
                  pageCount={this.state.totalPage}
                  previousLabel="< previous"
                  pageClassName="page-item"
                  pageLinkClassName="page-link"
                  previousClassName="page-item"
                  previousLinkClassName="page-link"
                  nextClassName="page-item"
                  nextLinkClassName="page-link"
                  breakLabel="..."
                  breakClassName="page-item"
                  breakLinkClassName="page-link"
                  containerClassName="pagination"
                  activeClassName="active"
                  renderOnZeroPageCount={null}
                />
              )}
            </div>
          </div>
        </div>
        <ModalDeleteSpecialty
          show={this.state.isShowModalDelete}
          handleClose={this.handleModalClinicClose}
          confirmDeleteClinic={this.confirmDeleteClinic}
          dataModal={this.state.dataModalDelete}
        />
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageClinic);
