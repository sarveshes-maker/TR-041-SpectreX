export const CROP_DATABASE = [
  // Fruits
  { crop: 'Mango', minPH: 6.5, maxPH: 8.0, nNeeded: 'Medium', pNeeded: 'Low', kNeeded: 'High', minMoisture: 40, maxMoisture: 60, emoji: '🥭' },
  { crop: 'Banana', minPH: 6.5, maxPH: 7.5, nNeeded: 'High', pNeeded: 'Medium', kNeeded: 'High', minMoisture: 70, maxMoisture: 80, emoji: '🍌' },
  { crop: 'Papaya', minPH: 5.5, maxPH: 7.0, nNeeded: 'High', pNeeded: 'High', kNeeded: 'Medium', minMoisture: 60, maxMoisture: 75, emoji: '🍈' },
  { crop: 'Guava', minPH: 4.5, maxPH: 8.2, nNeeded: 'Medium', pNeeded: 'Medium', kNeeded: 'Low', minMoisture: 40, maxMoisture: 50, emoji: '🍐' },
  
  // Vegetables
  { crop: 'Chili', minPH: 6.5, maxPH: 7.5, nNeeded: 'Medium', pNeeded: 'High', kNeeded: 'High', minMoisture: 50, maxMoisture: 60, emoji: '🌶️' },
  { crop: 'Onion', minPH: 6.0, maxPH: 7.0, nNeeded: 'High', pNeeded: 'High', kNeeded: 'High', minMoisture: 65, maxMoisture: 75, emoji: '🧅' },
  { crop: 'Potato', minPH: 5.0, maxPH: 5.5, nNeeded: 'Medium', pNeeded: 'High', kNeeded: 'High', minMoisture: 70, maxMoisture: 80, emoji: '🥔' },
  { crop: 'Tomato', minPH: 6.5, maxPH: 7.5, nNeeded: 'High', pNeeded: 'High', kNeeded: 'High', minMoisture: 60, maxMoisture: 70, emoji: '🍅' },
  
  // Commercial & Field Crops
  { crop: 'Cotton', minPH: 6.0, maxPH: 8.0, nNeeded: 'High', pNeeded: 'Medium', kNeeded: 'Low', minMoisture: 50, maxMoisture: 65, emoji: '☁️' },
  { crop: 'Sugarcane', minPH: 6.5, maxPH: 7.5, nNeeded: 'High', pNeeded: 'Medium', kNeeded: 'Medium', minMoisture: 75, maxMoisture: 85, emoji: '🎋' },
  { crop: 'Groundnut', minPH: 6.0, maxPH: 7.5, nNeeded: 'Low', pNeeded: 'High', kNeeded: 'Medium', minMoisture: 50, maxMoisture: 60, emoji: '🥜' },
  { crop: 'Mustard', minPH: 6.0, maxPH: 7.5, nNeeded: 'Medium', pNeeded: 'Medium', kNeeded: 'Low', minMoisture: 30, maxMoisture: 40, emoji: '🌼' },
  { crop: 'Soybean', minPH: 6.0, maxPH: 7.5, nNeeded: 'Low', pNeeded: 'High', kNeeded: 'Medium', minMoisture: 60, maxMoisture: 70, emoji: '🌱' },
  
  // Cereals & Millets
  { crop: 'Rice', minPH: 5.0, maxPH: 6.5, nNeeded: 'High', pNeeded: 'Medium', kNeeded: 'Medium', minMoisture: 85, maxMoisture: 95, emoji: '🌾' },
  { crop: 'Wheat', minPH: 6.0, maxPH: 7.5, nNeeded: 'High', pNeeded: 'Medium', kNeeded: 'Low', minMoisture: 40, maxMoisture: 50, emoji: '🌾' },
  { crop: 'Finger Millet (Ragi)', minPH: 4.5, maxPH: 8.0, nNeeded: 'Low', pNeeded: 'Medium', kNeeded: 'Low', minMoisture: 30, maxMoisture: 40, emoji: '🌾' },
  { crop: 'Pearl Millet (Bajra)', minPH: 6.5, maxPH: 7.5, nNeeded: 'Low', pNeeded: 'Low', kNeeded: 'Low', minMoisture: 25, maxMoisture: 35, emoji: '🌾' },
  { crop: 'Sorghum (Jowar)', minPH: 6.0, maxPH: 7.5, nNeeded: 'Medium', pNeeded: 'Medium', kNeeded: 'Low', minMoisture: 35, maxMoisture: 45, emoji: '🌿' },
  { crop: 'Maize', minPH: 5.5, maxPH: 7.5, nNeeded: 'High', pNeeded: 'High', kNeeded: 'Medium', minMoisture: 60, maxMoisture: 70, emoji: '🌽' }
];

