import React from 'react';
import axios from 'axios'
import {Button} from 'antd'

function Home(props) {
    const ajax = ()=>{
        // 取数据
        // axios.get('http://localhost:3001/posts').then(res=>{
        //     console.log(res.data)
        // })
        // 查询数据 get
        // axios.get('http://localhost:3001/posts?id=1').then(res=>{
        //     console.log(res.data)
        // })
        // 增加数据 post
        // axios.post('http://localhost:3001/posts',{
        //     "title": "法外狂徒",
        //     "author": "张三"
        // }).then(res=>{
        //     console.log(res)
        //     }
        // )
        // 修改 put (覆盖) 不保留其他字段
        // axios.put('http://localhost:3001/posts/3',{
        //         "title": "漏网之鱼"
        //     }).then(res=>{
        //         console.log(res)
        //         }
        //     )
        // 修改 patch(替换) 保留其他字段
        axios.patch('http://localhost:3001/posts/3',{
            "title": "漏网之鱼"
        }).then(res=>{
                console.log(res)
            }
        )
        // 删除数据 delete
        // axios.delete('http://localhost:3001/posts/4').then(res=>{
        //     console.log(res.statusText)
        // })
        // 包含子资源，添加 _embed
        // axios.get('http://localhost:3001/posts?_embed=comments').then(res=>{
        //     console.log(res.data)
        // })
        // 包含父资源，添加 _expand
        // axios.get('http://localhost:3001/comments?_expand=post').then(res=>{
        //     console.log(res.data)
        // })
    }
    return (
        <div>
            Home
            <Button type='primary' onClick={ajax}>按钮</Button>
        </div>
    );
}

export default Home;
