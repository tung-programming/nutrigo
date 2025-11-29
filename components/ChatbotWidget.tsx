'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, X, MessageCircle, Loader2, Sparkles } from 'lucide-react';

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([
    {
      role: 'assistant',
      content:
        "Hi! I'm your NutriGo AI assistant. Ask me anything about nutrition, packaged food scanning, or how to use our app! 🥫✨",
    },
  ]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    // Load voices for speech synthesis
    if ('speechSynthesis' in window) {
      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoices(availableVoices);
        console.log('Available voices:', availableVoices);
      };

      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    // Initialize speech recognition
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        setInput(finalTranscript || interimTranscript);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (message?: string) => {
    const textToSend = message || input;
    if (!textToSend.trim() || isLoading) return;

    setMessages((prev) => [...prev, { role: 'user', content: textToSend }]);
    setInput('');
    setIsLoading(true);

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
      const endpoint = `${backendUrl}/api/chatbot/chat`;
      
      console.log('🔍 Sending request to:', endpoint);
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ message: textToSend }),
      });

      console.log('📥 Response status:', response.status);
      console.log('📥 Content-Type:', response.headers.get('content-type'));

      const contentType = response.headers.get('content-type');
      
      // Check if response is HTML (error page)
      if (contentType && contentType.includes('text/html')) {
        const htmlText = await response.text();
        console.error('❌ Received HTML instead of JSON:', htmlText.substring(0, 200));
        throw new Error(`Server returned HTML instead of JSON. The chatbot endpoint might not be available. Status: ${response.status}`);
      }
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('❌ Backend error:', errorData);
        throw new Error(errorData.error || `Request failed with status ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Response data:', data);
      
      setMessages((prev) => [...prev, { role: 'assistant', content: data.response }]);
      speakResponse(data.response);
    } catch (error) {
      console.error('❌ Chat error:', error);
      
      let errorMessage = 'Sorry, I encountered an error. ';
      
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        errorMessage += `Cannot connect to the chatbot server. Please check if the backend is running at ${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000'}.`;
      } else if (error instanceof Error) {
        errorMessage += error.message;
      } else {
        errorMessage += 'Please try again!';
      }
      
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: errorMessage,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const speakResponse = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(true);

      const utterance = new SpeechSynthesisUtterance(text);

      // Find the best soothing female voice
      const femaleVoice = voices.find(voice =>
        // Priority order for soothing female voices
        voice.name.includes('Samantha') || // macOS - very natural
        voice.name.includes('Google UK English Female') ||
        voice.name.includes('Google US English Female') ||
        voice.name.includes('Microsoft Zira') || // Windows
        voice.name.includes('Karen') || // macOS
        voice.name.includes('Moira') || // macOS
        voice.name.includes('Tessa') || // macOS
        (voice.lang.startsWith('en') && voice.name.toLowerCase().includes('female'))
      ) || voices.find(v => v.lang.startsWith('en-US') || v.lang.startsWith('en-GB'));

      // Set voice
      if (femaleVoice) {
        utterance.voice = femaleVoice;
        console.log('Using voice:', femaleVoice.name);
      }

      // Voice settings for soothing effect
      utterance.rate = 0.9; // Slower, more relaxed (0.1 to 10)
      utterance.pitch = 1.05; // Slightly higher, softer pitch (0 to 2)
      utterance.volume = 0.9; // Slightly lower volume for gentleness (0 to 1)

      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setInput('');
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <>
      {/* FIXED BUTTON WRAPPER */}
      <div className="fixed bottom-6 right-6 z-[999999] pointer-events-auto">
        {/* Floating Button */}
        {!isOpen && (
          <button onClick={() => setIsOpen(true)} className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-full blur-xl opacity-60 group-hover:opacity-100 animate-pulse-slow transition-opacity duration-300"></div>

            <div className="relative bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 p-4 rounded-full shadow-2xl group-hover:scale-110 transition-all duration-300">
              <MessageCircle className="w-7 h-7 text-white" />

              <span className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full animate-pulse border-2 border-slate-950"></span>

              <Sparkles className="absolute -top-2 -left-2 w-4 h-4 text-cyan-400 animate-ping" />
            </div>
          </button>
        )}
      </div>

      {/* CHAT WINDOW */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[380px] h-[580px] max-h-[85vh] z-[999999] flex flex-col animate-slideUp">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/30 via-teal-500/30 to-cyan-500/30 rounded-3xl blur-2xl"></div>

          <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl shadow-2xl border border-emerald-500/30 backdrop-blur-xl overflow-hidden flex flex-col h-full">
            {/* Header */}
            <div className="relative bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 p-4 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30 shadow-xl animate-float">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-black text-base text-white">NutriGo AI</h3>
                  <p className="text-xs text-emerald-100 flex items-center gap-1">
                    <span className="w-2 h-2 bg-emerald-300 rounded-full animate-pulse"></span>
                    Always here to help
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/20 p-2 rounded-xl transition-all duration-300 group"
              >
                <X className="w-5 h-5 text-white group-hover:rotate-90 transition-transform duration-300" />
              </button>

              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-950/50 backdrop-blur-sm">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  } animate-fadeIn`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl relative ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white rounded-br-md shadow-xl shadow-emerald-500/30'
                        : 'bg-gradient-to-br from-slate-800 to-slate-700 text-slate-100 rounded-bl-md border border-emerald-500/20 shadow-xl'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start animate-fadeIn">
                  <div className="bg-gradient-to-br from-slate-800 to-slate-700 p-3 rounded-2xl rounded-bl-md border border-emerald-500/20 shadow-xl">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
                      <span className="text-sm text-slate-300">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-slate-900/80 backdrop-blur-xl border-t border-emerald-500/20 flex-shrink-0">
              {isSpeaking && (
                <div className="mb-3 flex items-center justify-between bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 rounded-xl p-2.5 animate-fadeIn backdrop-blur-sm">
                  <span className="text-xs text-emerald-400 flex items-center gap-2 font-semibold">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                    AI is speaking...
                  </span>
                  <button
                    onClick={stopSpeaking}
                    className="text-xs text-emerald-400 hover:text-emerald-300 font-bold transition-colors"
                  >
                    Stop
                  </button>
                </div>
              )}

              {isListening && (
                <div className="mb-3 flex items-center justify-between bg-gradient-to-r from-rose-500/20 to-pink-500/20 border border-rose-500/30 rounded-xl p-2.5 animate-fadeIn backdrop-blur-sm">
                  <span className="text-xs text-rose-400 flex items-center gap-2 font-semibold">
                    <span className="w-2 h-2 bg-rose-400 rounded-full animate-pulse"></span>
                    Listening...
                  </span>
                  <button
                    onClick={toggleListening}
                    className="text-xs text-rose-400 hover:text-rose-300 font-bold transition-colors"
                  >
                    Stop
                  </button>
                </div>
              )}

              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about nutrition..."
                  disabled={isLoading}
                  className="flex-1 bg-slate-800 border border-emerald-500/30 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm text-white placeholder-slate-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                />

                <button
                  onClick={toggleListening}
                  disabled={isLoading}
                  className={`p-2.5 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative group ${
                    isListening
                      ? 'bg-gradient-to-r from-rose-500 to-pink-500 shadow-xl shadow-rose-500/50'
                      : 'bg-slate-800 border border-emerald-500/30 hover:border-emerald-500/50 hover:bg-slate-700'
                  }`}
                >
                  {isListening ? (
                    <>
                      <MicOff className="w-5 h-5 text-white" />
                      <span className="absolute inset-0 bg-rose-400 opacity-30 rounded-xl animate-ping"></span>
                    </>
                  ) : (
                    <Mic className="w-5 h-5 text-emerald-400 group-hover:text-emerald-300" />
                  )}
                </button>

                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isLoading}
                  className="relative group bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 p-2.5 rounded-xl shadow-xl shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none overflow-hidden"
                >
                  <Send className="w-5 h-5 text-white relative z-10 group-hover:translate-x-0.5 transition-transform" />
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </div>

              <p className="text-xs text-slate-500 mt-2.5 text-center flex items-center justify-center gap-2">
                <Sparkles className="w-3 h-3" />
                Click 🎤 to speak or type your question
              </p>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-pulse-slow {
          animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </>
  );
}
