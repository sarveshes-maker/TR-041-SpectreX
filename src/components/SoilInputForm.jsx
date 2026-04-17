import React, { useState, useEffect } from 'react';
import { Beaker, Droplets, MapPin, Search, Activity, Navigation, Loader2, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import LabMap from './LabMap';

const SoilInputForm = ({ onSubmit, isAnalyzing, detectedLocation, userCoords, initialData, onBack, onLocationChange }) => {
  const [formData, setFormData] = useState({
    pH: initialData?.pH || '',
    nitrogen: initialData?.nitrogen || '',
    phosphorus: initialData?.phosphorus || '',
    potassium: initialData?.potassium || '',
    district: detectedLocation || '',
    season: 'kharif',
    preferredCrop: '',
    soilDepth: 20,
    bulkDensity: 1.4,
    fieldArea: 1,
    areaUnit: 'hectare'
  });
  const [isLocating, setIsLocating] = useState(false);

  // Sync with detected location from parent
  useEffect(() => {
    if (detectedLocation) {
      setFormData(prev => ({ ...prev, district: detectedLocation }));
    }
  }, [detectedLocation]);

  // Sync with file-uploaded data
  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        pH: initialData.pH !== undefined && initialData.pH !== '' ? initialData.pH : prev.pH,
        nitrogen: initialData.nitrogen !== undefined && initialData.nitrogen !== '' ? initialData.nitrogen : prev.nitrogen,
        phosphorus: initialData.phosphorus !== undefined && initialData.phosphorus !== '' ? initialData.phosphorus : prev.phosphorus,
        potassium: initialData.potassium !== undefined && initialData.potassium !== '' ? initialData.potassium : prev.potassium,
        moisture: initialData.moisture !== undefined && initialData.moisture !== '' ? initialData.moisture : prev.moisture
      }));
    }
  }, [initialData]);

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
       alert("Geolocation is not supported by your browser");
       return;
    }
    
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          // Use BigDataCloud free reverse geocoding API (no API key required for client-side)
          const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
          const data = await response.json();
          
          const city = data.city || data.locality || '';
          const state = data.principalSubdivision || '';
          const locationString = [state, city].filter(Boolean).join(', ');
          
          setFormData(prev => ({
            ...prev,
            district: locationString || 'Location not found'
          }));
        } catch (error) {
          console.error("Error fetching location details:", error);
          alert("Failed to get location details.");
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Failed to get your location. Please ensure location access is allowed in your browser.");
        setIsLocating(false);
      }
    );
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const calculateNPKPercentage = () => {
    // Topsoil depth in meters
    const depthMeters = parseFloat(formData.soilDepth) / 100;
    // Bulk density to kg/m3 (g/cm3 * 1000)
    const densityKgM3 = parseFloat(formData.bulkDensity) * 1000;
    
    // Normalize area into hectares
    let areaInHectares = parseFloat(formData.fieldArea) || 1;
    if (formData.areaUnit === 'acre') areaInHectares = areaInHectares * 0.404686;
    else if (formData.areaUnit === 'sqft') areaInHectares = areaInHectares * 0.00000929;

    // Calculate dynamic soil mass accounting for user's literal field size
    const volumeTotalM3 = (10000 * areaInHectares) * depthMeters;
    const soilMassTotalKg = volumeTotalM3 * densityKgM3;

    const convertToPercentage = (val) => {
      if (!val) return '';
      const rawKgHa = parseFloat(val);
      const totalNutrientMass = rawKgHa * areaInHectares;
      
      // percentage mathematically preserves concentration ratio while mapping true scale bounds
      const percentage = (totalNutrientMass / soilMassTotalKg) * 100;
      return percentage.toFixed(5);
    };

    setFormData(prev => ({
      ...prev,
      nitrogen: convertToPercentage(prev.nitrogen),
      phosphorus: convertToPercentage(prev.phosphorus),
      potassium: convertToPercentage(prev.potassium)
    }));

    // Alert user just to confirm computation worked visually
    alert(`Mass Computation Completed:\nCalculated Total Soil Mass for ${formData.fieldArea} ${formData.areaUnit}(s) at ${formData.soilDepth}cm depth equals exactly: ${Math.round(soilMassTotalKg).toLocaleString()} kg.`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="glass-panel" style={{ padding: '40px' }}>
      <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', marginBottom: '20px', fontSize: '0.9rem' }}>
        <ArrowLeft size={16} /> Change Entry Method
      </button>

      <div style={{ marginBottom: '30px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '20px' }}>
        <h2 style={{ color: 'var(--text-primary)', marginBottom: '10px' }}>Soil Health Data Entry</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Provide recent soil test readings and context for accurate ML-driven recommendations.</p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        
        {/* Basic Soil Metrics */}
        <div>
          <h3 style={{ color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', fontSize: '1.2rem' }}>
            <Beaker size={20} color="var(--accent-primary)" /> Primary Soil Metrics
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">pH Level</label>
              <input required type="number" step="0.1" name="pH" value={formData.pH} onChange={handleChange} className="form-control" placeholder="e.g. 6.5" />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Droplets size={16}/> Moisture (%)</label>
              <input required type="number" name="moisture" value={formData.moisture} onChange={handleChange} className="form-control" placeholder="e.g. 15" />
            </div>
          </div>
        </div>

        {/* Soil Mass Parameters */}
        <div style={{ background: 'var(--glass-highlight)', padding: '20px', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
          <h3 style={{ color: 'var(--text-primary)', marginBottom: '16px', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={18} color="var(--accent-primary)"/> Calculate Science-Grade Percentage
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '16px' }}>Convert kg/ha extractions into precise soil mass fractions based on physical field density.</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr auto', gap: '16px', alignItems: 'end' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Soil Depth (cm)</label>
              <input type="number" step="1" name="soilDepth" value={formData.soilDepth} onChange={handleChange} className="form-control" />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Bulk Density</label>
              <input type="number" step="0.1" name="bulkDensity" value={formData.bulkDensity} onChange={handleChange} className="form-control" />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Field Area</label>
              <input type="number" step="0.1" name="fieldArea" value={formData.fieldArea} onChange={handleChange} className="form-control" />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Area Unit</label>
              <select name="areaUnit" value={formData.areaUnit} onChange={handleChange} className="form-control" style={{ appearance: 'none', padding: '10px 8px' }}>
                <option value="hectare">Hectares (ha)</option>
                <option value="acre">Acres</option>
                <option value="sqft">Sq. Ft</option>
              </select>
            </div>
            <button type="button" onClick={calculateNPKPercentage} className="btn-outline" style={{ whiteSpace: 'nowrap', padding: '10px 16px', fontSize: '0.9rem', height: '42px' }}>
              Calculate %
            </button>
          </div>
        </div>

        {/* NPK Grid */}
        <div style={{ background: 'var(--glass-highlight)', padding: '24px', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
          <h3 style={{ color: 'var(--text-primary)', marginBottom: '16px', fontSize: '1.1rem' }}>
            Macronutrients (%)
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Nitrogen (N)</label>
              <input required type="number" step="0.0001" name="nitrogen" value={formData.nitrogen} onChange={handleChange} className="form-control" placeholder="e.g. 0.014" />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Phosphorus (P)</label>
              <input required type="number" step="0.0001" name="phosphorus" value={formData.phosphorus} onChange={handleChange} className="form-control" placeholder="e.g. 0.0011" />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Potassium (K)</label>
              <input required type="number" step="0.0001" name="potassium" value={formData.potassium} onChange={handleChange} className="form-control" placeholder="e.g. 0.0075" />
            </div>
          </div>
        </div>

        {/* Contextual Data */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '32px' }}>
          <div>
            <h3 style={{ color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', fontSize: '1.2rem' }}>
              <Navigation size={20} color="var(--accent-blue)" /> Environmental & Crop Context
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  Live GPS Location
                  {isLocating && <span style={{ color: 'var(--accent-blue)', fontSize: '0.8rem' }}>Detecting...</span>}
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <div style={{ 
                    flex: 1, 
                    background: 'var(--glass-highlight)', 
                    border: '1px solid var(--glass-border)', 
                    borderRadius: '8px', 
                    padding: '10px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    color: formData.district ? 'var(--text-primary)' : 'var(--text-secondary)'
                  }}>
                    <MapPin size={18} color="var(--accent-primary)" />
                    {formData.district || "Select 'Auto-Detect' or wait..."}
                  </div>
                  <button 
                    type="button" 
                    onClick={handleDetectLocation} 
                    disabled={isLocating}
                    style={{ 
                      padding: '0 16px', 
                      background: 'rgba(56, 189, 248, 0.1)', 
                      border: '1px solid var(--accent-blue)', 
                      color: 'var(--accent-blue)', 
                      borderRadius: '8px',
                      cursor: isLocating ? 'not-allowed' : 'pointer'
                    }}
                    title="Refresh GPS"
                  >
                    {isLocating ? <Loader2 size={20} className="animate-spin" /> : <Navigation size={20} />}
                  </button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Season</label>
                  <select name="season" value={formData.season} onChange={handleChange} className="form-control" style={{ appearance: 'none' }}>
                    <option value="kharif">Kharif</option>
                    <option value="rabi">Rabi</option>
                    <option value="zaid">Zaid</option>
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Ideal Crop Focus</label>
                  <select name="preferredCrop" value={formData.preferredCrop} onChange={handleChange} className="form-control" style={{ appearance: 'none' }}>
                    <option value="">Decided by AI</option>
                    <option value="Rice">Rice</option>
                    <option value="Wheat">Wheat</option>
                    <option value="Maize">Maize</option>
                    <option value="Cotton">Cotton</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '16px', fontSize: '1rem', opacity: 0.8 }}>Live Agri-Map Tracking</h3>
            <div style={{ flex: 1, minHeight: '180px', borderRadius: '16px', border: '1px solid var(--glass-border)', overflow: 'hidden' }}>
              {userCoords ? (
                <LabMap 
                  userCoords={userCoords} 
                  labCoords={userCoords} 
                  labName="FARM LOCATION" 
                  isInteractive={true}
                  onLocationChange={onLocationChange}
                />
              ) : (
                <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--glass-highlight)', color: 'var(--text-secondary)', fontSize: '0.9rem', textAlign: 'center', padding: '20px' }}>
                  Enable GPS to see your farm position on the map
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Submit */}
        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
          <button 
            type="submit" 
            className={`btn-primary ${isAnalyzing ? 'animate-glow' : ''}`} 
            disabled={isAnalyzing}
            style={{ padding: '16px 40px', fontSize: '1.2rem', minWidth: '300px' }}
          >
            {isAnalyzing ? (
               <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                 <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                   <Search size={22} />
                 </motion.div>
                 Running ML Models...
               </div>
            ) : (
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                 <Activity size={22} /> Process Soil Data
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SoilInputForm;
