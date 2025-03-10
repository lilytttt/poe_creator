import React, { useState, useEffect, useMemo } from 'react';

// Define TypeScript interfaces
interface Tool {
  name: string;
  description: string;
  tags: string[];
}

interface ToolCardProps {
  tool: Tool;
  onTagClick: (tag: string) => void;
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

const ToolCard: React.FC<ToolCardProps> = ({ tool, onTagClick }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col h-full">
      <div className="p-5 flex-grow">
        <h3 className="text-xl font-bold mb-2 text-[#5D5CDE] dark:text-[#7e7df0]">
          {tool.name}
        </h3>
        <p className="text-gray-700 dark:text-gray-300 mb-4">{tool.description}</p>
        <div className="flex flex-wrap gap-2 mt-auto">
          {tool.tags.map((tag, index) => (
            <span
              key={index}
              className="tag-pill px-2 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-[#5D5CDE] hover:text-white dark:hover:bg-[#7e7df0] transition-colors"
              onClick={() => onTagClick(tag.toLowerCase())}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

const ToolCardPage: React.FC = () => {
  // Define your tools data
  const toolsData: Tool[] = [
    {
      name: "Visual Studio Code",
      description: "A lightweight but powerful source code editor that runs on your desktop and is available for Windows, macOS and Linux.",
      tags: ["development", "code editor", "free"]
    },
    {
      name: "Figma",
      description: "A collaborative interface design tool that enables teams to work together on creating, testing, and shipping designs.",
      tags: ["design", "ui", "collaboration"]
    },
    {
      name: "GitHub",
      description: "A platform for version control and collaboration that lets you and others work together on projects from anywhere.",
      tags: ["development", "version control", "collaboration"]
    },
    {
      name: "Notion",
      description: "An all-in-one workspace for notes, tasks, wikis, and databases. Helps teams collaborate and organize information.",
      tags: ["productivity", "notes", "collaboration"]
    },
    {
      name: "Adobe Photoshop",
      description: "Industry-standard software for creating and enhancing photographs, illustrations, and 3D artwork.",
      tags: ["design", "photo editing", "paid"]
    },
    {
      name: "Trello",
      description: "A visual collaboration tool that creates a shared perspective on any project. Organize tasks with boards, lists, and cards.",
      tags: ["productivity", "project management", "collaboration"]
    }
  ];

  // State management
  const [tools] = useState<Tool[]>(toolsData);
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

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
      <div className="container mx-auto p-4 max-w-6xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-center mb-2">Tool Collection</h1>
          <p className="text-center text-gray-600 dark:text-gray-400">Browse and filter your tools</p>
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
              onTagClick={handleTagClick}
            />
          ))}
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
