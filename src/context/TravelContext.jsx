import React, { createContext, useState, useEffect } from 'react';
import { DESTINATIONS, MOCK_ITINERARIES, generateFallbackItinerary, MOCK_LOCAL_LISTINGS } from '../data/mockData';

export const TravelContext = createContext();

export const TravelProvider = ({ children }) => {
  // Onboarding parameters
  const [onboardingData, setOnboardingData] = useState(() => {
    const saved = localStorage.getItem('tripz_onboarding');
    return saved ? JSON.parse(saved) : {
      budget: 15000,
      days: 3,
      interests: [],
      startDate: '',
      endDate: '',
      travelStyle: 'solo',
      transport: 'Bus',
      groupCode: ''
    };
  });

  const [selectedDestination, setSelectedDestination] = useState(() => {
    return localStorage.getItem('tripz_selected_dest') || '';
  });

  const [itinerary, setItinerary] = useState(() => {
    const saved = localStorage.getItem('tripz_itinerary');
    return saved ? JSON.parse(saved) : null;
  });

  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('tripz_expenses');
    return saved ? JSON.parse(saved) : [];
  });

  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem('tripz_claude_key') || '';
  });

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- NEW STATES FOR V2 FEATURE-EXTENDED ---
  
  // Group Room State
  const [groupRoom, setGroupRoom] = useState(() => {
    const saved = localStorage.getItem('tripz_group_room');
    return saved ? JSON.parse(saved) : null;
  });

  // Crowd Check-ins State
  const [crowdCheckIns, setCrowdCheckIns] = useState(() => {
    const saved = localStorage.getItem('tripz_crowd_checkins');
    // Pre-populate with some fresh mock signals for dynamic UI out of the box
    return saved ? JSON.parse(saved) : [
      { id: 'c1', destinationId: 'goa', level: 'high', timestamp: Date.now() - 3600000 },
      { id: 'c2', destinationId: 'goa', level: 'high', timestamp: Date.now() - 7200000 },
      { id: 'c3', destinationId: 'munnar', level: 'low', timestamp: Date.now() - 1800000 }
    ];
  });

  // Offline Mode (Simulated status toggle)
  const [isOfflineSimulated, setIsOfflineSimulated] = useState(false);

  // Local Listings state (homestays, guides)
  const [localListings, setLocalListings] = useState(() => {
    const saved = localStorage.getItem('tripz_local_listings');
    if (saved) return JSON.parse(saved);
    const initialList = [];
    Object.keys(MOCK_LOCAL_LISTINGS).forEach(destId => {
      MOCK_LOCAL_LISTINGS[destId].forEach(listing => {
        initialList.push({ ...listing, destinationId: destId });
      });
    });
    return initialList;
  });

  // SOS status
  const [sosStatus, setSosStatus] = useState(() => {
    const saved = localStorage.getItem('tripz_sos_status');
    return saved ? JSON.parse(saved) : { active: false, location: null, timestamp: null };
  });

  // SOS Event Logs
  const [sosLogs, setSosLogs] = useState(() => {
    const saved = localStorage.getItem('tripz_sos_logs');
    return saved ? JSON.parse(saved) : [];
  });

  // Personal Emergency Contact
  const [emergencyContacts, setEmergencyContacts] = useState(() => {
    const saved = localStorage.getItem('tripz_emergency_contacts');
    return saved ? JSON.parse(saved) : { name: 'Aashish (Friend)', phone: '+91 98765 43210', relationship: 'Emergency Contact' };
  });

  // --- SAVE STATES TO LOCAL STORAGE ---
  useEffect(() => {
    localStorage.setItem('tripz_onboarding', JSON.stringify(onboardingData));
  }, [onboardingData]);

  useEffect(() => {
    localStorage.setItem('tripz_selected_dest', selectedDestination);
  }, [selectedDestination]);

  useEffect(() => {
    if (itinerary) {
      localStorage.setItem('tripz_itinerary', JSON.stringify(itinerary));
    } else {
      localStorage.removeItem('tripz_itinerary');
    }
  }, [itinerary]);

  useEffect(() => {
    localStorage.setItem('tripz_expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('tripz_claude_key', apiKey);
  }, [apiKey]);

  useEffect(() => {
    localStorage.setItem('tripz_group_room', JSON.stringify(groupRoom));
  }, [groupRoom]);

  useEffect(() => {
    localStorage.setItem('tripz_crowd_checkins', JSON.stringify(crowdCheckIns));
  }, [crowdCheckIns]);

  useEffect(() => {
    localStorage.setItem('tripz_local_listings', JSON.stringify(localListings));
  }, [localListings]);

  useEffect(() => {
    localStorage.setItem('tripz_sos_status', JSON.stringify(sosStatus));
  }, [sosStatus]);

  useEffect(() => {
    localStorage.setItem('tripz_sos_logs', JSON.stringify(sosLogs));
  }, [sosLogs]);

  useEffect(() => {
    localStorage.setItem('tripz_emergency_contacts', JSON.stringify(emergencyContacts));
  }, [emergencyContacts]);

  // --- HELPER FUNCTIONS ---

  // Group Management
  const createGroupRoom = (hostName = 'You (Host)') => {
    const code = `TRIPZ-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const newRoom = {
      id: Date.now().toString(),
      inviteCode: code,
      members: [
        { id: 'you', name: hostName, budget: onboardingData.budget, interests: onboardingData.interests }
      ]
    };
    setGroupRoom(newRoom);
    setOnboardingData(prev => ({
      ...prev,
      travelStyle: 'friends',
      groupCode: code
    }));
    return code;
  };

  const joinGroupRoom = (code, userName = 'You') => {
    const roomCode = code.toUpperCase().trim();
    // Simulate other friends joining to provide dummy data for split & voting screens
    const newRoom = {
      id: Date.now().toString(),
      inviteCode: roomCode,
      members: [
        { id: 'you', name: userName, budget: onboardingData.budget, interests: onboardingData.interests },
        { id: 'aashish', name: 'Aashish', budget: Math.round(onboardingData.budget * 0.8), interests: ['beach', 'nightlife', 'food'] },
        { id: 'riya', name: 'Riya', budget: Math.round(onboardingData.budget * 1.2), interests: ['adventure', 'waterfall', 'food'] }
      ]
    };
    setGroupRoom(newRoom);
    setOnboardingData(prev => ({
      ...prev,
      travelStyle: 'friends',
      groupCode: roomCode
    }));
  };

  const updateMemberPreferences = (memberId, budgetVal, interestsList) => {
    if (!groupRoom) return;
    setGroupRoom(prev => {
      const updatedMembers = prev.members.map(m => {
        if (m.id === memberId) {
          return { ...m, budget: parseInt(budgetVal, 10), interests: interestsList };
        }
        return m;
      });
      return { ...prev, members: updatedMembers };
    });
  };

  const leaveGroupRoom = () => {
    setGroupRoom(null);
    setOnboardingData(prev => ({
      ...prev,
      travelStyle: 'solo',
      groupCode: ''
    }));
    setExpenses([]);
  };

  // Crowd Signals
  const addCrowdCheckIn = (destinationId, level) => {
    setCrowdCheckIns(prev => [
      {
        id: Date.now().toString(),
        destinationId,
        level,
        timestamp: Date.now()
      },
      ...prev
    ]);
  };

  // Local Listings submissions
  const addLocalListing = (destinationId, listing) => {
    setLocalListings(prev => [
      {
        id: Date.now().toString(),
        destinationId,
        verified: false,
        rating: 5.0,
        ...listing
      },
      ...prev
    ]);
  };

  // SOS activation
  const triggerSOS = (lat, lng) => {
    const timestamp = new Date().toLocaleTimeString();
    const date = new Date().toLocaleDateString();
    const newLog = {
      id: Date.now().toString(),
      timestamp,
      date,
      location: { lat, lng },
      status: 'Active',
      notified: ['Local Police Dept', emergencyContacts.name]
    };
    setSosStatus({
      active: true,
      location: { lat, lng },
      timestamp: `${date} ${timestamp}`
    });
    setSosLogs(prev => [newLog, ...prev]);
  };

  const resolveSOS = () => {
    setSosStatus({ active: false, location: null, timestamp: null });
    setSosLogs(prev => prev.map(log => log.status === 'Active' ? { ...log, status: 'Resolved' } : log));
  };

  // Carbon Emission calculation details
  // Emission constants (gCO2 per km per passenger)
  // Flight: 250, Car: 170, Bus: 80, Train: 30, Eco-Car (Electric): 40
  const getCarbonFootprint = () => {
    if (!itinerary) return 0;
    
    let factor = 80; // Bus default
    switch (onboardingData.transport) {
      case 'Flight': factor = 250; break;
      case 'Car': factor = 170; break;
      case 'Train': factor = 30; break;
      case 'Eco-Car': factor = 40; break;
      default: factor = 80;
    }

    // Calculate a rough distance by stops coordinates
    let totalDistKm = 0;
    itinerary.days.forEach(day => {
      const stops = day.stops || [];
      for (let i = 0; i < stops.length - 1; i++) {
        // Simple Euclidean distance multiplier for lat/lng (1 degree ~ 111 km)
        const dx = (stops[i+1].lng - stops[i].lng) * 111;
        const dy = (stops[i+1].lat - stops[i].lat) * 111;
        totalDistKm += Math.sqrt(dx*dx + dy*dy);
      }
    });

    if (totalDistKm === 0) {
      totalDistKm = onboardingData.days * 45; // simulated default daily distance
    }

    // Return in kg of CO2
    return Math.round((totalDistKm * factor) / 1000);
  };

  // Scoring function for recommendations
  const getRecommendations = () => {
    const { budget, days, interests, startDate } = onboardingData;
    
    // Find travel month if date is provided
    let travelMonth = '';
    if (startDate) {
      const date = new Date(startDate);
      travelMonth = date.toLocaleString('default', { month: 'long' });
    }

    return DESTINATIONS.map(dest => {
      let score = 0;
      let reasons = [];

      // Interest fit: 20 points per overlap
      const matchingInterests = dest.tags.filter(tag => interests.includes(tag));
      score += matchingInterests.length * 20;
      if (matchingInterests.length > 0) {
        reasons.push(`Matches your interest in ${matchingInterests.join(', ')}`);
      }

      // Budget fit: daily budget * days vs total budget
      const totalEstimatedCost = dest.avg_daily_budget * days;
      if (totalEstimatedCost <= budget) {
        score += 30;
        reasons.push(`Budget-friendly: Estimated trip cost is ₹${totalEstimatedCost}`);
      } else if (totalEstimatedCost <= budget * 1.3) {
        score += 10;
        reasons.push(`Slightly above budget: Estimated trip cost is ₹${totalEstimatedCost}`);
      } else {
        score -= 20; // penalize too expensive
      }

      // Season fit
      if (travelMonth && dest.best_months.includes(travelMonth)) {
        score += 25;
        reasons.push(`${travelMonth} is one of the best times to visit`);
      }

      // Eco friendly bonus
      const ecoScore = dest.eco_score || 75;
      score += Math.round((ecoScore - 70) * 0.5); // bonus for higher eco score
      if (ecoScore >= 85) {
        reasons.push(`High Sustainability Rating (${ecoScore}/100)`);
      }

      // Live Crowd Signals
      const recentCheckins = crowdCheckIns.filter(c => c.destinationId === dest.id && (Date.now() - c.timestamp) < 6 * 60 * 60 * 1000);
      if (recentCheckins.length > 0) {
        const busyCount = recentCheckins.filter(c => c.level === 'high').length;
        const quietCount = recentCheckins.filter(c => c.level === 'low').length;
        if (busyCount > quietCount) {
          score -= 15;
          reasons.push(`Live Crowd: Currently busy (Avoid peaks)`);
        } else if (quietCount > busyCount) {
          score += 15;
          reasons.push(`Live Crowd: Currently quiet (Great timing)`);
        }
      }

      return {
        ...dest,
        score,
        reasons,
        totalEstimatedCost
      };
    })
    .sort((a, b) => b.score - a.score);
  };

  // Generate Itinerary (Local template + optional Claude API)
  const generateItinerary = async (destinationId) => {
    // Check simulated offline mode
    if (isOfflineSimulated || !navigator.onLine) {
      setError("Cannot generate itinerary: Device is currently offline.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    // Resolve group inputs if active group trip
    let finalBudget = onboardingData.budget;
    let finalInterests = [...onboardingData.interests];
    let finalDays = onboardingData.days;

    if (groupRoom && groupRoom.members.length > 0) {
      // Merge preferences: average budget
      const budgets = groupRoom.members.map(m => m.budget);
      finalBudget = Math.round(budgets.reduce((a, b) => a + b, 0) / budgets.length);
      
      // Union of interests
      const allInterests = new Set();
      groupRoom.members.forEach(m => m.interests.forEach(i => allInterests.add(i)));
      finalInterests = Array.from(allInterests);
    }

    try {
      if (apiKey) {
        const userPrompt = `
          Generate a 100% valid JSON travel itinerary for:
          Destination: ${destinationId}
          Duration: ${finalDays} days
          Budget: ₹${finalBudget}
          Interests: ${finalInterests.join(', ')}
          Start Date: ${onboardingData.startDate || 'Tomorrow'}
          
          Respond ONLY with a JSON object. Do not include markdown code block syntax. Follow this exact schema:
          {
            "days": [
              {
                "day": 1,
                "date": "Day 1",
                "morning": "Detailed morning activity details...",
                "afternoon": "Detailed afternoon activity details...",
                "evening": "Detailed evening activity details...",
                "estimated_cost": 1500,
                "travel_notes": "Rent a bike etc...",
                "stops": [
                  { "name": "Stop 1 Name", "lat": 15.54, "lng": 73.76 },
                  { "name": "Stop 2 Name", "lat": 15.55, "lng": 73.77 }
                ]
              }
            ]
          }
        `;

        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
            'content-type': 'application/json',
            'dangerously-allow-browser': 'true'
          },
          body: JSON.stringify({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 4000,
            messages: [{ role: 'user', content: userPrompt }],
            system: "You are a travel assistant. You generate structured JSON itineraries. Return ONLY the JSON object, NO explanations, NO surrounding markdown. Ensure the JSON is parseable."
          })
        });

        if (!response.ok) {
          throw new Error(`API returned error: ${response.statusText}`);
        }

        const data = await response.json();
        const textResponse = data.content[0].text.trim();
        const cleanedJson = textResponse.replace(/^```json/, '').replace(/```$/, '').trim();
        const parsed = JSON.parse(cleanedJson);
        setItinerary(parsed);
      } else {
        // Fallback simulated generation
        await new Promise(resolve => setTimeout(resolve, 1200));
        
        if (MOCK_ITINERARIES[destinationId]) {
          const template = MOCK_ITINERARIES[destinationId];
          let finalDaysArray = [];
          for (let i = 0; i < finalDays; i++) {
            const templateDay = template.days[i % template.days.length];
            finalDaysArray.push({
              ...templateDay,
              day: i + 1,
              date: `Day ${i + 1}`,
              estimated_cost: Math.round(templateDay.estimated_cost * (0.8 + Math.random() * 0.4))
            });
          }
          setItinerary({ days: finalDaysArray });
        } else {
          const generated = generateFallbackItinerary(destinationId, finalDays, finalInterests);
          setItinerary(generated);
        }
      }
    } catch (err) {
      console.error(err);
      setError("AI generation failed. Loading simulated local itinerary instead.");
      if (MOCK_ITINERARIES[destinationId]) {
        const template = MOCK_ITINERARIES[destinationId];
        setItinerary({
          days: template.days.slice(0, finalDays).map((d, index) => ({ ...d, day: index + 1, date: `Day ${index + 1}` }))
        });
      } else {
        setItinerary(generateFallbackItinerary(destinationId, finalDays, finalInterests));
      }
    } finally {
      setLoading(false);
    }
  };

  // Regenerate a single day
  const regenerateDay = async (dayNumber) => {
    if (isOfflineSimulated || !navigator.onLine) {
      alert("Tweak feature is unavailable offline.");
      return;
    }
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate loading
    setItinerary(prev => {
      if (!prev) return null;
      const updatedDays = prev.days.map(d => {
        if (d.day === dayNumber) {
          const activities = [
            { morning: "Relaxed breakfast at a local bakery followed by reading by the lakeside/beach.", afternoon: "Walk through local spice market and handicraft shopping.", evening: "Scenic sunset stroll followed by dynamic dinner at a local fusion bistro." },
            { morning: "Sunrise photography session and cycle tour of surrounding villages.", afternoon: "Traditional local cooking workshop with organic farmers.", evening: "Live music performance at a rooftop cafe and sampling street food." },
            { morning: "Early guided nature trail hike to a local panoramic point.", afternoon: "Rest in a historical library cafe and try local hand-brewed coffees.", evening: "Ganga Aarti or local folk performance and riverside dinner." }
          ];
          const chosen = activities[Math.floor(Math.random() * activities.length)];
          return {
            ...d,
            ...chosen,
            estimated_cost: Math.round(d.estimated_cost * 0.9)
          };
        }
        return d;
      });
      return { days: updatedDays };
    });
    setLoading(false);
  };

  // Expense tracker functions
  const addExpense = (title, amount, category, paidBy = 'you', splitAmong = ['you'], splitType = 'equal', customSplits = null) => {
    setExpenses(prev => [...prev, {
      id: Date.now().toString(),
      title,
      amount: parseFloat(amount) || 0,
      category,
      paidBy,
      splitAmong,
      splitType,
      customSplits,
      date: new Date().toLocaleDateString()
    }]);
  };

  const deleteExpense = (id) => {
    setExpenses(prev => prev.filter(exp => exp.id !== id));
  };

  const getPlannedBudgetTotal = () => {
    if (!itinerary) return 0;
    return itinerary.days.reduce((acc, d) => acc + d.estimated_cost, 0);
  };

  // Calculate settlement rules (greedy algorithm for split bills)
  const getSettlements = () => {
    if (!groupRoom) return [];
    
    // Initialize balances for all group members
    const balances = {};
    groupRoom.members.forEach(m => {
      balances[m.id] = 0;
    });

    expenses.forEach(exp => {
      const amount = parseFloat(exp.amount) || 0;
      const paidBy = exp.paidBy || 'you';
      const splitAmong = exp.splitAmong || ['you'];
      const splitType = exp.splitType || 'equal';
      const customSplits = exp.customSplits || {};

      // Add to the payer
      if (balances[paidBy] !== undefined) {
        balances[paidBy] += amount;
      }

      // Subtract from the splitters
      if (splitType === 'equal') {
        const share = amount / Math.max(1, splitAmong.length);
        splitAmong.forEach(mId => {
          if (balances[mId] !== undefined) {
            balances[mId] -= share;
          }
        });
      } else {
        // Custom split
        splitAmong.forEach(mId => {
          const share = parseFloat(customSplits[mId]) || 0;
          if (balances[mId] !== undefined) {
            balances[mId] -= share;
          }
        });
      }
    });

    // Solve the debts (greedy algorithm)
    const creditors = [];
    const debtors = [];

    Object.keys(balances).forEach(mId => {
      const bal = balances[mId];
      const memberName = groupRoom.members.find(m => m.id === mId)?.name || mId;
      if (bal > 0.01) {
        creditors.push({ id: mId, name: memberName, balance: bal });
      } else if (bal < -0.01) {
        debtors.push({ id: mId, name: memberName, balance: Math.abs(bal) });
      }
    });

    // Sort creditors descending, debtors descending
    creditors.sort((a, b) => b.balance - a.balance);
    debtors.sort((a, b) => b.balance - a.balance);

    const transactions = [];
    let cIdx = 0;
    let dIdx = 0;

    // Shallow copy balances for manipulation
    const tempCreditors = creditors.map(c => ({ ...c }));
    const tempDebtors = debtors.map(d => ({ ...d }));

    while (cIdx < tempCreditors.length && dIdx < tempDebtors.length) {
      const creditor = tempCreditors[cIdx];
      const debtor = tempDebtors[dIdx];

      const amountToSettle = Math.min(creditor.balance, debtor.balance);
      
      transactions.push({
        from: debtor.name,
        fromId: debtor.id,
        to: creditor.name,
        toId: creditor.id,
        amount: Math.round(amountToSettle * 100) / 100
      });

      creditor.balance -= amountToSettle;
      debtor.balance -= amountToSettle;

      if (creditor.balance < 0.01) cIdx++;
      if (debtor.balance < 0.01) dIdx++;
    }

    return transactions;
  };

  const toggleChat = (forceState) => {
    setIsChatOpen(prev => forceState !== undefined ? forceState : !prev);
  };

  return (
    <TravelContext.Provider value={{
      onboardingData,
      setOnboardingData,
      selectedDestination,
      setSelectedDestination,
      itinerary,
      setItinerary,
      expenses,
      addExpense,
      deleteExpense,
      getPlannedBudgetTotal,
      apiKey,
      setApiKey,
      loading,
      error,
      getRecommendations,
      generateItinerary,
      regenerateDay,
      isChatOpen,
      setIsChatOpen,
      toggleChat,

      // Exported V2 States & functions
      groupRoom,
      setGroupRoom,
      createGroupRoom,
      joinGroupRoom,
      leaveGroupRoom,
      updateMemberPreferences,
      
      crowdCheckIns,
      addCrowdCheckIn,
      
      isOfflineSimulated,
      setIsOfflineSimulated,
      
      localListings,
      addLocalListing,
      
      sosStatus,
      triggerSOS,
      resolveSOS,
      sosLogs,
      
      emergencyContacts,
      setEmergencyContacts,
      
      getCarbonFootprint,
      getSettlements
    }}>
      {children}
    </TravelContext.Provider>
  );
};
