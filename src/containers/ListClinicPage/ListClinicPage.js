import React, { Component } from "react";
// import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import HomeHeader from "../HomePage/HomeHeader";

import HomeFooter from "../HomePage/HomeFooter";
import "./ListClinicPage.scss";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import * as actions from "../../store/actions";
import { getInforClininicOfUserOnPage } from "../../services/clinicService";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";
import Select from "react-select";

import { RiArrowDropDownLine } from "react-icons/ri";
import CardClinic from "./CardClinic";

const options = [
  { value: "chocolatevalu", label: "Chocolatelabe" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" },
];

class ListClinicPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: {},

      currentPage: 1,
      currentLimit: 7,
      totalPage: 0, //phân trang

      selectedProvinceId: null,
      selectedDistrictId: null,
      selectedWardId: null,

      lstProvince: [],
      lstDistrict: [],
      lstWard: [],

      lstProvinceOption: [],
      lstDistrictOption: [],
      lstWardOption: [],

      listClinics: [],
    };
  }
  componentDidMount() {
    this.fetchClinics();
    this.fetchProvince();
    this.fetchDistrict();
    this.fetchWard();
  }
  async componentDidUpdate(prevProps, prevState) {
    if (prevState.currentPage !== this.state.currentPage) {
      await this.fetchClinics();
    }
    if (prevState.selectedProvinceId !== this.state.selectedProvinceId) {
      await this.fetchDistrict();
      //fetchApi lấy data Clinic
      let res = await getInforClininicOfUserOnPage(
        this.state.currentPage,
        this.state.currentLimit,
        this.state.selectedProvinceId.value
      );
      if (res && +res.EC === 0) {
        this.setState({
          listClinics: res.DT.clinics,
          totalPage: res.DT.totalPages,
        });
      } else {
        toast.error(res.EM);
      }
    }
    if (prevState.selectedDistrictId !== this.state.selectedDistrictId) {
      await this.fetchWard();
      let res = await getInforClininicOfUserOnPage(
        this.state.currentPage,
        this.state.currentLimit,
        this.state.selectedProvinceId.value,
        this.state.selectedDistrictId.value
      );
      if (res && +res.EC === 0) {
        this.setState({
          listClinics: res.DT.clinics,
          totalPage: res.DT.totalPages,
        });
      } else {
        toast.error(res.EM);
      }

      //fetchApi lấy data Clinic
    }
    if (prevState.selectedWardId !== this.state.selectedWardId) {
      await this.fetchWard();
      let res = await getInforClininicOfUserOnPage(
        this.state.currentPage,
        this.state.currentLimit,
        this.state.selectedProvinceId.value,
        this.state.selectedDistrictId.value,
        this.state.selectedWardId.value
      );
      if (res && +res.EC === 0) {
        this.setState({
          listClinics: res.DT.clinics,
          totalPage: res.DT.totalPages,
        });
      } else {
        toast.error(res.EM);
      }
      //fetchApi lấy data Clinic
    }
  }
  fetchProvince = () => {
    fetch("https://provinces.open-api.vn/api/", {
      method: "GET", // or 'PUT'
    })
      .then((response) => response.json())
      .then((actualData) => {
        this.setState({
          lstProvince: this.coverAPIAddressToList(actualData),
          lstProvinceOption: this.coverAPIAddressToListOption(actualData),
        });
      })
      .catch((err) => {
        console.log(err.message);
      })
      .finally(() => {
        // setLoading(false);
      });
  };
  fetchDistrict = async () => {
    await fetch("https://provinces.open-api.vn/api/d", {
      method: "GET", // or 'PUT'
    })
      .then((response) => response.json())
      .then(async (actualData) => {
        let lstDistrictOptionfetch = {};
        if (this.state.selectedProvinceId) {
          lstDistrictOptionfetch = actualData.filter(
            (item) =>
              item.province_code === +this.state.selectedProvinceId.value
          );
        }
        this.setState({
          lstDistrict: this.coverAPIAddressToList(actualData),
          lstDistrictOption: lstDistrictOptionfetch
            ? this.coverAPIAddressToListOption(lstDistrictOptionfetch)
            : {},
        });
      })
      .catch((err) => {
        console.log(err.message);
      })
      .finally(() => {
        // setLoading(false);
      });
  };
  fetchWard = () => {
    fetch("https://provinces.open-api.vn/api/w", {
      method: "GET", // or 'PUT'
    })
      .then((response) => response.json())
      .then((actualData) => {
        let listWardOptionFetch = {};
        if (this.state.selectedDistrictId) {
          listWardOptionFetch = actualData.filter(
            (item) =>
              item.district_code === +this.state.selectedDistrictId.value
          );
        }
        this.setState({
          lstWard: this.coverAPIAddressToList(actualData),
          lstWardOption: listWardOptionFetch
            ? this.coverAPIAddressToListOption(listWardOptionFetch)
            : {},
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
  coverAPIAddressToListOption = (lstAPI) => {
    let lstcustom = {};
    if (lstAPI && lstAPI.length > 0)
      lstcustom = lstAPI.map((item, index) => {
        return {
          value: item.code,
          label: item.name,
        };
      });
    return lstcustom;
  };
  handleChangeProvince = (selectedProvinceId) => {
    this.setState({ selectedProvinceId }, () =>
      console.log(`Option selected:`, this.state.selectedProvinceId)
    );
  };
  handleChangeDistrict = (selectedDistrictId) => {
    this.setState({ selectedDistrictId }, () =>
      console.log(`Option selected:`, this.state.selectedDistrictId)
    );
  };
  handleChangeWard = (selectedWardId) => {
    this.setState({ selectedWardId }, () =>
      console.log(`Option selected:`, this.state.selectedWardId)
    );
  };

  handlePageClick = async (event) => {
    this.setState({ currentPage: event.selected + 1 }); // lỗi bất đồng bộ, cách fix thêm chỉ số vào fetchUser
    await this.fetchClinics();
  };
  fetchClinics = async () => {
    let res = await getInforClininicOfUserOnPage(
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

  render() {
    console.log("check user data >>>", this.state.userData);

    console.log(
      "check lst clinic, Totalpage >>",
      this.state.listClinics,
      this.state.totalPage
    );

    let {
      selectedProvinceId,
      selectedDistrictId,
      selectedWardId,
      lstProvince,
      lstDistrict,
      lstWard,
      lstProvinceOption,
      lstDistrictOption,
      lstWardOption,
    } = this.state;
    console.log("check state >>", this.state);
    return (
      <div>
        <HomeHeader isShowBanner={true} />
        <div className="Clinics_body__1PfOW">
          <div className="Container_container__uCFWk Container_desktop__35haU Clinics_wrapper_container__wBAoW">
            <div className="Filter_search__Mg5hk">
              <Select
                value={selectedProvinceId}
                onChange={this.handleChangeProvince}
                options={lstProvinceOption}
                className="Filter_select__18BMn custom-select css-2b097c-container flex-search"
                defaultValue={selectedProvinceId}
                placeholder={"Chọn Tỉnh/Thành phố"}
              />
              <Select
                value={selectedDistrictId}
                onChange={this.handleChangeDistrict}
                options={lstDistrictOption}
                className="Filter_select__18BMn custom-select css-2b097c-container flex-search"
                defaultValue={selectedDistrictId}
                placeholder={"Chọn Quận/Huyện"}
              />
              <Select
                value={selectedWardId}
                onChange={this.handleChangeWard}
                options={lstWardOption}
                className="Filter_select__18BMn custom-select css-2b097c-container flex-search"
                defaultValue={selectedWardId}
                placeholder={"Chọn Xã/Phường"}
              />
              <div className="Filter_group_filter__2RA9c">
                <div className="Filter_filter_sort__2Z7LW">
                  <span>Sắp xếp theo: </span>
                  <div className="Dropdown_wrapper__2OOf9 Filter_dropdown__1GvuX dropdown">
                    <div
                      aria-haspopup="true"
                      className=""
                      aria-expanded="false"
                    >
                      <div className="Filter_dropdown_toggle__3rcKE">
                        <span className="Filter_text__ngJ55">Mặc định</span>
                        <RiArrowDropDownLine
                          alt="dont have img"
                          className="Image_wrapper__18WCY Filter_icon_dropdown__1CSIC"
                          value={{ height: "50px", width: "50px" }}
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
                  console.log("check email >>>", item["Users.email"]);
                  if (item.status === 1 && item["Users.groupId"] === 5)
                    //trùng 5 có nghĩa là đối tác chủ phòng khám, tại trả về raw là true nên cần lấy thông tin của đối tác
                    return (
                      <CardClinic
                        key={`row-${index}`}
                        id={item.id}
                        nameVI={item.nameVI}
                        nameEN={item.nameEN}
                        addressVI={item.addressVI}
                        addressEN={item.addressEN}
                        img={item["Users.image"]}
                        email={item["Users.email"]}
                        phoneContact={item["Users.phone"]}
                        timework={item.timework}
                        nameProvince={lstProvince[item.provinceId]}
                        nameDistrict={lstDistrict[item.districtId]}
                        nameWard={lstWard[item.wardId]}
                      />
                    );
                })}
              </>
            ) : (
              <>
                <tr>
                  <td>Không có Bác sĩ nào</td>
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
