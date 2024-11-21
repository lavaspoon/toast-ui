import React, { useState, useRef } from "react";
import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";
import colorSyntax from "@toast-ui/editor-plugin-color-syntax";
import { useDispatch } from "react-redux";
import { fetchBoardData } from "./boardSlice";
import axios from "axios";
import BoardList from "./BoardList"; // BoardList 컴포넌트 임포트

const App = () => {
    const editorRef = useRef();
    const dispatch = useDispatch();
    const [videoFile, setVideoFile] = useState(null);

    // 비디오 파일 선택 핸들러
    const handleVideoChange = (event) => {
        setVideoFile(event.target.files[0]);
    };

    // 데이터 저장
    const handleSave = async () => {
        if (!videoFile) {
            alert("Please select a video file before saving.");
            return;
        }

        const editorInstance = editorRef.current.getInstance();
        const content = editorInstance.getHTML(); // WYSIWYG 형식으로 HTML 가져오기

        const formData = new FormData();
        formData.append("content", content);
        formData.append("video", videoFile);

        try {
            await axios.post("http://localhost:8080/board", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            alert("Content and video saved successfully!");
            dispatch(fetchBoardData()); // 데이터 갱신
        } catch (error) {
            alert("Failed to save content and video!");
            console.error(error);
        }
    };

    return (
        <div style={{ margin: "20px" }}>
            <h1>Toast UI Editor with Video Upload</h1>
            <Editor
                ref={editorRef}
                initialValue="<p>Write something here!</p>"
                previewStyle="vertical"
                height="400px"
                initialEditType="wysiwyg"
                useCommandShortcut={true}
                plugins={[colorSyntax]} // Color Syntax 플러그인 적용
            />
            <div style={{ marginTop: "10px" }}>
                <label>
                    <strong>Upload Video:</strong>
                    <input
                        type="file"
                        accept="video/*"
                        onChange={handleVideoChange}
                        style={{ marginLeft: "10px" }}
                    />
                </label>
            </div>
            <button onClick={handleSave} style={{ marginTop: "10px" }}>
                Save Content and Video
            </button>
            <hr />
            <BoardList /> {/* 게시판 목록 컴포넌트 추가 */}
        </div>
    );
};

export default App;
