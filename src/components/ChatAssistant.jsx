import React, { useState, useContext, useEffect, useRef } from 'react';
import { TravelContext } from '../context/TravelContext';
import { DESTINATIONS, TRANSLATIONS } from '../data/mockData';
import { MessageSquare, X, Send, Languages, Sparkles, Mic } from 'lucide-react';

const ChatAssistant = () => {
  const { 
    selectedDestination, 
    apiKey, 
    regenerateDay, 
    isChatOpen, 
    toggleChat,
    isOfflineSimulated 
  } = useContext(TravelContext);
  
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // V2 Voice states
  const [isListening, setIsListening] = useState(false);
  const [speechLang, setSpeechLang] = useState('en-IN');

  const destination = DESTINATIONS.find(d => d.id === selectedDestination) || DESTINATIONS[0];
  const translationData = TRANSLATIONS[destination.state] || null;

  const isOffline = isOfflineSimulated || !navigator.onLine;

  // Scroll messages to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isChatOpen]);

  // Initial welcome message
  useEffect(() => {
    if (selectedDestination) {
      setMessages([
        {
          sender: 'bot',
          text: `Hi! I am your AI Travel Assistant for ${destination.name}. Ask me to translate phrases, search safety guides, or tweak your daily activities!`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      if (translationData) {
        setTargetLanguage(translationData.language);
      }
    } else {
      setMessages([
        {
          sender: 'bot',
          text: `Hi! I'm your AI Travel Assistant. Complete the onboarding configuration to start tailoring itineraries!`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  }, [selectedDestination]);

  // Speech recognition setup
  const startSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Web Speech API is not supported by your current browser. Please try Google Chrome or Apple Safari.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = speechLang;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onresult = (event) => {
      const speechToText = event.results[0][0].transcript;
      setInputValue(speechToText);
      setIsListening(false);
    };

    recognition.start();
  };

  const handleSendMessage = async (textToSend) => {
    if (!textToSend.trim()) return;

    if (isOffline) {
      alert("Chat messages cannot be routed while offline.");
      return;
    }

    const userMsg = {
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setChatLoading(true);

    try {
      if (apiKey) {
        // Real API Call with Anthropic Claude
        const prompt = `
          You are a travel assistant and translator for the destination: ${destination.name}, ${destination.state}.
          The user says: "${textToSend}"
          The preferred local dialect here is: ${targetLanguage || 'Hindi'}.
          
          Provide a helpful, concise travel advice or translation. Keep the tone friendly and direct. Limit the response to 3-4 sentences.
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
            max_tokens: 300,
            messages: [{ role: 'user', content: prompt }]
          })
        });

        if (!response.ok) {
          throw new Error('Claude API error');
        }

        const data = await response.json();
        const botText = data.content[0].text;
        
        setMessages(prev => [...prev, {
          sender: 'bot',
          text: botText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      } else {
        // Simulated Dynamic Travel Agent
        await new Promise(resolve => setTimeout(resolve, 800));
        let reply = '';
        const lowercaseText = textToSend.toLowerCase();

        if (lowercaseText.includes('translate') || lowercaseText.includes('how do i say') || lowercaseText.includes('native')) {
          if (translationData) {
            const phrases = translationData.common.map(p => `• "${p.english}" ➔ "${p.native}" (pronounced: ${p.pronunciation})`).join('\n');
            reply = `Here are common phrases in local ${translationData.language}:\n${phrases}`;
          } else {
            reply = `The local language in ${destination.state} is primarily Hindi. You can say "Thank you" ➔ "Dhanyawaad" and "Hello" ➔ "Namaste".`;
          }
        } else if (lowercaseText.includes('cheap') || lowercaseText.includes('budget') || lowercaseText.includes('cost')) {
          reply = `To make your schedule cheaper in ${destination.name}, swap fine dining for local thali spots (average ₹150 per meal). Rent a scooter (₹350/day) instead of booking cabs.`;
        } else if (lowercaseText.includes('vegetarian') || lowercaseText.includes('veg')) {
          reply = `Understood! Swapping restaurants to vegetarian hubs. I'll search local organic markets and temple kitchens near ${destination.name} for you.`;
        } else if (lowercaseText.includes('tweak') || lowercaseText.includes('regenerate') || lowercaseText.includes('change')) {
          regenerateDay(1);
          reply = `Successfully tweaked Day 1 activities for ${destination.name}! Check your refreshed schedule on the Itinerary ledger.`;
        } else {
          reply = `For ${destination.name}, I suggest renting a scooter (₹350/day) and staying at Zostel to meet travelers. Let me know if you need specific food recommendations or route maps!`;
        }

        setMessages(prev => [...prev, {
          sender: 'bot',
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, {
        sender: 'bot',
        text: "I couldn't contact the AI server. Here is a local tip: Carry cash as digital UPI has low connectivity in mountain tracks.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage(inputValue);
    }
  };

  return (
    <div className="chat-widget non-printable">
      {/* Trigger floating button */}
      {!isChatOpen && (
        <div className="chat-trigger" onClick={() => toggleChat(true)}>
          <MessageSquare size={24} />
        </div>
      )}

      {/* Chat Window Panel */}
      {isChatOpen && (
        <div className="chat-window" style={{ height: '510px' }}>
          {/* Header */}
          <div style={{
            backgroundColor: 'var(--text-primary)',
            color: '#FFFFFF',
            padding: '16px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '8px', height: '8px', backgroundColor: 'var(--neon-lime)', borderRadius: '50%' }}></div>
              <strong style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem' }}>TRIPZ ASSISTANT</strong>
            </div>
            <button onClick={() => toggleChat(false)} style={{ background: 'none', border: 'none', color: '#FFFFFF', cursor: 'pointer' }}>
              <X size={18} />
            </button>
          </div>

          {/* Language translation bar */}
          {translationData && (
            <div style={{
              backgroundColor: 'var(--light-gray)',
              borderBottom: '1px solid var(--border-gray)',
              padding: '6px 16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.75rem'
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '700' }}>
                <Languages size={14} /> Local Dialect:
              </span>
              <span className="highlight-badge" style={{ marginBottom: 0, padding: '2px 6px', fontSize: '0.7rem' }}>
                {translationData.language}
              </span>
            </div>
          )}

          {/* V2 Voice Input Language Selector */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderBottom: '1px solid var(--border-gray)',
            padding: '6px 16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.7rem'
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '700' }}>
              🎤 Voice Input Dialect:
            </span>
            <select 
              value={speechLang} 
              onChange={e => setSpeechLang(e.target.value)}
              style={{
                border: '1px solid var(--border-gray)',
                borderRadius: '6px',
                padding: '2px 4px',
                fontSize: '0.7rem',
                outline: 'none',
                cursor: 'pointer'
              }}
              disabled={isOffline}
            >
              <option value="en-IN">English (India)</option>
              <option value="hi-IN">हिन्दी (Hindi)</option>
              <option value="ta-IN">தமிழ் (Tamil)</option>
              <option value="te-IN">తెలుగు (Telugu)</option>
              <option value="kn-IN">ಕನ್ನಡ (Kannada)</option>
              <option value="ml-IN">മലയാളം (Malayalam)</option>
            </select>
          </div>

          {/* Messages Feed */}
          <div style={{
            flexGrow: '1',
            overflowY: 'auto',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            backgroundColor: '#FAFAFA'
          }}>
            {messages.map((msg, index) => {
              const isBot = msg.sender === 'bot';
              return (
                <div key={index} style={{
                  alignSelf: isBot ? 'flex-start' : 'flex-end',
                  maxWidth: '85%'
                }}>
                  <div style={{
                    backgroundColor: isBot ? '#FFFFFF' : 'var(--text-primary)',
                    color: isBot ? 'var(--text-primary)' : '#FFFFFF',
                    border: isBot ? '1px solid var(--border-gray)' : 'none',
                    borderRadius: isBot ? '16px 16px 16px 4px' : '16px 16px 4px 16px',
                    padding: '12px 16px',
                    fontSize: '0.8rem',
                    whiteSpace: 'pre-line',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                  }}>
                    {msg.text}
                  </div>
                  <span style={{ fontSize: '0.65rem', color: '#888888', display: 'block', textAlign: isBot ? 'left' : 'right', marginTop: '4px', padding: '0 4px' }}>
                    {msg.time}
                  </span>
                </div>
              );
            })}
            {chatLoading && (
              <div style={{ alignSelf: 'flex-start', display: 'flex', gap: '6px', alignItems: 'center', backgroundColor: '#FFFFFF', border: '1px solid var(--border-gray)', padding: '12px 16px', borderRadius: '16px 16px 16px 4px' }}>
                <div style={{ width: '6px', height: '6px', backgroundColor: '#888888', borderRadius: '50%', animation: 'float 1s infinite' }}></div>
                <div style={{ width: '6px', height: '6px', backgroundColor: '#888888', borderRadius: '50%', animation: 'float 1s infinite', animationDelay: '0.2s' }}></div>
                <div style={{ width: '6px', height: '6px', backgroundColor: '#888888', borderRadius: '50%', animation: 'float 1s infinite', animationDelay: '0.4s' }}></div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick chips bar */}
          <div style={{
            padding: '10px 16px',
            backgroundColor: '#FFFFFF',
            borderTop: '1px solid var(--border-gray)',
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            whiteSpace: 'nowrap'
          }} className="non-printable">
            <button disabled={isOffline} onClick={() => handleSendMessage("Show native translations")} style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: '8px', border: '1px solid var(--border-gray)', backgroundColor: 'var(--light-gray)', cursor: isOffline ? 'not-allowed' : 'pointer', opacity: isOffline ? 0.5 : 1 }}>
              🗣️ Translate Phrases
            </button>
            <button disabled={isOffline} onClick={() => handleSendMessage("Make Day 2 cheaper")} style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: '8px', border: '1px solid var(--border-gray)', backgroundColor: 'var(--light-gray)', cursor: isOffline ? 'not-allowed' : 'pointer', opacity: isOffline ? 0.5 : 1 }}>
              📉 Make Cheaper
            </button>
            <button disabled={isOffline} onClick={() => handleSendMessage("Make it vegetarian")} style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: '8px', border: '1px solid var(--border-gray)', backgroundColor: 'var(--light-gray)', cursor: isOffline ? 'not-allowed' : 'pointer', opacity: isOffline ? 0.5 : 1 }}>
              🥗 Vegetarian Spots
            </button>
          </div>

          {/* Input control footer */}
          <div style={{
            padding: '12px 16px',
            borderTop: '1px solid var(--border-gray)',
            display: 'flex',
            gap: '8px',
            backgroundColor: '#FFFFFF'
          }}>
            <input 
              type="text" 
              placeholder={isOffline ? "Assistant is offline..." : "Ask travel question..."} 
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isOffline}
              style={{
                flexGrow: '1',
                border: '1px solid var(--border-gray)',
                borderRadius: '12px',
                padding: '10px 14px',
                fontSize: '0.8rem',
                outline: 'none',
                backgroundColor: isOffline ? 'var(--light-gray)' : '#FFFFFF',
                cursor: isOffline ? 'not-allowed' : 'text'
              }}
            />

            {/* Microphone Voice button */}
            <button
              onClick={startSpeechRecognition}
              disabled={isOffline}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '12px',
                backgroundColor: isListening ? '#FF3B30' : 'var(--light-gray)',
                color: isListening ? '#FFFFFF' : 'var(--text-primary)',
                border: '1px solid var(--border-gray)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: isOffline ? 'not-allowed' : 'pointer',
                opacity: isOffline ? 0.5 : 1,
                animation: isListening ? 'pulse 1s infinite' : 'none'
              }}
              title="Voice Input (Speech-to-Text)"
            >
              <Mic size={16} />
            </button>

            <button 
              disabled={isOffline}
              onClick={() => handleSendMessage(inputValue)}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '12px',
                backgroundColor: 'var(--text-primary)',
                color: '#FFFFFF',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: isOffline ? 'not-allowed' : 'pointer',
                opacity: isOffline ? 0.5 : 1
              }}
            >
              <Send size={16} />
            </button>
          </div>

        </div>
      )}
    </div>
  );
};

export default ChatAssistant;
