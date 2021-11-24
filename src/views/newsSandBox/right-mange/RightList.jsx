import React,{useState,useEffect} from 'react';
import axios from "axios";
import {Table, Tag, Space, Button, Modal, message, Popover, Switch} from 'antd'
import {
    EditOutlined,
    DeleteOutlined,
    ExclamationCircleOutlined
} from '@ant-design/icons';

function RightList(props) {
    const [dataSource,setDataSource] = useState([])
    useEffect(()=>{
        axios.get('/rights?_embed=children').then(res=>{
            const data = res.data
            // 将数据中children的空数组设为空值
            data.forEach(item=>{
                if (item.children.length===0){
                    item.children = null
                }
            })
            setDataSource(data)
        })
    },[])
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
                // 如果当前项的层级为1就直接删除
               if (item.grade===1){
                   setDataSource(()=> dataSource.filter(i=>i.id!==item.id))
                   axios.delete(`/rights/${item.id}`).then(
                       message.success('删除成功')
                   )
               } else {
                   let preItem = dataSource.filter(i=>i.id===item.rightId)
                   // console.log(preItem)
                   preItem[0].children = preItem[0].children.filter(i=>i.id!==item.id)
                   // console.log(dataSource)
                   //更新页面数据
                   setDataSource([...dataSource])
                   //更新后台数据
                   axios.delete(`/children/${item.id}`).then(
                       message.success('删除成功',5)
                   )
               }
            }
        });
    }
    const switchChange = (item) => {
        item.pagepermisson = item.pagepermisson===1?0:1
        //更新页面
        setDataSource([...dataSource])
        //更新后端
        if (item.grade === 1){
            axios.patch(`/rights/${item.id}`,{
                pagepermisson:item.pagepermisson
            }).then(
                message.success('修改成功')
            )
        } else {
            axios.patch(`/children/${item.id}`,{
                pagepermisson:item.pagepermisson
            }).then(
                message.success('修改成功')
            )
        }
    }
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            width: '20%',
        },
        {
            title: '权限名称',
            dataIndex: 'title',
            width: '30%',
        },
        {
            title: '权限路径',
            dataIndex: 'key',
            width: '20%',
            render: tag => (<Tag color='blue' key={tag}>
                {tag}
            </Tag>)
        },
        {
            title: '操作',
            width: '20%',
            render: (item) => (
                <Space size="middle">
                    <Popover content={<Switch
                        style={{marginLeft:'10px'}}
                        checked={item.pagepermisson === 1}
                        onChange={()=>switchChange(item)}
                    />}
                             title="页面配置项"
                             trigger={item.pagepermisson===undefined?'':'click'}
                             overlayStyle={{width:'100px'}}>
                        <Button shape="circle"
                                icon={<EditOutlined />}
                                type="primary"
                                disabled={item.pagepermisson===undefined}
                        />
                    </Popover>
                    <Button shape="circle" onClick={()=>deleteMethod(item)} icon={<DeleteOutlined />} danger />
                </Space>
            ),
        }
    ]
    return (
        <div>
            <Table dataSource={dataSource}
                   columns={columns}
                   pagination={{ position:['bottomCenter'],pageSize:5}}
            />
        </div>
    );
}

export default RightList;
