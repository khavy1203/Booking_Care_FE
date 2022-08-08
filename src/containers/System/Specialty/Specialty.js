import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import MarkdownIt from "markdown-it";
import { CommonUtils } from "../../../utils";
import { fetchAllSpecialOfSupport, createNewSpecialty, } from "../../../services/specialtyService";

import ReactPaginate from "react-paginate";
import _ from 'lodash';
import { toast } from "react-toastify";
import ModalCreateSpecialty from "./ModalCreateSpecialty";
import ModalUpdateSpecialty from "./ModalUpdateSpecialty";
import ModalDeleteSpecialty from "./ModalDeleteSpecialty";

const mdParser = new MarkdownIt(/* Markdown-it options */);

class Specialty extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPage: 1,
            currentLimit: 7,
            totalPage: 0,//phân trang

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
                totalPage: res.DT.totalPages
            })
        } else {
            toast.error(res.EM)
        }
    }
    async componentDidUpdate(prevProps, prevState) {
    }

    handlePageClick = async (event) => {
        this.setState({ currentPage: event.selected + 1 }); // lỗi bất đồng bộ, cách fix thêm chỉ số vào fetchSpecialty
        await this.fetchSpecialty();
    };

    handleDeleteSpecialty = (item) => {
        this.setState({ dataModalDelete: item });
        this.setState({ isShowModalDelete: true });
    }

    handleModalDeleteSpecialtyClose = async () => {
        this.setState({ dataModalDelete: {} });
        this.setState({ isShowModalDelete: false });
        await this.fetchSpecialty();
    }
    handleModalUpdateSpecialtyClose = async () => {
        this.setState({ dataModalUpdateSpecialty: {} });
        this.setState({ isShowModalUpdateSpecialty: false });
        await this.fetchSpecialty();
    }
    handleShowCreateModalSpecialty = async () => {
        this.setState({
            isShowModalCreateSpecialty: true,
        })
    }
    handleModalUpdateSpecialty = (item) => {
        console.log("check item >>", item)
        this.setState({
            isShowModalUpdateSpecialty: true,
            dataModalUpdateSpecialty: item
        })
    }
    handleModalCreateSpecialtyClose = async () => {
        this.setState({ isShowModalCreateSpecialty: false });
        await this.fetchSpecialty();
    }
    render() {

        return (
            <>
                <div className="container mt-5">
                    <h4 className="ms-title my-3">Quản lý chuyên khoa</h4>
                    <div></div>
                    <div className="action">
                        <button
                            className="btn btn-success"
                            onClick={() => this.handleShowCreateModalSpecialty()}
                        >
                            <i className="fa fa-plus"></i>Thêm chuyên khoa
                        </button>
                    </div>
                    <div className="manage-Specialtyy-container">
                        <div className="Specialty-body">
                            <table className="table table-bordered table-hover">
                                <thead>
                                    <tr>
                                        <th >No</th>
                                        <th  >Tên chuyên khoa</th>
                                        <th >Số lượng bác sĩ thuộc chuyên khoa</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.listSpecialties && this.state.listSpecialties.length > 0 ? (
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
                                                        <td>1</td>
                                                        <td>
                                                            <button
                                                                className="btn btn-warning m-2"
                                                                onClick={() => this.handleModalUpdateSpecialty(item)}
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