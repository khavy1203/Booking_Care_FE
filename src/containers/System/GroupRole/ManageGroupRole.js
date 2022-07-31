//video 90
import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import "./ManageGroupRole.scss";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import { CommonUtils } from "../../../utils";
import { fetchGroup } from '../../../services/userService';
import { fetchAllRole, fetchRolesByGroup, assignRolesToGroup } from '../../../services/roleService';
import _ from 'lodash';

import { toast } from "react-toastify";


const mdParser = new MarkdownIt(/* Markdown-it options */);

class ManageGroupRole extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userGroups: [],
            listRoles: [],
            selectGroup: "",
            assignRolesByGroup: []
        };
    }
    componentDidMount() {
        this.getGroups();
        this.getAllRoles();
    }
    getGroups = async () => {
        let res = await fetchGroup();
        if (res && res.EC === 0) {
            this.setState({ userGroups: res.DT });
        } else {
            toast.error(res.EM);
        }
    }
    getAllRoles = async () => {
        let data = await fetchAllRole();
        if (data && +data.EC === 0) {
            this.setState({ listRoles: data.DT });
        }
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language === prevProps.language) {
        }
    }
    buildDataRolesByGroup = (groupRoles, allRoles) => {
        let result = [];
        if (allRoles && allRoles.length > 0) {
            allRoles.map(role => {
                let object = {};
                object.url = role.url;
                object.id = role.id;
                object.description = role.description;
                object.isAssigned = false;
                if (groupRoles && groupRoles.length > 0) {//nếu group đó có các roles
                    object.isAssigned = groupRoles.some(item => item.url === object.url)//Nếu các vai trò trong nhóm tại thời điểm đó trùng với các vai trò thuộc sở hữu của nhóm, thì gán lại
                }
                result.push(object);
            })
        }
        return result;
    }
    handleOnchangeGroup = async (groupId) => {
        this.setState({ selectGroup: groupId });
        if (groupId) {
            let data = await fetchRolesByGroup(groupId);
            if (data && data.EC === 0) {
                let result = this.buildDataRolesByGroup(data.DT.Roles, this.state.listRoles);//truyền Roles nè
                this.setState({ assignRolesByGroup: result });
            }
        }
    }
    handleSelectRole = (value) => {
        const _assignRolesByGroup = _.cloneDeep(this.state.assignRolesByGroup);
        let foundIndex = _assignRolesByGroup.findIndex(item => +item.id === +value);//trả về vị trí tít trong mảng
        if (foundIndex > -1) {
            _assignRolesByGroup[foundIndex].isAssigned = !_assignRolesByGroup[foundIndex].isAssigned;

        }
        this.setState({ assignRolesByGroup: _assignRolesByGroup });
    }

    buildDataToSave = () => {
        let result = {};
        const _assignRolesByGroup = _.cloneDeep(this.state.assignRolesByGroup);
        result.groupId = this.state.selectGroup;
        let groupRoleFilter = _assignRolesByGroup.filter(item => item.isAssigned === true);//lọc hết tất cả role được chọn
        let finalGroupRoles = groupRoleFilter.map(item => {
            let data = {
                groupId: +this.state.selectGroup, roleId: +item.id
            };
            return data;//data gồm group id và roleId
        });
        result.groupRoles = finalGroupRoles;
        return result;
    }
    handleSave = async () => {
        let data = this.buildDataToSave();
        let res = await assignRolesToGroup(data);
        if (res && res.EC === 0) {
            toast.success(res.EM)
        }
        else {
            toast.error(res.EM)
        }
    }
    render() {
        console.log("check this.state.userGroups", this.state.userGroups)
        return (
            <div className="group-role-container">
                <div className="container">
                    <div className="container mt-3">
                        <h4>Group Roles : </h4>
                        <div className="assign-group-role">
                            <div className="col-12 col-sm-6 form-group">
                                <label>Select Group: (<span className="red"> * </span>)</label>
                                <select className="form-select"
                                    onChange={(event) => this.handleOnchangeGroup(event.target.value)}
                                >
                                    <option value="">Please select your group</option>
                                    {this.state.userGroups.length > 0 && this.state.userGroups.id !== 1 && this.state.userGroups.map((item, index) => {
                                        return (
                                            <option
                                                key={`group-${index}`}
                                                value={item.id}
                                            >{item.name}</option>
                                        )
                                    })}
                                </select>
                            </div>
                            <hr />
                            <div className="roles">
                                <h5>Assign Roles: </h5>
                            </div>
                            {this.state.selectGroup && this.state.assignRolesByGroup && this.state.assignRolesByGroup.length > 0
                                && this.state.assignRolesByGroup.map((item, index) => {
                                    return (
                                        <div className="form-check" key={`list-role-${index}`}>
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                value={item.id}
                                                id={`list-role-${index}`}
                                                checked={item.isAssigned}
                                                onChange={(event) => this.handleSelectRole(event.target.value)}
                                            />
                                            <label className="form-check-label" htmlFor={`list-role-${index}`}>
                                                {item.description}
                                            </label>
                                        </div>
                                    )
                                })
                            }
                            <div className="mt-3">
                                <button className="btn btn-warning" onClick={() => this.handleSave()}>Save</button>
                            </div>
                        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(ManageGroupRole);
