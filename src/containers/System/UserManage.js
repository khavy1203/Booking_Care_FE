import React, { Component } from "react";
// import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import "./UserManage.scss";
import ReactPaginate from "react-paginate";
import ModalDeleteUser from "./ModalUserDelete";
import ModalUser from "./ModalUser";
import { fetchAllUser, deleteUser } from "../../services/userService";
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

      //trạng thái Modal
      actionModalUser: "CREATE",
      isShowModalUser: false,

      //create user
      dataModalCreate: {},

      //update user
      dataModalUpdate: {},

      //delete user
      dataModalDelete: {},

      isShowModalDelete: false,
    };
  }
  componentDidMount() {
    const { isLoggedIn } = this.props;
    if (isLoggedIn === true) {//nếu trùng false có khả năng người dùng đã login bằng mxh, tài khoản đã lưu dưới cookie
      this.fetchUser();//mục đích lấy cookie set lại cho localStorage
    }

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

  confirmDeleteUser = async () => {
    let response = await deleteUser(this.state.dataModalDelete); //ban đầu là xóa user nhưng thuận tiện truyền dữ liệu thì sài cách này đồng thời dataModal cũng là 1 user luôn
    if (response && +response.EC === 0) {
      toast.success(response.EM);
      await this.fetchUser();
      this.setState({ isShowModalDelete: false });
    } else {
      toast.error(response.EM);
    }
  };

  // //update modal
  handleModalUserClose = () => {
    this.setState({ isShowModalDelete: false });
    this.setState({ isShowModalUser: false });
    this.setState({ isShowModalUser: false });
  };
  handUpdateUser = (item) => {
    this.setState({ actionModalUser: "UPDATE" });
    this.setState({ dataModalUpdate: item });
    this.setState({ isShowModalUser: true });
  };

  handleShowCreateModalUser = () => {
    this.setState({ actionModalUser: "CREATE" });
    this.setState({ isShowModalUser: true });
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
                                onClick={() => this.handUpdateUser(item)}
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
          confirmDeleteUser={this.confirmDeleteUser}
          dataModal={this.state.dataModalDelete}
        />
        <ModalUser
          show={this.state.isShowModalUser}
          action={this.state.actionModalUser}
          handleModalUserClose={this.handleModalUserClose}
          fetchUser={this.fetchUser}
          dataModalUpdate={this.state.dataModalUpdate}
        />
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    systemMenuPath: state.app.systemMenuPath,
    isLoggedIn: state.user.isLoggedIn,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(UserManage);
