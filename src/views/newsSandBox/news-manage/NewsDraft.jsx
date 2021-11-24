import React, {useState,useEffect} from 'react';
import axios from 'axios'
import {Button, message, Modal, notification, Space, Table, Tree} from "antd";
import {DeleteOutlined, ExclamationCircleOutlined, EditOutlined,ToTopOutlined } from "@ant-design/icons";

function NewsDraft(props) {
    const user = JSON.parse(localStorage.getItem('token'))
    let [dataSource,setDataSource] = useState([])
    const [isModalShow, setIsModalShow] = useState(false);
    useEffect(() => {
        axios.get(`/news?author=${user.username}&auditState=0`).then(res => {
            console.log(res)
            setDataSource(res.data)
        })
    }, [])
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            width: '20%',
        },
        {
            title: '新闻标题',
            dataIndex: 'title',
            width: '30%',
            render:(title,item)=>(<a href={`/#/news-manage/preview/${item.id}`}>{title}</a>)
        },
        {
            title: '作者',
            dataIndex: 'author',
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
                            }}
                            icon={<EditOutlined /> }
                            type="primary"/>
                    <Button shape="circle"
                            onClick={()=>deleteMethod(item)}
                            icon={<DeleteOutlined />} danger />
                    <Button shape="circle"
                            onClick={()=>submitMethod(item.id)}
                            icon={<ToTopOutlined />} dashed  />
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
                axios.delete(`/news/${item.id}`).then(
                    message.success('删除成功')
                )
            }
        });
    }
    //提交审核的方法
    const submitMethod = (id)=>{
        Modal.confirm({
            title: '是否提交审核',
            icon: <ExclamationCircleOutlined />,
            okText: '确认',
            cancelText: '取消',
            onOk:()=>{
                // console.log(item)
                // 删除：当前页面数据删除 + 后端数据删除
                setDataSource(()=> dataSource.filter(i=>i.id!==id))
                    axios.patch(`/news/${id}`,{
                        auditState:1
                    }).then(res=>{
                        console.log(res)
                        notification.info({
                            message: '通知',
                            description:
                                `你可以到审核列表查看`,
                            placement: 'bottomRight',
                        });
                        props.history.push('/audit-manage/list')
                    })
            }
        });
    }
    return (
        <Table dataSource={dataSource}
               columns={columns}
               rowKey={i=>i.id}
               pagination={{pageSize:5}}
        />
    );
}

export default NewsDraft;
