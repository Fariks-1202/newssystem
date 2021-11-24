import React, {useState, useRef, useEffect} from 'react';
import axios from "axios";
import {PageHeader, Steps, Button, Space, Form, Input, Select, message, notification} from 'antd';
import NewsEdit from "../../../components/news-manage/NewsEdit";
import style from './News.module.css'

const {Step} = Steps
const {Option} = Select;

function NewsAdd(props) {
    const [current, setCurrent] = useState(0)
    let [categoryList, setCategory] = useState([])
    const newsRef = useRef(null)
    useEffect(() => {
        axios.get('/categories').then(res => {
            // console.log(res)
            setCategory(res.data)
        })
    }, [])
    let [formInfo, setFormInfo] = useState({})
    let [editContent, setEditContent] = useState('')
    const handleNext = () => {
        if (current === 0) {
            // console.log(newsRef)
            newsRef.current.validateFields().then(res => {
                console.log('setFormInfosetFormInfosetFormInfosetFormInfo',res)
                setFormInfo(res)
                setCurrent(current + 1)
            }).catch(err => {
                console.log(err)
            })

        } else {
            if (editContent === '' || (editContent.trim()) === "<p></p>") {
                message.error('新闻内容不能为空！')
            } else {
                setCurrent(current + 1)
            }
        }
    }
    const handleSave = (flag) => {
        const user = JSON.parse(localStorage.getItem('token'))
        const newsObj = {
            ...formInfo,
            "content": editContent,
            "region": user.region ? user.region : "全球",
            "author": user.username,
            "roleId": user.roleId,
            "auditState": flag,
            "publishState": 0,
            "createTime": Date.now(),
            "star": 0,
            "view": 0,
            // "publishTime": 0
        }
        // console.log(newsObj)
        axios.post('/news', newsObj).then(res => {
            // console.log(res)
            notification.info({
                message: '通知',
                description:
                    `你可以到${flag === 0 ? '草稿箱' : '审核列表'}查看`,
                placement: 'bottomRight',
            });
            props.history.push(flag === 0 ? '/news-manage/draft' : '/audit-manage/list')
        })
    }
    return (
        <div>
            <PageHeader
                className="site-page-header"
                title="撰写新闻"
            />
            <Steps current={current}>
                <Step title="基本信息" description="新闻标题，新闻分类"/>
                <Step title="新闻内容" description="新闻主题内容"/>
                <Step title="新闻提交" description="保存为草稿或提交审核"/>
            </Steps>

            {/*使用display属性控制页面元素的显示/隐藏，直接使用current判断会导致页面元素被销毁，表单数据会消失*/}
            <div className={current === 0 ? '' : style.hidden}>
                <Form name="control-hooks" style={{marginTop: '20px'}} ref={newsRef}>
                    <Form.Item name="title" label="新闻标题"
                               rules={[{required: true, message: '请输入标题！'}]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item name="cate" label="新闻分类" rules={[{required: true, message: '请选择分类！'}]}>
                        <Select
                            placeholder="选择新闻分类"
                            allowClear>
                            {
                                categoryList.map(item => (
                                    <Option value={item.value} key={item.id}>{item.title}</Option>
                                ))
                            }
                        </Select>
                    </Form.Item>
                </Form>
            </div>

            <div className={current === 1 ? '' : style.hidden}>
                <NewsEdit getContent={(value) => {
                    console.log(value)
                    setEditContent(value)
                }}/>
            </div>
            <div className={current === 2 ? '' : style.hidden}></div>
            <div style={{marginTop: '50px', float: "right"}}>
                <Space>
                    {
                        current > 0 && (<Button onClick={() => setCurrent(current - 1)}>上一步</Button>)
                    }
                    {
                        current < 2 && (<Button onClick={handleNext}>下一步</Button>)
                    }
                    {
                        current === 2 && (<div>
                            <Space>
                                <Button type='primary' onClick={() => handleSave(0)}>保存草稿</Button>
                                <Button type='danger' onClick={() => handleSave(1)}>提交审核</Button>
                            </Space>
                        </div>)
                    }
                </Space>
            </div>
        </div>
    )
        ;
}

export default NewsAdd;
