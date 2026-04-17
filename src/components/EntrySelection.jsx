import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Edit3, FileUp, ArrowLeft, Loader2 } from 'lucide-react';
import Tesseract from 'tesseract.js';

const EntrySelection = ({ onSelectManual, onFileLoaded, onBack }) => {
  const fileInputRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);

  const processAnalyzedData = (content, isJson) => {
    try {
      let parsedData = {};

      if (isJson) {
        const rawJson = JSON.parse(content);
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
        const lines = content.split('\n');
        lines.forEach(line => {
          const cleanLine = line.toLowerCase();
          const numMatch = cleanLine.match(/([\d.]+)\s*(ppm|kg\/ha|kg\/acre|g\/kg|gm\/kg|mg\/kg|gm|mg|%)?/);
          
          if (numMatch) {
            let val = parseFloat(numMatch[1]);
            const unit = numMatch[2] || '';
            
            const isPh = cleanLine.includes('ph');
            const isN = cleanLine.includes('nitro') || /\bn\b/.test(cleanLine);
            const isP = cleanLine.includes('phospho') || /\bp\b/.test(cleanLine);
            const isK = cleanLine.includes('potass') || /\bk\b/.test(cleanLine);
            const isMoist = cleanLine.includes('moist');

            if ((isN || isP || isK) && unit !== '%') {
               // Normalizing all standard units back to standard ppm whole numbers as requested
               if (unit === 'kg/ha') val = val / 2;
               else if (unit === 'kg/acre') val = (val * 1.12) / 2;
               
               // Cap the value at exactly 100 percentage points as requested
               val = Math.min(100, Math.round(val));
            }

            if (isPh && !parsedData.pH) parsedData.pH = val;
            else if (isN && !parsedData.nitrogen) parsedData.nitrogen = val;
            else if (isP && !parsedData.phosphorus) parsedData.phosphorus = val;
            else if (isK && !parsedData.potassium) parsedData.potassium = val;
            else if (isMoist && !parsedData.moisture) parsedData.moisture = val;
          }
        });
      }

      const cleanData = {
        pH: parsedData.pH !== undefined ? parseFloat(parsedData.pH) : '',
        nitrogen: parsedData.nitrogen !== undefined ? parseFloat(parsedData.nitrogen) : '',
        phosphorus: parsedData.phosphorus !== undefined ? parseFloat(parsedData.phosphorus) : '',
        potassium: parsedData.potassium !== undefined ? parseFloat(parsedData.potassium) : '',
        moisture: parsedData.moisture !== undefined ? Math.round(parseFloat(parsedData.moisture)) : ''
      };

      if (Object.values(cleanData).every(v => v === '')) throw new Error("No valid data found in file");
      
      onFileLoaded(cleanData);
    } catch (err) {
      alert(err.message || "Failed to parse file. Ensure it contains labels like 'pH:', 'N:', 'P:', 'K:' followed by numbers.");
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type.startsWith('image/')) {
      setIsScanning(true);
      Tesseract.recognize(file, 'eng', { logger: m => console.log(m) })
        .then(({ data: { text } }) => {
          setIsScanning(false);
          processAnalyzedData(text, false);
        })
        .catch(err => {
          setIsScanning(false);
          console.error("OCR Error:", err);
          alert("Image scanning failed. Please try a clearer image or a text document.");
        });
    } else {
      const reader = new FileReader();
      reader.onload = (event) => {
        processAnalyzedData(event.target.result, file.name.endsWith('.json'));
      };
      reader.readAsText(file);
    }
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
          onClick={() => isScanning ? null : fileInputRef.current.click()}
          className="glass-panel" 
          style={{ padding: '40px', cursor: isScanning ? 'wait' : 'pointer', textAlign: 'center', border: '1px solid var(--accent-primary)', boxShadow: '0 0 30px var(--accent-glow)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', opacity: isScanning ? 0.7 : 1 }}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            style={{ display: 'none' }} 
            onChange={handleFileUpload}
            accept=".txt,.json,image/*"
          />
          <div style={{ background: 'var(--accent-glow)', padding: '20px', borderRadius: '50%' }}>
            {isScanning ? <Loader2 size={40} className="animate-spin" color="var(--accent-primary)" /> : <FileUp size={40} color="var(--accent-primary)" />}
          </div>
          <div>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '10px' }}>
               {isScanning ? 'Extracting Data via AI...' : 'AI Photo & Document Scanner'}
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Upload a report photo (.jpg/png) or a .txt/json file. We'll automatically extract all soil metrics for you.</p>
          </div>
          <button className="btn-primary" style={{ pointerEvents: 'none' }}>
             {isScanning ? 'Scanning...' : 'Browse Files'}
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default EntrySelection;