const getRating = (val, nut) => {
  if (nut === 'N') return val >= 100 ? 'High' : val >= 50 ? 'Medium' : 'Low';
  if (nut === 'P') return val >= 40 ? 'High' : val >= 20 ? 'Medium' : 'Low';
  if (nut === 'K') return val >= 40 ? 'High' : val >= 20 ? 'Medium' : 'Low';
};

const getNutrientPenalty = (needed, actual) => {
    const levels = { 'Low': 1, 'Medium': 2, 'High': 3 };
    const diff = levels[needed] - levels[actual];
    if (diff > 0) return diff * 15; // Extensively punish missing nutrients heavily
    if (diff < 0) return Math.abs(diff) * 2; // Minimal punishment for excessive nutrients
    return 0;
};

export const evaluateSoil = (formData) => {
  const pH = parseFloat(formData.pH);
  const N = parseInt(formData.nitrogen);
  const P = parseInt(formData.phosphorus);
  const K = parseInt(formData.potassium);
  const moisture = parseInt(formData.moisture);
  const preferred = formData.preferredCrop;

  const actualN = getRating(N, 'N');
  const actualP = getRating(P, 'P');
  const actualK = getRating(K, 'K');

  let results = CROP_DATABASE.map(crop => {
    let score = 100;
    let issues = [];
    let requiredFixes = [];

    // Evaluate pH
    if (pH < crop.minPH) {
      const diff = crop.minPH - pH;
      score -= diff * 15;
      issues.push(`pH is too acidic (Needs ${crop.minPH}-${crop.maxPH})`);
      requiredFixes.push(`Apply ${Math.ceil(diff*200)}kg agricultural lime per hectare to neutralize acidity.`);
    } else if (pH > crop.maxPH) {
      const diff = pH - crop.maxPH;
      score -= diff * 15;
      issues.push(`pH is too alkaline (Needs ${crop.minPH}-${crop.maxPH})`);
      requiredFixes.push(`Apply elemental sulfur or gypsum to safely lower soil pH.`);
    }

    // Evaluate Moisture
    if (moisture < crop.minMoisture) {
      const diff = crop.minMoisture - moisture;
      score -= diff * 1.5;
      issues.push(`Moisture deficit (Needs ${crop.minMoisture}%)`);
      requiredFixes.push(`Intensify irrigation schedule. Target soil moisture is ${crop.minMoisture}-${crop.maxMoisture}%.`);
    } else if (moisture > crop.maxMoisture) {
      const diff = moisture - crop.maxMoisture;
      score -= diff * 1.5;
      issues.push(`Excess moisture / waterlogging risk (Max ${crop.maxMoisture}%)`);
      requiredFixes.push(`Improve soil drainage mechanisms to prevent destructive root rot.`);
    }

    // Evaluate NPK
    const penN = getNutrientPenalty(crop.nNeeded, actualN);
    if (penN > 0) {
        score -= penN;
        requiredFixes.push(`Nitrogen Deficient: Apply Urea or DAP top dressing. Crop requires ${crop.nNeeded} N.`);
    }
    const penP = getNutrientPenalty(crop.pNeeded, actualP);
    if (penP > 0) {
        score -= penP;
        requiredFixes.push(`Phosphorus Deficient: Add basal dose of SSP or DAP. Crop requires ${crop.pNeeded} P.`);
    }
    const penK = getNutrientPenalty(crop.kNeeded, actualK);
    if (penK > 0) {
        score -= penK;
        requiredFixes.push(`Potassium Deficient: Apply MOP (Muriate of Potash). Crop requires ${crop.kNeeded} K.`);
    }

    return {
      crop: crop.crop,
      score: Math.max(0, Math.round(score)), // Cap score at > 0
      emoji: crop.emoji,
      issues,
      requiredFixes: [...new Set(requiredFixes)] // unique fixes
    };
  });

  // Sort by highest suitability score
  results.sort((a, b) => b.score - a.score);

  // Focus analysis on preferred crop if given, else use the algorithm's #1 pick
  let primaryResult = results[0];
  if (preferred && preferred !== '') {
    const prefMatch = results.find(r => r.crop.toLowerCase() === preferred.toLowerCase());
    if (prefMatch) primaryResult = prefMatch;
  }

  // Filter out the primary crop from the secondary recommendations list
  const secondaryRecs = results.filter(r => r.crop !== primaryResult.crop);
  const finalRecommendations = [primaryResult, ...secondaryRecs].slice(0, 3);

  // Generate fertilizer plan dynamically based on needs
  let fertilizerActions = [];
  fertilizerActions.push({ day: 0, action: `Basal Dose Preparation: Adjust field to match base ${primaryResult.crop} requirements prior to sowing.` });
  
  if (primaryResult.issues.find(i => i.includes('Nitrogen'))) {
      fertilizerActions.push({ day: 30, action: 'Top Dressing Alert: Apply heavy 25kg N/ha to combat massive early deficiency.' });
  } else {
      fertilizerActions.push({ day: 30, action: 'Standard Top Dressing: Apply standard N maintenance based on commercial charts.' });
  }

  if (primaryResult.score < 60) {
      fertilizerActions.push({ day: 45, action: 'Micronutrient Rescue Spray: Immediate foliar spray highly recommended due to high soil stress environment.' });
  } else {
      fertilizerActions.push({ day: 60, action: 'Routine Check: Ensure water levels are steady during late vegetative phase.' });
  }

  let finalCorrections = primaryResult.requiredFixes.map(fix => ({ issue: "Soil Gap Detected", fix }));
  if (finalCorrections.length === 0) {
      finalCorrections.push({ issue: "Optimal Condition", fix: "Soil parameters are well-balanced for this crop. Maintain current agronomy practices." });
  }

  const advisoryText = primaryResult.score >= 80 
     ? `The algorithmic soil diagnosis indicates excellent potential (${primaryResult.score}% suitability) for ${primaryResult.crop}. No major structural corrections are required.` 
     : `The soil is highly challenging (${primaryResult.score}% suitability) for ${primaryResult.crop}. Identified problems: ${primaryResult.issues.join('. ')}. Critical interventions and heavy soil amendments are required before planting.`;

  const cropData = CROP_DATABASE.find(c => c.crop === primaryResult.crop) || CROP_DATABASE[0];

  return {
    input: formData,
    recommendations: finalRecommendations, 
    fertilizer: fertilizerActions,
    correction: finalCorrections,
    yieldStrategies: [
        { icon: 'irrigation', title: "Targeted Irrigation", detail: `Optimal moisture for ${primaryResult.crop} is firmly between ${cropData.minMoisture}% to ${cropData.maxMoisture}%. Prevent extreme swings.` },
        { icon: 'fertilizer', title: "Efficiency Dynamics", detail: `Precision farming required: Follow strict schedules. Only apply ${cropData.nNeeded} Nitrogen when necessary to prevent leaching.` },
        { icon: 'practice', title: "Growth Guarantee", detail: `Predicted Yield Capability reflects a ${primaryResult.score}% health index. ${primaryResult.score < 60 ? 'Intense care required.' : 'Solid routine maintenance is sufficient.'}` }
    ],
    advisory: {
      en: advisoryText
    }
  };
};
