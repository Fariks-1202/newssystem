import React,{useState,useEffect,useRef,useContext} from 'react';
import axios from "axios";
import {Button, message, Modal, Space, Table, Tag,Form,Input} from "antd";
import {DeleteOutlined, ExclamationCircleOutlined} from "@ant-design/icons";
const EditableContext = React.createContext(null);
function NewsCategory(props) {
    let [dataSource,setDataSource] = useState([])
    const [editingKey, setEditingKey] = useState('');
    useEffect(()=>{
        axios.get(`/categories`).then(res=>{
            console.log(res.data)
            setDataSource(res.data)
        })
    },[])
    // 定义删除的方法
    const deleteMethod = (item) => {
        Modal.confirm({
            title: '是否确认删除',
            icon: <ExclamationCircleOutlined />,
            okText: '确认',
            cancelText: '取消',
            onOk:()=>{
                setDataSource(dataSource.filter(i=>i.id!==item.id))
                axios.delete(`/categories/${item.id}`).then(res=>{
                    message.success('删除成功')
                })
            }
        });
    }
    const handleSave = record=>{
        console.log(record)
        setDataSource(dataSource.map(item=>{
            if (item.id===record.id){
                return {
                    title:record.title,
                    value:record.title,
                    id:item.id
                }
            }
            return item
        }))
        axios.patch(`/categories/${record.id}`,{
            title:record.title,
            value:record.title,
        })
    }

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            width: '30%'
        },
        {
            title: '分类名称',
            dataIndex: 'title',
            width: '40%',
            onCell: (record) => ({
                record,
                editable: true,
                dataIndex: 'title',
                title: '分类名称',
                handleSave: handleSave,
            }),
        },
        {
            title: '操作',
            width: '25%',
            align:'center',
            render: (item) =>
                <Button shape="circle" onClick={()=>deleteMethod(item)} icon={<DeleteOutlined />} danger />
        },
    ]
    const EditableRow = ({ index, ...props }) => {
        const [form] = Form.useForm();
        return (
            <Form form={form} component={false}>
                <EditableContext.Provider value={form}>
                    <tr {...props} />
                </EditableContext.Provider>
            </Form>
        );
    };
    const EditableCell = ({
                              title,
                              editable,
                              children,
                              dataIndex,
                              record,
                              handleSave,
                              ...restProps
                          }) => {
        const [editing, setEditing] = useState(false);
        const inputRef = useRef(null);
        const form = useContext(EditableContext);
        useEffect(() => {
            if (editing) {
                inputRef.current.focus();
            }
        }, [editing]);

        const toggleEdit = () => {
            setEditing(!editing);
            form.setFieldsValue({
                [dataIndex]: record[dataIndex],
            });
        };

        const save = async () => {
            try {
                const values = await form.validateFields();
                toggleEdit();
                handleSave({ ...record, ...values });
            } catch (errInfo) {
                console.log('Save failed:', errInfo);
            }
        };

        let childNode = children;

        if (editable) {
            childNode = editing ? (
                <Form.Item
                    style={{
                        margin: 0,
                    }}
                    name={dataIndex}
                    rules={[
                        {
                            required: true,
                            message: `${title} is required.`,
                        },
                    ]}
                >
                    <Input ref={inputRef} onPressEnter={save} onBlur={save} />
                </Form.Item>
            ) : (
                <div
                    className="editable-cell-value-wrap"
                    style={{
                        paddingRight: 24,
                    }}
                    onClick={toggleEdit}
                >
                    {children}
                </div>
            );
        }

        return <td {...restProps}>{childNode}</td>;
    };
    return (
        <Table dataSource={dataSource}
               columns={columns}
               rowKey={i=>i.id}
               components={ {
                   body: {
                   row: EditableRow,
                   cell: EditableCell,
               }
               }}
               pagination={{hideOnSinglePage:true}}
        />
    );
}

export default NewsCategory;
