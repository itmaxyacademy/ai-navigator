import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquarePlus, Image as ImageIcon, Folder, Plus, Send,
  Shield, Glasses, ChevronDown, Check, Copy, RefreshCw, AlertCircle,
  Trash2, X, Lock, Sliders, Settings, ArrowUp, PanelLeft,
  Info, Sparkles, User, ExternalLink, Download, FileText
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'lumo';
  text: string;
  timestamp: string;
  toolsUsed?: string[];
  modelUsed?: string;
  isPrivacy?: boolean;
}

interface ChatThread {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
}

interface ProjectItem {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  timestamp: string;
  provider: string;
}

export const LumoReplica: React.FC = () => {
  // Navigation Tab State
  const [activeTab, setActiveTab] = useState<'chat' | 'images' | 'projects'>('chat');

  // Sidebar Open / Collapsed State
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  // Model Selection State
  const models = ['Lumo 2.0 Max', 'Lumo 2.0 Flash', 'Lumo 1.5 Privacy'];
  const [selectedModel, setSelectedModel] = useState<string>('Lumo 2.0 Max');
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState<boolean>(false);

  // Privacy Toggle State (Incognito / No History Mode)
  const [privacyMode, setPrivacyMode] = useState<boolean>(false);

  // Tools Selection State
  const availableTools = ['Web Search', 'Code Interpreter'];
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [isToolsDropdownOpen, setIsToolsDropdownOpen] = useState<boolean>(false);

  // Chat State
  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Saved Chat Threads History in Sidebar
  const [chatHistoryList, setChatHistoryList] = useState<ChatThread[]>([
    {
      id: 'lumo-th-1',
      title: 'Draf Kebijakan Enkripsi Zero-Knowledge',
      createdAt: 'Kemarin',
      messages: [
        {
          id: 'm1',
          sender: 'user',
          text: 'Buatkan draf prinsip privasi zero-knowledge untuk aplikasi keuangan.',
          timestamp: '14:20',
        },
        {
          id: 'm2',
          sender: 'lumo',
          text: 'Prinsip utama zero-knowledge privacy Proton Lumo:\n1. Client-Side Encryption: Kunci enkripsi disimpan di perangkat user.\n2. Zero-Log Architecture: Server tidak menyimpan riwayat identitas.\n3. Verifikasi Kriptografi: Bukti zk-SNARKs.',
          timestamp: '14:21',
          modelUsed: 'Lumo 2.0 Max',
        }
      ]
    },
    {
      id: 'lumo-th-2',
      title: 'Audit Kode Keamanan Python',
      createdAt: '3 hari lalu',
      messages: [
        {
          id: 'm3',
          sender: 'user',
          text: 'Periksa apakah ada potensi data leak pada skrip API ini.',
          timestamp: '09:10',
        },
        {
          id: 'm4',
          sender: 'lumo',
          text: 'Kode Anda secara umum aman. Disarankan menyembunyikan API key ke environment variable daripada hardcoding di file.',
          timestamp: '09:11',
          modelUsed: 'Lumo 2.0 Max',
        }
      ]
    }
  ]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);

  // Images Tab State
  const [imagePrompt, setImagePrompt] = useState<string>('');
  const [imageStyle, setImageStyle] = useState<string>('digital art');
  const [imageAspectRatio, setImageAspectRatio] = useState<string>('1:1');
  const [isGeneratingImage, setIsGeneratingImage] = useState<boolean>(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [imageError, setImageError] = useState<string | null>(null);

  // Projects Tab State
  const [projectsList, setProjectsList] = useState<ProjectItem[]>([
    {
      id: 'p-1',
      name: 'Riset Privasi Data 2026',
      description: 'Ruang kerja terenkripsi untuk analisis regulasi perlindungan data.',
      createdAt: '28 Juli 2026',
    },
    {
      id: 'p-2',
      name: 'Pengembangan Backend Zero-Trust',
      description: 'Dokumen arsitektur dan skema API terproteksi Proton.',
      createdAt: '20 Juli 2026',
    }
  ]);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState<boolean>(false);
  const [newProjectName, setNewProjectName] = useState<string>('');

  // Account Modal State (Sign in / Create Account Simulation)
  const [isAccountModalOpen, setIsAccountModalOpen] = useState<boolean>(false);
  const [accountModalAction, setAccountModalAction] = useState<string>('');

  // Auto scroll chat box
  const chatBottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Handle New Chat Reset
  const handleNewChat = () => {
    if (messages.length > 0) {
      // Save current thread if not in privacy/incognito mode
      if (!privacyMode) {
        const firstUserMsg = messages.find((m) => m.sender === 'user')?.text || 'Percakapan Baru';
        const titleSnippet = firstUserMsg.length > 32 ? firstUserMsg.slice(0, 32) + '...' : firstUserMsg;

        const newThread: ChatThread = {
          id: `lumo-th-${Date.now()}`,
          title: titleSnippet,
          messages: [...messages],
          createdAt: 'Baru saja',
        };

        setChatHistoryList((prev) => [newThread, ...prev]);
      }
    }

    setMessages([]);
    setActiveThreadId(null);
    setInputPrompt('');
    setErrorMessage(null);
  };

  // Handle Select History Thread
  const handleSelectThread = (thread: ChatThread) => {
    setActiveThreadId(thread.id);
    setMessages(thread.messages);
    setErrorMessage(null);
  };

  // Handle Delete History Thread
  const handleDeleteThread = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setChatHistoryList((prev) => prev.filter((t) => t.id !== id));
    if (activeThreadId === id) {
      setMessages([]);
      setActiveThreadId(null);
    }
  };

  // Handle Tool Toggle
  const handleToggleTool = (toolName: string) => {
    setSelectedTools((prev) =>
      prev.includes(toolName) ? prev.filter((t) => t !== toolName) : [...prev, toolName]
    );
  };

  // Handle Send Chat Message
  const handleSendMessage = async (textToSubmit?: string) => {
    const query = (textToSubmit || inputPrompt).trim();
    if (!query || isLoading) return;

    setErrorMessage(null);

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      modelUsed: selectedModel,
      isPrivacy: privacyMode,
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    if (!textToSubmit) setInputPrompt('');
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 600));

      const aiMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        sender: 'lumo',
        text: `[Lumo AI (${selectedModel})]\n\nMenjawab: "${query}"\n\n- Mode Privasi Proton: ${privacyMode ? 'Aktif (Zero Logs)' : 'Standar'}\n- Perkakas Aktif: ${selectedTools.join(', ') || 'Tanpa Tool'}\n- Status: Berhasil diproses (100% Offline Simulation).`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: selectedModel,
        isPrivacy: privacyMode,
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err: any) {
      console.error('Error submitting Lumo AI prompt:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Copy Message
  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Handle Generate Image (Tab 2)
  const handleGenerateImage = async () => {
    if (!imagePrompt.trim() || isGeneratingImage) return;

    setImageError(null);
    setIsGeneratingImage(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      const encodedPrompt = encodeURIComponent(imagePrompt.trim());
      const simulatedUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&seed=${Math.floor(Math.random() * 90000) + 10000}&nologo=true`;

      const newImg: GeneratedImage = {
        id: `img-${Date.now()}`,
        url: simulatedUrl,
        prompt: imagePrompt,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        provider: 'Lumo Image Offline Engine',
      };

      setGeneratedImages(prev => [newImg, ...prev]);
    } catch (err: any) {
      console.error('Error generating image in Lumo:', err);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // Handle Create Project (Tab 3)
  const handleCreateProject = () => {
    if (!newProjectName.trim()) return;

    const newProj: ProjectItem = {
      id: `proj-${Date.now()}`,
      name: newProjectName.trim(),
      description: 'Ruang kerja proyek terenkripsi buatan Anda.',
      createdAt: 'Hari Ini',
    };

    setProjectsList((prev) => [newProj, ...prev]);
    setNewProjectName('');
    setIsNewProjectModalOpen(false);
  };

  // Open Account Simulation Modal
  const handleOpenAccountModal = (actionName: string) => {
    setAccountModalAction(actionName);
    setIsAccountModalOpen(true);
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-[#0b0a12] text-slate-800 dark:text-slate-100 overflow-hidden shadow-2xl flex flex-col h-[750px] relative font-sans select-none">
      {/* Top Header Navbar */}
      <header className="bg-[#0b0a12] px-4 py-3 flex items-center justify-between shrink-0 z-20 border-b border-slate-200 dark:border-slate-900">
        <div className="flex items-center gap-3 flex-wrap max-w-full">
          {/* Sidebar Toggle Button */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg bg-white dark:bg-slate-900/60 hover:bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer z-50 relative"
            title="Toggle Sidebar"
          >
            {isSidebarOpen ? <X className="w-4 h-4 md:hidden" /> : <PanelLeft className="w-4 h-4 md:hidden" />}
            <PanelLeft className="w-4 h-4 hidden md:block" />
          </button>
        </div>

        {/* Top Right Header Buttons */}
        <div className="flex items-center gap-2 flex-wrap max-w-full">
          <button
            onClick={() => handleOpenAccountModal('Create a free account')}
            className="px-4 py-1.5 rounded-lg bg-[#201e2e] hover:bg-[#2a283c] border border-slate-300 dark:border-slate-700/60 text-slate-900 dark:text-white text-xs font-semibold transition-all cursor-pointer"
          >
            Create a free account
          </button>
          <button
            onClick={() => handleOpenAccountModal('Sign in')}
            className="px-4 py-1.5 rounded-lg bg-[#201e2e] hover:bg-[#2a283c] border border-slate-300 dark:border-slate-700/60 text-slate-900 dark:text-white text-xs font-semibold transition-all cursor-pointer"
          >
            Sign in
          </button>
        </div>
      </header>

      {/* Main Content Layout with Sidebar */}
      <div className="flex-1 flex overflow-hidden relative min-w-0">
        {/* Lumo Sidebar */}
        <aside
          className={`${
            isSidebarOpen ? 'w-full sm:w-64 absolute sm:relative h-full shadow-2xl sm:shadow-none left-0 top-0' : 'w-0 hidden'
          } bg-[#11101a] border-r border-slate-200 dark:border-slate-800/80 flex flex-col justify-between transition-all duration-300 shrink-0 z-40 sm:z-10 p-3`}
        >
          {/* Sidebar Top Header & Nav */}
          <div className="space-y-4 min-w-0 overflow-y-auto">
            {/* Logo Brand Title */}
            <div className="flex items-center gap-2 px-1 py-1 flex-wrap max-w-full">
              {/* Cat mascot icon in rounded container */}
              <div className="w-7 h-7 rounded-lg bg-[#6149f6] flex items-center justify-center shrink-0 shadow-md">
                <div className="w-5 h-5 relative flex items-center justify-center">
                  <span className="text-sm">🐱</span>
                </div>
              </div>
              <span className="font-extrabold text-slate-900 dark:text-white text-base tracking-tight">Lumo AI</span>
            </div>

            {/* New Chat Row & Privacy Toggle Switch */}
            <div className="flex items-center justify-between gap-2 pt-1">
              <button
                onClick={handleNewChat}
                className="flex-1 py-2 px-3 rounded-xl bg-[#1d1b2c] hover:bg-[#27243c] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium text-xs flex items-center gap-2 transition-all cursor-pointer truncate flex-wrap max-w-full min-w-0"
              >
                <MessageSquarePlus className="w-4 h-4 text-slate-600 dark:text-slate-300 shrink-0" />
                <span>New chat</span>
              </button>

              {/* Incognito / Privacy Glasses Toggle Switch */}
              <div className="flex items-center gap-1 bg-[#1d1b2c] border border-slate-200 dark:border-slate-800 rounded-xl p-1.5 shrink-0 flex-wrap max-w-full">
                <Glasses className={`w-4 h-4 ${privacyMode ? 'text-purple-400' : 'text-slate-500 dark:text-slate-400'}`} />
                <button
                  onClick={() => setPrivacyMode(!privacyMode)}
                  className={`w-8 h-4 rounded-full transition-colors relative cursor-pointer ${
                    privacyMode ? 'bg-purple-600' : 'bg-slate-700'
                  }`}
                  title={privacyMode ? 'Mode Incognito Aktif' : 'Aktifkan Mode Incognito'}
                >
                  <div
                    className={`w-3 h-3 rounded-full bg-white transition-transform absolute top-0.5 ${
                      privacyMode ? 'left-[17px]' : 'left-0.5'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Navigation Options (Images & Projects) */}
            <div className="space-y-1 pt-1">
              <button
                onClick={() => {
                  setActiveTab('chat');
                }}
                className={`w-full px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all cursor-pointer ${
                  activeTab === 'chat'
                    ? 'bg-[#221f36] text-slate-900 dark:text-white font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-[#1a1828] hover:text-slate-900 dark:text-white'
                }`}
              >
                <MessageSquarePlus className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                <span>Chat</span>
              </button>

              <button
                onClick={() => setActiveTab('images')}
                className={`w-full px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all cursor-pointer ${
                  activeTab === 'images'
                    ? 'bg-[#221f36] text-slate-900 dark:text-white font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-[#1a1828] hover:text-slate-900 dark:text-white'
                }`}
              >
                <ImageIcon className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                <span>Images</span>
              </button>

              <button
                onClick={() => setActiveTab('projects')}
                className={`w-full px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all cursor-pointer ${
                  activeTab === 'projects'
                    ? 'bg-[#221f36] text-slate-900 dark:text-white font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-[#1a1828] hover:text-slate-900 dark:text-white'
                }`}
              >
                <Folder className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                <span>Projects</span>
              </button>
            </div>

            {/* Saved Chat History Section */}
            {chatHistoryList.length > 0 && !privacyMode && (
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80 space-y-1">
                <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block px-1">
                  History
                </span>
                <div className="space-y-1 max-h-40 overflow-y-auto no-scrollbar">
                  {chatHistoryList.map((thread) => (
                    <div
                      key={thread.id}
                      onClick={() => {
                        handleSelectThread(thread);
                        setActiveTab('chat');
                      }}
                      className={`group p-2 rounded-xl text-xs transition-all cursor-pointer flex items-center justify-between gap-1 ${
                        activeThreadId === thread.id
                          ? 'bg-[#221f36] text-slate-900 dark:text-white font-bold'
                          : 'text-slate-500 dark:text-slate-400 hover:bg-[#181628] hover:text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      <span className="break-words whitespace-normal leading-snug min-w-0">{thread.title}</span>
                      <button
                        onClick={(e) => handleDeleteThread(e, thread.id)}
                        className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Bottom Box */}
          <div className="space-y-3 pt-2">
            <button
              onClick={() => handleOpenAccountModal('Settings')}
              className="w-full px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-[#1a1828] flex items-center gap-2.5 cursor-pointer flex-wrap max-w-full"
            >
              <Settings className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <span>Settings</span>
            </button>

            {/* Bottom Card: "Save your chat history" */}
            <div className="bg-[#181626] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-3.5 space-y-2.5">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Save your chat history</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Create a free account to keep your chats, organize them in projects, and get higher usage limits.
              </p>
              <div className="space-y-1.5 pt-1">
                <button
                  onClick={() => handleOpenAccountModal('Create a free account')}
                  className="w-full py-2 rounded-xl bg-[#6149f6] hover:bg-[#523be3] text-slate-900 dark:text-white text-xs font-bold transition-all cursor-pointer shadow-md shadow-purple-600/20"
                >
                  Create a free account
                </button>
                <button
                  onClick={() => handleOpenAccountModal('Sign in')}
                  className="w-full py-1.5 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-white text-xs font-semibold transition-colors cursor-pointer text-center block"
                >
                  Sign in
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Center Canvas Area */}
        <main className="flex-1 bg-[#0b0a12] flex flex-col min-w-0 overflow-hidden relative">
          {/* TAB 1: CHAT */}
          {activeTab === 'chat' && (
            <div className="flex-1 flex flex-col h-full min-h-0">
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 min-h-0 min-w-0">
                {messages.length === 0 ? (
                  /* INITIAL VIEW: "How can I help?" */
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-6 max-w-lg mx-auto my-auto py-12">
                    {/* Cute Lumo Cat Mascot */}
                    <div className="w-16 h-16 rounded-2xl bg-[#6149f6] flex items-center justify-center text-3xl shadow-xl shadow-purple-600/30">
                      🐱
                    </div>

                    <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                      How can I help?
                    </h2>

                    {/* Central Input Box */}
                    <div className="w-full relative bg-[#131220] border border-slate-200 dark:border-slate-800 focus-within:border-purple-500 rounded-3xl p-3.5 transition-all shadow-2xl space-y-3">
                      <textarea
                        value={inputPrompt}
                        onChange={(e) => setInputPrompt(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        placeholder="Ask anything..."
                        rows={2}
                        className="w-full bg-transparent text-slate-900 dark:text-white text-sm placeholder-slate-500 focus:outline-none resize-none leading-relaxed"
                      />

                      {/* Controls inside input field */}
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-2 relative flex-wrap max-w-full">
                          <button
                            onClick={() => handleSendMessage()}
                            className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white transition-colors cursor-pointer"
                            title="Lampirkan File"
                          >
                            <Plus className="w-4 h-4" />
                          </button>

                          {/* Tools Dropdown Button */}
                          <div className="relative">
                            <button
                              onClick={() => setIsToolsDropdownOpen(!isToolsDropdownOpen)}
                              className="px-2.5 py-1 rounded-xl bg-[#1b192c] border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-white flex items-center gap-1.5 cursor-pointer flex-wrap max-w-full"
                            >
                              <Sliders className="w-3.5 h-3.5 text-purple-400" />
                              <span>Tools</span>
                            </button>

                            {/* Tools Menu Popup */}
                            {isToolsDropdownOpen && (
                              <div className="absolute bottom-full left-0 mb-2 w-48 bg-[#1a182a] border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl p-2 z-50 space-y-1 text-left">
                                <span className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase block px-2 py-0.5">
                                  Pilih Tools Tambahan
                                </span>
                                {availableTools.map((tool) => {
                                  const isChecked = selectedTools.includes(tool);
                                  return (
                                    <button
                                      key={tool}
                                      onClick={() => handleToggleTool(tool)}
                                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                                        isChecked
                                          ? 'bg-purple-950 text-purple-200'
                                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:bg-slate-800'
                                      }`}
                                    >
                                      <span>{tool}</span>
                                      {isChecked && <Check className="w-3.5 h-3.5 text-purple-400" />}
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </div>

                          {selectedTools.length > 0 && (
                            <span className="text-[10px] bg-purple-950 text-purple-300 border border-purple-800 px-2 py-0.5 rounded-full font-bold">
                              {selectedTools.length} Tools Aktif
                            </span>
                          )}
                        </div>

                        {/* Model Selector Dropdown */}
                        <div className="relative">
                          <button
                            onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
                            className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#1b192c] border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-white cursor-pointer flex-wrap max-w-full"
                          >
                            <span>{selectedModel}</span>
                            <ChevronDown className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                          </button>

                          {isModelDropdownOpen && (
                            <div className="absolute bottom-full right-0 mb-2 w-44 bg-[#1a182a] border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl p-1.5 z-50 space-y-1 text-left">
                              {models.map((m) => (
                                <button
                                  key={m}
                                  onClick={() => {
                                    setSelectedModel(m);
                                    setIsModelDropdownOpen(false);
                                  }}
                                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between cursor-pointer ${
                                    selectedModel === m ? 'bg-purple-900/50 text-purple-200' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:bg-slate-800'
                                  }`}
                                >
                                  <span>{m}</span>
                                  {selectedModel === m && <Check className="w-3.5 h-3.5 text-purple-400" />}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-500">
                      By using Lumo, you agree to our <span className="underline cursor-pointer">Terms</span> and <span className="underline cursor-pointer">Privacy Policy</span>.
                    </p>
                  </div>
                ) : (
                  /* CONVERSATION THREAD VIEW */
                  <div className="max-w-3xl mx-auto space-y-6">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        {msg.sender === 'lumo' && (
                          <div className="w-8 h-8 rounded-xl bg-[#6149f6] flex items-center justify-center text-slate-900 dark:text-white shrink-0 shadow-md">
                            🐱
                          </div>
                        )}

                        <div className={`space-y-1 max-w-xl ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                          <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400 font-mono px-1 flex-wrap max-w-full">
                            <span>{msg.sender === 'user' ? 'Anda' : 'Lumo AI'}</span>
                            <span>•</span>
                            <span>{msg.timestamp}</span>
                          </div>

                          <div
                            className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words shadow-md ${
                              msg.sender === 'user'
                                ? 'bg-[#6149f6] text-slate-900 dark:text-white rounded-br-none'
                                : 'bg-[#141222] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 rounded-bl-none'
                            }`}
                          >
                            {msg.text}

                            {msg.toolsUsed && msg.toolsUsed.length > 0 && (
                              <div className="mt-3 pt-2 border-t border-purple-900/60 flex items-center gap-1.5 flex-wrap">
                                <span className="text-[10px] text-purple-300 font-bold">Tools:</span>
                                {msg.toolsUsed.map((t) => (
                                  <span key={t} className="text-[10px] bg-purple-950 text-purple-200 px-2 py-0.5 rounded-full border border-purple-800">
                                    {t}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          {msg.sender === 'lumo' && (
                            <div className="flex items-center gap-2 px-1 flex-wrap max-w-full">
                              <button
                                onClick={() => handleCopyText(msg.id, msg.text)}
                                className="text-[10px] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white flex items-center gap-1 transition-colors cursor-pointer flex-wrap max-w-full"
                              >
                                {copiedId === msg.id ? (
                                  <>
                                    <Check className="w-3 h-3 text-emerald-400" />
                                    <span className="text-emerald-400">Tersalin!</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3 h-3" />
                                    <span>Salin</span>
                                  </>
                                )}
                              </button>
                            </div>
                          )}
                        </div>

                        {msg.sender === 'user' && (
                          <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 p-1.5 flex items-center justify-center text-slate-600 dark:text-slate-300 shrink-0 shadow-md">
                            <User className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Loading Indicator */}
                    {isLoading && (
                      <div className="flex gap-3 justify-start">
                        <div className="w-8 h-8 rounded-xl bg-[#6149f6] flex items-center justify-center text-slate-900 dark:text-white shrink-0 animate-pulse">
                          🐱
                        </div>
                        <div className="p-4 rounded-2xl bg-[#141222] border border-slate-200 dark:border-slate-800 text-xs text-purple-300 flex items-center gap-2 flex-wrap max-w-full">
                          <RefreshCw className="w-4 h-4 animate-spin text-purple-400" />
                          <span>Lumo sedang memproses respon...</span>
                        </div>
                      </div>
                    )}

                    {/* Error Banner */}
                    {errorMessage && (
                      <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-200 text-xs flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0 flex-wrap max-w-full">
                          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                          <span className="break-words whitespace-normal leading-snug">{errorMessage}</span>
                        </div>
                        <button
                          onClick={() => handleSendMessage()}
                          className="px-2.5 py-1 rounded-lg bg-rose-800 hover:bg-rose-700 text-white font-bold text-[10px] shrink-0"
                        >
                          Coba Lagi
                        </button>
                      </div>
                    )}

                    <div ref={chatBottomRef} />
                  </div>
                )}
              </div>

              {/* Bottom Input Box (when thread is active) */}
              {messages.length > 0 && (
                <div className="p-3 bg-[#0b0a12] border-t border-slate-200 dark:border-slate-800/80 shrink-0">
                  <div className="max-w-3xl mx-auto space-y-2">
                    <div className="relative bg-[#131220] border border-slate-200 dark:border-slate-800 focus-within:border-purple-500 rounded-2xl p-2.5 transition-all shadow-xl">
                      <textarea
                        value={inputPrompt}
                        onChange={(e) => setInputPrompt(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        placeholder="Ask anything..."
                        rows={1}
                        className="w-full bg-transparent text-slate-900 dark:text-white text-xs sm:text-sm placeholder-slate-500 focus:outline-none resize-none leading-relaxed"
                      />

                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-2 flex-wrap max-w-full">
                          <button
                            onClick={() => setIsToolsDropdownOpen(!isToolsDropdownOpen)}
                            className="px-2.5 py-1 rounded-xl bg-[#1b192c] border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-white flex items-center gap-1.5 cursor-pointer flex-wrap max-w-full"
                          >
                            <Sliders className="w-3.5 h-3.5 text-purple-400" />
                            <span>Tools</span>
                          </button>
                        </div>

                        <button
                          onClick={() => handleSendMessage()}
                          disabled={!inputPrompt.trim() || isLoading}
                          className={`p-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center ${
                            inputPrompt.trim() && !isLoading
                              ? 'bg-[#6149f6] hover:bg-[#523be3] text-slate-900 dark:text-white shadow-md shadow-purple-600/30'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-500 cursor-not-allowed'
                          }`}
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: IMAGES */}
          {activeTab === 'images' && (
            <div className="flex-1 overflow-y-auto p-6 space-y-6 min-w-0">
              <div className="max-w-2xl mx-auto space-y-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2 flex-wrap max-w-full">
                    <ImageIcon className="w-5 h-5 text-purple-400" />
                    Lumo Vision (Generasi Gambar Privasi)
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Hasilkan gambar berkualitas tinggi secara aman tanpa pelacakan hak milik data atau riwayat iklan.
                  </p>
                </div>

                <div className="bg-[#131220] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3">
                  <div>
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                      Deskripsi Gambar (Prompt):
                    </label>
                    <textarea
                      value={imagePrompt}
                      onChange={(e) => setImagePrompt(e.target.value)}
                      placeholder="Contoh: Pemandangan kota futuristik bernuansa neon purple, cyberpunk style..."
                      rows={3}
                      className="w-full bg-[#0b0a12] border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">
                        Gaya Visual:
                      </label>
                      <select
                        value={imageStyle}
                        onChange={(e) => setImageStyle(e.target.value)}
                        className="w-full bg-[#0b0a12] border border-slate-200 dark:border-slate-800 rounded-xl p-2 text-xs text-slate-900 dark:text-white focus:outline-none"
                      >
                        <option value="digital art">Digital Art</option>
                        <option value="photorealistic">Photorealistic</option>
                        <option value="anime">Anime / Manga</option>
                        <option value="3d render">3D Render</option>
                        <option value="cyberpunk">Cyberpunk</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">
                        Rasio Aspek:
                      </label>
                      <select
                        value={imageAspectRatio}
                        onChange={(e) => setImageAspectRatio(e.target.value)}
                        className="w-full bg-[#0b0a12] border border-slate-200 dark:border-slate-800 rounded-xl p-2 text-xs text-slate-900 dark:text-white focus:outline-none"
                      >
                        <option value="1:1">1:1 (Persegi)</option>
                        <option value="16:9">16:9 (Landscape)</option>
                        <option value="9:16">9:16 (Story)</option>
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={handleGenerateImage}
                    disabled={!imagePrompt.trim() || isGeneratingImage}
                    className={`w-full py-2.5 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      imagePrompt.trim() && !isGeneratingImage
                        ? 'bg-[#6149f6] hover:bg-[#523be3] text-slate-900 dark:text-white shadow-lg shadow-purple-600/30'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    {isGeneratingImage ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-slate-900 dark:text-white" />
                        <span>Membuat Gambar AI...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-purple-200" />
                        <span>Generate Gambar Privasi</span>
                      </>
                    )}
                  </button>

                  {imageError && (
                    <div className="p-2.5 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-200 text-xs flex items-center gap-2 flex-wrap max-w-full">
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>{imageError}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-extrabold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                    Hasil Generasi Gambar ({generatedImages.length})
                  </h4>

                  {generatedImages.length === 0 ? (
                    <div className="p-8 text-center bg-[#131220]/50 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-500 text-xs space-y-1">
                      <ImageIcon className="w-8 h-8 mx-auto text-slate-600 mb-2" />
                      <p>Belum ada gambar yang dibuat.</p>
                      <p className="text-[11px] text-slate-600">Ketik prompt di atas dan klik Generate Gambar.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {generatedImages.map((img) => (
                        <div key={img.id} className="bg-[#131220] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden space-y-2 p-2">
                          <img
                            src={img.url}
                            alt={img.prompt}
                            className="w-full h-48 object-cover rounded-xl bg-slate-100 dark:bg-slate-950"
                          />
                          <div className="p-1 space-y-1">
                            <p className="text-xs text-slate-700 dark:text-slate-200 font-semibold line-clamp-2">
                              "{img.prompt}"
                            </p>
                            <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
                              <span>{img.provider} • {img.timestamp}</span>
                              <a
                                href={img.url}
                                download={`lumo-image-${img.id}.jpg`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-purple-400 hover:text-purple-300 flex items-center gap-1 font-bold flex-wrap max-w-full"
                              >
                                <Download className="w-3 h-3" /> Unduh
                              </a>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PROJECTS */}
          {activeTab === 'projects' && (
            <div className="flex-1 overflow-y-auto p-6 space-y-6 min-w-0">
              <div className="max-w-2xl mx-auto space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2 flex-wrap max-w-full">
                      <Folder className="w-5 h-5 text-purple-400" />
                      Lumo Workspace Projects
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Kelompokkan percakapan dan dokumen proyek terenkripsi.
                    </p>
                  </div>

                  <button
                    onClick={() => setIsNewProjectModalOpen(true)}
                    className="px-3 py-1.5 rounded-xl bg-[#6149f6] hover:bg-[#523be3] text-slate-900 dark:text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md flex-wrap max-w-full"
                  >
                    <Plus className="w-4 h-4" />
                    <span>New Project</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {projectsList.map((proj) => (
                    <div
                      key={proj.id}
                      className="bg-[#131220] border border-slate-200 dark:border-slate-800 hover:border-purple-500/80 p-4 rounded-2xl space-y-2 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center justify-between">
                        <Folder className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] text-slate-500 font-mono">{proj.createdAt}</span>
                      </div>
                      <h4 className="text-sm font-extrabold text-slate-900 dark:text-white group-hover:text-purple-300">
                        {proj.name}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {proj.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Page Footer Navigation Links */}
          <div className="p-3 bg-[#0b0a12] border-t border-slate-200 dark:border-slate-900 text-center flex items-center justify-center gap-6 text-xs text-slate-500 font-semibold shrink-0">
            <span className="hover:text-slate-600 dark:text-slate-300 cursor-pointer">About</span>
            <span className="hover:text-slate-600 dark:text-slate-300 cursor-pointer">By Proton</span>
            <span className="hover:text-slate-600 dark:text-slate-300 cursor-pointer">For Business</span>
          </div>
        </main>
      </div>

      {/* NEW PROJECT MODAL */}
      {isNewProjectModalOpen && (
        <div className="absolute inset-0 bg-slate-100 dark:bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#131220] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2 flex-wrap max-w-full">
                <Folder className="w-4 h-4 text-purple-400" />
                Buat Proyek Baru
              </h4>
              <button
                onClick={() => setIsNewProjectModalOpen(false)}
                className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                Nama Proyek:
              </label>
              <input
                type="text"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="Contoh: Analisis Dokumen Rahasia..."
                className="w-full bg-[#0b0a12] border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsNewProjectModalOpen(false)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white"
              >
                Batal
              </button>
              <button
                onClick={handleCreateProject}
                disabled={!newProjectName.trim()}
                className="px-4 py-1.5 rounded-xl bg-[#6149f6] hover:bg-[#523be3] text-slate-900 dark:text-white text-xs font-bold"
              >
                Simpan Proyek
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ACCOUNT SIMULATION MODAL */}
      {isAccountModalOpen && (
        <div className="absolute inset-0 bg-slate-100 dark:bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#131220] border border-purple-800/80 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl text-center">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-[#6149f6] flex items-center justify-center text-2xl shadow-lg">
              🐱
            </div>

            <div className="space-y-2">
              <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                Simulasi Pembelajaran AI
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Fitur tombol <strong className="text-purple-300">"{accountModalAction}"</strong> ini adalah bagian dari modul pembelajaran interaktif AI Navigator dan tidak terhubung ke akun asli Proton AG.
              </p>
            </div>

            <div className="bg-[#0b0a12] border border-slate-200 dark:border-slate-800 p-3 rounded-xl text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
              <p className="font-bold text-purple-300">💡 Fakta Lumo AI Proton:</p>
              <p>Lumo dikembangkan oleh Proton di Swiss dengan standar perlindungan data zero-knowledge terketat di dunia.</p>
            </div>

            <button
              onClick={() => setIsAccountModalOpen(false)}
              className="w-full py-2 rounded-xl bg-[#6149f6] hover:bg-[#523be3] text-slate-900 dark:text-white text-xs font-extrabold transition-all cursor-pointer"
            >
              Mengerti &amp; Lanjutkan Eksplorasi
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LumoReplica;
export const LumoAISimulator = LumoReplica;
