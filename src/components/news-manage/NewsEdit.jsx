import React,{useState} from 'react';
import { Editor } from "react-draft-wysiwyg";
import { convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./NewsEdit.css"

function NewsEdit(props) {
    let [editorState,setEditorState] = useState('')
    return (
    <Editor
        editorState={editorState}
        toolbarClassName="toolbarClassName"
        wrapperClassName="wrapperClassName"
        editorClassName="editorClassName"
        onEditorStateChange={(editorState)=>setEditorState(editorState)}
        onBlur={()=>{
            props.getContent(draftToHtml(convertToRaw(editorState.getCurrentContent())))
        }
            // console.log(draftToHtml(convertToRaw(editorState.getCurrentContent())))
        }
    />

);
}

export default NewsEdit;
