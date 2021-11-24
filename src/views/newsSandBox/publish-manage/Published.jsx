import React from 'react';
import {usePublish} from "../../../components/publish-manage/usePublish";
import NewsPublish from "../../../components/publish-manage/NewsPublish";
import {Button} from "antd";

function Published(props) {
    // 2---已发布
    const {dataSource,handleSunset} = usePublish(2)
    return (
        <NewsPublish button={(id)=><Button type='danger' onClick={()=>handleSunset(id)}>下线</Button>} dataSource={dataSource}/>
    );
}

export default Published;
