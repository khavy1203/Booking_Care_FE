import React, { Component } from "react";
// import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import HomeHeader from "../HomePage/HomeHeader";

import HomeFooter from "../HomePage/HomeFooter";
import "./ListClinicPage.scss";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import * as actions from "../../store/actions";
import { fetchAllClinics } from "../../services/clinicService";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";

import {
    RiArrowDropDownLine
} from "react-icons/ri";
import CardClinic from "./CardClinic";

class ListClinicPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userData: {},
            currentPage: 1,
            currentLimit: 7,
            totalPage: 0,//phân trang

            listClinics: [],
        };
    }
    componentDidMount() {
        this.fetchClinics();
    }
    handlePageClick = async (event) => {
        this.setState({ currentPage: event.selected + 1 }); // lỗi bất đồng bộ, cách fix thêm chỉ số vào fetchUser
        await this.fetchClinics();
    };
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

    render() {
        console.log("check user data >>>", this.state.userData)
        let settings = {
            dots: false,
            infinite: false,
            speed: 500,
            slidesToShow: 4,
            slidesToScroll: 4,
        };
        console.log("check lst clinic, Totalpage >>", this.state.listClinics, this.state.totalPage)

        return (
            <div>
                <HomeHeader isShowBanner={true} />
                <div className="Clinics_body__1PfOW">
                    <div className="Container_container__uCFWk Container_desktop__35haU Clinics_wrapper_container__wBAoW">
                        <div className="Filter_search__Mg5hk">
                            <div className="Filter_select__18BMn custom-select css-2b097c-container">
                                <span
                                    aria-live="polite"
                                    aria-atomic="false"
                                    aria-relevant="additions text"
                                    className="css-7pg0cj-a11yText"
                                />
                                <div className="custom-select__control css-yk16xz-control">
                                    <div className="custom-select__value-container css-1hwfws3">
                                        <div className="custom-select__placeholder css-1wa3eu0-placeholder">
                                            Tỉnh / Thành phố
                                        </div>
                                        <input
                                            id="select-1"
                                            readOnly=""
                                            tabIndex={0}
                                            defaultValue=""
                                            aria-autocomplete="list"
                                            className="css-62g3xt-dummyInput"
                                        />
                                    </div>
                                    <div className="custom-select__indicators css-1wy0on6">
                                        <span className="custom-select__indicator-separator css-1okebmr-indicatorSeparator" />
                                        <div
                                            className="custom-select__indicator custom-select__dropdown-indicator css-tlfecz-indicatorContainer"
                                            aria-hidden="true"
                                        >
                                            <svg
                                                height={20}
                                                width={20}
                                                viewBox="0 0 20 20"
                                                aria-hidden="true"
                                                focusable="false"
                                                className="css-8mmkcg"
                                            >
                                                <path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="Filter_select__18BMn custom-select custom-select--is-disabled css-14jk2my-container">
                                <span
                                    aria-live="polite"
                                    aria-atomic="false"
                                    aria-relevant="additions text"
                                    className="css-7pg0cj-a11yText"
                                />
                                <div className="custom-select__control custom-select__control--is-disabled css-1fhf3k1-control">
                                    <div className="custom-select__value-container css-1hwfws3">
                                        <div className="custom-select__placeholder css-1wa3eu0-placeholder">
                                            Quận / Huyện
                                        </div>
                                        <input
                                            id="select-2"
                                            readOnly=""
                                            disabled=""
                                            tabIndex={0}
                                            defaultValue=""
                                            aria-autocomplete="list"
                                            className="css-62g3xt-dummyInput"
                                        />
                                    </div>
                                    <div className="custom-select__indicators css-1wy0on6">
                                        <span className="custom-select__indicator-separator css-109onse-indicatorSeparator" />
                                        <div
                                            className="custom-select__indicator custom-select__dropdown-indicator css-tlfecz-indicatorContainer"
                                            aria-hidden="true"
                                        >
                                            <svg
                                                height={20}
                                                width={20}
                                                viewBox="0 0 20 20"
                                                aria-hidden="true"
                                                focusable="false"
                                                className="css-8mmkcg"
                                            >
                                                <path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="Filter_select__18BMn custom-select custom-select--is-disabled css-14jk2my-container">
                                <span
                                    aria-live="polite"
                                    aria-atomic="false"
                                    aria-relevant="additions text"
                                    className="css-7pg0cj-a11yText"
                                />
                                <div className="custom-select__control custom-select__control--is-disabled css-1fhf3k1-control">
                                    <div className="custom-select__value-container css-1hwfws3">
                                        <div className="custom-select__placeholder css-1wa3eu0-placeholder">
                                            Phường / Xã
                                        </div>
                                        <input
                                            id="select-3"
                                            readOnly=""
                                            disabled=""
                                            tabIndex={0}
                                            defaultValue=""
                                            aria-autocomplete="list"
                                            className="css-62g3xt-dummyInput"
                                        />
                                    </div>
                                    <div className="custom-select__indicators css-1wy0on6">
                                        <span className="custom-select__indicator-separator css-109onse-indicatorSeparator" />
                                        <div
                                            className="custom-select__indicator custom-select__dropdown-indicator css-tlfecz-indicatorContainer"
                                            aria-hidden="true"
                                        >
                                            <svg
                                                height={20}
                                                width={20}
                                                viewBox="0 0 20 20"
                                                aria-hidden="true"
                                                focusable="false"
                                                className="css-8mmkcg"
                                            >
                                                <path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="Filter_group_filter__2RA9c">
                                <div className="Filter_filter_sort__2Z7LW">
                                    <span>Sắp xếp theo: </span>
                                    <div className="Dropdown_wrapper__2OOf9 Filter_dropdown__1GvuX dropdown">
                                        <div aria-haspopup="true" className="" aria-expanded="false">
                                            <div className="Filter_dropdown_toggle__3rcKE">
                                                <span className="Filter_text__ngJ55">Mặc định</span>
                                                <RiArrowDropDownLine
                                                    alt="dont have img"
                                                    className="Image_wrapper__18WCY Filter_icon_dropdown__1CSIC"
                                                    value={{ height: '50px', width: '50px' }}
                                                />

                                            </div>
                                        </div>
                                        <div
                                            tabIndex={-1}
                                            role="menu"
                                            aria-hidden="true"
                                            className="Dropdown_dropdown_menu__qmFIE Filter_dropdown_menu__UOSpg dropdown-menu"
                                        >
                                            <div className="Dropdown_rt_dropdown_item__J-nWE">
                                                <div className="menu-item Dropdown_menu_items__3LdZF">
                                                    <div className="Filter_menu_items__RmFqq">
                                                        <button
                                                            type="button"
                                                            value="default"
                                                            tabIndex={0}
                                                            role="menuitem"
                                                            className="Filter_dropdown_item__3ggKh dropdown-item"
                                                        >
                                                            Mặc định
                                                        </button>
                                                        <button
                                                            type="button"
                                                            value="new"
                                                            tabIndex={0}
                                                            role="menuitem"
                                                            className="Filter_dropdown_item__3ggKh dropdown-item"
                                                        >
                                                            Mới nhất
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                        {/* tao modal item card */}
                        {this.state.listClinics && this.state.listClinics.length > 0 ? (
                            <>
                                {this.state.listClinics.map((item, index) => {
                                    console.log("check email >>>", item['Users.email'])
                                    if (item.status === 1 && item['Users.groupId'] === 5) //trùng 5 có nghĩa là đối tác chủ phòng khám, tại trả về raw là true nên cần lấy thông tin của đối tác
                                        return (
                                            <CardClinic
                                                key={`row-${index}`}
                                                id={item.id}
                                                nameVI={item.nameVI}
                                                nameEN={item.nameEN}
                                                addressVI={item.addressVI}
                                                addressEN={item.addressEN}
                                                img={item['Users.image']}
                                                email={item['Users.email']}
                                                phoneContact={item.phoneContact}
                                            />
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

                    </div>
                </div>
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

                <HomeFooter />

            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.user.isLoggedIn,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        userlogOut: () => dispatch(actions.userlogOut()),
        userloginSuccess: (userInfo) =>
            dispatch(actions.userloginSuccess(userInfo)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ListClinicPage);
