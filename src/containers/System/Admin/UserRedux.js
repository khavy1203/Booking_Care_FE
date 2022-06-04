import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import "./UserRedux.scss";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css"; // This only needs to be imported once in your app
import TableManageUser from "./TableManageUser";
import { CommonUtils } from "../../../utils";

class UserRedux extends Component {
  constructor(props) {
    super(props);
    this.state = {
      previewImgURL: "",
      isOpen: false,
      avatar: "",
    };
  }
  componentDidMount() {}

  //
  handleOnchangImage = async (event) => {
    let data = event.target.files; //list các file
    let file = data[0];
    if (file) {
      let base64 = await CommonUtils.getBase64(file);
      let objectUrl = URL.createObjectURL(file); //tạo url để xem ảnh
      this.setState({
        previewImgURL: objectUrl,
        avatar: base64,
      });
    }
  };

  openPreviewImage = () => {
    if (!this.state.previewImgURL) return;
    this.setState({
      isOpen: true,
    });
  };
  render() {
    return (
      <div className="user-redux-container">
        <div className="title"> User Redux</div>
        <div className="user-redux-body">
          <div className="container">
            <div className="row">
              <div className="col-12 my-3">
                <FormattedMessage id={"manage-user.add"} />
              </div>
              <div className="col-3">
                <label>
                  <FormattedMessage id={"manage-user.email"} />
                </label>
                <input className="form-control" type="email" placeholder=" " />
              </div>
              <div className="col-3">
                <label>
                  <FormattedMessage id={"manage-user.password"} />
                </label>
                <input
                  className="form-control"
                  type="password"
                  placeholder=""
                />
              </div>
              <div className="col-3">
                <label>
                  <FormattedMessage id={"manage-user.first-name"} />
                </label>
                <input className="form-control" type="text" placeholder="" />
              </div>
              <div className="col-3">
                <label>
                  <FormattedMessage id={"manage-user.last-name"} />
                </label>
                <input className="form-control" type="text" placeholder="" />
              </div>
              <div className="col-3">
                <label>
                  <FormattedMessage id={"manage-user.phone-number"} />
                </label>
                <input className="form-control" type="text" placeholder="" />
              </div>
              <div className="col-9">
                <label>
                  <FormattedMessage id={"manage-user.address"} />
                </label>
                <input className="form-control" type="text" placeholder="" />
              </div>
              <div className="col-3">
                <label>
                  <FormattedMessage id={"manage-user.gender"} />
                </label>
                <select className="form-control">
                  <option selected>Choose...</option>
                  <option>...</option>
                </select>
              </div>
              <div className="col-3">
                <label>
                  <FormattedMessage id={"manage-user.position"} />
                </label>
                <select className="form-control">
                  <option selected>Choose...</option>
                  <option>...</option>
                </select>
              </div>
              <div className="col-3">
                <label>
                  <FormattedMessage id={"manage-user.role"} />
                </label>
                <select className="form-control">
                  <option selected>Choose...</option>
                  <option>...</option>
                </select>
              </div>
              <div className="col-3">
                <label>
                  <FormattedMessage id={"manage-user.image"} />
                </label>
                <div className="preview-img-container">
                  <input
                    id="previewImg"
                    type="file"
                    hidden
                    onChange={(event) => {
                      this.handleOnchangImage(event);
                    }}
                  />
                  <label className="label-upload" htmlFor="previewImg">
                    Tải ảnh <i className="fas fa-upload"></i>
                  </label>
                  <div
                    className="preview-image"
                    style={{
                      backgroundImage: `url(${this.state.previewImgURL})`,
                    }}
                    onClick={() => {
                      this.openPreviewImage();
                    }}
                  ></div>
                </div>
              </div>
              <div className="col-12 my-3">
                <button className="btn btn-primary">
                  <FormattedMessage id={"manage-user.save"} />
                </button>
              </div>
              <div className="col-12">
                <TableManageUser />
              </div>
            </div>
          </div>
        </div>

        {this.state.isOpen === true && (
          <Lightbox
            mainSrc={this.state.previewImgURL}
            onCloseRequest={() => this.setState({ isOpen: false })}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(UserRedux);
