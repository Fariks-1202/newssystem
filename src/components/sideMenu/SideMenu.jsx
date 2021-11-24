import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import './SideMenu.css'
import {Layout, Menu} from 'antd';
import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'
import axios from "../../util/request";
import {
    createFromIconfontCN,
    UserOutlined,
    HomeOutlined,
    UnorderedListOutlined,
    RightOutlined
} from '@ant-design/icons';

const {Sider} = Layout;
const {SubMenu} = Menu;
const IconFont = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_2786290_wbej0lp2f6.js',
});

function SideMenu(props) {
    // console.log(props)
    //隐藏加载圈
    Nprogress.configure({showSpinner: false})
    //显示进度条
    Nprogress.start()
    useEffect(() => {
        //关闭进度条
        Nprogress.done()
    })
    // let [collapsed] = useState(false)
    let [menu, setMenu] = useState([])
    // console.log(props.location.pathname)
    //选中的菜单
    const selectedKey = [props.location.pathname]
    //展开的SubMenu
    const openKeys = ['/' + props.location.pathname.split('/')[1]]
    // console.log(openKeys)
    // console.log(selectedKey)
    useEffect(() => {
        axios.get('/rights?_embed=children').then(res => {
            // console.log(res.data)
            setMenu(res.data)
        })
    }, [])
    // const menuList = [
    //     {
    //         key: '/home',
    //         title: '主页',
    //         icon: <UserOutlined/>
    //     },
    //     {
    //         key: '/right-mange',
    //         title: '权限管理',
    //         icon: <VideoCameraOutlined/>,
    //         children: [
    //             {
    //                 key: '/right-mange/rightList',
    //                 title: '权限列表',
    //                 icon: <UserOutlined/>
    //             },
    //             {
    //                 key: '/right-mange/roleList',
    //                 title: '角色列表',
    //                 icon: <UserOutlined/>
    //             }
    //         ]
    //     },
    //     {
    //         key: '/user-mange',
    //         title: '用户管理',
    //         icon: <VideoCameraOutlined/>,
    //         children: [
    //             {
    //                 key: '/user-mange/userList',
    //                 title: '用户列表',
    //                 icon: <UserOutlined/>
    //             }
    //         ]
    //     }
    // ]
    const iconList =
        {
            '/home': <HomeOutlined/>,
            '/user-manage': <UserOutlined/>,
            '/user-manage/list': <UnorderedListOutlined/>,
            '/right-manage': <RightOutlined/>,
            '/right-manage/role/list': <UnorderedListOutlined/>,
            '/right-manage/right/list': <UnorderedListOutlined/>,
            '/news-manage': <IconFont type="icon-news"/>,
            '/audit-manage': <IconFont type="icon-a-shenhe"/>,
            '/publish-manage': <IconFont type="icon-fabu"/>,
            '/news-manage/add': <IconFont type="icon-news"/>,
            '/news-manage/draft': <IconFont type="icon-news"/>,
            '/news-manage/category': <IconFont type="icon-news"/>,
            '/audit-manage/audit': <IconFont type="icon-a-shenhe"/>,
            '/audit-manage/list': <UnorderedListOutlined/>,
            '/publish-manage/unpublished': <IconFont type="icon-fabu"/>,
            '/publish-manage/published': <IconFont type="icon-fabu"/>,
            '/publish-manage/sunset': <IconFont type="icon-fabu"/>,
        }
    const {roleId, role: {rights}} = JSON.parse(localStorage.getItem('token'))
    // console.log(rights)
    const checkPagepermisson = (item) => {
        return item.pagepermisson === 1 && (roleId === 1 ? rights.checked.includes(item.key) : rights.includes(item.key))
    }
    const renderMenu = menu => {
        return (
            menu.map(item => {
                if (item.children?.length > 0 && checkPagepermisson(item)) {
                    return (
                        <SubMenu key={item.key}
                                 icon={iconList[item.key]} title={item.title}>
                            {
                                // item.children.map(child=>
                                //     <Menu.Item
                                //         key={child.key} icon={child.icon}>{child.title}
                                //     </Menu.Item>
                                // )
                                //递归调用
                                renderMenu(item.children)
                            }
                        </SubMenu>
                    )
                }
                return checkPagepermisson(item) && (
                    <Menu.Item key={item.key} icon={iconList[item.key]} onClick={() => {
                        // console.log(props)
                        props.history.push(item.key)
                    }
                    }>
                        {item.title}
                    </Menu.Item>
                )
            })
        )
    }
    return (
        <Sider trigger={null} collapsible collapsed={props.isCollapsed}>
            <div style={{display: 'flex', height: '100%', flexDirection: 'column'}}>
                <div className="logo">
                    新闻发布系统
                </div>
                <div style={{flex: 1, overflow: 'auto'}}>
                    <Menu theme="dark" mode="inline"
                          defaultOpenKeys={openKeys}
                          defaultSelectedKeys={selectedKey}>
                        {
                            // 渲染左侧菜单列表
                            renderMenu(menu)
                        }
                    </Menu>
                </div>
            </div>
        </Sider>
    );
}

const mapStateToProps = ({collapsedReducer:{isCollapsed}})=>{
    return {
        isCollapsed
    }
}

export default connect(mapStateToProps)(withRouter(SideMenu));

