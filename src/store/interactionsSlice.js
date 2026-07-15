import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API = 'http://127.0.0.1:8000/api';

export const fetchInteractions = createAsyncThunk('interactions/fetchAll', async () => {
  const res = await axios.get(`${API}/interactions`);
  return res.data;
});

export const submitFormInteraction = createAsyncThunk('interactions/submitForm', async (data) => {
  const res = await axios.post(`${API}/interactions`, data);
  return res.data;
});

export const sendChatMessage = createAsyncThunk('interactions/chat', async (message) => {
  const res = await axios.post(`${API}/chat`, { message });
  return res.data.reply;
});

const interactionsSlice = createSlice({
  name: 'interactions',
  initialState: {
    list: [],
    chatMessages: [],
    loading: false,
    error: null,
  },
  reducers: {
    addChatMessage: (state, action) => {
      state.chatMessages.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInteractions.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(sendChatMessage.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendChatMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.chatMessages.push({ role: 'assistant', content: action.payload });
      })
      .addCase(submitFormInteraction.fulfilled, (state) => {
        state.loading = false;
      });
  },
});

export const { addChatMessage } = interactionsSlice.actions;
export default interactionsSlice.reducer;