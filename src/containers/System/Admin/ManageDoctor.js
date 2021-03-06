import React, { Component } from "react";
// import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import "./ManageDoctor.scss";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
// import style manually
import "react-markdown-editor-lite/lib/index.css";
import Select from "react-select";
import { FormattedMessage } from "react-intl";

const options = [
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" },
];
// Initialize a markdown parser
const mdParser = new MarkdownIt(/* Markdown-it options */);

class ManageDoctor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDoctor: "",
      selectedSpecialties: [],
      contentMarkdown_VI: "",
      contentHMTL_VI: "",
      description: "",
      listDoctors: [],
      hasOldData: false,

      contentHMTL_EN: "",
      contentMarkdown_EN: "",

      //save to doctor_info table
      listPrice: [],
      listPayment: [],
      listProvince: [],
      selectedPrice: [],
      seletedPayment: [],
      seletedProvince: [],
      nameClinic: "",
      addressClinic: "",
      note: "",
    };
  }
  // Finish!
  handleEditorChange = ({ html, text }) => {
    this.setState({
      contentMarkdown: text,
      contentHMTL: html,
    });
  };

  handleSaveContentmarkdown = () => {
    console.log("check state", this.state);
  };

  handleChangeSelect = (selectedOption) => {
    this.setState({ selectedOption }, () =>
      console.log(`Option selected:`, this.state.selectedOption)
    );
  };

  handleOnchangeDesc = (event) => {
    this.setState({ description: event.target.value });
  };
  render() {
    // let arrUsers = this.state.arrUsers;
    return (
      <div className="manage-doctor-container">
        <div className="manage-doctor-title">
          <FormattedMessage id="admin.manage-doctor.title" />
        </div>
        <div className="more-info">
          <div className="info-top row">
            <div className="choose-doctor col-4 form-group">
              <label>
                <FormattedMessage id="admin.manage-doctor.select-doctor" />
              </label>
              <Select
                value={this.state.selectedOption}
                onChange={this.handleChangeSelect}
                options={options}
              />
            </div>
            <div className="choose-doctor-specialty col-4 form-group">
              <label>
                <FormattedMessage id={"admin.manage-doctor.specialty"} />
              </label>
              <Select
                value={this.state.selectedOption}
                onChange={this.handleChangeSelect}
                options={options}
                placeholder={"Ch???n chuy??n khoa"}
              />
            </div>
            <div className="choose-doctor-clinic col-4 form-group">
              <label>
                <FormattedMessage id={"admin.manage-doctor.select-clinic"} />
              </label>
              <Select
                value={this.state.selectedOption}
                onChange={this.handleChangeSelect}
                options={options}
                placeholder={"Ch???n ph??ng kh??m"}
              />
            </div>
          </div>

          <div className="info-center">
            <div className="info-doctor row form-group">
              <div className="intro-doctor-vi col-6">
                <label>
                  {/* <FormattedMessage id="admin.manage-doctor.intro" /> */}
                  Th??ng tin gi???i thi???u (VI)
                </label>
                <textarea
                  className="form-control"
                  onChange={(event) => this.handleOnchangeDesc(event)}
                  value={this.state.description}
                >
                  adasdsa
                </textarea>
              </div>
              <div className="intro-doctor-en col-6">
                <label>
                  {/* <FormattedMessage id="admin.manage-doctor.intro" /> */}
                  Th??ng tin gi???i thi???u (EN)
                </label>
                <textarea
                  className="form-control"
                  onChange={(event) => this.handleOnchangeDesc(event)}
                  value={this.state.description}
                >
                  adasdsa
                </textarea>
              </div>
            </div>

            <div className="info-price">
              <div className="doctor-price row form-group">
                <div className="col-3">
                  <label>Gi?? kh??m</label>
                  <input className="form-control" />
                </div>
              </div>
              <div className="doctor-payment row form-group">
                <div className="doctor-payment-vi col-6">
                  <label>Ph????ng th???c thanh to??n (VI)</label>
                  <input className="form-control" />
                </div>
                <div className="doctor-payment-en col-6">
                  <label>Ph????ng th???c thanh to??n (EN)</label>
                  <input className="form-control" />
                </div>
              </div>
              <div className="doctor-note row form-group">
                <div className="doctor-note-vi col-6">
                  <label>Ghi ch?? (VI)</label>
                  <input className="form-control" />
                </div>
                <div className="doctor-note-en col-6">
                  <label>Ghi ch?? (EN)</label>
                  <input className="form-control" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="info-bottom">
          <div className="manage-doctor-editor-vi form-group">
            <label>M?? t??? b??c s?? (VI)</label>
            <MdEditor
              style={{ height: "500px" }}
              renderHTML={(text) => mdParser.render(text)}
              onChange={this.handleEditorChange}
            />
          </div>
          <div className="manage-doctor-editor-en form-group">
            <label>M?? t??? b??c s?? (EN)</label>
            <MdEditor
              style={{ height: "500px" }}
              renderHTML={(text) => mdParser.render(text)}
              onChange={this.handleEditorChange}
            />
          </div>
        </div>
        <button
          onClick={() => {
            this.handleSaveContentmarkdown();
          }}
          className={true ? "save-content-doctor" : "create-content-doctor"}
        >
          {true ? (
            <span>
              <FormattedMessage id="admin.manage-doctor.save" />
            </span>
          ) : (
            <span>
              <FormattedMessage id="admin.manage-doctor.add" />
            </span>
          )}
        </button>
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

export default connect(mapStateToProps, mapDispatchToProps)(ManageDoctor);
