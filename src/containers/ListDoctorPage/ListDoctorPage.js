import React, { Component } from "react";
// import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import HomeHeader from "../HomePage/HomeHeader";

import HomeFooter from "../HomePage/HomeFooter";
import "./ListDoctorPage.scss";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import * as actions from "../../store/actions";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";
import ReactHtmlParser from "react-html-parser";
import { RiArrowDropDownLine } from "react-icons/ri";
import {
  FcOvertime,
  FcVoicemail,
  FcTabletAndroid,
  FcShare,
} from "react-icons/fc";
import { HiOutlineEye } from "react-icons/hi";
import CardDoctor from "./CardDoctor";
import { fetchDoctorOfCLinic } from "../../services/clinicService";
class ListDoctorPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: {},
      currentPage: 1,
      currentLimit: 7,
      totalPage: 0, //phân trang

      inforClinic: {},
      listDoctor: [],
      currentClinicId: "",
    };
  }

  componentDidMount() {
    this.fetchProvince();
    this.fetchDistrict();
    this.fetchWard();
    if (
      this.props.match &&
      this.props.match.params &&
      this.props.match.params.id
    ) {
      let id = this.props.match.params.id;

      this.setState({
        currentClinicId: id,
      });
    }
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.currentPage !== this.state.currentPage) {
      this.fetchDoctorOfCLinic();
    }
    if (prevState.currentClinicId !== this.state.currentClinicId) {
      this.fetchDoctorOfCLinic();
    }
  }
  handlePageClick = async (event) => {
    this.setState({ currentPage: event.selected + 1 }); // lỗi bất đồng bộ, cách fix thêm chỉ số vào fetchUser
    await this.fetchDoctorOfCLinic();
  };
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
  fetchDistrict = () => {
    fetch("https://provinces.open-api.vn/api/d", {
      method: "GET", // or 'PUT'
    })
      .then((response) => response.json())
      .then((actualData) => {
        this.setState({
          lstDistrict: this.coverAPIAddressToList(actualData),
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
        this.setState({
          lstWard: this.coverAPIAddressToList(actualData),
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
  fetchDoctorOfCLinic = async () => {
    let res = await fetchDoctorOfCLinic(
      this.state.currentClinicId,
      this.state.currentPage,
      this.state.currentLimit
    );
    if (res && +res.EC === 0) {
      this.setState({
        listDoctor: res.DT.doctors,
        totalPage: res.DT.totalPages,
        inforClinic: res.DT.clinic,
        lstSpecialOfClinic: res.DT.lstSpecialOfClinic,
      });
    } else {
      toast.error(res.EM);
    }
  };

  render() {
    console.log(
      "check lst clinic, Totalpage >>",
      this.state.listDoctor,
      this.state.totalPage
    );
    console.log("check id >>", this.state.currentClinicId);
    console.log("check lst dop>>", this.state.currentClinicId);
    console.log("check infor clinic >>>", this.state.inforClinic);
    let inforClinic = this.state.inforClinic;
    console.log("check lst province >>>", this.state.lstProvince);

    let { lstProvince, lstDistrict, lstWard } = this.state;

    return (
      <div>
        <HomeHeader isShowBanner={false} />
        <div className="Page_wrapper__2FpUM ClinicDetail_wrapper__yqiMu Page_desktop__21nvB">
          <div className="Container_container__uCFWk Container_desktop__35haU">
            <div>
              <div className="Breadcrumb_breadcrumb__3KVL4 ClinicDetail_breadcrumb__RTrk-">
                <div className="Breadcrumb_route_item__OzVt_">
                  <a
                    href="/"
                    className="Breadcrumb_route_name__UUKHm"
                    draggable="false"
                  >
                    <span>Trang chủ</span>
                  </a>
                </div>

                <div className="Breadcrumb_route_item__OzVt_ ClinicDetail_route_item__1wo5U">
                  <svg
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="fas"
                    data-icon="angle-right"
                    className="svg-inline--fa fa-angle-right fa-w-8 Breadcrumb_icon__2pwXa"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 256 512"
                    width={16}
                    height={16}
                  >
                    <path
                      fill="currentColor"
                      d="M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34z"
                    />
                  </svg>
                  <a
                    href="/clinic-page"
                    className="Breadcrumb_route_name__UUKHm"
                    draggable="false"
                  >
                    <span className="">Phòng khám</span>
                  </a>
                </div>
                <div className="Breadcrumb_route_item__OzVt_ ClinicDetail_route_item__1wo5U">
                  <svg
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="fas"
                    data-icon="angle-right"
                    className="svg-inline--fa fa-angle-right fa-w-8 Breadcrumb_icon__2pwXa"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 256 512"
                    width={16}
                    height={16}
                  >
                    <path
                      fill="currentColor"
                      d="M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34z"
                    />
                  </svg>
                  <a
                    href="/bai-viet/danh-muc/"
                    className="Breadcrumb_route_name__UUKHm"
                    draggable="false"
                  >
                    <span className="">Chi tiết phòng khám</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="ClinicDetail_body__3T77W">
            <div className="Container_container__uCFWk Container_desktop__35haU ClinicDetail_wrapper_clinic__3q2lu">
              <div className="ClinicDetail_left_content__1AP51">
                <div className="ClinicDetail_summary__5X3zu">
                  <div className="ClinicDetail_top__2WebE">
                    <img
                      width={150}
                      height={110}
                      alt="dont has img"
                      src={inforClinic["Users.image"]}
                      className="Image_wrapper__18WCY ClinicDetail_icon_banner__3O1YZ"
                    />
                    <div className="ClinicDetail_group_title__3lTIP">
                      <div className="ClinicDetail_title__1cHWX">
                        {inforClinic.nameVI}
                      </div>
                      <div className="ClinicDetail_address__3iTvZ">
                        {inforClinic &&
                          lstProvince &&
                          lstDistrict &&
                          lstWard &&
                          `${inforClinic.addressVI} - ${
                            lstWard[inforClinic.wardId]
                          } - ${lstDistrict[inforClinic.districtId]} -  ${
                            lstProvince[inforClinic.provinceId]
                          }`}
                      </div>
                    </div>
                  </div>
                  <div className="ClinicDetail_bottom__1ocVm">
                    <div className="ClinicDetail_list_item__3Xig4">
                      <div className="ClinicDetail_content__2xZpZ">
                        <FcTabletAndroid
                          className="Image_wrapper__18WCY"
                          value={{
                            height: "16px",
                            width: "15px",
                            marginRight: "10px",
                          }}
                        />
                        Điện thoại:
                      </div>
                      <div className="ClinicDetail_hight_light__3Ul_-">
                        {inforClinic.phoneContact}
                      </div>
                    </div>
                    <div className="ClinicDetail_list_item__3Xig4">
                      <div className="ClinicDetail_content__2xZpZ">
                        <FcVoicemail
                          className="Image_wrapper__18WCY"
                          value={{ height: "16px", width: "15px" }}
                        />
                        Email:
                      </div>
                      <div className="ClinicDetail_hight_light__3Ul_-">
                        {inforClinic["Users.email"]}
                      </div>
                    </div>
                    <div className="ClinicDetail_list_item__3Xig4">
                      <div className="ClinicDetail_content__2xZpZ">
                        <FcOvertime
                          className="Image_wrapper__18WCY"
                          value={{ height: "16px", width: "15px" }}
                        />
                        Giờ làm việc:
                      </div>
                      <div className="ClinicDetail_text__3G2ed">
                        {inforClinic.timework
                          ? inforClinic.timework
                          : `Từ thứ hai đến thứ bảy: từ 04h00 đến 19h00. Chủ nhật: từ 04h00
                                                đến 12h00.`}
                      </div>
                    </div>
                    <div className="ClinicDetail_button__1nh2h">
                      <a
                        target="_blank"
                        rel="noreferrer"
                        href="https://www.facebook.com/sharer/sharer.php?u=https://edoctor.io/tra-cuu/phong-kham/trung-tam-y-khoa-medic-hoa-hao"
                        className="ClinicDetail_share__2FMDu"
                        draggable="false"
                      >
                        <FcShare />
                        <span>Chia sẻ</span>
                      </a>
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://www.google.com/maps/search/?api=1&query=10.7626961,106.6702624"
                        className="ClinicDetail_btn_map__31O28"
                        draggable="false"
                      >
                        <HiOutlineEye />
                        Xem bản đồ
                      </a>
                    </div>
                  </div>
                </div>
                <div className="ClinicDetail_about__1eNPD">
                  <div className="ClinicDetail_title__1cHWX">Giới thiệu</div>
                  <div className="ClinicDetail_description__3kqmn">
                    {ReactHtmlParser(inforClinic.descriptionHTML_VI)}
                  </div>
                </div>
              </div>
              <div className="ClinicDetail_right_content__L_34K">
                <div className="Feedback_Feedback__17vAI ClinicDetail_block_item__3B88u ">
                  <img src={inforClinic.image} className="img-clinic" alt="" />
                </div>
                <form className="Feedback_Feedback__17vAI ClinicDetail_block_item__3B88u">
                  <div className="Feedback_text__2XSC4 mb-3 description-clinic">
                    <h2>Phòng Khám điều trị các chuyên khoa</h2>
                    {this.state.lstSpecialOfClinic &&
                    this.state.lstSpecialOfClinic.length > 0 ? (
                      <>
                        {this.state.lstSpecialOfClinic.map((item, index) => {
                          if (+item.userCount > 0)
                            return (
                              <>
                                <h3>{item.nameVI}</h3>
                                <div>
                                  {ReactHtmlParser(item.descriptionHTML_VI)}
                                </div>
                              </>
                            );
                        })}
                      </>
                    ) : (
                      ""
                    )}
                  </div>
                  {this.state.listDoctor && this.state.listDoctor.length > 0 ? (
                    <>
                      {this.state.listDoctor.map((item, index) => {
                        console.log("check email >>>", item["Users.email"]);
                        if (item.groupId === 2)
                          //trùng 5 có nghĩa là đối tác chủ phòng khám, tại trả về raw là true nên cần lấy thông tin của đối tác
                          return (
                            <CardDoctor
                              key={`row-${index}`}
                              id={item.id}
                              username={item.username}
                              phone={item.phone}
                              image={item.image}
                              namespecial={item["Specialty.nameVI"]}
                              email={item.email}
                              phoneContact={item.phone}
                              iconSpecial={item["Specialty.image"]}
                              degree_VI={item["Doctorinfo.degree_VI"]}
                              degree_EN={item["Doctorinfo.degree_EN"]}
                              price={item["Doctorinfo.price"]}
                              lstProvince={lstProvince}
                              lstDistrict={lstDistrict}
                              lstWard={lstWard}
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

                  {/* fix lai */}

                  <div className="footer-doctor">
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
                  <div className="Feedback_title__2EBgw mt-5">
                    Đóng góp ý kiến về phòng khám
                  </div>
                  <div className="Feedback_sub_title__2FcoY">
                    Ý kiến đóng góp của bạn giúp chúng tôi cải thiện và nâng cao
                    chất lượng dịch vụ tốt hơn!
                  </div>
                  <div>
                    <div className="react-rater">
                      <div>
                        <div className="react-rater-star ">★</div>
                      </div>
                      <div>
                        <div className="react-rater-star ">★</div>
                      </div>
                      <div>
                        <div className="react-rater-star ">★</div>
                      </div>
                      <div>
                        <div className="react-rater-star ">★</div>
                      </div>
                      <div>
                        <div className="react-rater-star ">★</div>
                      </div>
                    </div>
                  </div>
                  <textarea
                    placeholder="Nhập nội dung đánh giá"
                    className="Feedback_text__2XSC4"
                    rows={4}
                    defaultValue={""}
                  />
                  <div className="Feedback_button__1gtfE">
                    <button
                      type="submit"
                      className="Feedback_btn_button__194m-"
                    >
                      Gửi
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(ListDoctorPage);
