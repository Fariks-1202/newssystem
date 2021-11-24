import React from 'react';
import {Table} from "antd";

function NewsPublish(props) {
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
            render:(item)=>item?item:"科学技术"
        },
        {
            title: '操作',
            width: '25%',
            render: (item) => {
               return (<div>
                   { props.button(item.id)}
               </div>)
            }
        },
    ]
    return (
        <Table dataSource={props.dataSource}
               columns={columns}
               rowKey={i=>i.id}
               pagination={{pageSize:5}}/>
    );
}

export default NewsPublish;
