import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// 게시판 데이터 가져오기
export const fetchBoardData = createAsyncThunk(
    'board/fetchBoardData',
    async () => {
        const response = await axios.get('http://localhost:8080/board');
        return response.data; // 서버에서 반환된 데이터
    }
);

const boardSlice = createSlice({
    name: 'board',
    initialState: {
        data: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchBoardData.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchBoardData.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchBoardData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default boardSlice.reducer;
