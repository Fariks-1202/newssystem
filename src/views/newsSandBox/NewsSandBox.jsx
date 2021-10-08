import React from 'react';
import {Route,Switch,Redirect} from 'react-router-dom'

import SideMenu from '../../components/sideMenu/SideMenu'
import TopHeader from "../../components/topHeader/TopHeader";
import Home from "./home/Home";
import RoleList from "./right-mange/RoleList";
import RightList from "./right-mange/RightList";
import UserList from "./user-mange/UserList";
import NoPermission from "./noPermission/NoPermission";

//css
import './NewsSandBox.css'

//antd
import { Layout } from 'antd';
import 'antd/dist/antd.css';
const { Content } = Layout;

function NewsSandBox(props) {
    return (
        <Layout>
            <SideMenu/>
            <Layout className="site-layout">
                <TopHeader/>
                <Content
                    className="site-layout-background"
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        overflow:'auto'
                    }}>
                    <Switch>
                        <Route path='/home' component={Home}/>
                        <Route path='/user-manage/list' component={UserList}/>
                        <Route path='/right-manage/role/list' component={RoleList}/>
                        <Route path='/right-manage/right/list' component={RightList}/>
                        <Redirect from='/' to='/home' exact/>
                        <Route path='*' component={NoPermission}/>
                    </Switch>
                </Content>
            </Layout>
        </Layout>
    );
}

export default NewsSandBox;


