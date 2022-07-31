import React, { Component } from "react";
// import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import "./UserManage.scss";
import ReactPaginate from "react-paginate";
import ModalDeleteUser from "./ModalUserDelete";
import { fetchAllUser, deleteUser } from "../../services/userService";
import ModalUpdateUser from "./ModalUpdateUser";
import ModalCreateUser from "./ModalCreateUser";
import { toast } from "react-toastify";

require("dotenv").config();
class UserManage extends Component {
  constructor(props) {
    super(props);
    //khai báo state
    this.state = {
      //page
      listUser: [],
      currentPage: 1,
      currentLimit: 7,
      totalPage: 0,

      //update user
      dataModalUpdate: {},

      //delete user
      dataModalDelete: {},

      isShowModalDelete: false,
      isShowModalUpdateUser: false,
      isShowModalCreateUser: false
    };
  }
  componentDidMount() {
    this.fetchUser();
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.currentPage !== this.state.currentPage) {
      this.fetchUser();
    }
  }

  /*Life cycle
  1. run constructor to init state
  2. did mount (set state): hàm componentDidMount này gọi api để lấy dữ liệu
  3. render
  */

  fetchUser = async () => {
    let response = await fetchAllUser(
      this.state.currentPage,
      this.state.currentLimit
    );

    if (response && +response.EC === 0) {
      this.setState({ totalPage: response.DT.totalPages });
      this.setState({ listUser: response.DT.users });
    }
  };
  handlePageClick = async (event) => {
    this.setState({ currentPage: event.selected + 1 }); // lỗi bất đồng bộ, cách fix thêm chỉ số vào fetchUser
    await this.fetchUser();
  };
  //delete modal
  handleDeleteUser = async (user) => {
    this.setState({ dataModalDelete: user });
    this.setState({ isShowModalDelete: true });
  };



  // //update modal
  handleModalUserClose = async () => {
    this.setState({
      isShowModalDelete: false,
      isShowModalUpdateUser: false,
      isShowModalCreateUser: false,
      dataModalUpdate: {},
      dataModalDelete: {}
    });
    await this.fetchUser();
  };
  handShowUpdateUser = (item) => {
    this.setState({ dataModalUpdate: item, isShowModalUpdateUser: true });
  };

  handleShowCreateModalUser = () => {
    this.setState({ isShowModalCreateUser: true });
  };

  render() {
    return (
      <>
        <div className="container">
          <div className="manage-user-container">
            <div className="user-header">
              <div className="title">
                <h3>Table user</h3>
              </div>
              <div className="action">
                <button
                  className="btn btn-success"
                  onClick={() => this.handleShowCreateModalUser()}
                >
                  <i className="fa fa-plus"></i>Add new user
                </button>
              </div>
            </div>

            <div className="user-body">
              <table className="table table-bordered table-hover">
                <thead>
                  <tr>
                    <th scope="col">No</th>
                    <th scope="col">Email</th>
                    <th scope="col">Username</th>
                    <th scope="col">Phone</th>
                    <th scope="col">Group</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.listUser && this.state.listUser.length > 0 ? (
                    <>
                      {this.state.listUser.map((item, index) => {
                        let admin = process.env.REACT_APP_EMAIL_ADMIN;
                        if (admin === item.email) return;
                        return (
                          <tr key={`row-${index}`}>
                            <td>
                              {(this.state.currentPage - 1) *
                                this.state.currentLimit +
                                index +
                                1}
                            </td>
                            <td>{item.email}</td>
                            <td>{item.username}</td>
                            <td>{item.phone}</td>
                            <td>{item.groupId ? item.Group.name : ""}</td>
                            <td>
                              <button
                                className="btn btn-warning m-2"
                                onClick={() => this.handShowUpdateUser(item)}
                              >
                                <i
                                  className="fa fa-pencil"
                                  aria-hidden="true"
                                ></i>
                              </button>
                              <button
                                className="btn btn-danger"
                                onClick={() => this.handleDeleteUser(item)}
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
                        <td>Không có user nào</td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>
            <div className="user-footer">
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
        <ModalDeleteUser
          show={this.state.isShowModalDelete}
          handleClose={this.handleModalUserClose}
          dataModal={this.state.dataModalDelete}
        />
        <ModalUpdateUser
          show={this.state.isShowModalUpdateUser}
          handleClose={this.handleModalUserClose}
          dataModal={this.state.dataModalUpdate}
        />
        <ModalCreateUser
          show={this.state.isShowModalCreateUser}
          handleClose={this.handleModalUserClose}
        />
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(UserManage);
