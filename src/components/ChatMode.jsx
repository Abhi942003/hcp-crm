import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendChatMessage, addChatMessage } from '../store/interactionsSlice';

export default function ChatMode() {
  const dispatch = useDispatch();
  const { chatMessages, loading } = useSelector((state) => state.interactions);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = { role: 'user', content: input };
    dispatch(addChatMessage(userMessage));
    setInput('');
    await dispatch(sendChatMessage(input));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div style={styles.card}>
      <h2 style={styles.title}>AI Chat Assistant</h2>
      <p style={styles.subtitle}>
        Describe your HCP interaction naturally and the AI will log it for you.
      </p>

      <div style={styles.chatBox}>
        {chatMessages.length === 0 && (
          <div style={styles.emptyChat}>
            <p>👋 Try saying something like:</p>
            <p style={styles.example}>
              "I met Dr. Sharma today, a cardiologist. We discussed CardioMax.
              She was positive and wants a follow-up next week."
            </p>
          </div>
        )}
        {chatMessages.map((msg, i) => (
          <div key={i} style={msg.role === 'user' ? styles.userBubble : styles.aiBubble}>
            <span style={styles.roleLabel}>
              {msg.role === 'user' ? '👤 You' : '🤖 AI'}
            </span>
            <p style={styles.messageText}>{msg.content}</p>
          </div>
        ))}
        {loading && (
          <div style={styles.aiBubble}>
            <span style={styles.roleLabel}>🤖 AI</span>
            <p style={styles.messageText}>Thinking...</p>
          </div>
        )}
      </div>

      <div style={styles.inputRow}>
        <textarea
          style={styles.input}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe your HCP interaction here..."
          rows={2}
        />
        <button
          style={styles.sendButton}
          onClick={handleSend}
          disabled={loading}
        >
          {loading ? '...' : 'Send'}
        </button>
      </div>
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  title: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1e3a8a',
    marginBottom: '4px',
  },
  subtitle: {
    fontSize: '13px',
    color: '#64748b',
    marginBottom: '16px',
  },
  chatBox: {
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    padding: '16px',
    minHeight: '200px',
    maxHeight: '350px',
    overflowY: 'auto',
    marginBottom: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  emptyChat: {
    color: '#94a3b8',
    fontSize: '14px',
    textAlign: 'center',
    marginTop: '40px',
  },
  example: {
    fontStyle: 'italic',
    marginTop: '8px',
    color: '#64748b',
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#1e3a8a',
    color: 'white',
    padding: '10px 14px',
    borderRadius: '12px 12px 0 12px',
    maxWidth: '80%',
  },
  aiBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#e2e8f0',
    color: '#1a1a2e',
    padding: '10px 14px',
    borderRadius: '12px 12px 12px 0',
    maxWidth: '80%',
  },
  roleLabel: {
    fontSize: '11px',
    fontWeight: '600',
    opacity: 0.75,
    display: 'block',
    marginBottom: '4px',
  },
  messageText: {
    fontSize: '14px',
    lineHeight: '1.5',
  },
  inputRow: {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    padding: '10px 12px',
    border: '1.5px solid #e2e8f0',
    borderRadius: '10px',
    fontSize: '14px',
    resize: 'none',
    outline: 'none',
    fontFamily: 'Inter, sans-serif',
  },
  sendButton: {
    padding: '10px 24px',
    backgroundColor: '#1e3a8a',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: '600',
    height: '44px',
  },
};