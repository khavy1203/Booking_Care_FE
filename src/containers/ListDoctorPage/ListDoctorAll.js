import React, { Component } from "react";
// import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import HomeHeader from "../HomePage/HomeHeader";

import HomeFooter from "../HomePage/HomeFooter";
import "./ListDoctorPage.scss";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import * as actions from "../../store/actions";
import { getAllDoctorsPagination } from "../../services/doctorService";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";
import { fetchAllSpecialtysNoPage } from "../../services/specialtyService";
import {
    RiArrowDropDownLine
} from "react-icons/ri";
import CardDoctor from "./CardDoctor";
import Select from 'react-select';

class ListClinicPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userData: {},

            currentPage: 1,
            currentLimit: 7,
            totalPage: 0,//phân trang

            selectedSpecialty: null,
            lstSpecialties: [],

            listDoctor: [],
        };
    }
    componentDidMount() {
        this.fetchDoctors();
        this.fetchSpecialty();

    }
    async componentDidUpdate(prevProps, prevState) {
        if (prevState.selectedSpecialty !== this.state.selectedSpecialty) {
            let res = await getAllDoctorsPagination(
                this.state.currentPage,
                this.state.currentLimit,
                this.state.selectedSpecialty.value
            );
            if (res && +res.EC === 0) {

                this.setState({
                    listDoctor: res.DT.doctors,
                    totalPage: res.DT.totalPages
                })
            } else {
                toast.error(res.EM)
            }

            //fetchApi lấy data Clinic
        }
    }
    fetchSpecialty = async () => {
        let res = await fetchAllSpecialtysNoPage();
        if (res && +res.EC === 0) {
            this.setState({
                lstSpecialties: this.coverAPISpecialToListOption(res.DT),
            })
        } else {
            toast.error(res.EM)
        }
    }
    coverAPISpecialToListOption = (lstAPI) => {
        let lstcustom = {};
        if (lstAPI && lstAPI.length > 0)
            lstcustom = lstAPI.map((item, index) => {
                return {
                    value: item.id,
                    label: item.nameVI
                }
            })
        return lstcustom;
    }

    handlePageClick = async (event) => {
        this.setState({ currentPage: event.selected + 1 }); // lỗi bất đồng bộ, cách fix thêm chỉ số vào fetchUser
        await this.fetchDoctors();
    };
    fetchDoctors = async () => {
        let res = await getAllDoctorsPagination(
            this.state.currentPage,
            this.state.currentLimit
        );
        if (res && +res.EC === 0) {

            this.setState({
                listDoctor: res.DT.doctors,
                totalPage: res.DT.totalPages
            })
        } else {
            toast.error(res.EM)
        }
    }

    handleChangeSpecialties = (selectedSpecialty) => {
        this.setState({ selectedSpecialty }, () =>
            console.log(`Option selected:`, this.state.selectedSpecialty)
        );
    }
    render() {
        console.log("check user data >>>", this.state.userData)
        console.log("check lst clinic, Totalpage >>", this.state.listDoctor, this.state.totalPage)
        console.log("check state >>>", this.state)
        let { selectedSpecialty, lstSpecialties } = this.state;
        return (
            <div>
                <HomeHeader
                    isShowBanner={true} />
                <div className="Clinics_body__1PfOW">
                    <div className="Container_container__uCFWk Container_desktop__35haU Clinics_wrapper_container__wBAoW">
                        <div className="Filter_search__Mg5hk d-flex justify-content-between">
                            <Select
                                value={selectedSpecialty}
                                onChange={this.handleChangeSpecialties}
                                options={lstSpecialties}
                                className="Filter_select__18BMn custom-select css-2b097c-container flex-search"
                                defaultValue={selectedSpecialty}
                                placeholder={"Chọn chuyên khoa Bác Sĩ"}
                            />
                            <div className="Filter_group_filter__2RA9c ml-5">
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
                        {this.state.listDoctor && this.state.listDoctor.length > 0 ? (
                            <>
                                {this.state.listDoctor.map((item, index) => {
                                    console.log("check email >>>", item['Users.email'])
                                    if (item.groupId === 2) //trùng 5 có nghĩa là đối tác chủ phòng khám, tại trả về raw là true nên cần lấy thông tin của đối tác
                                        return (
                                            <CardDoctor
                                                key={`row-${index}`}
                                                id={item.id}
                                                username={item.username}
                                                phone={item.phone}
                                                image={item.image}
                                                namespecial={item['Specialty.nameVI']}
                                                email={item.email}
                                                phoneContact={item.phone}
                                                iconSpecial={item['Specialty.image']}

                                                addressVI={item['Clinic.addressVI']}
                                                addressEN={item['Clinic.addressEN']}
                                                provinceId={item['Clinic.provinceId']}
                                                districtId={item['Clinic.districtId']}
                                                wardId={item['Clinic.wardId']}

                                                degree_VI={item['Doctorinfo.degree_VI']}
                                                degree_EN={item['Doctorinfo.degree_EN']}
                                                price={item['Doctorinfo.price']}

                                            />
                                        );
                                })}
                            </>
                        ) : (
                            <>
                                <tr>
                                    <td>Không có Chuyên khoa nào</td>
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
