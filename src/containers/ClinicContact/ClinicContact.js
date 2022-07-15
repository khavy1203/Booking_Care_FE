//video 82
import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import "./ClinicContact.scss";
import HomeHeader from "../HomePage/HomeHeader";
import { toast } from "react-toastify";
import _ from 'lodash';
import { storage } from "../../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { registerClinic } from "../../services/partnerService";
import { push } from "connected-react-router";
import * as actions from "../../store/actions";
import { Redirect } from 'react-router'
class ClinicContact extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userData: {},
            lstWard: [],
            lstDistrict: [],
            lstProvince: [],
            selectedProvince: 0,
            selectedDistrict: 0,
            selectedWard: 0,

            clinicData: {},
            validInput: {},

            dataDefault: {
                name: "",
                address: "",
                phoneContact: "",
                emailUserOfClinicRegister: "",
            },
            validInputDefault: {
                name: true,
                phoneContact: true,
                address: true,
                province: true,
                district: true,
                ward: true,
                url: true
            },

            file: "", //để lấy file trong event
            url: "", //sau khi upload file lên firebase, firebase trả về url. Biến này để chứa url
            per: null, //tiến độ upload file lên firebase, per = 100 thì cho phép mở nút tạo/cập nhật user

        };
    }


    componentDidMount() {
        this.setState({ clinicData: this.state.dataDefault });
        this.setState({ validInput: this.state.validInputDefault });
        fetch('https://provinces.open-api.vn/api/', {
            method: 'GET', // or 'PUT'
        })
            .then(response => response.json())
            .then((actualData) => {
                this.setState({ lstProvince: actualData })
            })
            .catch((err) => {
                console.log(err.message);
            })
            .finally(() => {
                // setLoading(false);
            });
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language === prevProps.language) {
        }
        if (prevProps.isLoggedIn !== this.props.isLoggedIn) {
            console.log("check login trước và sau >>>", prevProps.isLoggedIn, this.props.isLoggedIn)
        }
        if (prevState.selectedProvince !== this.state.selectedProvince) {
            //xử lý cập nhật lại dữ liệu, fetch lại data cho huyện
            fetch('https://provinces.open-api.vn/api/d', {
                method: 'GET', // or 'PUT'
            })
                .then(response => response.json())
                .then((actualData) => {
                    console.log("check actual Data", actualData)
                    let lstDistrictOfProvince = actualData.filter((item) =>
                        item.province_code === +this.state.selectedProvince
                    )
                    this.setState({ lstDistrict: lstDistrictOfProvince })
                })
                .catch((err) => {
                    console.log(err.message);
                })
                .finally(() => {
                    // setLoading(false);
                });
        }
        if (prevState.selectedDistrict !== this.state.selectedDistrict) {
            //xử lý cập nhật lại dữ liệu, fetch lại data cho huyện
            fetch('https://provinces.open-api.vn/api/w', {
                method: 'GET', // or 'PUT'
            })
                .then(response => response.json())
                .then((actualData) => {
                    console.log("check actual Data", actualData)
                    let lstWardOfDistrict = actualData.filter((item) =>
                        item.district_code === +this.state.selectedDistrict
                    )
                    this.setState({ lstWard: lstWardOfDistrict })
                })
                .catch((err) => {
                    console.log(err.message);
                })
                .finally(() => {
                    // setLoading(false);
                });
        }

        if (prevState.file !== this.state.file) {
            if (this.state.file) {
                await this.uploadFile();
            }
        }
    }

    uploadFile = async () => {
        let { file } = this.state;
        const name = new Date().getTime() + file.name;
        const storageRef = ref(storage, name);

        const uploadTask = uploadBytesResumable(storageRef, file);

        // Register three observers:
        // 1. 'state_changed' observer, called any time the state changes
        // 2. Error observer, called on failure
        // 3. Completion observer, called on successful completion
        await uploadTask.on(
            "state_changed",
            async (snapshot) => {
                console.log(snapshot);
                // Observe state change events such as progress, pause, and resume
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log("Upload is " + progress + "% done");
                await this.setState({ per: progress });
                switch (snapshot.state) {
                    case "paused":
                        console.log("Upload is paused");
                        break;
                    case "running":
                        console.log("Upload is running");
                        break;
                    default:
                        break;
                }
            },
            (error) => {
                // Handle unsuccessful uploads
            },
            async () => {
                // Handle successful uploads on complete
                // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                await getDownloadURL(uploadTask.snapshot.ref).then(
                    async (downloadURL) => {
                        console.log("File available at", downloadURL);
                        await this.setState({ url: downloadURL });
                    }
                );
            }
        );
    };

    checkValidateInput = () => {
        // if (action === "UPDATE") return true;//update thi ko validation
        //create user
        this.setState({ validInput: this.state.validInputDefault });
        let array = ["name", "phoneContact", "address"];
        for (let i = 0; i < array.length; i++) {
            if (!this.state.clinicData[array[i]]) {
                //set lai gia tri input bang false khi gia tri trong
                let _validInput = _.cloneDeep(this.state.validInputDefault);
                _validInput[array[i]] = false;
                this.setState({ validInput: _validInput });
                return false;
            }
        }
        if (this.state.selectedProvince === 0) {
            let _validInput = _.cloneDeep(this.state.validInputDefault);
            _validInput['province'] = false;
            this.setState({ validInput: _validInput });
            return false;
        }
        if (this.state.selectedDistrict === 0) {
            let _validInput = _.cloneDeep(this.state.validInputDefault);
            _validInput['district'] = false;
            this.setState({ validInput: _validInput });
            return false;
        }
        if (this.state.selectedWard === 0) {
            let _validInput = _.cloneDeep(this.state.validInputDefault);
            _validInput['ward'] = false;
            this.setState({ validInput: _validInput });
            return false;
        }
        if (this.state.url === "" && this.state.per === null) {

            let _validInput = _.cloneDeep(this.state.validInputDefault);
            _validInput['url'] = false;
            this.setState({ validInput: _validInput });
            return false;
        }
        return true;
    };

    handleOnchangeProvince = (value) => {
        console.log("check value provinces >>>", value);
        this.setState({ selectedProvince: value });
    }

    handleOnchangeDistrict = (value) => {
        console.log("check value district >>>", value);
        this.setState({ selectedDistrict: value });
    }

    handleOnchangeWard = (value) => {
        console.log("check value ward >>>", value);
        this.setState({ selectedWard: value });
    }

    handleOnchangImage = (event) => {
        let data = event.target.files; //list các file
        let getFile = data[0];
        if (getFile) {
            this.setState({ file: getFile });
        }
    }
    handleOnchangeInput = (value, name) => {
        let _clinicData = _.cloneDeep(this.state.clinicData);
        _clinicData[name] = value;
        this.setState({ clinicData: _clinicData });
    };
    registerClinic = async () => {
        if (!this.props.isLoggedIn) {
            toast.warn("Bạn phải đăng nhập")
            const { navigate } = this.props;
            const redirectPath = "/login";
            navigate(`${redirectPath}`);
        }
        let check = this.checkValidateInput();
        if (check) {
            let _clinicData = _.cloneDeep(this.state.clinicData);
            _clinicData['province'] = this.state.selectedProvince;
            _clinicData['district'] = this.state.selectedDistrict;
            _clinicData['ward'] = this.state.selectedWard;
            _clinicData['url'] = this.state.url;
            console.log("check clinicData", _clinicData);
            let res = await registerClinic(_clinicData);
            console.log("check clinicData >>>", this.state.clinicData);
            console.log("check datadefault>>", this.state.dataDefault);
            if (res && res.EC === 0) {
                this.setState({
                    selectedProvince: 0,
                    selectedDistrict: 0,
                    selectedWard: 0,
                    per: null,
                    file: "",
                    url: "",
                    clinicData: this.state.dataDefault,
                })
                toast.success(res.EM)
            } else {
                toast.error(res.EM)
            }
        }

    }
    render() {
        let checklogin = this.props.isLoggedIn;
        console.log("checklogin nè >>>>", checklogin)
        // if (!checklogin) return <Redirect to='/login' />;
        // else {
        let { per, url } = this.state;
        return (
            <>
                <HomeHeader />
                <div className="contact-container container d-flex justify-content-center">
                    <div className="form-contact">
                        <div className="contact-title mt-4">Hợp tác cùng BookingCare</div>
                        <div className="contact-text mb-3">
                            Chúng tôi rất hân hạnh được hợp tác với bác sĩ và cơ sở y tế. Vui
                            lòng gửi thông tin, chúng tôi sẽ liên hệ lại trong thời gian sớm
                            nhất.
                        </div>
                        <div className="contact-input form-group col-6">
                            <label>Tên phòng khám </label>
                            <input
                                className={
                                    this.state.validInput.name
                                        ? "form-control"
                                        : "form-control is-invalid"
                                } placeholder="Bắt buộc"
                                value={this.state.clinicData.name}
                                onChange={(event) =>
                                    this.handleOnchangeInput(event.target.value, "name")
                                }
                            />
                        </div>

                        <div className="contact-input form-group col-6">
                            <label>Số điện thoại liên hệ (*)</label>
                            <input
                                className={
                                    this.state.validInput.phoneContact
                                        ? "form-control"
                                        : "form-control is-invalid"
                                }
                                value={this.state.clinicData.phoneContact}
                                placeholder="Bắt buộc"
                                onChange={(event) =>
                                    this.handleOnchangeInput(event.target.value, "phoneContact")
                                }
                            />
                        </div>
                        <div class="form-group col-4 address">
                            <label for="exampleFormControlSelect1">Tỉnh/Thành Phố</label>
                            <select
                                className={
                                    this.state.validInput.province
                                        ? "form-control"
                                        : "form-control is-invalid"
                                }
                                id="exampleFormControlSelect1"
                                onChange={(event) => this.handleOnchangeProvince(event.target.value)}
                            >
                                <option value="">Vui lòng chọn Tỉnh/Thành Phố</option>
                                {this.state.lstProvince.length > 0 && this.state.lstProvince.map((item, index) => {
                                    return (
                                        <option
                                            key={`province-${index}`}
                                            value={item.code}
                                        >{item.name}</option>
                                    )
                                })}
                            </select>
                        </div>
                        <div class="form-group col-4 address">
                            <label for="exampleFormControlSelect2">Quận/huyện</label>
                            <select
                                className={
                                    this.state.validInput.district
                                        ? "form-control"
                                        : "form-control is-invalid"
                                }
                                id="exampleFormControlSelect2"
                                onChange={(event) => this.handleOnchangeDistrict(event.target.value)}
                            >
                                <option value="">Vui lòng chọn Quận/huyện</option>
                                {this.state.lstDistrict.length > 0 && this.state.lstDistrict.map((item, index) => {
                                    return (
                                        <option
                                            key={`distric-${index}`}
                                            value={item.code}
                                        >{item.name}</option>
                                    )
                                })}
                            </select>
                        </div>
                        <div class="form-group col-4 address">
                            <label for="exampleFormControlSelect3">Xã/Phường</label>
                            <select
                                className={
                                    this.state.validInput.ward
                                        ? "form-control"
                                        : "form-control is-invalid"
                                }
                                id="exampleFormControlSelect3"
                                onChange={(event) => this.handleOnchangeWard(event.target.value)}
                            >
                                <option value="">Vui lòng chọn Xã/phường</option>
                                {this.state.lstWard.length > 0 && this.state.lstWard.map((item, index) => {
                                    return (
                                        <option
                                            key={`ward-${index}`}
                                            value={item.code}
                                        >{item.name}</option>
                                    )
                                })}
                            </select>
                        </div>
                        <div className="contact-input form-group">
                            <label>Địa chỉ cụ thể</label>
                            <input
                                className={
                                    this.state.validInput.address
                                        ? "form-control"
                                        : "form-control is-invalid"
                                }
                                value={this.state.clinicData.address}
                                placeholder="Bắt buộc"
                                onChange={(event) =>
                                    this.handleOnchangeInput(event.target.value, "address")
                                }
                            />
                        </div>

                        <div class="form-group col-6 file-img">
                            <label for="exampleFormControlFile4" className="noice-dowload">File nén đính kèm (hình ảnh giấy chứng nhận hoạt động của phòng khám và danh sách bác sĩ, chứng nhận bác sĩ)</label>
                            <input
                                className={
                                    this.state.validInput.url
                                        ? "form-control"
                                        : "form-control is-invalid"
                                }
                                type="file" class="form-control-file" id="exampleFormControlFile4"
                                onChange={(event) => {
                                    this.handleOnchangImage(event);
                                }}
                            />
                        </div>
                        <div class="form-group ">
                            <a href="/about-register-clinic" >
                                <label>Bạn chưa có giấy chứng nhận hoạt động phòng khám</label>
                            </a>
                        </div>


                        <div className="contact-input form-group">
                            <button className="btn btn-primary btn-save-schedule"
                                disabled={url === ""}
                                onClick={() => this.registerClinic()}
                            >
                                Đăng ký hợp tác
                            </button>
                        </div>
                    </div>
                </div>
            </>
        );
        // }

    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        navigate: (path) => dispatch(push(path)),
        userlogOut: () => dispatch(actions.userlogOut()),
        changeLanguageAppRedux: (language) => {
            dispatch(actions.changeLanguageApp(language));
        },
        userloginSuccess: (userInfo) =>
            dispatch(actions.userloginSuccess(userInfo)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ClinicContact);
