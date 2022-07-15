import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import "./ManageClinic.css";
import MarkdownIt from "markdown-it";
import { CommonUtils } from "../../../utils";
import "../UserManage.scss";

import { fetchAllClinics, createNewClinic, } from "../../../services/clinicService";

import ReactPaginate from "react-paginate";
import ModalDeleteClinic from "./ModalDeleteClinic";
import _ from 'lodash';
import { toast } from "react-toastify";
import ModalUpdateClinic from "./ModalUpdateClinic";


const mdParser = new MarkdownIt(/* Markdown-it options */);

class ManageClinic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1,
      currentLimit: 7,
      totalPage: 0,//phân trang

      listClinics: [],

      isShowModalUpdateClinic: false,
      dataModalUpdateClinic: {},

      isShowModalDelete: false,
      dataModalDelete: {},


    };

  }

  componentDidMount() {
    this.fetchClinics();
  }

  fetchClinics = async () => {
    let res = await fetchAllClinics(
      this.state.currentPage,
      this.state.currentLimit
    );
    if (res && +res.EC === 0) {

      this.setState({
        listClinics: res.DT.clinics,
        totalPage: res.DT.totalPages
      })
    } else {
      toast.error(res.EM)
    }
  }
  async componentDidUpdate(prevProps, prevState) {
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
  }

  handleDeleteClinic = (item) => {
    this.setState({ dataModalDelete: item });
    this.setState({ isShowModalDelete: true });
  }

  handleModalDeleteClinicClose = async () => {
    this.setState({ dataModalDelete: {} });
    this.setState({ isShowModalDelete: false });
    await this.fetchClinics();
  }
  handleModalUpdateClinicClose = async () => {
    this.setState({ dataModalUpdateClinic: {} });
    this.setState({ isShowModalUpdateClinic: false });
    await this.fetchClinics();
  }

  handleModalUpdateClinic = (item) => {
    // this.setClinicDataItem(item);
    this.setState({
      isShowModalUpdateClinic: true,
      dataModalUpdateClinic: item
    })
  }

  render() {
    console.log("check isloggin in manageClinicU ", this.props.isLoggedIn)

    return (
      <>
        <div className="manage-specialty-container">
          <div className="ms-title">Quản lý phòng khám</div>

          <div className="Clinic-body">
            <table className="table table-bordered table-hover">
              <thead>
                <tr>
                  <th >No</th>
                  <th  >Tên</th>
                  <th className="col-5">Địa chỉ</th>
                  <th >Tỉnh</th>
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
                          <td>{item.provinceId ? item.provinceId : ""}</td>
                          <td >

                            <div className={
                              item.status === 0 && "pending-status" || item.status === 1 && "active-status" || item.status === 2 && "pause-status"
                            }>
                              {
                                item.status === 0 && "pending" || item.status === 1 && "active" || item.status === 2 && "pause"
                              }
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