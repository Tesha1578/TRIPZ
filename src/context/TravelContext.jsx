import React, { createContext, useState, useEffect } from 'react';
import { DESTINATIONS, MOCK_ITINERARIES, generateFallbackItinerary } from '../data/mockData';

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
      travelStyle: 'solo'
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

  // Save states to localStorage
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
    setLoading(true);
    setError(null);
    const { budget, days, interests, startDate } = onboardingData;

    try {
      if (apiKey) {
        // Real API Call with Anthropic API Key
        const userPrompt = `
          Generate a 100% valid JSON travel itinerary for:
          Destination: ${destinationId}
          Duration: ${days} days
          Budget: ₹${budget}
          Interests: ${interests.join(', ')}
          Start Date: ${startDate || 'Tomorrow'}
          
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
            'dangerously-allow-browser': 'true' // For frontend direct development calls
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
        // Remove code block ticks if LLM output included them
        const cleanedJson = textResponse.replace(/^```json/, '').replace(/```$/, '').trim();
        const parsed = JSON.parse(cleanedJson);
        setItinerary(parsed);
      } else {
        // Fallback simulated generation (highly styled, responsive)
        // Wait 1.5 seconds to simulate API lag
        await new Promise(resolve => setTimeout(resolve, 1200));
        
        if (MOCK_ITINERARIES[destinationId]) {
          // Adjust templates to user's duration
          const template = MOCK_ITINERARIES[destinationId];
          let finalDays = [];
          for (let i = 0; i < days; i++) {
            const templateDay = template.days[i % template.days.length];
            finalDays.push({
              ...templateDay,
              day: i + 1,
              date: `Day ${i + 1}`,
              estimated_cost: Math.round(templateDay.estimated_cost * (0.8 + Math.random() * 0.4))
            });
          }
          setItinerary({ days: finalDays });
        } else {
          // Dynamic fallback based on selected tags
          const generated = generateFallbackItinerary(destinationId, days, interests);
          setItinerary(generated);
        }
      }
    } catch (err) {
      console.error(err);
      setError("AI generation failed. Loading simulated local itinerary instead.");
      // Soft fallback to simulated
      if (MOCK_ITINERARIES[destinationId]) {
        const template = MOCK_ITINERARIES[destinationId];
        setItinerary({
          days: template.days.slice(0, days).map((d, index) => ({ ...d, day: index + 1, date: `Day ${index + 1}` }))
        });
      } else {
        setItinerary(generateFallbackItinerary(destinationId, days, interests));
      }
    } finally {
      setLoading(false);
    }
  };

  // Regenerate a single day
  const regenerateDay = async (dayNumber) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate loading
    setItinerary(prev => {
      if (!prev) return null;
      const updatedDays = prev.days.map(d => {
        if (d.day === dayNumber) {
          // Randomize or tweak activities slightly
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
  const addExpense = (title, amount, category) => {
    setExpenses(prev => [...prev, {
      id: Date.now().toString(),
      title,
      amount: parseFloat(amount),
      category,
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
      toggleChat
    }}>
      {children}
    </TravelContext.Provider>
  );
};
