import React from 'react';
import {usePublish} from "../../../components/publish-manage/usePublish";
import NewsPublish from "../../../components/publish-manage/NewsPublish";
import {Button} from "antd";

function Sunset(props){
    // 3---已下线
    const {dataSource,handleDelete} = usePublish(3)
    return <NewsPublish button={(id)=><Button onClick={()=>handleDelete(id)}>删除</Button>} dataSource={dataSource}/>
}
export default Sunset
