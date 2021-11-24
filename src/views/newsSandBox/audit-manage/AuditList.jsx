import React, {useEffect, useState} from 'react';
import axios from "axios";
import {Button, message, Space, Table, Tag} from "antd";
import {CheckCircleFilled, CloseCircleFilled} from "@ant-design/icons";
function AuditList(props) {
    const {username} = JSON.parse(localStorage.getItem('token'))
    const colorList = ['','orange','green','red']
    const columns = [
        {
            title: '新闻标题',
            dataIndex: 'title',
            width: '20%',
            render:(title,item)=>(<a href={`/#/news-manage/preview/${item.id}`}>{title}</a>)
        },
        {
            title: '作者',
            dataIndex: 'author',
            width: '20%',
        },
        {
            title: '新闻分类',
            dataIndex: 'cate',
            width: '20%',
        },
        {
            title: '审核状态',
            dataIndex: 'auditState',
            width: '25%',
            render:(item)=>(<Tag color={colorList[item]}>{item===1?'审核中':item===2?'已通过':item===3?'未通过':''}</Tag>)
        },
        {
            title: '操作',
            width: '25%',
            render: (item) => item.auditState===1?
                <Button onClick={()=>handleReverse(item)}>撤销</Button>: item.auditState===2?
                <Button type='primary' onClick={()=>handlePublish(item.id)}>发布</Button>:
                <Button type='danger'>更新</Button>,
        },
    ]
    let [dataSource,setDataSource] = useState([])
    useEffect(()=>{
        axios.get(`/news?author=${username}&auditState_ne=0&publishState_lte=1`)
            .then(res=>{
            console.log(res)
                setDataSource(res.data)
        })
    },[username])
    const handleReverse = item=>{
        setDataSource(dataSource.filter(i=>item.id!==i.id))//页面数据更新
        axios.patch(`/news/${item.id}`,{
            auditState:0
        }).then(res=>{
            message.success('撤销成功！')
        })
    }
    const handlePublish = id=>{
        setDataSource(dataSource.filter(i=>id!==i.id))//页面数据更新
        axios.patch(`/news/${id}`,{
            publishState:2
        }).then(res=>{
            message.success('发布成功！')
        })
    }
    return ( <Table dataSource={dataSource}
                    columns={columns}
                    rowKey={i=>i.id}
                    pagination={{pageSize:5}}/>)
}

export default AuditList;
