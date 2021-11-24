import React, {useEffect, useState} from 'react';
import {Button, Space, Table,message} from "antd";
import {CheckCircleFilled, CloseCircleFilled} from "@ant-design/icons";
import axios from "axios";

function Audit(props) {
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
                            onClick={()=>handleAudit(item,true)}
                            icon={<CheckCircleFilled /> } primary/>
                    <Button shape="circle"
                            onClick={()=>handleAudit(item,false)}
                            icon={<CloseCircleFilled />} danger   />
                </Space>
            ),
        },
    ]
    let [dataSource,setDataSource] = useState([])
    useEffect(() => {
        axios.get(`/news?auditState=1&_expand=role`).then(res => {
            console.log(res)
            setDataSource(res.data)
        })
    }, [])
    // 处理审核
    const handleAudit = (i,flag) =>{
            axios.patch(`/news/${i.id}`,{
                auditState:flag?2:3
            }).then(res=>{
                setDataSource(dataSource.filter(item=>item.id!==i.id))
                message.success('操作成功')
            }).catch(err=>message.error('操作失败'))
        }
    return (
        <div>
            <Table dataSource={dataSource}
                   columns={columns}
                   rowKey={i=>i.id}
                   pagination={{pageSize:5}}
            />
        </div>
    );
}

export default Audit;
