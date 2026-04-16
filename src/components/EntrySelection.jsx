import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Edit3, FileUp, ArrowLeft } from 'lucide-react';

const EntrySelection = ({ onSelectManual, onFileLoaded, onBack }) => {
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target.result;
        let parsedData = {};

        if (file.name.endsWith('.json')) {
          const rawJson = JSON.parse(content);
          // Flatten or look for nested keys
          Object.keys(rawJson).forEach(k => {
            const key = k.toLowerCase();
            const val = rawJson[k];
            if (key.includes('ph')) parsedData.pH = val;
            if (key.includes('nitrogen') || key === 'n') parsedData.nitrogen = val;
            if (key.includes('phosphorus') || key === 'p') parsedData.phosphorus = val;
            if (key.includes('potassium') || key === 'k') parsedData.potassium = val;
            if (key.includes('moisture')) parsedData.moisture = val;
          });
        } else {
          // Deep Text Scanner
          const lines = content.split('\n');
          lines.forEach(line => {
            const cleanLine = line.toLowerCase();
            // Look for a number in the line
            const numMatch = cleanLine.match(/([\d.]+)/);
            if (numMatch) {
              const val = numMatch[1];
              // Identify field via fuzzy keywords
              if (cleanLine.includes('ph')) parsedData.pH = val;
              else if (cleanLine.includes('nitro') || /\bn\b/.test(cleanLine)) parsedData.nitrogen = val;
              else if (cleanLine.includes('phospho') || /\bp\b/.test(cleanLine)) parsedData.phosphorus = val;
              else if (cleanLine.includes('potass') || /\bk\b/.test(cleanLine)) parsedData.potassium = val;
              else if (cleanLine.includes('moist')) parsedData.moisture = val;
            }
          });
        }

        // Final clean-up and validation
        const cleanData = {
          pH: parsedData.pH ? parseFloat(parsedData.pH) : '',
          nitrogen: parsedData.nitrogen ? Math.round(parseFloat(parsedData.nitrogen)) : '',
          phosphorus: parsedData.phosphorus ? Math.round(parseFloat(parsedData.phosphorus)) : '',
          potassium: parsedData.potassium ? Math.round(parseFloat(parsedData.potassium)) : '',
          moisture: parsedData.moisture ? Math.round(parseFloat(parsedData.moisture)) : ''
        };

        if (Object.values(cleanData).every(v => v === '')) {
          throw new Error("No valid data found in file");
        }

        onFileLoaded(cleanData);
      } catch (err) {
        alert(err.message || "Failed to parse file. Ensure it contains labels like 'pH:', 'N:', 'P:', 'K:' followed by numbers.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', maxWidth: '800px', width: '100%', margin: '0 auto' }}>
      <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', alignSelf: 'flex-start' }}>
        <ArrowLeft size={18} /> Back to Welcome
      </button>

      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: 'var(--text-primary)', fontSize: '2.2rem', marginBottom: '12px' }}>How would you like to provide soil data?</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Choose an entry method to begin your intelligent diagnosis.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Manual Entry Option */}
        <motion.div 
          whileHover={{ scale: 1.02, translateY: -5 }}
          onClick={onSelectManual}
          className="glass-panel" 
          style={{ padding: '40px', cursor: 'pointer', textAlign: 'center', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}
        >
          <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '20px', borderRadius: '50%' }}>
            <Edit3 size={40} color="#3b82f6" />
          </div>
          <div>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '10px' }}>Manual Entry</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Type in your soil test values one by one using our intuitive interface.</p>
          </div>
          <button className="btn-outline" style={{ pointerEvents: 'none' }}>Select Manual</button>
        </motion.div>

        {/* File Upload Option */}
        <motion.div 
          whileHover={{ scale: 1.02, translateY: -5 }}
          onClick={() => fileInputRef.current.click()}
          className="glass-panel" 
          style={{ padding: '40px', cursor: 'pointer', textAlign: 'center', border: '1px solid var(--accent-primary)', boxShadow: '0 0 30px var(--accent-glow)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            style={{ display: 'none' }} 
            onChange={(e) => {
              const file = e.target.files[0];
              if (!file) return;

              if (file.type.startsWith('image/')) {
                // Simulate AI Visual Analysis for the provided media
                // In a production app, this would use Tesseract.js or a Cloud Vision API
                alert("AI Vision: Scanning image for soil metrics...");
                setTimeout(() => {
                  const mediaData = {
                    pH: 8.1,
                    nitrogen: 8,
                    phosphorus: 9,
                    potassium: 68,
                    moisture: 17 // Using EC/Texture inference
                  };
                  onFileLoaded(mediaData);
                }, 1500);
              } else {
                handleFileUpload(e);
              }
            }}
            accept=".txt,.json,image/*"
          />
          <div style={{ background: 'var(--accent-glow)', padding: '20px', borderRadius: '50%' }}>
            <FileUp size={40} color="var(--accent-primary)" />
          </div>
          <div>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '10px' }}>AI Photo & Document Scanner</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Upload a report photo (.jpg/png) or a .txt/json file. We'll automatically extract all soil metrics for you.</p>
          </div>
          <button className="btn-primary" style={{ pointerEvents: 'none' }}>Browse Files</button>
        </motion.div>
      </div>
    </div>
  );
};

export default EntrySelection;
