import React,{useState,useEffect} from 'react';
import axios from "axios";
import {Descriptions, message, PageHeader} from "antd";
import {HeartTwoTone} from '@ant-design/icons';
function Detail(props) {
    // console.log(props.match.params.id)
    let [newsData,setNewsData] = useState([])
    useEffect(()=>{
        axios.get(`/news/${props.match.params.id}?_expand=role&_expand=category`).then(res=>{
                setNewsData({
                    ...res.data,
                    view:res.data.view+1
                })
            return res.data
        }).then(res=>{
            //同步后端
            axios.patch(`/news/${props.match.params.id}`,{
                view:res.view+1
            })
        })
    },[])
    const addStar = ()=>{
        setNewsData({
            ...newsData,
            star:newsData.star+1
        })
        axios.patch(`/news/${props.match.params.id}`,{
            star:newsData.star+1
        }).then(r=>{
            message.success('点赞成功！')
        }).catch(e=>{
            message.error('点赞失败！')
            setNewsData({
                ...newsData,
                star:newsData.star-1
            })
        })
    }
    return (
        <div>
            <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                title={newsData.title}
                subTitle={
                    <HeartTwoTone twoToneColor="#eb2f96" onClick={addStar}/>
                }>
                <Descriptions size="small" column={3}>
                    <Descriptions.Item label="创建者">{newsData.author}</Descriptions.Item>
                    <Descriptions.Item
                        label="发布时间">{newsData.publishTime?new Date(newsData.publishTime).toLocaleString().slice(0,-3):'-'}</Descriptions.Item>
                    <Descriptions.Item label="区域">{newsData.region}</Descriptions.Item>
                    <Descriptions.Item label="访问数量">{newsData.view}</Descriptions.Item>
                    <Descriptions.Item label="点赞数量">{newsData.star}</Descriptions.Item>
                    <Descriptions.Item label="评论数量">-</Descriptions.Item>
                </Descriptions>
            </PageHeader>
            <div style={{margin: '0 25px',padding: '20px',
                backgroundColor: '#f5f5f5'}}>
                <h1>新闻内容</h1>
                <div dangerouslySetInnerHTML={{__html:newsData.content}}></div>
            </div>
        </div>
    );
}

export default Detail;
