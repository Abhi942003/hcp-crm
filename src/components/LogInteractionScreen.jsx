import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInteractions } from '../store/interactionsSlice';
import FormMode from './FormMode';
import ChatMode from './ChatMode';

export default function LogInteractionScreen() {
  const [activeTab, setActiveTab] = useState('form');
  const dispatch = useDispatch();
  const interactions = useSelector((state) => state.interactions.list);

  useEffect(() => {
    dispatch(fetchInteractions());
  }, [dispatch]);

  const getSentimentColor = (sentiment) => {
    if (sentiment === 'positive') return { bg: '#d1fae5', text: '#065f46' };
    if (sentiment === 'negative') return { bg: '#fee2e2', text: '#991b1b' };
    return { bg: '#fef3c7', text: '#92400e' };
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>HCP Interaction Logger</h1>
        <p style={styles.headerSub}>Log your Healthcare Professional interactions</p>
      </div>

      <div style={styles.tabContainer}>
        <button
          style={activeTab === 'form' ? styles.activeTab : styles.inactiveTab}
          onClick={() => setActiveTab('form')}
        >
          Form Mode
        </button>
        <button
          style={activeTab === 'chat' ? styles.activeTab : styles.inactiveTab}
          onClick={() => setActiveTab('chat')}
        >
          Chat Mode
        </button>
      </div>

      <div style={styles.content}>
        {activeTab === 'form' ? <FormMode /> : <ChatMode />}
      </div>

      <div style={styles.recentSection}>
        <h2 style={styles.recentTitle}>Recent Interactions</h2>
        {interactions.length === 0 ? (
          <p style={styles.noData}>No interactions logged yet.</p>
        ) : (
          <div>
            {interactions.slice(0, 5).map((item) => {
              const colors = getSentimentColor(item.sentiment);
              return (
                <div key={item.id} style={styles.interactionCard}>
                  <div style={styles.cardLeft}>
                    <span style={styles.hcpName}>{item.hcp_name}</span>
                    <span style={styles.specialty}>{item.hcp_specialty}</span>
                  </div>
                  <div style={styles.cardRight}>
                    <span style={{
                      padding: '2px 10px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '500',
                      backgroundColor: colors.bg,
                      color: colors.text,
                    }}>
                      {item.sentiment || 'neutral'}
                    </span>
                    <span style={styles.channel}>{item.channel}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '24px 16px',
  },
  header: {
    background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)',
    borderRadius: '16px',
    padding: '32px',
    marginBottom: '24px',
    color: 'white',
  },
  headerTitle: {
    fontSize: '28px',
    fontWeight: '700',
    marginBottom: '8px',
  },
  headerSub: {
    fontSize: '14px',
    opacity: 0.85,
  },
  tabContainer: {
    display: 'flex',
    gap: '12px',
    marginBottom: '24px',
  },
  activeTab: {
    flex: 1,
    padding: '12px',
    backgroundColor: '#1e3a8a',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: '600',
  },
  inactiveTab: {
    flex: 1,
    padding: '12px',
    backgroundColor: 'white',
    color: '#64748b',
    border: '2px solid #e2e8f0',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: '500',
  },
  content: {
    marginBottom: '24px',
  },
  recentSection: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  recentTitle: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '16px',
    color: '#1e3a8a',
  },
  noData: {
    color: '#94a3b8',
    fontSize: '14px',
  },
  interactionCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 0',
    borderBottom: '1px solid #f1f5f9',
  },
  cardLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  hcpName: {
    fontWeight: '600',
    fontSize: '14px',
  },
  specialty: {
    fontSize: '12px',
    color: '#64748b',
  },
  cardRight: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '4px',
  },
  channel: {
    fontSize: '12px',
    color: '#94a3b8',
  },
};