import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBoardData } from "./boardSlice";
import ReactPlayer from "react-player";
import Modal from "react-modal"; // react-modal 임포트

const BoardList = () => {
    const dispatch = useDispatch();
    const { data: boardData, loading, error } = useSelector((state) => state.board);
    const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태
    const [selectedPost, setSelectedPost] = useState(null); // 선택된 게시글

    // 컴포넌트 마운트 시 데이터 조회
    useEffect(() => {
        dispatch(fetchBoardData()); // 게시판 데이터 조회
    }, [dispatch]);

    // 게시글 클릭 시 모달 열기
    const openModal = (post) => {
        setSelectedPost(post); // 선택된 게시글 설정
        setIsModalOpen(true); // 모달 열기
    };

    // 모달 닫기
    const closeModal = () => {
        setIsModalOpen(false); // 모달 닫기
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h2>Saved Contents</h2>
            <ul style={{ listStyleType: "none", padding: 0 }}>
                {boardData.map((item) => (
                    <li
                        key={item.id}
                        onClick={() => openModal(item)} // 리스트 항목 클릭 시 모달 열기
                        style={{
                            margin: "15px 0",
                            padding: "10px",
                            borderRadius: "8px",
                            backgroundColor: "#f4f4f9",
                            cursor: "pointer",
                            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                            transition: "transform 0.2s, box-shadow 0.2s",
                        }}
                        onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
                        onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
                    >
                        <div
                            style={{
                                fontWeight: "bold",
                                fontSize: "18px",
                                color: "#333",
                            }}
                        >
                            {item.content.length > 50
                                ? item.content.substring(0, 50) + "..." // 50자 이상이면 자르기
                                : item.content}
                        </div>
                        {item.video && item.video.vimeoId && (
                            <ReactPlayer
                                url={`https://vimeo.com/${item.video.vimeoId}`}
                                width="100%"
                                height="auto"
                                controls={true}
                                style={{ marginTop: "10px" }}
                            />
                        )}
                    </li>
                ))}
            </ul>

            {/* Modal */}
            {selectedPost && (
                <Modal
                    isOpen={isModalOpen}
                    onRequestClose={closeModal}
                    contentLabel="Post Detail"
                    style={{
                        overlay: {
                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                        },
                        content: {
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            width: "80%",
                            maxWidth: "600px",
                            padding: "20px",
                            borderRadius: "8px",
                            backgroundColor: "#fff",
                            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                        },
                    }}
                >
                    <h2>Post Details</h2>
                    <div
                        style={{
                            fontSize: "16px",
                            marginBottom: "15px",
                            lineHeight: "1.6",
                            color: "#555",
                        }}
                    >
                        <div
                            dangerouslySetInnerHTML={{
                                __html: selectedPost.content,
                            }}
                        />
                    </div>
                    {selectedPost.vimeoId && selectedPost.vimeoId && (
                        <div>
                            <ReactPlayer
                                url={`https://vimeo.com/${selectedPost.vimeoId}`}
                                controls={true}
                                width="100%"
                                height="auto"
                            />
                        </div>
                    )}
                    <button
                        onClick={closeModal}
                        style={{
                            marginTop: "20px",
                            padding: "10px 20px",
                            backgroundColor: "#007BFF",
                            color: "#fff",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                        }}
                    >
                        Close
                    </button>
                </Modal>
            )}
        </div>
    );
};

export default BoardList;
