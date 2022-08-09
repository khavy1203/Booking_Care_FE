import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import MarkdownIt from "markdown-it";
import { CommonUtils } from "../../../utils";
import {
  fetchAllSpecialOfSupport,
  createNewSpecialty,
  searchSpecial,
} from "../../../services/specialtyService";

import ReactPaginate from "react-paginate";
import _ from "lodash";
import { toast } from "react-toastify";
import ModalCreateSpecialty from "./ModalCreateSpecialty";
import ModalUpdateSpecialty from "./ModalUpdateSpecialty";
import ModalDeleteSpecialty from "./ModalDeleteSpecialty";

const mdParser = new MarkdownIt(/* Markdown-it options */);

class Specialty extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: "",
      currentPage: 1,
      currentLimit: 7,
      totalPage: 0, //phân trang

      listSpecialties: [],

      isShowModalCreateSpecialty: false,

      isShowModalUpdateSpecialty: false,
      dataModalUpdateSpecialty: {},

      isShowModalDelete: false,
      dataModalDelete: {},
    };
  }

  componentDidMount() {
    this.fetchSpecialty();
  }
  fetchSpecialty = async () => {
    let res = await fetchAllSpecialOfSupport(
      this.state.currentPage,
      this.state.currentLimit
    );
    if (res && +res.EC === 0) {
      this.setState({
        listSpecialties: res.DT.specialties,
        totalPage: res.DT.totalPages,
      });
    } else {
      toast.error(res.EM);
    }
  };
  async componentDidUpdate(prevProps, prevState) {
    if (prevState.currentPage !== this.state.currentPage) {
      this.fetchSpecialty();
    }
  }

  handlePageClick = async (event) => {
    this.setState({ currentPage: event.selected + 1 }); // lỗi bất đồng bộ, cách fix thêm chỉ số vào fetchSpecialty
  };

  handleDeleteSpecialty = (item) => {
    this.setState({ dataModalDelete: item });
    this.setState({ isShowModalDelete: true });
  };

  handleModalDeleteSpecialtyClose = async () => {
    this.setState({ dataModalDelete: {} });
    this.setState({ isShowModalDelete: false });
    await this.fetchSpecialty();
  };
  handleModalUpdateSpecialtyClose = async () => {
    this.setState({ dataModalUpdateSpecialty: {} });
    this.setState({ isShowModalUpdateSpecialty: false });
    await this.fetchSpecialty();
  };
  handleShowCreateModalSpecialty = async () => {
    this.setState({
      isShowModalCreateSpecialty: true,
    });
  };
  handleModalUpdateSpecialty = (item) => {
    console.log("check item >>", item);
    this.setState({
      isShowModalUpdateSpecialty: true,
      dataModalUpdateSpecialty: item,
    });
  };
  handleModalCreateSpecialtyClose = async () => {
    this.setState({ isShowModalCreateSpecialty: false });
    await this.fetchSpecialty();
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
  searchSpecial = async (event) => {
    if (event.key === "Enter") {
      if (this.state.searchValue != "") {
        let response = await searchSpecial(
          this.state.searchValue,
          this.state.currentPage,
          this.state.currentLimit
        );

        if (response && +response.EC === 0) {
          this.setState({ totalPage: response.DT.totalPages });
          this.setState({ listSpecialties: response.DT.listSpecialties });
        }
      } else {
        this.fetchSpecialty();
      }
    }
  };
  render() {
    return (
      <>
        <div className="container mt-5">
          <h4 className="ms-title my-3">Quản lý chuyên khoa</h4>

          <div className="row">
            <div className="col-6">
              <button
                className="btn btn-success"
                onClick={() => this.handleShowCreateModalSpecialty()}
              >
                <i className="fa fa-plus"></i>Thêm chuyên khoa
              </button>
            </div>

            <div className="mt-3 table-role col-6">
              <input
                type="text"
                className="form-control"
                placeholder="Search"
                value={this.state.searchValue}
                onChange={(event) => this.fillerData(event)}
                onKeyPress={this.searchSpecial}
              />
            </div>
          </div>
          <div className="manage-Specialtyy-container">
            <div className="Specialty-body">
              <table className="table table-bordered table-hover">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Tên chuyên khoa</th>
                    <th>Số lượng bác sĩ thuộc chuyên khoa</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.listSpecialties &&
                  this.state.listSpecialties.length > 0 ? (
                    <>
                      {this.state.listSpecialties.map((item, index) => {
                        return (
                          <tr key={`row-${index}`}>
                            <td>
                              {(this.state.currentPage - 1) *
                                this.state.currentLimit +
                                index +
                                1}
                            </td>
                            <td>{item.nameVI}</td>
                            <td>{item.userCount}</td>
                            <td>
                              <button
                                className="btn btn-warning m-2"
                                onClick={() =>
                                  this.handleModalUpdateSpecialty(item)
                                }
                              >
                                <i
                                  className="fa fa-pencil"
                                  aria-hidden="true"
                                ></i>
                              </button>
                              <button
                                className="btn btn-danger"
                                onClick={() => this.handleDeleteSpecialty(item)}
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
                        <td>Không có Specialtys nào</td>
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
            handleClose={this.handleModalDeleteSpecialtyClose}
            dataModal={this.state.dataModalDelete}
          />
          <ModalUpdateSpecialty
            show={this.state.isShowModalUpdateSpecialty}
            handleClose={this.handleModalUpdateSpecialtyClose}
            dataModal={this.state.dataModalUpdateSpecialty}
          />
          <ModalCreateSpecialty
            show={this.state.isShowModalCreateSpecialty}
            handleClose={this.handleModalCreateSpecialtyClose}
          />
        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Specialty);
