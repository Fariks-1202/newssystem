import axios from "axios";
import {useState,useEffect} from 'react';
import {message} from "antd";

export function usePublish(type){
    const {username} = JSON.parse(localStorage.getItem('token'))
    const [dataSource,setdataSource] = useState([])
    useEffect(()=>{
        axios.get(`/news?author=${username}&publishState=${type}&_expand=cate`)
            .then(res=>{
                console.log(res.data)
                setdataSource(res.data)
            })
    },[username])
    //上线
    const handlePublish = (id)=>{
        console.log(id)
        axios.patch(`/news/${id}`,{
            publishState:2,
            publishTime:Date.now()
        }).then(res=>{
            setdataSource(dataSource.filter(i=>i.id!==id))
            message.success('上线成功！')
        })
    }
    //下线
    const handleSunset = (id)=>{
        console.log(id)
        axios.patch(`/news/${id}`,{
            publishState:3
        }).then(res=>{
            setdataSource(dataSource.filter(i=>i.id!==id))
            message.success('下线成功！')
        })
    }

    const handleDelete = (id)=>{
        console.log(id)
        axios.delete(`/news/${id}`).then(res=>{
            setdataSource(dataSource.filter(i=>i.id!==id))
            message.success('删除成功！')
        })
    }
    return {
        dataSource,
        handlePublish,
        handleDelete,
        handleSunset
    }
}
