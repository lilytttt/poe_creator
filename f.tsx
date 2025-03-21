import React, { useState, useEffect, useMemo } from 'react';

// Define TypeScript interfaces
interface ToolParameter {
  name: string;
  value: string;
  type: 'text' | 'select' | 'checkbox' | 'number';
  options?: string[]; // For select type
}

interface Tool {
  name: string;
  description: string;
  tags: string[];
  parameters: ToolParameter[];
}

interface ToolCardProps {
  tool: Tool;
  onTagClick: (tag: string) => void;
  index: number;
  flippedCard: number | null;
  setFlippedCard: (index: number | null) => void;
  onParameterChange: (toolIndex: number, paramIndex: number, value: string) => void;
}

interface TagFilterProps {
  tag: string;
  isActive: boolean;
  onClick: () => void;
}

const TagFilter: React.FC<TagFilterProps> = ({ tag, isActive, onClick }) => {
  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium cursor-pointer transition-colors ${
        isActive
          ? 'bg-[#5D5CDE] text-white'
          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
      }`}
      onClick={onClick}
    >
      {tag}
    </span>
  );
};

const ToolCard: React.FC<ToolCardProps> = ({ 
  tool, 
  onTagClick, 
  index, 
  flippedCard, 
  setFlippedCard,
  onParameterChange 
}) => {
  const isFlipped = flippedCard === index;
  
  const handleCardClick = () => {
    if (isFlipped) {
      setFlippedCard(null);
    } else {
      setFlippedCard(index);
    }
  };

  const handleParameterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, paramIndex: number) => {
    onParameterChange(index, paramIndex, e.target.value);
    e.stopPropagation(); // Prevent card flip when interacting with inputs
  };

  return (
    <div className="h-64 perspective-1000">
      <div 
        className={`relative w-full h-full transition-transform duration-500 transform-style-preserve-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* Front of card */}
        <div 
          className="absolute w-full h-full bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-5 flex flex-col backface-hidden cursor-pointer"
          onClick={handleCardClick}
        >
          <h3 className="text-xl font-bold mb-2 text-[#5D5CDE] dark:text-[#7e7df0]">
            {tool.name}
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mb-4 flex-grow">{tool.description}</p>
          <div className="flex flex-wrap gap-2 mt-auto">
            {tool.tags.map((tag, tagIndex) => (
              <span
                key={tagIndex}
                className="tag-pill px-2 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-[#5D5CDE] hover:text-white dark:hover:bg-[#7e7df0] transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  onTagClick(tag.toLowerCase());
                }}
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="absolute bottom-2 right-2 text-gray-400">
            <i className="fas fa-cog"></i>
          </div>
        </div>
        
        {/* Back of card */}
        <div 
          className="absolute w-full h-full bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-5 flex flex-col backface-hidden rotate-y-180 overflow-y-auto"
          onClick={handleCardClick}
        >
          <h3 className="text-lg font-bold mb-3 text-[#5D5CDE] dark:text-[#7e7df0]">
            {tool.name} Parameters
          </h3>
          
          <div className="space-y-3 mb-4" onClick={(e) => e.stopPropagation()}>
            {tool.parameters.map((param, paramIndex) => (
              <div key={paramIndex} className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {param.name}
                </label>
                
                {param.type === 'select' && (
                  <select 
                    value={param.value}
                    onChange={(e) => handleParameterChange(e, paramIndex)}
                    className="p-1.5 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-sm"
                  >
                    {param.options?.map((option, optIndex) => (
                      <option key={optIndex} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                )}
                
                {param.type === 'checkbox' && (
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      checked={param.value === 'true'}
                      onChange={(e) => handleParameterChange(
                        {target: {value: e.target.checked ? 'true' : 'false'}} as React.ChangeEvent<HTMLInputElement>,
                        paramIndex
                      )}
                      className="mr-2 rounded"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {param.value === 'true' ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                )}
                
                {param.type === 'text' && (
                  <input 
                    type="text"
                    value={param.value}
                    onChange={(e) => handleParameterChange(e, paramIndex)}
                    className="p-1.5 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-sm"
                  />
                )}
                
                {param.type === 'number' && (
                  <input 
                    type="number"
                    value={param.value}
                    onChange={(e) => handleParameterChange(e, paramIndex)}
                    className="p-1.5 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-sm"
                  />
                )}
              </div>
            ))}
          </div>
          
          <div className="absolute bottom-2 right-2 text-gray-400">
            <i className="fas fa-arrow-left"></i>
          </div>
        </div>
      </div>
    </div>
  );
};

const ToolCardPage: React.FC = () => {
  // Define your tools data with parameters
  const initialToolsData: Tool[] = [
    {
      name: "Visual Studio Code",
      description: "A lightweight but powerful source code editor that runs on your desktop and is available for Windows, macOS and Linux.",
      tags: ["development", "code editor", "free"],
      parameters: [
        { name: "Editor Theme", value: "Dark+", type: "select", options: ["Dark+", "Light+", "Monokai", "Solarized"] },
        { name: "Auto Save", value: "true", type: "checkbox" },
        { name: "Tab Size", value: "4", type: "number" }
      ]
    },
    {
      name: "Figma",
      description: "A collaborative interface design tool that enables teams to work together on creating, testing, and shipping designs.",
      tags: ["design", "ui", "collaboration"],
      parameters: [
        { name: "Default Color Mode", value: "RGB", type: "select", options: ["RGB", "CMYK", "HSL"] },
        { name: "Auto Layout", value: "true", type: "checkbox" },
        { name: "API Key", value: "", type: "text" }
      ]
    },
    {
      name: "GitHub",
      description: "A platform for version control and collaboration that lets you and others work together on projects from anywhere.",
      tags: ["development", "version control", "collaboration"],
      parameters: [
        { name: "Default Branch", value: "main", type: "text" },
        { name: "Email Notifications", value: "false", type: "checkbox" },
        { name: "SSH Authentication", value: "true", type: "checkbox" }
      ]
    },
    {
      name: "Notion",
      description: "An all-in-one workspace for notes, tasks, wikis, and databases. Helps teams collaborate and organize information.",
      tags: ["productivity", "notes", "collaboration"],
      parameters: [
        { name: "Default View", value: "List", type: "select", options: ["List", "Board", "Calendar", "Gallery"] },
        { name: "Offline Access", value: "true", type: "checkbox" },
        { name: "Font Size", value: "14", type: "number" }
      ]
    },
    {
      name: "Adobe Photoshop",
      description: "Industry-standard software for creating and enhancing photographs, illustrations, and 3D artwork.",
      tags: ["design", "photo editing", "paid"],
      parameters: [
        { name: "Color Profile", value: "sRGB", type: "select", options: ["sRGB", "Adobe RGB", "ProPhoto RGB"] },
        { name: "Auto Recovery", value: "true", type: "checkbox" },
        { name: "Default Resolution", value: "300", type: "number" }
      ]
    },
    {
      name: "Trello",
      description: "A visual collaboration tool that creates a shared perspective on any project. Organize tasks with boards, lists, and cards.",
      tags: ["productivity", "project management", "collaboration"],
      parameters: [
        { name: "Color Label", value: "Green", type: "select", options: ["Green", "Yellow", "Red", "Blue", "Purple"] },
        { name: "Due Date Reminders", value: "true", type: "checkbox" },
        { name: "API Token", value: "", type: "text" }
      ]
    }
  ];

  // State management
  const [tools, setTools] = useState<Tool[]>(initialToolsData);
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [flippedCard, setFlippedCard] = useState<number | null>(null);

  // Handle parameter change
  const handleParameterChange = (toolIndex: number, paramIndex: number, value: string) => {
    const updatedTools = [...tools];
    updatedTools[toolIndex].parameters[paramIndex].value = value;
    setTools(updatedTools);
  };

  // Collect all unique tags from tools
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    tools.forEach(tool => {
      tool.tags.forEach(tag => {
        tagSet.add(tag.toLowerCase());
      });
    });
    return Array.from(tagSet).sort();
  }, [tools]);

  // Filter tools based on active filters and search term
  const filteredTools = useMemo(() => {
    return tools.filter(tool => {
      // Check if any tag filter is active and if tool has any of the active tags
      const passesTagFilter = activeFilters.size === 0 ||
        tool.tags.some(tag => activeFilters.has(tag.toLowerCase()));
      
      // Check if tool name or description contains search term
      const passesSearch = searchTerm === '' ||
        tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      return passesTagFilter && passesSearch;
    });
  }, [tools, activeFilters, searchTerm]);

  // Handle tag click
  const handleTagClick = (tag: string) => {
    setActiveFilters(prev => {
      const newFilters = new Set(prev);
      if (newFilters.has(tag)) {
        newFilters.delete(tag);
      } else {
        newFilters.add(tag);
      }
      return newFilters;
    });
  };

  // Clear all filters
  const clearFilters = () => {
    setActiveFilters(new Set());
    setSearchTerm('');
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  // Initialize dark mode based on system preference
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }

    const darkModeListener = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
      if (e.matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', darkModeListener);
    
    return () => {
      window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', darkModeListener);
    };
  }, []);

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen transition-colors duration-200">
      {/* Add these styles for card flipping */}
      <style>
        {`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        `}
      </style>
      
      <div className="container mx-auto p-4 max-w-6xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-center mb-2">Tool Collection</h1>
          <p className="text-center text-gray-600 dark:text-gray-400">Browse and configure your tools</p>
        </header>
        
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 mb-4 items-center">
            <h2 className="text-xl font-semibold mr-2">Filter by Tag:</h2>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag, index) => (
                <TagFilter
                  key={index}
                  tag={tag}
                  isActive={activeFilters.has(tag)}
                  onClick={() => handleTagClick(tag)}
                />
              ))}
            </div>
            <button 
              className="text-[#5D5CDE] dark:text-[#7e7df0] hover:underline text-sm ml-auto"
              onClick={clearFilters}
            >
              Clear Filters
            </button>
          </div>
          <input
            type="text"
            placeholder="Search tools..."
            className="w-full p-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 text-base"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {filteredTools.length === 0 && (
          <div className="text-center py-12 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <i className="fas fa-search text-gray-400 text-4xl mb-3"></i>
            <p className="text-gray-500 dark:text-gray-400">No tools match your current filters.</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool, index) => (
            <ToolCard
              key={index}
              tool={tool}
              index={tools.indexOf(tool)}
              onTagClick={handleTagClick}
              flippedCard={flippedCard}
              setFlippedCard={setFlippedCard}
              onParameterChange={handleParameterChange}
            />
          ))}
        </div>
        
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Click on any card to flip and view/edit parameters</p>
        </div>
      </div>

      <button 
        className="fixed bottom-4 right-4 p-3 bg-gray-200 dark:bg-gray-700 rounded-full shadow-md hover:shadow-lg transition-all"
        onClick={toggleDarkMode}
      >
        {isDarkMode ? (
          <i className="fas fa-sun"></i>
        ) : (
          <i className="fas fa-moon"></i>
        )}
      </button>
    </div>
  );
};

export default ToolCardPage;
