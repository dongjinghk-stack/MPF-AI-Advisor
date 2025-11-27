import React, { useState, useRef, useEffect } from 'react';
import { Upload, X, Send, FileText, Key, RotateCcw } from 'lucide-react';
import { UploadedFile, ChatMessage, MPFFund } from '../../types';
import ChatBubble from '../Chat/ChatBubble';
import { callKimiAPI, parseResponseForVisualization } from '../../services/moonshotService';
import { getFunds } from '../../services/dataService';
import { PieChart as RechartsPieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';

interface AnalyzedPortfolio {
    sectors: { name: string; value: number; color: string }[];
    riskLevel: string;
    funds: (MPFFund & { allocation: number })[];
}

const AnalyzerView: React.FC = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [apiKey, setApiKey] = useState('');
  
  // Portfolio Analysis State
  const [portfolioAnalysis, setPortfolioAnalysis] = useState<AnalyzedPortfolio | null>(null);

  // Modal State
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [tempApiKey, setTempApiKey] = useState('');

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'bot',
      text: "Hello! I'm your MPF assistant. Upload your statement or describe your portfolio, and I'll analyze it using real market data.",
      timestamp: new Date()
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const allFunds = getFunds();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load liked messages from local storage on mount
  useEffect(() => {
    const savedFeedback = localStorage.getItem('chatFeedback');
    if (savedFeedback) {
        const feedbackMap = JSON.parse(savedFeedback);
        setMessages(prev => prev.map(msg => ({
            ...msg,
            feedback: feedbackMap[msg.id] || null
        })));
    }
  }, []);

  // Handle Feedback (Like/Dislike)
  const handleFeedback = (messageId: string, feedback: 'like' | 'dislike') => {
    setMessages(prev => {
        const newMessages = prev.map(msg => 
            msg.id === messageId ? { ...msg, feedback } : msg
        );
        
        // Persist to localStorage
        const feedbackMap = newMessages.reduce((acc, msg) => {
            if (msg.feedback) acc[msg.id] = msg.feedback;
            return acc;
        }, {} as Record<string, string>);
        localStorage.setItem('chatFeedback', JSON.stringify(feedbackMap));
        
        return newMessages;
    });
  };

  // File Upload Handlers
  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;
    const uploaded = Array.from(newFiles).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type
    }));
    setFiles(prev => [...prev, ...uploaded]);
    
    // Simulate OCR processing and Analysis
    setTimeout(() => {
      // Find specific funds to simulate a detected portfolio
      const interestFund = allFunds.find(f => f.constituent_fund.includes('Manulife MPF Interest')) || allFunds[0];
      const stableFund = allFunds.find(f => f.constituent_fund.includes('Manulife MPF Stable')) || allFunds[1];
      const equityFund = allFunds.find(f => f.constituent_fund.includes('Manulife MPF Healthcare')) || allFunds[2];

      const detectedFunds = [
          { ...interestFund, allocation: 40 },
          { ...stableFund, allocation: 35 },
          { ...equityFund, allocation: 25 }
      ];

      // Mock Analysis Data
      const mockAnalysis: AnalyzedPortfolio = {
         sectors: [
             { name: 'Guaranteed', value: 40, color: '#10B981' }, // Low Risk
             { name: 'Stable', value: 35, color: '#F59E0B' }, // Medium Risk
             { name: 'Equity', value: 25, color: '#EF4444' }, // High Risk
         ],
         riskLevel: 'Conservative',
         funds: detectedFunds
      };
      setPortfolioAnalysis(mockAnalysis);

      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        sender: 'bot',
        text: `I've analyzed ${uploaded.length} file(s). It looks like a conservative portfolio (mostly Stable/Guaranteed funds). Would you like me to suggest some optimization scenarios?`,
        timestamp: new Date()
      }]);

      // Pre-populate input with contextual suggestion
      setInputMessage("How can I optimize my conservative portfolio for higher returns?");
    }, 1500);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  // Modal handlers
  const openApiKeyModal = () => {
    setTempApiKey(apiKey);
    setShowApiKeyModal(true);
  };

  const saveApiKey = () => {
    setApiKey(tempApiKey.trim());
    setShowApiKeyModal(false);
  };

  // Chat Logic
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const responseText = await callKimiAPI(userMsg.text, allFunds, messages, apiKey);
      const { text, scenarios } = parseResponseForVisualization(responseText, allFunds);
      
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: text,
        timestamp: new Date(),
        sections: scenarios.map(s => ({ type: 'scenario', data: s }))
      };

      setMessages(prev => [...prev, botMsg]);

      // Contextual Suggestion based on AI response
      if (scenarios.length > 0) {
        setTimeout(() => {
            setInputMessage("What are the key risks associated with Scenario 1?");
        }, 500);
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        sender: 'bot',
        text: "Sorry, I encountered an error connecting to the analysis service. Please check your API key or try again later.",
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const quickActions = [
    "Plan for retirement in 15 years",
    "What is my risk level?",
    "Suggest a High Growth portfolio",
    "Switching recommendations"
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-140px)] min-h-[600px] relative">
      
      {/* LEFT: Upload & Analysis */}
      <div className="lg:col-span-5 flex flex-col space-y-4 h-full overflow-y-auto">
        {/* COMPACT Upload Control */}
        <div 
          className={`shrink-0 border-2 border-dashed rounded-xl transition-all duration-300 p-4 bg-white shadow-sm
            ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}
          onDragOver={handleDragOver}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <Upload className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-800">Upload Portfolio</h3>
                <p className="text-xs text-gray-500">PDFs or Images</p>
              </div>
            </div>
            <label className="px-4 py-2 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 cursor-pointer font-medium transition-colors shadow-sm whitespace-nowrap">
              Browse
              <input type="file" className="hidden" multiple onChange={(e) => handleFiles(e.target.files)} />
            </label>
          </div>
        </div>

        {/* Uploaded Files Grid - Moved UP */}
        {files.length > 0 && (
            <div className="shrink-0 bg-white rounded-xl p-3 shadow-sm border border-gray-200">
                <h4 className="text-xs font-semibold text-gray-500 mb-2 uppercase flex items-center">
                    <FileText className="w-3 h-3 mr-1" /> Uploaded ({files.length})
                </h4>
                <div className="grid grid-cols-2 gap-2">
                {files.map(file => (
                    <div key={file.id} className="relative flex items-center p-2 bg-gray-50 rounded border border-gray-100 hover:border-blue-200 transition-colors">
                        <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center text-blue-600 text-[10px] font-bold mr-2 shrink-0">
                            {file.name.split('.').pop()?.toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-gray-700 truncate" title={file.name}>{file.name}</p>
                            <p className="text-[9px] text-green-600">Analyzed</p>
                        </div>
                        <button 
                            onClick={() => setFiles(files.filter(f => f.id !== file.id))}
                            className="text-gray-300 hover:text-red-500 ml-1"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </div>
                ))}
                </div>
            </div>
        )}

        {/* Portfolio Analysis Visualization (Pie Chart & Detailed Table) */}
        {portfolioAnalysis && (
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 animate-fade-in flex flex-col gap-4">
               <div className="flex justify-between items-start border-b border-gray-100 pb-2">
                   <div>
                       <h4 className="text-sm font-bold text-gray-800">Portfolio Composition</h4>
                       <p className="text-xs text-gray-500">Detected Risk: <span className="font-semibold text-blue-600">{portfolioAnalysis.riskLevel}</span></p>
                   </div>
               </div>
               
               <div className="flex flex-col gap-4 items-center">
                   {/* Top: Pie Chart */}
                   <div className="h-40 w-full relative">
                       <ResponsiveContainer width="100%" height="100%">
                           <RechartsPieChart>
                               <Pie
                                   data={portfolioAnalysis.sectors}
                                   cx="50%"
                                   cy="50%"
                                   innerRadius={45}
                                   outerRadius={65}
                                   paddingAngle={2}
                                   dataKey="value"
                               >
                                   {portfolioAnalysis.sectors.map((entry, index) => (
                                       <Cell key={`cell-${index}`} fill={entry.color} />
                                   ))}
                               </Pie>
                               <RechartsTooltip />
                               <Legend wrapperStyle={{fontSize: '10px'}} layout="vertical" verticalAlign="middle" align="right" />
                           </RechartsPieChart>
                       </ResponsiveContainer>
                   </div>

                   {/* Bottom: Detailed Table */}
                   <div className="w-full overflow-x-auto">
                       <table className="w-full text-[10px] text-left">
                           <thead>
                               <tr className="text-gray-400 border-b border-gray-100">
                                   <th className="pb-1 font-medium">Fund</th>
                                   <th className="pb-1 text-right font-medium">Alloc</th>
                                   <th className="pb-1 text-right font-medium">1Y</th>
                                   <th className="pb-1 text-right font-medium">3Y</th>
                                   <th className="pb-1 text-right font-medium">5Y</th>
                                   <th className="pb-1 text-right font-medium">FER</th>
                               </tr>
                           </thead>
                           <tbody>
                               {portfolioAnalysis.funds.map((fund, idx) => (
                                   <tr key={idx} className="border-b border-gray-50 last:border-0">
                                       <td className="py-1.5 pr-1 truncate max-w-[120px]" title={fund.constituent_fund}>
                                           {fund.constituent_fund.split(' - ')[0].replace('Manulife MPF ', '')}
                                       </td>
                                       <td className="py-1.5 text-right font-semibold text-gray-700">{fund.allocation}%</td>
                                       <td className={`py-1.5 text-right ${fund.annualized_return_1y >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                           {fund.annualized_return_1y.toFixed(1)}%
                                       </td>
                                       <td className={`py-1.5 text-right ${fund.annualized_return_3y >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                           {fund.annualized_return_3y.toFixed(1)}%
                                       </td>
                                       <td className={`py-1.5 text-right ${fund.annualized_return_5y >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                           {fund.annualized_return_5y.toFixed(1)}%
                                       </td>
                                       <td className="py-1.5 text-right text-gray-500">{fund.latest_fer.toFixed(2)}%</td>
                                   </tr>
                               ))}
                           </tbody>
                       </table>
                   </div>
               </div>
            </div>
        )}
      </div>

      {/* RIGHT: Chatbot */}
      <div className="lg:col-span-7 flex flex-col bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden relative">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${apiKey ? 'bg-green-500' : 'bg-yellow-400'} animate-pulse`}></div>
            <span className="font-semibold text-gray-700">Investment Assistant (Kimi AI)</span>
          </div>
          <div className="flex items-center space-x-3">
             <button
                onClick={openApiKeyModal}
                className={`flex items-center space-x-1 text-xs font-medium px-2 py-1 rounded border transition-colors
                   ${apiKey ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}
                title={apiKey ? "API Key Configured" : "Click to set API Key"}
             >
                <Key className="w-3 h-3" />
                <span>{apiKey ? 'API Key Set' : 'Add API Key'}</span>
             </button>
             <button 
                onClick={() => {
                    setMessages([{id: 'init', sender: 'bot', text: 'Analysis reset.', timestamp: new Date()}]);
                    setFiles([]);
                    setPortfolioAnalysis(null);
                }}
                className="text-gray-400 hover:text-red-500 transition-colors"
                title="Reset Chat"
             >
                <RotateCcw className="w-4 h-4" />
             </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/30 scrollbar-hide">
          {messages.map((msg) => (
            <ChatBubble key={msg.id} message={msg} onFeedback={handleFeedback} />
          ))}
          {isTyping && (
             <div className="flex items-center space-x-2 text-gray-400 text-sm ml-4">
                <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                </div>
                <span>Analyzing data...</span>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        <div className="px-4 py-2 border-t border-gray-100 bg-white">
           <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {quickActions.map((action, i) => (
                 <button 
                    key={i}
                    onClick={() => setInputMessage(action)}
                    className="whitespace-nowrap px-3 py-1 bg-blue-50 text-blue-600 text-xs rounded-full border border-blue-100 hover:bg-blue-100 transition-colors"
                 >
                    {action}
                 </button>
              ))}
           </div>
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-gray-100">
          <div className="flex items-center space-x-2">
            <input 
              type="text" 
              className="flex-1 border border-gray-300 rounded-full px-4 py-3 bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              placeholder="Ask about your portfolio optimization..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button 
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className={`p-3 rounded-full text-white transition-all
                ${!inputMessage.trim() || isTyping ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-md transform hover:scale-105'}
              `}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* API Key Modal Overlay */}
        {showApiKeyModal && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
             <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md animate-fade-in">
                <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center">
                   <Key className="w-5 h-5 mr-2 text-blue-600" />
                   Configure Kimi API Key
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                   Enter your Moonshot AI API key to enable real-time portfolio analysis using the K2 Thinking Model.
                </p>
                <div className="mb-4">
                   <input
                      type="password"
                      value={tempApiKey}
                      onChange={(e) => setTempApiKey(e.target.value)}
                      placeholder="sk-..."
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                   />
                </div>
                <div className="flex justify-end space-x-3">
                   <button
                      onClick={() => setShowApiKeyModal(false)}
                      className="px-4 py-2 text-gray-600 text-sm hover:bg-gray-100 rounded-lg transition-colors"
                   >
                      Cancel
                   </button>
                   <button
                      onClick={saveApiKey}
                      className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors font-medium"
                   >
                      Save Key
                   </button>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyzerView;