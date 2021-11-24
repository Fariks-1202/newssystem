import NewsPublish from "../../../components/publish-manage/NewsPublish";
import {usePublish} from "../../../components/publish-manage/usePublish";
import {Button} from "antd";

function Unpublished(props) {
    //  1---待发布
    const {dataSource,handlePublish} = usePublish(1)
    return (
        <NewsPublish button={(id)=><Button type='primary' onClick={()=>handlePublish(id)}>上线</Button>} dataSource={dataSource}/>
    );
}
export default Unpublished;
