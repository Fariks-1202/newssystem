import React, {Fragment, useState, useEffect, useRef} from 'react';
import axios from 'axios'
import {Table, Space, Button, Modal, message, Popover, Switch} from 'antd'
import {
    EditOutlined,
    DeleteOutlined,
    ExclamationCircleOutlined
} from '@ant-design/icons';
import UserForm from "../../../components/user-manage/UserForm";

function UserList(props) {
    const [dataSource, setDataSource] = useState([])
    const [isAddUserModalVisible, setIsAddUserModalVisible] = useState(false)
    const [isUpdateUserModalVisible, setIsUpdateUserModalVisible] = useState(false)
    const [isUpdateDisabled, setisUpdateDisabled] = useState(false)
    const [roleList, setRoleList] = useState([])
    const [regionList, setRegionList] = useState([])
    const [currentItem, setcurrentItem] = useState([])
    const addRef = useRef([])
    const updateRef = useRef([])
    const {id:roleId,region,username} = JSON.parse(localStorage.getItem('token'))
    useEffect(() => {
        const roleObj = {
            '1':'superadmin',
            '2':'admin',
            '3':'editor'
        }
        axios.get('http://localhost:5000/users?_expand=role').then(res => {
            const data = res.data
            console.log(data)
            //过滤用户列表数据
            setDataSource(roleObj[roleId]==='superadmin'?data:[
                ...data.filter(item=>item.username===username),
                ...data.filter(item=>item.region===region&&item.roleId===3)
            ])
        })
    }, [roleId,region,username])
    useEffect(() => {
        axios.get('http://localhost:5000/roles').then(res => {
            setRoleList(res.data)
        })
    }, [])
    useEffect(() => {
        axios.get('http://localhost:5000/regions').then(res => {
            setRegionList(res.data)
        })
    }, [])

    // 定义删除的方法
    const deleteMethod = item => {
        Modal.confirm({
            title: '是否确认删除',
            icon: <ExclamationCircleOutlined/>,
            okText: '确认',
            cancelText: '取消',
            onOk: () => {
                // console.log(item)
                // 删除：当前页面数据删除 + 后端数据删除
                setDataSource(() => dataSource.filter(i => i.id !== item.id))
                axios.delete(`http://localhost:5000/users/${item.id}`).then(res => {
                        console.log(res)
                        if (res.status === 200) {
                            return message.success('删除成功')
                        }
                    }
                ).catch(err => message.error('删除失败'))
            }
        })
    }
    //更新的方法
    const updateMethod = item => {
        console.log(item)
        setcurrentItem(item)
        setTimeout(() => {
            // 将下列代码变成同步执行
            setIsUpdateUserModalVisible(true)
            if (item.id === 1) {
                //禁用选择框
                setisUpdateDisabled(true)
            } else {
                //取消禁用选择框
                setisUpdateDisabled(false)
            }
            // console.log(updateRef.current)
            updateRef.current.setFieldsValue(item)
        }, 0)
    }
    const onChange = i => {
        i.roleState = !i.roleState
        setDataSource([...dataSource])
        axios.patch(`http://localhost:5000/users/${i.id}`, {
            roleState: i.roleState
        }).then(
            message.success('修改成功')
        )
    }
    const handleAddUserOk = () => {
        console.log(addRef)
        //表单校验
        addRef.current.validateFields().then(value => {
            // console.log(value)
            // value['roleId'] = value['role']
            // delete value['role']
            //先通过post请求更新数据，然后再更新页面数据，这样方便后续的删除和更新操作
            axios.post(`http://localhost:5000/users`, {
                ...value,
                "roleState": true,
                "default": false
            }).then(res => {
                console.log(res.data)
                //清空表单
                addRef.current.resetFields()
                //关闭模态框
                setIsAddUserModalVisible(false)
                //更新页面数据
                setDataSource([...dataSource, {
                    ...res.data,
                    role: roleList.filter(i => i.id === res.data.roleId)[0]
                }])
                message.success('添加成功')
            })
        }, err => {
            message.success(`${err}添加失败，请重试`)
        })
    }
    const handleUpdateUserOk = () => {
        // console.log(currentItem)
        //表单校验
        updateRef.current.validateFields().then(value => {
            // console.log(value)
            // 页面更新
            setDataSource(
                dataSource.map(i => {
                    if (i.id === currentItem.id) {
                        return {
                            ...i,
                            ...value,
                            role: roleList.filter(item => item.id === value.roleId)[0]
                        }
                    }
                    return i
                }))
            //后台更新
            axios.patch(`http://localhost:5000/users/${currentItem.id}`, value).then(res => {
                console.log(res)
            }).catch(err => {
                console.log(err)
            })
            setIsUpdateUserModalVisible(false)
        }, err => {
            message.success(`${err}添加失败，请重试`)
        })
    }
    const columns = [
        {
            title: '区域',
            dataIndex: 'region',
            width: '15%',
            filters: [
                {
                    text: '全球',
                    value: ''
                },
                ...regionList.map(item => ({
                    text: item.title,
                    value: item.value
                }))
            ],
            onFilter: (value, record) => record.region === value,
            render: region => <b>{region === '' ? '全球' : region}</b>
        },
        {
            title: '角色名称',
            dataIndex: 'role',
            width: '25%',
            render: role => role?.roleName
        },
        {
            title: '用户名',
            dataIndex: 'username',
            width: '20%'
        },
        {
            title: '用户状态',
            width: '20%',
            dataIndex: 'roleState',
            sorter: (a, b) => a.roleState - b.roleState,
            render: (roleState, item) => (<Switch checked={roleState}
                                                  onChange={() => onChange(item)}
                                                  disabled={item.default}>
            </Switch>)
        },
        {
            title: '操作',
            width: '20%',
            render: (item) => (
                <Space size="middle">
                    <Popover content={<Switch
                        style={{marginLeft: '10px'}}
                        checked={item.pagepermisson === 1}
                    />}
                             title="页面配置项"
                             trigger={item.pagepermisson === undefined ? '' : 'click'}
                             overlayStyle={{width: '100px'}}>
                        <Button shape="circle"
                                icon={<EditOutlined/>}
                                onClick={() => {
                                    updateMethod(item)
                                }}
                                type="primary"
                        />
                    </Popover>
                    <Button shape="circle"
                            disabled={item.default}
                            onClick={() => deleteMethod(item)}
                            icon={<DeleteOutlined/>} danger/>
                </Space>
            ),
        }
    ]
    return (
        <Fragment>
            <Button type='primary'
                    onClick={() => {
                        setIsAddUserModalVisible(true)
                    }}
                    style={{marginBottom: '13px'}}>添加用户</Button>
            <Modal title="添加用户" visible={isAddUserModalVisible}
                   onOk={handleAddUserOk}
                   onCancel={() => {
                       setIsAddUserModalVisible(false)
                   }}>
                <UserForm ref={addRef} roleList={roleList}
                          isUpdate={false}
                          regionList={regionList}/>
            </Modal>
            <Modal title="更新用户"
                   visible={isUpdateUserModalVisible}
                   onOk={handleUpdateUserOk}
                   onCancel={() => {
                       setIsUpdateUserModalVisible(false)
                   }}>
                <UserForm ref={updateRef}
                          isUpdate={true}
                          isUpdateDisabled={isUpdateDisabled}
                          roleList={roleList}
                          regionList={regionList}/>
            </Modal>
            <Table dataSource={dataSource}
                   columns={columns}
                   rowKey={i => i.id}
                   pagination={{position: ['bottomCenter'], pageSize: 5}}
            />
        </Fragment>
    );
}

export default UserList;
