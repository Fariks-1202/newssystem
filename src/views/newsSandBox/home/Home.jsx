import React, {useState, useEffect,useRef} from 'react';
import {Card, Col, Row, List, Avatar, Drawer} from 'antd';
import {EditOutlined, EllipsisOutlined, SettingOutlined} from '@ant-design/icons';
import axios from "axios";
import * as echarts from 'echarts'
import _ from 'lodash'
const {Meta} = Card;

function Home(props) {
    let [mostViewList, setmostViewList] = useState([])
    let [mostStarList, setmostStarList] = useState([])
    const [visible, setVisible] = useState(false);
    const [pieChart,setpieChart] = useState(null)
    const [chartData,setchartData] = useState([])
    const mainRef = useRef('')
    const pieRef = useRef('')
    const showDrawer = () => {
        setTimeout(()=>{
            setVisible(true);
            renderPieView()
        },0)
    };
    const onClose = () => {
        setVisible(false);
    };
    const user = JSON.parse(localStorage.getItem('token'))
    // console.log(user)
    useEffect(() => {
        axios.get(`/news?publishState=2&_expand=category`).then(res=>{
            const data = _.groupBy(res.data,item=>item.category.title)
            setchartData(data)
            // console.log('1111111',_.groupBy(res.data,item=>item.category.title))
            renderBarView(data)
        })
        return ()=> {
            window.onresize = null
        }
    },[])
    const renderBarView = (obj)=>{
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(mainRef.current);

        // 指定图表的配置项和数据
        var option = {
            title: {
                text: '新闻分类'
            },
            tooltip: {},
            legend: {
                data: ['数量']
            },
            xAxis: {
                data: Object.keys(obj),
                axisLabel: {
                    rotate: 45
                }
            },
            yAxis: {
                minInterval: 1
            },
            series: [
                {
                    name: '数量',
                    type: 'bar',
                    data: Object.values(obj).map(i=>i.length),
                }
            ]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        window.onresize = ()=>{
            myChart.resize()
        }
    }
    const renderPieView = ()=>{
        let list = []
        for (var i in chartData){
            list.push({
                name:i,
                value:chartData[i].length
            })
        }
        // console.log('listttttttttttttt',list)
        let myChart;
        if (!pieChart){
            myChart = echarts.init(pieRef.current)
            setpieChart(myChart)
        }else {
            myChart = pieChart
        }
        let option;
        option = {
            title: {
                text: '个人新闻分类',
                left: 'center'
            },
            tooltip: {
                trigger: 'item'
            },
            legend: {
                orient: 'vertical',
                left: 'left'
            },
            series: [
                {
                    name: 'Access From',
                    type: 'pie',
                    radius: '50%',
                    data: list,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };

        option && myChart.setOption(option);
    }
    useEffect(() => {
        axios.get(`/news?publishState=2&_expand=category&_sort=view&_order=desc`).then(res => {
            console.log(res.data)
            setmostViewList(res.data)
        })
        axios.get(`/news?publishState=2&_expand=category&_sort=star&_order=desc`).then(res => {
            console.log(res.data)
            setmostStarList(res.data)
        })
    }, [])
    return (
        <div>
            <Row gutter={16}>
                <Col span={8}>
                    <Card title="用户最常浏览" bordered>
                        <List
                            dataSource={mostViewList}
                            renderItem={item => <List.Item>
                                <a href={`/#/news-manage/preview/${item.id}`}>{item.title}</a>
                            </List.Item>}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="用户点赞最多" bordered>
                        <List
                            dataSource={mostStarList}
                            renderItem={item => <List.Item>
                                <a href={`/#/news-manage/preview/${item.id}`}>{item.title}</a>
                            </List.Item>}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card
                        cover={
                            <img
                                alt="example"
                                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                            />
                        }
                        actions={[
                            <SettingOutlined key="setting" onClick={showDrawer}/>,
                            <EditOutlined key="edit"/>,
                            <EllipsisOutlined key="ellipsis"/>,
                        ]}
                    >
                        <Meta
                            avatar={<Avatar src="https://joeschmoe.io/api/v1/random"/>}
                            title={user.username}
                            description={
                                <div>
                                    <span>{user.region ? user.region : '全球'}</span>
                                    &nbsp;
                                    <span><strong>{user.role.roleName}</strong></span>
                                </div>
                            }
                        />
                    </Card>
                </Col>
            </Row>
            <div ref={mainRef} style={{width: '600px', height: '400px',marginTop:'20px'}}>
            </div>
            <Drawer title="个人新闻分类" placement="right" onClose={onClose} visible={visible} width='600'>
                <div ref={pieRef} style={{width: '100%', height: '400px'}}>
                </div>
            </Drawer>
        </div>
    );
}

export default Home;
