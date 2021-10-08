import React, {useState} from 'react';
import {withRouter} from 'react-router-dom'
import './TopHeader.css'
import {Layout,Avatar,Dropdown,Menu} from 'antd';
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    GithubOutlined
} from '@ant-design/icons';

const {Header} = Layout;
function TopHeader(props) {
    const [collapsed,setCollapsed] = useState(false)
    //从缓存中获取用户信息
    const {role:{roleName},username} = JSON.parse(localStorage.getItem('token'))
    const toggle = ()=>{
        setCollapsed(!collapsed)
    }
    const logout = ()=>{
        //移除token
        localStorage.removeItem('token')
        //重定向到登录页面
        // console.log(props.history)
        props.history.replace('/login')
    }
    const menu = (
        <Menu>
            <Menu.Item key='username'>
                <span>{roleName}</span>
            </Menu.Item>
            <Menu.Item danger key='logout' onClick={logout}>退出登录</Menu.Item>
        </Menu>
    );
    return (
        <Header className="site-layout-background" style={{paddingLeft: '16px'}}>
            {
                React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,{
                    className: 'trigger',
                    onClick: toggle,
                })
            }
            {/*<span style={{padding:'0 10px'}}></span>*/}
            <div style={{float:'right'}}>
                <span style={{marginRight:'10px'}}>欢迎 <span
                    style={{color:'skyblue'}}>{username}</span> 回来</span>
                <Dropdown overlay={menu}>
                    <Avatar size='large' icon={<GithubOutlined />}/>
                </Dropdown>
            </div>
        </Header>
    );
}

export default withRouter(TopHeader);
