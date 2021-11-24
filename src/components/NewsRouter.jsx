import React,{useState,useEffect} from 'react';
import {Redirect, Route, Switch} from "react-router-dom";
import Home from "../views/newsSandBox/home/Home";
import UserList from "../views/newsSandBox/user-mange/UserList";
import RoleList from "../views/newsSandBox/right-mange/RoleList";
import RightList from "../views/newsSandBox/right-mange/RightList";
import NoPermission from "../views/newsSandBox/noPermission/NoPermission";

import NewsAdd from "../views/newsSandBox/news-manage/NewsAdd";
import NewsDraft from "../views/newsSandBox/news-manage/NewsDraft";
import NewsCategory from "../views/newsSandBox/news-manage/NewsCategory";
import NewsPreview from "../views/newsSandBox/news-manage/NewsPreview";

import Audit from "../views/newsSandBox/audit-manage/Audit";
import AuditList from "../views/newsSandBox/audit-manage/AuditList";

import Unpublished from "../views/newsSandBox/publish-manage/Unpublished";
import Published from "../views/newsSandBox/publish-manage/Published";
import Sunset from "../views/newsSandBox/publish-manage/Sunset";
import axios from "axios";
import {connect} from 'react-redux'
import {Spin} from 'antd'
// 创建本地路由映射表
const LocalRouterMap = {
    '/home': Home,
    '/user-manage/list': UserList,
    '/right-manage': RightList,
    '/right-manage/role/list': RoleList,
    '/right-manage/right/list': RightList,
    '/news-manage/add': NewsAdd,
    '/news-manage/draft': NewsDraft,
    '/news-manage/category': NewsCategory,
    "/news-manage/preview/:id":NewsPreview,
    '/audit-manage/audit': Audit,
    '/audit-manage/list': AuditList,
    '/publish-manage/unpublished': Unpublished,
    '/publish-manage/published': Published,
    '/publish-manage/sunset': Sunset,
}

function NewsRouter(props){
    let [routerList,setRouterList] = useState([])
    useEffect(()=>{
      Promise.all([
          axios.get('/rights'),
          axios.get('/children')
      ]).then(res=>{
          // console.log(res)
          setRouterList([...res[0].data,...res[1].data])
          // console.log(routerList)
      })
    },[])
    // 检查路由
    const checkRouter = (item)=>{
        return LocalRouterMap[item.key] && item.pagepermisson===1 || item.routepermisson===1
    }
    // 检查用户权限
    const checkUserPermission = (item)=>{
        const {role:{rights,roleName}} = JSON.parse(localStorage.getItem('token'))
        // console.log('0000000000',rights)
        if (roleName==='超级管理员'){
            return rights.checked.includes(item.key)
        }
        return rights.includes(item.key)
    }
    return (
       <Spin spinning={props.isLoading}>
           <Switch>
               {
                   routerList.map(item=>{
                           if (checkRouter(item)&&checkUserPermission(item)){
                               return <Route path={item.key} key={item.key} component={LocalRouterMap[item.key]} exact/>
                           }
                       }
                   )
               }
               <Redirect from='/' to='/home' exact/>
               {
                   routerList.length>0 && <Route path='*' component={NoPermission}/>
               }
           </Switch>
       </Spin>
    );
}

const mapStateToProps = ({loadingReducer:{isLoading}})=>{
    return {
        isLoading
    }
}

export default connect(mapStateToProps)(NewsRouter);
