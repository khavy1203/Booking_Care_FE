//video 90
import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import "./ManageSpecialty.scss";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import { CommonUtils } from "../../../utils";
import { createNewSpecialty } from "../../../services/specialtyService";
import { toast } from "react-toastify";

const mdParser = new MarkdownIt(/* Markdown-it options */);

class ManageSpecialty extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageBase64: "",

      nameVI: "",
      descriptionHTML_VI: "",
      descriptionMarkdown_VI: "",

      nameEN: "",
      descriptionHTML_EN: "",
      descriptionMarkdown_EN: "",
    };
  }
  componentDidMount() {}

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.language === prevProps.language) {
    }
  }

  handleOnchangeInput = (event, id) => {
    let stateCopy = { ...this.state };
    stateCopy[id] = event.target.value;
    this.setState({
      ...stateCopy,
    });
  };

  handleEditorChangeVI = ({ html, text }) => {
    this.setState({
      descriptionMarkdown_VI: text,
      descriptionHTML_VI: html,
    });
  };

  handleEditorChangeEN = ({ html, text }) => {
    this.setState({
      descriptionMarkdown_EN: text,
      descriptionHTML_EN: html,
    });
  };

  handleOnchangImage = async (event) => {
    let data = event.target.files; //list các file
    let file = data[0];
    if (file) {
      let base64 = await CommonUtils.getBase64(file);
      this.setState({
        imageBase64: base64,
      });
    }
  };

  handleSaveNewSpecialty = async () => {
    try {
      let res = await createNewSpecialty(this.state);
      if (res && res.errCode === 0) {
        toast.success("add new specialty succeeds!!!");
      } else {
        toast.error("Something wrongs...");
        console.log("Specialty, check result", res);
      }
    } catch (error) {
      console.log(error);
    }
    console.log("checkstate specialty", this.state);
  };

  render() {
    return (
      <div className="manage-specialty-container">
        <div className="ms-title">Quản lý chuyên khoa</div>
        <div className="add-new-specialty row">
          <div className="col-4 form-group">
            <label>Tên chuyên khoa (VI)</label>
            <input
              className="form-control"
              type="text"
              value={this.state.name}
              onChange={(event) => {
                this.handleOnchangeInput(event, "nameVI");
              }}
            />
          </div>
          <div className="col-4 form-group">
            <label>Tên chuyên khoa (EN)</label>
            <input
              className="form-control"
              type="text"
              value={this.state.name}
              onChange={(event) => {
                this.handleOnchangeInput(event, "nameEN");
              }}
            />
          </div>
          <div className="col-4 form-group">
            <label>Ảnh chuyên khoa</label>
            <input
              className="form-control-file"
              type="file"
              onChange={(event) => {
                this.handleOnchangImage(event);
              }}
            />
          </div>
          <div className="col-12 form-group">
            <label>Mô tả (VI)</label>
            <MdEditor
              style={{ height: "300px" }}
              renderHTML={(text) => mdParser.render(text)}
              onChange={this.handleEditorChangeVI}
              value={this.state.descriptionMarkdown_VI}
            />
          </div>
          <div className="col-12 form-group">
            <label>Mô tả (EN)</label>
            <MdEditor
              style={{ height: "300px" }}
              renderHTML={(text) => mdParser.render(text)}
              onChange={this.handleEditorChangeEN}
              value={this.state.descriptionMarkdown_EN}
            />
          </div>
          <div className="col-12">
            <button
              className="btn-save-specialty"
              onClick={() => {
                this.handleSaveNewSpecialty();
              }}
            >
              Save
            </button>
          </div>
        </div>
      </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(ManageSpecialty);
