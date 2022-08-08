import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import "./ManageClinic.css";
import MarkdownIt from "markdown-it";
import { CommonUtils } from "../../../utils";
import "../UserManage.scss";

import {
  fetchAllClinics,
  createNewClinic,
  fetchAllClinicsOfSupport,
  searchClinic,
} from "../../../services/clinicService";
import ReactPaginate from "react-paginate";
import ModalDeleteClinic from "./ModalDeleteClinic";
import _ from "lodash";
import { toast } from "react-toastify";
import ModalUpdateClinic from "./ModalUpdateClinic";

const mdParser = new MarkdownIt(/* Markdown-it options */);

class ManageClinic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: "",
      currentPage: 1,
      currentLimit: 7,
      totalPage: 0, //phân trang

      listClinics: [],

      isShowModalUpdateClinic: false,
      dataModalUpdateClinic: {},

      isShowModalDelete: false,
      dataModalDelete: {},
      lstProvince: {},
    };
  }

  componentDidMount() {
    this.fetchClinics();
    this.fetchProvince();
  }

  async componentDidUpdate(prevProps, prevState) {}
  fetchProvince = () => {
    fetch("https://provinces.open-api.vn/api/", {
      method: "GET", // or 'PUT'
    })
      .then((response) => response.json())
      .then((actualData) => {
        this.setState({
          lstProvince: this.coverAPIAddressToList(actualData),
        });
      })
      .catch((err) => {
        console.log(err.message);
      })
      .finally(() => {
        // setLoading(false);
      });
  };
  coverAPIAddressToList = (lstAPI) => {
    let lstcustom = {};
    if (lstAPI && lstAPI.length > 0)
      lstAPI.map((item, index) => {
        lstcustom[item.code] = item.name;
      });
    return lstcustom;
  };
  fetchClinics = async () => {
    let res = await fetchAllClinicsOfSupport(
      this.state.currentPage,
      this.state.currentLimit
    );
    if (res && +res.EC === 0) {
      this.setState({
        listClinics: res.DT.clinics,
        totalPage: res.DT.totalPages,
      });
    } else {
      toast.error(res.EM);
    }
  };
  async componentDidUpdate(prevProps, prevState) {
    if (prevState.currentPage !== this.state.currentPage) {
      await this.fetchClinics();
    }
  }

  handlePageClick = async (event) => {
    this.setState({ currentPage: event.selected + 1 }); // lỗi bất đồng bộ, cách fix thêm chỉ số vào fetchUser
    await this.fetchClinics();
  };

  handleOnchangImage = (event) => {
    let data = event.target.files; //list các file
    let getFile = data[0];
    if (getFile) {
      this.setState({ file: getFile });
    }
  };

  handleDeleteClinic = (item) => {
    this.setState({ dataModalDelete: item });
    this.setState({ isShowModalDelete: true });
  };

  handleModalDeleteClinicClose = async () => {
    this.setState({ dataModalDelete: {} });
    this.setState({ isShowModalDelete: false });
    await this.fetchClinics();
  };
  handleModalUpdateClinicClose = async () => {
    this.setState({ dataModalUpdateClinic: {} });
    this.setState({ isShowModalUpdateClinic: false });
    await this.fetchClinics();
  };

  handleModalUpdateClinic = (item) => {
    // this.setClinicDataItem(item);
    this.setState({
      isShowModalUpdateClinic: true,
      dataModalUpdateClinic: item,
    });
  };

  fillerData = (e) => {
    this.setState({ searchValue: e.target.value });

    // if (e.target.value != "") {
    //   // let isActive = 0;
    //   let check = false;
    //   let arrayFillter = [];

    //   // if ("đang hoạt động".includes(e.target.value.toLowerCase())) isActive = 1;
    //   // if ("tạm dừng".includes(e.target.value.toLowerCase())) isActive = 2;

    //   this.setState({ searchValue: e.target.value })
    //   if (this.state.listUser) {
    //     Object.entries(this.state.listUser).map(([key1, child1], index) => {
    //       Object.entries(child1).map(([key2, child2], index) => {
    //         console.log("check key 2???", key2)
    //         if (String(child2).toLowerCase().includes(e.target.value.toLowerCase())) {
    //           console.log("child2 .", child2)
    //           check = true;
    //         }
    //         else {
    //           check = false;
    //         };
    //         if (check) {
    //           arrayFillter[key1] = child1;
    //         }
    //       })
    //     })
    //     console.log("check arrayFillter", arrayFillter)

    //     this.setState({ tableFillter: arrayFillter })
    //   }
    // } else {
    //   if (this.state.listUser) {
    //     this.setState({
    //       tableFillter: this.state.listUser,
    //       searchValue: e.target.value
    //     })
    //   }
    // }
  };
  searchClinic = async (event) => {
    if (event.key === "Enter") {
      if (this.state.searchValue != "") {
        let response = await searchClinic(
          this.state.searchValue,
          this.state.currentPage,
          this.state.currentLimit
        );

        if (response && +response.EC === 0) {
          this.setState({ totalPage: response.DT.totalPages });
          this.setState({ listClinics: response.DT.clinics });
        }
      } else {
        this.fetchClinics();
      }
    }
  };
  render() {
    console.log("check isloggin in manageClinicU ", this.props.isLoggedIn);

    return (
      <>
        <div className="manage-specialty-container">
          <div className="ms-title">Quản lý phòng khám</div>
          <div className="row">
            <div className="col-6"></div>

            <div className="mt-3 table-role col-6">
              <input
                type="text"
                className="form-control"
                placeholder="Search"
                value={this.state.searchValue}
                onChange={(event) => this.fillerData(event)}
                onKeyPress={this.searchClinic}
              />
            </div>
          </div>

          <div className="Clinic-body">
            <table className="table table-bordered table-hover">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Tên</th>
                  <th className="col-5">Địa chỉ</th>
                  <th>Tỉnh</th>
                  <th>Trạng thái</th>
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
                          <td>
                            {item.provinceId && this.state.lstProvince
                              ? this.state.lstProvince[item.provinceId]
                              : ""}
                          </td>
                          <td>
                            <div
                              className={
                                (item.status === 0 && "pending-status") ||
                                (item.status === 1 && "active-status") ||
                                (item.status === 2 && "pause-status")
                              }
                            >
                              {(item.status === 0 && "Chờ đợi duyệt") ||
                                (item.status === 1 && "Đang hoạt động") ||
                                (item.status === 2 && "Tạm dừng")}
                            </div>
                          </td>
                          <td>
                            <button
                              className="btn btn-warning m-2"
                              onClick={() => this.handleModalUpdateClinic(item)}
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
        <ModalDeleteClinic
          show={this.state.isShowModalDelete}
          handleClose={this.handleModalDeleteClinicClose}
          dataModal={this.state.dataModalDelete}
        />
        <ModalUpdateClinic
          show={this.state.isShowModalUpdateClinic}
          handleClose={this.handleModalUpdateClinicClose}
          dataModal={this.state.dataModalUpdateClinic}
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
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageClinic);
