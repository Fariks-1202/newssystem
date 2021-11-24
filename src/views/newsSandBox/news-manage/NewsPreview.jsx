import React, {useState, useEffect} from 'react';
import {PageHeader, Button, Descriptions} from 'antd';
import axios from "axios";

function NewsPreview(props) {
    console.log(props.match.params.id)
    let [newsData, setnewsData] = useState('')
    const colorList = ['black','orange','green','red']
    useEffect(() => {
        axios.get(`/news/${props.match.params.id}?_expand=role`).then(res => {
            console.log(res)
            setnewsData(res.data)
        })
    }, [])
    return (
        <div>
            <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                title={newsData.title}
                subTitle={newsData.cate}>
                <Descriptions size="small" column={3}>
                    <Descriptions.Item label="创建者">{newsData.author}</Descriptions.Item>
                    <Descriptions.Item
                        label="创建时间">{new Date(newsData.createTime).toLocaleString().slice(0,-3)}</Descriptions.Item>
                    <Descriptions.Item
                        label="发布时间">{newsData.publishTime?new Date(newsData.publishTime).toLocaleString().slice(0,-3):'-'}</Descriptions.Item>
                    <Descriptions.Item label="区域">{newsData.region}</Descriptions.Item>
                    <Descriptions.Item label="审核状态">{newsData.auditState === 0 ? <span style={{color:colorList[newsData.auditState]}}>未审核</span> : <span style={{color:colorList[newsData.auditState]}}>已审核</span>}</Descriptions.Item>
                    <Descriptions.Item label="发布状态">{newsData.publishState === 0 ? <span style={{color:colorList[3]}}>未发布</span> : <span style={{color:colorList[2]}}>已发布</span>}</Descriptions.Item>
                    <Descriptions.Item label="访问数量">{newsData.view}</Descriptions.Item>
                    <Descriptions.Item label="点赞数量">{newsData.star}</Descriptions.Item>
                    <Descriptions.Item label="评论数量">-</Descriptions.Item>
                </Descriptions>
            </PageHeader>
            <div style={{marginLeft: '25px',padding: '24px',
                backgroundColor: '#f5f5f5'}}>
                <h1>新闻内容</h1>
                <div dangerouslySetInnerHTML={{__html:newsData.content}}></div>
            </div>
        </div>
    );
}

export default NewsPreview;
