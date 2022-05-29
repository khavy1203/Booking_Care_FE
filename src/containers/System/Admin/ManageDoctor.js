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
      //save to Mardown table
      contentMarkdown: "",
      contentHMTL: "",
      selectedOption: "",
      description: "",
      listDoctors: [],
      hasOldData: false,

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
          <div className="content-left form-group">
            <label>
              <FormattedMessage id="admin.manage-doctor.select-doctor" />
            </label>
            <Select
              value={this.state.selectedOption}
              onChange={this.handleChangeSelect}
              options={options}
            />
          </div>
          <div className="content-right">
            <label>
              <FormattedMessage id="admin.manage-doctor.intro" />
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
        <div className="more-info-extra row">
          <div className="col-4 form-group">
            <label>Chọn giá</label>
            {/* <input className="form-control" /> */}
            <Select
              value={this.state.selectedOption}
              onChange={this.handleChangeSelect}
              options={options}
              placeholder={"Chọn bác sĩ"}
            />
          </div>
          <div className="col-4 form-group">
            <label>Chọn phương thức thanh toán</label>
            <input className="form-control" />
          </div>
          <div className="col-4 form-group">
            <label>Chọn tỉnh thành</label>
            <input className="form-control" />
          </div>

          <div className="col-4 form-group">
            <label>Tên phòng khám</label>
            <input className="form-control" />
          </div>
          <div className="col-4 form-group">
            <label>Địa chỉ phòng khám</label>
            <input className="form-control" />
          </div>
          <div className="col-4 form-group">
            <label>Note</label>
            <input className="form-control" />
          </div>
        </div>
        <div className="manage-doctor-editor">
          <MdEditor
            style={{ height: "500px" }}
            renderHTML={(text) => mdParser.render(text)}
            onChange={this.handleEditorChange}
          />
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
