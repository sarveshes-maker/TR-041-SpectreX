import React, { useState, useEffect } from 'react';
import { Leaf, Droplets, MapPin, Activity, Sun, Moon, Languages } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SoilInputForm from './components/SoilInputForm';
import ResultsDisplay from './components/ResultsDisplay';
import StartPage from './components/StartPage';
import { evaluateSoil } from './utils/soilAnalyzer';
import { findNearestLab } from './utils/labLocator';
import { fetchWeather } from './utils/weatherApi';
import LabMap from './components/LabMap';

function App() {
  const [hasStarted, setHasStarted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showLabModal, setShowLabModal] = useState(false);
  const [foundLab, setFoundLab] = useState(null);
  const [isLocatingLab, setIsLocatingLab] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [userAddress, setUserAddress] = useState("");
  const [userCoords, setUserCoords] = useState(null);

  const fetchLocationDetails = async (lat, lon) => {
    try {
      // Fetch Weather
      const weather = await fetchWeather(lat, lon);
      setWeatherData(weather);

      // Fetch Address (Reverse Geocoding)
      const geoResponse = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
      const geoData = await geoResponse.json();
      setUserAddress(geoData.address.city || geoData.address.town || geoData.address.village || geoData.address.district || "Your Location");
    } catch (err) {
      console.error("Location Details Error:", err);
    }
  };

  useEffect(() => {
    // Auto-locate on mount to prep coordinates for the maps
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserCoords({ lat: latitude, lng: longitude });
          fetchLocationDetails(latitude, longitude);
          
          const nearest = findNearestLab(latitude, longitude);
          setFoundLab(nearest);
        },
        (error) => console.warn("Initial auto-locate declined or failed:", error),
        { enableHighAccuracy: true }
      );
    }

    const handleLocateLabs = () => {
      if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser");
        return;
      }

      setIsLocatingLab(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserCoords({ lat: latitude, lng: longitude });
          
          fetchLocationDetails(latitude, longitude);

          const nearest = findNearestLab(latitude, longitude);
          setFoundLab(nearest);
          setShowLabModal(true);
          setIsLocatingLab(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Failed to get your location. Please ensure location access is allowed.");
          setIsLocatingLab(false);
        },
        { enableHighAccuracy: true }
      );
    };

    window.addEventListener('locate-labs', handleLocateLabs);
    return () => window.removeEventListener('locate-labs', handleLocateLabs);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  useEffect(() => {
    // Define the global callback BEFORE adding the script
    window.googleTranslateElementInit = () => {
      try {
        if (window.google && window.google.translate) {
          new window.google.translate.TranslateElement({
            pageLanguage: 'en',
            includedLanguages: 'en,hi,ta,te,ml,bn,mr,or,gu',
            autoDisplay: false
          }, 'google_translate_element');
        }
      } catch (err) {
        console.error("Google Translate Init Error:", err);
      }
    };

    // Only add script if it doesn't exist
    if (!document.getElementById('google-translate-script')) {
      const addScript = document.createElement('script');
      addScript.id = 'google-translate-script';
      addScript.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      addScript.async = true;
      addScript.defer = true;
      document.body.appendChild(addScript);
    }
  }, []);

  const [analysisData, setAnalysisData] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Mock Analysis Output
  const handleAnalyze = (formData) => {
    setIsAnalyzing(true);
    // Simulate ML algorithmic delay
    setTimeout(() => {
      const algorithmicData = evaluateSoil(formData);
      setAnalysisData(algorithmicData);
      setIsAnalyzing(false);
    }, 1500);
  };

  const resetAnalysis = () => {
    setAnalysisData(null);
  };

  return (
    <div className="app-container" style={{ minHeight: '100vh', padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Header */}
      <header style={{ textAlign: 'center', marginBottom: '40px', maxWidth: '800px', width: '100%' }}>
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', marginBottom: '15px' }}>
            <div style={{ background: 'var(--accent-glow)', padding: '12px', borderRadius: '16px' }}>
              <Leaf color="var(--accent-primary)" size={32} />
            </div>
            <h1 style={{ fontSize: '2.5rem', color: 'var(--text-primary)' }}>
              FARM <span style={{ color: 'var(--accent-primary)' }}>AI</span>
            </h1>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
            AI-Powered Soil Analysis & Crop Recommendation Platform
          </p>
        </motion.div>
        
        {/* Controls: Theme & Language */}
        <div style={{ position: 'absolute', top: '20px', right: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          
          {/* Weather & Location Info */}
          {(weatherData || userAddress) && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '15px',
                background: 'var(--glass-bg)',
                border: '1px solid var(--glass-border)',
                borderRadius: '100px',
                padding: '4px 20px',
                marginRight: '10px'
              }}
            >
              {userAddress && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', borderRight: weatherData ? '1px solid var(--glass-border)' : 'none', paddingRight: weatherData ? '12px' : '0' }}>
                  <MapPin size={16} color="var(--accent-primary)" />
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: '600' }}>{userAddress}</span>
                </div>
              )}
              
              {weatherData && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Activity size={16} color="var(--accent-blue)" />
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{weatherData.temp}°C</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Droplets size={16} color="var(--accent-primary)" />
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{weatherData.humidity}%</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', opacity: 0.8 }}>
                    <Sun size={16} color="#fbbf24" />
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{weatherData.condition}</span>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Custom Language Selection */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            background: 'var(--glass-bg)', 
            border: '1px solid var(--glass-border)', 
            borderRadius: '100px', 
            padding: '4px 8px',
            boxShadow: 'var(--shadow-card)'
          }}>
            <Languages size={18} style={{ marginLeft: '8px', color: 'var(--accent-primary)' }} />
            <select 
              id="language-select"
              onChange={(e) => {
                const lang = e.target.value;
                let retries = 0;
                const triggerTranslation = () => {
                  const selectElement = document.querySelector('.goog-te-combo');
                  if (selectElement) {
                    selectElement.value = lang;
                    selectElement.dispatchEvent(new Event('change'));
                    return true;
                  }
                  retries++;
                  if (retries < 10) {
                    setTimeout(triggerTranslation, 500);
                  }
                  return false;
                };

                triggerTranslation();
              }}
              style={{ 
                background: 'transparent', 
                border: 'none', 
                color: 'var(--text-primary)', 
                padding: '6px 12px', 
                fontSize: '0.95rem', 
                fontWeight: '600',
                outline: 'none',
                cursor: 'pointer',
                fontFamily: 'Outfit, sans-serif'
              }}
            >
              <option value="en" style={{background: 'var(--bg-secondary)'}}>English</option>
              <option value="hi" style={{background: 'var(--bg-secondary)'}}>Hindi (हिन्दी)</option>
              <option value="ta" style={{background: 'var(--bg-secondary)'}}>Tamil (தமிழ்)</option>
              <option value="te" style={{background: 'var(--bg-secondary)'}}>Telugu (తెలుగు)</option>
              <option value="ml" style={{background: 'var(--bg-secondary)'}}>Malayalam (മലയാളം)</option>
              <option value="bn" style={{background: 'var(--bg-secondary)'}}>Bengali (বাংলা)</option>
              <option value="mr" style={{background: 'var(--bg-secondary)'}}>Marathi (मराठी)</option>
              <option value="gu" style={{background: 'var(--bg-secondary)'}}>Gujarati (ગુજરાતી)</option>
              <option value="or" style={{background: 'var(--bg-secondary)'}}>Odia (ଓଡ଼ିଆ)</option>
            </select>
          </div>

          {/* Hidden Google Translate Widget Engine - Kept at 1px to ensure it initializes properly */}
          <div 
            id="google_translate_element" 
            style={{ 
              position: 'fixed', 
              bottom: '0', 
              right: '0', 
              opacity: 0, 
              pointerEvents: 'none', 
              zIndex: -1,
              width: '1px',
              height: '1px', 
              overflow: 'hidden'
            }}
          ></div>
          
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            style={{ padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '50%', color: 'var(--accent-primary)', cursor: 'pointer', transition: 'all 0.3s' }}
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ maxWidth: '1000px', width: '100%', position: 'relative' }}>
        <AnimatePresence mode="wait">
          {!hasStarted ? (
            <motion.div
              key="start-page"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
              transition={{ duration: 0.4 }}
            >
              <StartPage onStart={() => setHasStarted(true)} />
            </motion.div>
          ) : !analysisData ? (
            <motion.div
              key="input-form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20, filter: 'blur(10px)' }}
              transition={{ duration: 0.4 }}
            >
              <SoilInputForm 
                onSubmit={handleAnalyze} 
                isAnalyzing={isAnalyzing} 
                detectedLocation={userAddress}
                userCoords={userCoords}
              />
            </motion.div>
          ) : (
            <motion.div
              key="results-display"
              initial={{ opacity: 0, x: 20, filter: 'blur(10px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.5 }}
            >
              <ResultsDisplay data={analysisData} onBack={resetAnalysis} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      
      {/* Footer background styling */}
      <div style={{ position: 'fixed', bottom: '-20%', left: '-10%', width: '120%', height: '50%', background: 'radial-gradient(ellipse at bottom, rgba(192, 132, 252, 0.15) 0%, transparent 60%)', zIndex: -1, pointerEvents: 'none' }} />

      {/* Soil Testing Labs Modal */}
      <AnimatePresence>
        {showLabModal && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-panel" 
              style={{ width: '90%', maxWidth: '500px', padding: '40px', position: 'relative' }}
            >
              <button onClick={() => setShowLabModal(false)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
              
              <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <div style={{ background: 'var(--accent-glow)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <MapPin color="var(--accent-primary)" size={32} />
                </div>
                <h2 style={{ color: 'var(--text-primary)' }}>Nearest Soil Testing Lab</h2>
                <p style={{ color: 'var(--text-secondary)' }}>Based on your current GPS location</p>
              </div>

              {foundLab ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ background: 'var(--glass-highlight)', padding: '24px', borderRadius: '16px', border: '1px solid var(--accent-primary)' }}>
                    <h3 style={{ color: 'var(--accent-primary)', marginBottom: '8px' }}>{foundLab.place} District Lab</h3>
                    <p style={{ color: 'var(--text-primary)', fontSize: '1.1rem', lineHeight: '1.4' }}>{foundLab.address}</p>
                    <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-blue)', fontWeight: 'bold' }}>
                      <Activity size={18} /> Approximately {foundLab.distance} km away
                    </div>
                  </div>

                  {/* High Accuracy Minimap */}
                  <LabMap 
                    userCoords={userCoords} 
                    labCoords={{ lat: foundLab.lat, lng: foundLab.lng }} 
                    labName={`${foundLab.place} Lab`}
                  />

                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
                    Source: TNAU Agritech Portal
                  </p>
                  <button onClick={() => setShowLabModal(false)} className="btn-primary" style={{ width: '100%' }}>BOOK NOW</button>
                </div>
              ) : (
                <p style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>No labs found nearby. Please try again.</p>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Loading Overlay for Lab Locating */}
      <AnimatePresence>
        {isLocatingLab && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 2100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(20px)' }}>
            <div style={{ textAlign: 'center' }}>
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} style={{ marginBottom: '20px' }}>
                <MapPin size={60} color="var(--accent-primary)" />
              </motion.div>
              <h2 style={{ color: 'var(--text-primary)' }}>Locating Nearest Lab...</h2>
              <p style={{ color: 'var(--text-secondary)' }}>Triangulating GPS coordinates</p>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
