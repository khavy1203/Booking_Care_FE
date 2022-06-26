import React, { Component } from "react";
// import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import "./TableManageUser.scss";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
// import style manually
import "react-markdown-editor-lite/lib/index.css";

// Initialize a markdown parser
const mdParser = new MarkdownIt(/* Markdown-it options */);

// Finish!
function handleEditorChange({ html, text }) {
  console.log("handleEditorChange", html, text);
}

class TableManageUser extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    // let arrUsers = this.state.arrUsers;
    return (
      <React.Fragment>
        <table id="TableManageUser">
          <thead>
            <tr>
              <th>Email</th>
              <th>First name</th>
              <th>Last name</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>testman@gmail.com</td>
              <td>Testman</td>
              <td>One</td>
              <td>Testland</td>
              <td>
                <button
                  className="btn-edit"
                  onClick={() => {
                    this.handleEditUser();
                  }}
                >
                  <i className="fas fa-pencil-alt"></i>
                </button>
                <button
                  className="btn-delete"
                  onClick={() => {
                    this.handleDeleteUser();
                  }}
                >
                  <i className="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <MdEditor
          style={{ height: "500px" }}
          renderHTML={(text) => mdParser.render(text)}
          onChange={handleEditorChange}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(TableManageUser);
