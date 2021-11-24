import React,{useState,useEffect} from 'react';
import axios from 'axios'
import {Button, message, Modal, Space, Table,Tree } from "antd";
import {DeleteOutlined, ExclamationCircleOutlined, UnorderedListOutlined} from "@ant-design/icons";


function RoleList(props) {
    const [dataSource,setDataSource] = useState([])
    const [rightsList,setRightList] = useState([])
    const [currentRights,setCurrentRights] = useState([])
    const [currentId,setCurrentId] = useState(0)
    const [isModalShow, setIsModalShow] = useState(false);
    useEffect(()=>{
        axios.get('/roles').then(res=>{
            setDataSource(res.data)
            }
        )
    },[])
    useEffect(()=>{
        axios.get('/rights?_embed=children').then(res=>{
            setRightList(res.data)
        })
    },[])
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            width: '20%',
        },
        {
            title: '角色名称',
            dataIndex: 'roleName',
            width: '30%',
        },
        {
            title: '操作',
            width: '20%',
            render: (item) => (
                <Space size="middle">
                    <Button shape="circle"
                            onClick={()=>{
                                setIsModalShow(true);
                                setCurrentRights(item.rights);
                                setCurrentId(item.id)
                            }}
                            icon={<UnorderedListOutlined /> }
                            type="primary"/>
                    <Modal title="权限分配"
                           onOk={handleOk}
                           onCancel={()=>{setIsModalShow(false)}}
                           visible={isModalShow}>
                        <Tree
                            checkable
                            checkStrictly
                            checkedKeys={currentRights}
                            onCheck={onCheck}
                            treeData={rightsList}
                        />
                    </Modal>
                    <Button shape="circle"
                            onClick={()=>deleteMethod(item)}
                            icon={<DeleteOutlined />} danger />
                </Space>
            ),
        },
    ]
    // 定义删除的方法
    const deleteMethod = (item) => {
        Modal.confirm({
            title: '是否确认删除',
            icon: <ExclamationCircleOutlined />,
            okText: '确认',
            cancelText: '取消',
            onOk:()=>{
                // console.log(item)
                // 删除：当前页面数据删除 + 后端数据删除
                setDataSource(()=> dataSource.filter(i=>i.id!==item.id))
                axios.delete(`/roles/${item.id}`).then(
                    message.success('删除成功')
                )
            }
        });
    }
    const onCheck = (checkedKeys) => {
        setCurrentRights(checkedKeys)
    };
    const handleOk = () => {
        // console.log(currentRights?.checked)
        // console.log(currentRightsId)
        setIsModalShow(false)
        setDataSource(dataSource.map(item=>{
            if (item.id===currentId){
                return {...item,rights:currentRights}
            }
            return item
        }))
        // patch更新
        axios.patch(`/roles/${currentId}`,{
            rights:currentRights
        }).then(()=>{
            message.success('更新成功')
        })
    }
    return (
        <Table dataSource={dataSource}
               columns={columns}
               rowKey={i=>i.id}
               pagination={false}
        />
    );
}

export default RoleList;
