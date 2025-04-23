import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';

// Define TypeScript interfaces
interface AppState {
  selectedServices: Set<string>;
  activeTab: 'mcp-plaza' | 'custom-mcp';
  activeCategory: 'all' | 'activated' | 'not-activated';
  openedMCP: boolean;
  searchTerm: string;
  toggles: {
    'creation': boolean;
    'knowledge-graph': boolean;
    'dynamic-analysis': boolean;
    'smart-search': boolean;
    'rotation': boolean;
    'mcp-service': boolean;
  };
}

interface ServiceItemProps {
  name: string;
  description: string;
  icon: React.ReactNode;
  infoIcon?: React.ReactNode;
  isSelected: boolean;
  isActivated: boolean;
  onSelect: (name: string) => void;
  onActivate: (name: string) => void;
}

interface NotificationProps {
  message: string;
  onClose: () => void;
}

const App: React.FC = () => {
  // State management with React hooks
  const [state, setState] = useState<AppState>({
    selectedServices: new Set<string>(['Amap Maps', 'QuickChart']),
    activeTab: 'mcp-plaza',
    activeCategory: 'all',
    openedMCP: true,
    searchTerm: '',
    toggles: {
      'creation': false,
      'knowledge-graph': false,
      'dynamic-analysis': false,
      'smart-search': false,
      'rotation': false,
      'mcp-service': true
    }
  });
  
  const [notification, setNotification] = useState<string | null>(null);

  // Initialize dark mode
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark');
    }
    
    const darkModeListener = window.matchMedia('(prefers-color-scheme: dark)');
    const handleDarkModeChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };
    
    darkModeListener.addEventListener('change', handleDarkModeChange);
    
    return () => {
      darkModeListener.removeEventListener('change', handleDarkModeChange);
    };
  }, []);

  // Service data
  const services = [
    {
      name: 'Amap Maps',
      description: 'Amap Maps 是高德提供的大型地图服务，帮助查询地图和地点信息，包括路径规划和位置服务。',
      icon: (
        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
          <svg className="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
        </div>
      ),
      infoIcon: (
        <span className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center">
          <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-11v6h2v-6h-2zm0-4v2h2V7h-2z"/>
          </svg>
        </span>
      ),
      isActivated: false
    },
    {
      name: 'EverArt',
      description: '创作TUNDRA绘画 AI 图像生成工具，可以绘制各种艺术图像。Plus 等会员使用无限额度。',
      icon: (
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
          <svg className="w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-18c-4.418 0-8 3.582-8 8 0 .362.043.711.11 1.054 1.496-1.226 2.849-1.773 4.148-1.772 1.816 0 3.365 1.114 5.099 2.541 1.534 1.264 3.313 2.733 5.252 2.733.309 0 .621-.03.934-.089A7.958 7.958 0 0 0 20 12c0-4.418-3.582-8-8-8z"/>
          </svg>
        </div>
      ),
      isActivated: false
    },
    {
      name: 'Notion',
      description: '同步到Notion来查看和使用 Notion API 同步，使用 AI 操作管理你的 Notion 文档和空间。',
      icon: (
        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
          <svg className="w-5 h-5 text-gray-800 dark:text-gray-200" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm0 2v12h16V6H4zm2 3h12v2H6V9zm0 4h10v2H6v-2z"/>
          </svg>
        </div>
      ),
      isActivated: false
    },
    {
      name: 'GitHub',
      description: 'GitHub 专用的智能助手。为开发人员提供更深层次的 GitHub 项目解读和代码理解。',
      icon: (
        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
          <svg className="w-5 h-5 text-gray-800 dark:text-gray-200" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.167 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.605-3.369-1.343-3.369-1.343-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.699 1.028 1.592 1.028 2.683 0 3.841-2.337 4.687-4.565 4.935.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12c0-5.523-4.477-10-10-10z"/>
          </svg>
        </div>
      ),
      isActivated: false
    },
    {
      name: 'Firecrawl',
      description: 'Firecrawl 专项对网站的爬虫，支持各种网站，每个兔组都可能的网页爬虫和网址解析。',
      icon: (
        <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
          <svg className="w-5 h-5 text-orange-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 23a7.5 7.5 0 0 1-5.138-12.963C8.204 8.774 11.5 6.5 11 1.5c6 4 9 8 3 14 1 0 2.5 0 5-2.47.27.773.5 1.604.5 2.47A7.5 7.5 0 0 1 12 23z"/>
          </svg>
        </div>
      ),
      isActivated: false
    },
    {
      name: 'Perplexity Ask',
      description: 'Perplexity 是一款依赖在线信息处理，通过自动合成多个问题创建可靠的搜索引擎回答。',
      icon: (
        <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center">
          <svg className="w-5 h-5 text-teal-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.222 9.16h-1.334c.015-.09.028-.182.028-.277V6.57c0-.98-.797-1.777-1.778-1.777H3.5V3.358a.75.75 0 0 0-1.5 0V20.83a.75.75 0 0 0 1.5 0v-1.434h10.556a1.78 1.78 0 0 0 1.778-1.777v-2.313c0-.095-.014-.187-.028-.278h4.417a1.78 1.78 0 0 0 1.778-1.777v-2.314a1.78 1.78 0 0 0-1.778-1.78h-.001zM17.14 6.293c.152 0 .277.124.277.277v2.31a.28.28 0 0 1-.278.28H3.5V6.29h13.64v.003zm-2.807 9.014v2.312a.278.278 0 0 1-.278.277H3.5v-2.868h10.556c.153 0 .277.126.277.28v-.001zM20.5 13.25a.278.278 0 0 1-.278.277H3.5V10.66h16.722c.153 0 .278.124.278.277v2.313z"/>
          </svg>
        </div>
      ),
      isActivated: false
    },
    {
      name: 'QuickChart',
      description: '可生成各种各样的统计图、图表数据，使用 QuickChart 生成各种专业的图表效果图。',
      icon: (
        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
          <svg className="w-5 h-5 text-green-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm0 2v14h14V5H5zm2 2h2v10H7V7zm4 2h2v8h-2V9zm4 2h2v6h-2v-6z"/>
          </svg>
        </div>
      ),
      infoIcon: (
        <span className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center">
          <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-11v6h2v-6h-2zm0-4v2h2V7h-2z"/>
          </svg>
        </span>
      ),
      isActivated: false
    },
    {
      name: 'Flomo',
      description: 'Flomo 浮墨笔记可以帮你快速记录笔记，支持卡片式 AI 帮助笔记 Flomo 内容管理和收集。还提供...',
      icon: (
        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
          <svg className="w-5 h-5 text-emerald-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17 3h4a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h4V1h2v2h6V1h2v2zm-2 2H9v2H7V5H4v4h16V5h-3v2h-2V5zm5 6H4v8h16v-8z"/>
          </svg>
        </div>
      ),
      isActivated: false
    }
  ];

  // Event handlers
  const toggleMCPPanel = (show: boolean) => {
    setState(prev => ({ ...prev, openedMCP: show }));
  };

  const handleSelectService = (serviceName: string) => {
    setState(prev => {
      const newSelectedServices = new Set(prev.selectedServices);
      if (newSelectedServices.has(serviceName)) {
        newSelectedServices.delete(serviceName);
      } else {
        newSelectedServices.add(serviceName);
      }
      
      return {
        ...prev,
        selectedServices: newSelectedServices
      };
    });
  };

  const handleActivateService = (serviceName: string) => {
    const updatedServices = services.map(service => {
      if (service.name === serviceName) {
        const newActivatedState = !service.isActivated;
        
        // If newly activated, also select it
        if (newActivatedState && !state.selectedServices.has(serviceName)) {
          setState(prev => {
            const newSelectedServices = new Set(prev.selectedServices);
            newSelectedServices.add(serviceName);
            return { ...prev, selectedServices: newSelectedServices };
          });
        }
        
        return { ...service, isActivated: newActivatedState };
      }
      return service;
    });
    
    // In a real app, we would update the services state here
    showNotification(serviceName + (services.find(s => s.name === serviceName)?.isActivated ? 
      ' 已取消开通' : ' 已成功开通'));
  };

  const handleTabChange = (tab: 'mcp-plaza' | 'custom-mcp') => {
    setState(prev => ({ ...prev, activeTab: tab }));
  };

  const handleCategoryChange = (category: 'all' | 'activated' | 'not-activated') => {
    setState(prev => ({ ...prev, activeCategory: category }));
  };

  const handleToggleChange = (key: keyof AppState['toggles']) => {
    setState(prev => ({
      ...prev,
      toggles: {
        ...prev.toggles,
        [key]: !prev.toggles[key]
      }
    }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState(prev => ({ ...prev, searchTerm: e.target.value }));
  };

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 2000);
  };

  // Filter services based on search and category
  const filteredServices = services.filter(service => {
    const matchesSearch = state.searchTerm === '' || 
                         service.name.toLowerCase().includes(state.searchTerm.toLowerCase()) || 
                         service.description.toLowerCase().includes(state.searchTerm.toLowerCase());
    
    let matchesCategory = true;
    if (state.activeCategory === 'activated') {
      matchesCategory = service.isActivated;
    } else if (state.activeCategory === 'not-activated') {
      matchesCategory = !service.isActivated;
    }
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-100 dark:bg-gray-900">
      {/* Header with gradient background */}
      <header className="gradient-bg text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="font-bold text-xl">全媒体写作辅助套件</h1>
          <div className="flex space-x-4">
            <button className="px-3 py-1 bg-white bg-opacity-20 rounded-md">正在编辑中</button>
            <button className="px-3 py-1 bg-white bg-opacity-20 rounded-md">应用服务</button>
            <button className="px-3 py-1 bg-white bg-opacity-20 rounded-md">发布渠道</button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left side - Document editor area */}
        <div className="flex-1 flex flex-col bg-white dark:bg-gray-800 overflow-hidden border-r border-gray-200 dark:border-gray-700">
          {/* Editor toolbar */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <button className="text-gray-600 dark:text-gray-300">搜索词</button>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-gray-600 dark:text-gray-300">自 检测</button>
              <button className="text-gray-600 dark:text-gray-300">词 优化</button>
              <div className="relative">
                <button className="text-gray-600 dark:text-gray-300 flex items-center">
                  文本对话 
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Document content */}
          <div className="flex-1 p-4 overflow-auto">
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p className="font-bold"># 简介</p>
              <p>创建一个专业的空气质量分析仪，讲解各地区城市的空气质量天气，并生成可视化图表。</p>
              
              <p className="font-bold"># 技能</p>
              <p>## 技能 1: 查询城市气候</p>
              <p>- 使用Amap Maps查询MCP服务，查询任意国内城市的实时空气质量。</p>
              <p>- 可以详细展示包括PM2.5，温度，风速，和湿度等天气指标。</p>
              
              <p className="font-bold"># 技能 2: 生成数据可视化</p>
              <p>- 调查细节的空气质量使用QuickChart的MCP服务呈现为多种图表可视化展示。</p>
              <p>- 可视化形式包括折线图，柱状图，气泡图等形式，轻松看清不同城市的空气质量差异。</p>
              <p>- 海伦图表展示，突出显示变化。</p>
              
              <p className="font-bold"># 技能 3: 提供空气分析报告</p>
            </div>
          </div>

          {/* Document footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              470 / 128000
            </div>
            <div className="flex items-center space-x-2">
              <button className="text-sm text-gray-500 dark:text-gray-400">整理</button>
            </div>
          </div>

          {/* Bottom toolbar */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-2">
            <div className="flex flex-col space-y-2">
              {/* Toggle switches */}
              <ToggleSwitch 
                label="创世" 
                isChecked={state.toggles['creation']} 
                onChange={() => handleToggleChange('creation')} 
              />
              <ToggleSwitch 
                label="知识图谱" 
                isChecked={state.toggles['knowledge-graph']} 
                onChange={() => handleToggleChange('knowledge-graph')} 
              />
              <ToggleSwitch 
                label="动态文件解析" 
                isChecked={state.toggles['dynamic-analysis']} 
                onChange={() => handleToggleChange('dynamic-analysis')} 
              />
              <ToggleSwitch 
                label="智能搜索" 
                isChecked={state.toggles['smart-search']} 
                onChange={() => handleToggleChange('smart-search')} 
              />
              <ToggleSwitch 
                label="转角度" 
                isChecked={state.toggles['rotation']} 
                onChange={() => handleToggleChange('rotation')} 
              />
            </div>
            
            <div className="mt-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">特性</p>
              <ToggleSwitch 
                label="MCP服务" 
                isChecked={state.toggles['mcp-service']} 
                onChange={() => handleToggleChange('mcp-service')} 
              />
            </div>
            
            <div className="border-t border-gray-200 dark:border-gray-700 mt-4 pt-4">
              <div className="flex items-center">
                <div className="flex items-center">
                  <span className="w-6 h-6 flex items-center justify-center bg-red-500 text-white rounded-full text-xs">
                    {state.selectedServices.size || 1}
                  </span>
                  <button 
                    className="ml-2 px-3 py-1 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 rounded-md flex items-center"
                    onClick={() => toggleMCPPanel(true)}
                  >
                    <span>+ MCP</span>
                  </button>
                </div>
                <div className="ml-auto flex items-center">
                  <button 
                    className="text-xs text-primary"
                    onClick={() => showNotification('工具123 功能已触发')}
                  >
                    工具123
                  </button>
                </div>
              </div>
              
              {/* Selected services list */}
              <div className="mt-4 flex flex-col space-y-1">
                {Array.from(state.selectedServices).map(service => (
                  <div key={service} className="flex items-center p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
                    <svg className="w-5 h-5 text-green-500" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-.997-4L6.76 11.757l1.414-1.414 2.829 2.829 5.656-5.657 1.415 1.414L11.003 16z"/>
                    </svg>
                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">{service}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">编辑</span>
                  <div className="flex items-center">
                    <button 
                      className="text-primary"
                      onClick={() => showNotification('添加功能已触发')}
                    >
                      + 添加
                    </button>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="flex items-center p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
                    <span className="text-sm text-gray-600 dark:text-gray-400">清单</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - MCP Services modal */}
        {state.openedMCP && (
          <div className="w-80 md:w-96 bg-white dark:bg-gray-800 shadow-lg overflow-y-auto animate-fadeIn">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="font-bold text-lg text-gray-800 dark:text-gray-200">选择MCP服务</h2>
              <button 
                onClick={() => toggleMCPPanel(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            {/* Search bar */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                  </svg>
                </div>
                <input 
                  type="search" 
                  className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" 
                  placeholder="名称搜索" 
                  value={state.searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
            
            {/* Tabs */}
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              <button 
                className={`flex-1 py-3 px-4 text-center ${state.activeTab === 'mcp-plaza' ? 'border-b-2 border-primary text-primary font-medium' : 'text-gray-500 dark:text-gray-400'}`}
                onClick={() => handleTabChange('mcp-plaza')}
              >
                MCP 广场
              </button>
              <button 
                className={`flex-1 py-3 px-4 text-center ${state.activeTab === 'custom-mcp' ? 'border-b-2 border-primary text-primary font-medium' : 'text-gray-500 dark:text-gray-400'}`}
                onClick={() => handleTabChange('custom-mcp')}
              >
                自定义MCP
              </button>
            </div>
            
            {/* Categories */}
            <div className="flex space-x-2 p-2 text-sm overflow-x-auto whitespace-nowrap border-b border-gray-200 dark:border-gray-700">
              <button 
                className={`px-3 py-1 rounded-full text-gray-700 dark:text-gray-300 ${state.activeCategory === 'all' ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
                onClick={() => handleCategoryChange('all')}
              >
                全部服务
              </button>
              <button 
                className={`px-3 py-1 rounded-full text-gray-700 dark:text-gray-300 ${state.activeCategory === 'activated' ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
                onClick={() => handleCategoryChange('activated')}
              >
                已开通
              </button>
              <button 
                className={`px-3 py-1 rounded-full text-gray-700 dark:text-gray-300 ${state.activeCategory === 'not-activated' ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
                onClick={() => handleCategoryChange('not-activated')}
              >
                未开通
              </button>
            </div>
            
            {/* Service list */}
            <div className="p-4 space-y-4">
              {filteredServices.map(service => (
                <ServiceItem 
                  key={service.name}
                  name={service.name}
                  description={service.description}
                  icon={service.icon}
                  infoIcon={service.infoIcon}
                  isSelected={state.selectedServices.has(service.name)}
                  isActivated={service.isActivated}
                  onSelect={() => handleSelectService(service.name)}
                  onActivate={() => handleActivateService(service.name)}
                />
              ))}
            </div>
            
            {/* Footer */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between">
              <button className="text-xs text-gray-500 dark:text-gray-400">赞助可用</button>
              <button className="text-xs text-gray-500 dark:text-gray-400">回到首页</button>
            </div>
          </div>
        )}
      </div>

      {/* Notification Toast */}
      {notification && (
        <Notification 
          message={notification} 
          onClose={() => setNotification(null)} 
        />
      )}
    </div>
  );
};

// Sub-components
const ServiceItem: React.FC<ServiceItemProps> = ({ 
  name, 
  description, 
  icon, 
  infoIcon, 
  isSelected, 
  isActivated,
  onSelect, 
  onActivate 
}) => {
  return (
    <div 
      className={`service-item p-3 rounded-lg border ${isSelected ? 'border-primary bg-blue-50 dark:bg-blue-900/10' : 'border-gray-200 dark:border-gray-700'} flex justify-between items-center`}
      onClick={() => onSelect(name)}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          {icon}
        </div>
        <div>
          <div className="flex items-center">
            <span className="font-medium text-gray-900 dark:text-white">{name}</span>
            {infoIcon && (
              <div className="ml-2 flex items-center">
                {infoIcon}
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{description}</p>
        </div>
      </div>
      <button 
        className={`px-3 py-1 text-xs text-white ${isActivated ? 'bg-green-500' : 'bg-primary'} rounded-md hover:bg-opacity-90`}
        onClick={(e) => {
          e.stopPropagation();
          onActivate(name);
        }}
      >
        {isActivated ? '已开通' : '立即开通'}
      </button>
    </div>
  );
};

interface ToggleSwitchProps {
  label: string;
  isChecked: boolean;
  onChange: () => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ label, isChecked, onChange }) => {
  return (
    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mt-2">
      <span className={isChecked ? 'font-medium' : ''}>{label}</span>
      <label className="relative inline-flex items-center cursor-pointer">
        <input 
          type="checkbox" 
          className="sr-only peer" 
          checked={isChecked}
          onChange={onChange}
        />
        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
      </label>
    </div>
  );
};

const Notification: React.FC<NotificationProps> = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [onClose]);
  
  return (
    <div className="fixed top-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-md shadow-lg z-50 animate-fadeIn">
      {message}
    </div>
  );
};

// Add styles
const styles = document.createElement('style');
styles.innerHTML = `
  .gradient-bg {
    background: linear-gradient(120deg, #4facfe 0%, #5D5CDE 100%);
  }
  .dark .gradient-bg {
    background: linear-gradient(120deg, #30cfd0 0%, #5D5CDE 100%);
    opacity: 0.8;
  }
  .service-item:hover {
    background-color: rgba(93, 92, 222, 0.05);
  }
  .dark .service-item:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }
  .text-primary {
    color: #5D5CDE;
  }
  .bg-primary {
    background-color: #5D5CDE;
  }
  .border-primary {
    border-color: #5D5CDE;
  }
  .peer-checked\:bg-primary:checked + .peer-checked\:bg-primary {
    background-color: #5D5CDE;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }
  .animate-fadeIn {
    animation: fadeIn 0.3s ease-in-out forwards;
  }
  .animate-fadeOut {
    animation: fadeOut 0.3s ease-in-out forwards;
  }
`;
document.head.appendChild(styles);

// Initialize the app
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<App />);
}

export default App;
