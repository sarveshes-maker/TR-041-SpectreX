import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, MapPin } from 'lucide-react';

const StartPage = ({ onStart }) => {
  return (
    <div style={{ padding: '60px 20px', maxWidth: '600px', width: '100%', margin: '0 auto', textAlign: 'center' }}>
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}
      >
        <div style={{ background: 'var(--accent-glow)', padding: '24px', borderRadius: '30px', boxShadow: '0 0 40px var(--accent-glow)' }}>
          <Sparkles color="var(--accent-primary)" size={60} />
        </div>
      </motion.div>
      
      <motion.h2 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        style={{ color: 'var(--text-primary)', marginBottom: '20px', fontSize: '3.5rem', fontWeight: '700', lineHeight: '1.2', letterSpacing: '-0.03em' }}
      >
        Intelligent Soil <br/>
        <span style={{ color: 'var(--accent-primary)' }}>Advisory System</span>
      </motion.h2>
      
      <motion.p 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        style={{ color: 'var(--text-secondary)', marginBottom: '50px', fontSize: '1.25rem', lineHeight: '1.6' }}
      >
        Leverage machine learning to generate precise, localized crop recommendations and actionable fertilizer schedules based directly on your soil metrics.
      </motion.p>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}
      >
        <button 
          onClick={onStart}
          className="btn-primary" 
          style={{ padding: '18px 48px', fontSize: '1.3rem', borderRadius: '40px', minWidth: '280px', boxShadow: '0 8px 30px var(--accent-glow)' }}
        >
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
            Get Started <ArrowRight size={24} />
          </span>
        </button>

        <button 
          onClick={() => window.dispatchEvent(new CustomEvent('locate-labs'))}
          className="btn-outline" 
          style={{ padding: '14px 32px', fontSize: '1.1rem', borderRadius: '40px', minWidth: '280px' }}
        >
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <MapPin size={20} /> Soil Testing Labs
          </span>
        </button>
      </motion.div>
    </div>
  );
};

export default StartPage;
