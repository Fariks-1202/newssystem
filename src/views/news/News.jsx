import React, {useState, useEffect} from 'react';
import {PageHeader, Row, Col, Card, List} from 'antd'
import axios from "axios";
import _ from 'lodash'

function News(props) {
    let [dataSource, setDataSource] = useState([])
    useEffect(() => {
        axios.get(`/news?publishState=2&_expand=category`).then(res => {
            console.log(Object.entries(_.groupBy(res.data,item=>item.category.title)))
            setDataSource(Object.entries(_.groupBy(res.data, item => item.category.title)))
        })
    }, [])
    return (
        <div>
            <PageHeader
                className="site-page-header"
                title="全球大新闻"
                subTitle="查看新闻"
            />
            <div className="site-card-wrapper" style={{width: '95%', margin: 'auto'}}>
                <Row gutter={[16, 16]}>
                    {
                        dataSource.map(item =>
                            <Col span={8} key={item[0]}>
                                <Card title={item[0]} hoverable>
                                    <List
                                        size="small"
                                        pagination={{
                                            pageSize: 3,
                                        }}
                                        dataSource={item[1]}
                                        renderItem={i => <List.Item>
                                            <a href={`/#/detail/${i.id}`} key={i.id}>{i.title}</a>
                                        </List.Item>}
                                    />
                                </Card>
                            </Col>
                        )
                    }
                </Row>
            </div>
        </div>
    );
}

export default News;
