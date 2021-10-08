/*用户列表表单*/
import React, {Fragment, forwardRef, useState, useEffect} from 'react';
import {Form, Input, Select} from "antd";

const {Option} = Select;

const UserForm = forwardRef((props, ref) => {
    const [isDisabled, setisDisabled] = useState(false)
    useEffect(() => {
        setisDisabled(props.isUpdateDisabled)
    }, [props.isUpdateDisabled])
    console.log('更新', props.isUpdate)
    const {id: roleId, region, role: {roleType}} = JSON.parse(localStorage.getItem('token'))
    const roleObj = {
        '1': 'superadmin',
        '2': 'admin',
        '3': 'editor'
    }
    //判断区域选择是否被禁用的方法
    const checkRegionDisabled = value => {
        //当前操作为更新时
        if (props.isUpdate) {
            //为超级管理员
            if (roleObj[roleId] === 'superadmin') {
                //不禁用
                return false
            } else {
                return true
            }
        } else {
            //当前操作为添加时
            //为超级管理员
            if (roleObj[roleId] === 'superadmin') {
                //不禁用
                return false
            } else {
                return value !== region
            }
        }
    }
    //判断角色选择是否被禁用的方法
    const checkRoleDisabled = i => {
        //当前操作为更新时
        if (props.isUpdate) {
            //为超级管理员
            if (roleObj[roleId] === 'superadmin') {
                //不禁用
                return false
            } else {
                return true
            }
        } else {
            //当前操作为添加时
            //为超级管理员
            if (roleObj[roleId] === 'superadmin') {
                //不禁用
                return false
            } else {
                console.log(i)
                return i.roleType < roleType
            }
        }
    }
    return (
        <Fragment>
            <Form layout="vertical" ref={ref}>
                <Form.Item
                    name="username"
                    label="用户名"
                    rules={[{required: true, message: '请输入用户名'}]}>
                    <Input/>
                </Form.Item>
                <Form.Item
                    name="password"
                    label="密码"
                    rules={[{required: true, message: '请输入密码'}]}>
                    <Input/>
                </Form.Item>
                <Form.Item
                    name="region"
                    label="区域"
                    rules={isDisabled ? [] : [{required: true, message: '请选择区域'}]}>
                    <Select
                        placeholder="选择区域"
                        allowClear
                        disabled={isDisabled}
                    >
                        {
                            props.regionList.map(i => <Option
                                key={i.id}
                                disabled={checkRegionDisabled(i.value)}
                                value={i.value}>{i.title}</Option>)
                        }
                    </Select>
                </Form.Item>
                <Form.Item
                    name="roleId"
                    label="角色"
                    rules={[{required: true, message: '请选择角色'}]}>
                    <Select
                        placeholder="选择角色"
                        allowClear
                        onChange={(value) => {
                            if (value === 1) {
                                //禁用区域选择,清空选择框内容
                                setisDisabled(true)
                                console.log(ref)
                                ref.current.setFieldsValue({
                                    region: ''
                                })
                            } else {
                                setisDisabled(false)
                            }
                        }}
                    >
                        {
                            props.roleList.map(i => <Option
                                disabled={checkRoleDisabled(i)}
                                key={i.id}
                                value={i.roleType}>{i.roleName}</Option>)
                        }
                    </Select>
                </Form.Item>
            </Form>
        </Fragment>
    );
})
export default UserForm
