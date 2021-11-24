import React from 'react';
import SideMenu from '../../components/sideMenu/SideMenu'
import TopHeader from "../../components/topHeader/TopHeader";
import NewsRouter from "../../components/NewsRouter";

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
                    <NewsRouter/>
                </Content>
            </Layout>
        </Layout>
    );
}

export default NewsSandBox;


