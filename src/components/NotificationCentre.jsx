import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Droplets, Leaf, X, Sprout } from 'lucide-react';

const NotificationCentre = ({ notifications, onClose }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9, y: -20, x: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -20, x: 20 }}
      transition={{ duration: 0.2 }}
      style={{
        position: 'absolute',
        top: '60px',
        right: '0',
        width: '350px',
        maxHeight: '400px',
        background: 'var(--glass-bg)',
        border: '1px solid var(--glass-border)',
        borderRadius: '16px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.3), 0 0 20px var(--accent-glow)',
        backdropFilter: 'blur(16px)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)', margin: 0, fontSize: '1.1rem' }}>
          <Bell size={18} color="var(--accent-primary)" /> Agri-Smart Alerts
        </h3>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
          <X size={18} />
        </button>
      </div>

      <div style={{ padding: '12px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {notifications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-secondary)' }}>
            No pending schedules or alerts.
          </div>
        ) : (
          notifications.map((notif) => (
            <div key={notif.id} style={{ 
              background: 'var(--glass-highlight)', 
              borderRadius: '12px', 
              padding: '16px',
              borderLeft: `4px solid ${notif.type === 'irrigation' ? 'var(--accent-blue)' : notif.type === 'sowing' ? '#fbbf24' : 'var(--accent-primary)'}` 
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                {notif.type === 'irrigation' ? <Droplets size={16} color="var(--accent-blue)" /> : notif.type === 'sowing' ? <Sprout size={16} color="#fbbf24" /> : <Leaf size={16} color="var(--accent-primary)" />}
                <strong style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>{notif.title}</strong>
                <span style={{ marginLeft: 'auto', fontSize: '0.8rem', color: 'var(--text-secondary)', background: 'var(--bg-secondary)', padding: '2px 6px', borderRadius: '4px' }}>
                  {notif.time}
                </span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.4', margin: 0 }}>
                {notif.message}
              </p>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default NotificationCentre;
