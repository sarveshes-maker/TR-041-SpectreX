import React, { useState } from 'react';
import { ArrowLeft, CheckCircle, AlertTriangle, Languages, Thermometer, ShieldAlert, Sprout, TrendingUp, Droplets, Leaf } from 'lucide-react';
import { motion } from 'framer-motion';

const ResultsDisplay = ({ data, onBack }) => {

  // Helper for the radial progress
  const SuitabilityRing = ({ score, emoji, label }) => {
    // Coloring logic
    let color = 'var(--accent-primary)';
    if (score < 80) color = 'var(--accent-orange)';
    if (score < 60) color = 'var(--accent-red)';

    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <div 
          className="radial-progress" 
          style={{ '--progress': `${score}%`, '--accent-primary': color, width: '80px', height: '80px' }}
        >
          <div className="radial-value" style={{ fontSize: '1.2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span>{score}%</span>
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '1.5rem' }}>{emoji}</span>
          <p style={{ fontWeight: 600, marginTop: '4px', color: 'var(--text-primary)' }}>{label}</p>
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Banner / Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={onBack} className="btn-outline" style={{ padding: '8px 16px' }}>
          <ArrowLeft size={18} /> New Analysis
        </button>
        <div className="glass-panel" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', borderRadius: '100px' }}>
          <CheckCircle size={18} color="var(--accent-primary)" />
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>High Confidence Score</span>
        </div>
      </div>

      {/* Recommended Crops Section */}
      <div className="glass-panel" style={{ padding: '30px' }}>
        <h3 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
          <Sprout color="var(--accent-primary)" /> Top Viable Crops
        </h3>
        <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '20px' }}>
          {data.recommendations.map((rec, i) => (
            <motion.div 
              key={rec.crop}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              <SuitabilityRing score={rec.score} emoji={rec.emoji} label={rec.crop} />
            </motion.div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Fertilizer Actions */}
        <div className="glass-panel" style={{ padding: '30px' }}>
          <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-blue)' }}>
            <Thermometer color="var(--accent-blue)" /> Agronomist Plan
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {data.fertilizer.map((f, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--accent-blue)' }} />
                  {i !== data.fertilizer.length - 1 && <div style={{ flex: 1, width: '2px', background: 'var(--glass-border)', margin: '4px 0' }} />}
                </div>
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--accent-blue)', fontWeight: 'bold' }}>Day {f.day}</span>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '4px' }}>{f.action}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Soil Correction */}
        <div className="glass-panel" style={{ padding: '30px', borderLeft: '4px solid var(--accent-orange)' }}>
          <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-orange)' }}>
            <ShieldAlert color="var(--accent-orange)" /> Required Corrections
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {data.correction.map((c, i) => (
              <div key={i} style={{ background: 'rgba(245, 158, 11, 0.05)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                <strong style={{ display: 'block', color: 'var(--text-primary)', marginBottom: '4px' }}>{c.issue}</strong>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{c.fix}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Yield & Irrigation Strategies */}
      <div className="glass-panel" style={{ padding: '30px', borderLeft: '4px solid var(--accent-secondary)' }}>
        <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-primary)' }}>
          <TrendingUp color="var(--accent-primary)" /> Yield Optimization & Best Practices
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {data.yieldStrategies.map((strategy, i) => (
            <div key={i} style={{ background: 'var(--glass-bg)', padding: '20px', borderRadius: '12px', border: '1px solid var(--glass-border)', transition: 'all 0.3s' }}>
              <strong style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)', marginBottom: '10px', fontSize: '1.1rem' }}>
                {strategy.icon === 'irrigation' || strategy.icon === 'droplets' ? <Droplets size={20} color="var(--accent-blue)" /> : 
                 strategy.icon === 'fertilizer' ? <Leaf size={20} color="var(--accent-primary)" /> : 
                 <Sprout size={20} color="var(--accent-secondary)" />}
                {strategy.title}
              </strong>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>{strategy.detail}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Advisory Section */}
      <div className="glass-panel" style={{ padding: '30px', background: 'linear-gradient(to right, var(--accent-glow), transparent)' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-primary)', marginBottom: '16px' }}>
          <Languages size={20} /> Expert Advisory (AI Generated)
        </h3>
        <p style={{ color: 'var(--text-primary)', fontSize: '1.1rem', lineHeight: '1.6', fontStyle: 'italic' }}>
          "{data.advisory.en}"
        </p>
      </div>

    </div>
  );
};

export default ResultsDisplay;
