import React, { useState, useEffect, FC, ReactElement } from 'react';

// Type definitions
interface Parameter {
  name: string;
  type: 'path' | 'query' | 'body' | 'header';
  required: boolean;
  description: string;
}

interface Endpoint {
  id: string;
  method: string;
  path: string;
  description: string;
  parameters: Parameter[];
}

interface CustomEndpointData {
  description?: string;
  permissions?: string[];
}

interface CustomDataState {
  [endpointId: string]: CustomEndpointData;
}

// Sample API data - replace with your actual data
const sampleApiData: Endpoint[] = [
  {
    id: "get-users",
    method: "GET",
    path: "/api/users",
    description: "Retrieve a list of all users in the system with pagination support.",
    parameters: [
      { name: "page", type: "query", required: false, description: "Page number (default: 1)" },
      { name: "limit", type: "query", required: false, description: "Items per page (default: 10)" }
    ]
  },
  {
    id: "get-user",
    method: "GET",
    path: "/api/users/{user_id}",
    description: "Retrieve a specific user by their ID.",
    parameters: [
      { name: "user_id", type: "path", required: true, description: "The ID of the user to retrieve" }
    ]
  },
  {
    id: "create-user",
    method: "POST",
    path: "/api/users",
    description: "Create a new user in the system.",
    parameters: [
      { name: "username", type: "body", required: true, description: "Username for the new user" },
      { name: "email", type: "body", required: true, description: "Email address for the new user" },
      { name: "password", type: "body", required: true, description: "Password for the new user" }
    ]
  },
  {
    id: "update-user",
    method: "PUT",
    path: "/api/users/{user_id}",
    description: "Update an existing user's information.",
    parameters: [
      { name: "user_id", type: "path", required: true, description: "The ID of the user to update" },
      { name: "username", type: "body", required: false, description: "New username" },
      { name: "email", type: "body", required: false, description: "New email address" }
    ]
  },
  {
    id: "delete-user",
    method: "DELETE",
    path: "/api/users/{user_id}",
    description: "Delete a user from the system.",
    parameters: [
      { name: "user_id", type: "path", required: true, description: "The ID of the user to delete" }
    ]
  },
  {
    id: "get-items",
    method: "GET",
    path: "/api/items",
    description: "Retrieve a list of all items with filtering options.",
    parameters: [
      { name: "category", type: "query", required: false, description: "Filter by category" },
      { name: "search", type: "query", required: false, description: "Search term for item names" }
    ]
  },
  {
    id: "create-item",
    method: "POST",
    path: "/api/items",
    description: "Create a new item in the inventory.",
    parameters: [
      { name: "name", type: "body", required: true, description: "Name of the item" },
      { name: "description", type: "body", required: true, description: "Description of the item" },
      { name: "price", type: "body", required: true, description: "Price of the item" },
      { name: "category", type: "body", required: false, description: "Category of the item" }
    ]
  }
];

// Method color mapping function
const getMethodColor = (method: string): string => {
  switch (method.toUpperCase()) {
    case 'GET': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    case 'POST': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'PUT': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    case 'DELETE': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    case 'PATCH': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
};

// Parameter Type Badge component
const ParameterTypeBadge: FC<{ type: string }> = ({ type }) => {
  const typeClass = {
    'path': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    'query': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    'body': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    'header': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
  }[type] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';

  return (
    <span className={`ml-2 px-2 py-0.5 text-xs rounded-md ${typeClass}`}>
      {type}
    </span>
  );
};

// Method Badge component
const MethodBadge: FC<{ method: string }> = ({ method }) => {
  const colorClass = getMethodColor(method);
  
  return (
    <span className={`px-2 py-0.5 text-xs font-semibold rounded-md ${colorClass}`}>
      {method}
    </span>
  );
};

// Parameter Item component
const ParameterItem: FC<{ parameter: Parameter }> = ({ parameter }) => {
  return (
    <div className="py-3">
      <div className="flex items-center">
        <span className="font-mono font-medium">
          {parameter.name}
          {parameter.required && 
            <span className="ml-1 text-red-500 dark:text-red-400">*</span>
          }
        </span>
        <ParameterTypeBadge type={parameter.type} />
      </div>
      <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
        {parameter.description}
      </div>
    </div>
  );
};

// Endpoint List Item component
const EndpointListItem: FC<{ 
  endpoint: Endpoint; 
  onClick: (endpoint: Endpoint) => void 
}> = ({ endpoint, onClick }) => {
  return (
    <div 
      className="p-3 border border-gray-200 dark:border-gray-700 rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center"
      onClick={() => onClick(endpoint)}
    >
      <MethodBadge method={endpoint.method} />
      <div className="flex-1 ml-3">
        <div className="font-mono text-sm">{endpoint.path}</div>
        <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
          {endpoint.description}
        </div>
      </div>
    </div>
  );
};

// Permission Button component
const PermissionButton: FC<{ 
  role: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ role, isActive, onClick }) => {
  const activeClass = isActive
    ? 'bg-primary text-white border-primary'
    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600';
  
  return (
    <button 
      className={`permission-btn px-3 py-1 rounded-full text-sm border ${activeClass}`}
      onClick={onClick}
    >
      {role.charAt(0).toUpperCase() + role.slice(1)}
    </button>
  );
};

// Main App component
const ApiPopupManager: FC = () => {
  // State
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentEndpoint, setCurrentEndpoint] = useState<Endpoint | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [customDescription, setCustomDescription] = useState<string>('');
  const [customData, setCustomData] = useState<CustomDataState>({});
  
  // Dark mode effect
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark');
    }
    
    const darkModeListener = (event: MediaQueryListEvent) => {
      if (event.matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };
    
    window.matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', darkModeListener);
      
    return () => {
      window.matchMedia('(prefers-color-scheme: dark)')
        .removeEventListener('change', darkModeListener);
    };
  }, []);
  
  // Filter endpoints based on search term
  const filteredEndpoints = searchTerm
    ? sampleApiData.filter(endpoint => 
        endpoint.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
        endpoint.description.toLowerCase().includes(searchTerm.toLowerCase()))
    : sampleApiData;
  
  // Event handlers
  const handleOpenModal = (endpoint: Endpoint) => {
    setCurrentEndpoint(endpoint);
    setCustomDescription(customData[endpoint.id]?.description || '');
    setIsEditing(false);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleClearSearch = () => {
    setSearchTerm('');
  };
  
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };
  
  const handleCancelEdit = () => {
    setIsEditing(false);
    setCustomDescription(customData[currentEndpoint?.id || '']?.description || '');
  };
  
  const handleSaveEdit = () => {
    if (!currentEndpoint) return;
    
    setCustomData(prevData => ({
      ...prevData,
      [currentEndpoint.id]: {
        ...prevData[currentEndpoint.id],
        description: customDescription
      }
    }));
    
    setIsEditing(false);
    console.log('Saved custom data:', customData);
  };
  
  const handlePermissionToggle = (role: string) => {
    if (!currentEndpoint) return;
    
    setCustomData(prevData => {
      // Get current permissions or initialize empty array
      const currentPermissions = prevData[currentEndpoint.id]?.permissions || [];
      
      // Toggle the permission
      const updatedPermissions = currentPermissions.includes(role)
        ? currentPermissions.filter(p => p !== role)
        : [...currentPermissions, role];
      
      return {
        ...prevData,
        [currentEndpoint.id]: {
          ...prevData[currentEndpoint.id],
          permissions: updatedPermissions
        }
      };
    });
  };
  
  const isPermissionActive = (role: string): boolean => {
    if (!currentEndpoint) return false;
    return customData[currentEndpoint.id]?.permissions?.includes(role) || false;
  };
  
  // Render
  return (
    <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors duration-200 min-h-screen">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6 text-primary">FastAPI Endpoints Manager</h1>
        
        {/* Search Bar */}
        <div className="mb-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search endpoints..." 
              value={searchTerm}
              onChange={handleSearch}
              className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary text-base"
            />
            {searchTerm && (
              <button 
                onClick={handleClearSearch}
                className="absolute right-3 top-2.5 text-gray-500 dark:text-gray-400"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
        
        {/* Endpoints List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
          <h2 className="text-xl font-semibold mb-4">Endpoints</h2>
          <div className="space-y-2">
            {filteredEndpoints.length > 0 ? (
              filteredEndpoints.map(endpoint => (
                <EndpointListItem 
                  key={endpoint.id} 
                  endpoint={endpoint} 
                  onClick={handleOpenModal} 
                />
              ))
            ) : (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                No endpoints found matching "{searchTerm}"
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Modal */}
      {isModalOpen && currentEndpoint && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-xl font-bold text-primary">
                {currentEndpoint.method} Endpoint
              </h3>
              <button 
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              {/* Endpoint Path */}
              <div className="mb-6">
                <MethodBadge method={currentEndpoint.method} />
                <span className="font-mono text-sm ml-2">
                  {currentEndpoint.path}
                </span>
              </div>
              
              {/* Original Description */}
              <div className="mb-4">
                <h4 className="font-semibold mb-1">Original Description</h4>
                <p className="text-gray-600 dark:text-gray-400 p-3 bg-gray-100 dark:bg-gray-700 rounded-md">
                  {currentEndpoint.description}
                </p>
              </div>
              
              {/* Custom Description */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="font-semibold">Custom Description</h4>
                  <button 
                    onClick={handleEditToggle}
                    className="text-primary hover:text-primary/80 text-sm font-medium"
                  >
                    Edit
                  </button>
                </div>
                
                {isEditing ? (
                  <div>
                    <textarea 
                      value={customDescription}
                      onChange={(e) => setCustomDescription(e.target.value)}
                      className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-base"
                      rows={4}
                    />
                    <div className="flex justify-end mt-2 space-x-2">
                      <button 
                        onClick={handleCancelEdit}
                        className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={handleSaveEdit}
                        className="px-3 py-1 bg-primary text-white rounded-md hover:bg-primary/80"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-md min-h-[60px]">
                    {customData[currentEndpoint.id]?.description || 'No custom description'}
                  </div>
                )}
              </div>
              
              {/* Parameters */}
              <div className="mb-4">
                <h4 className="font-semibold mb-2">Parameters</h4>
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {currentEndpoint.parameters.length > 0 ? (
                    currentEndpoint.parameters.map((param, index) => (
                      <ParameterItem key={index} parameter={param} />
                    ))
                  ) : (
                    <div className="py-2 text-gray-500 dark:text-gray-400">
                      No parameters
                    </div>
                  )}
                </div>
              </div>
              
              {/* Permissions */}
              <div className="mb-4">
                <h4 className="font-semibold mb-2">Permissions</h4>
                <div className="flex flex-wrap gap-2">
                  <PermissionButton 
                    role="admin" 
                    isActive={isPermissionActive('admin')}
                    onClick={() => handlePermissionToggle('admin')}
                  />
                  <PermissionButton 
                    role="user" 
                    isActive={isPermissionActive('user')}
                    onClick={() => handlePermissionToggle('user')}
                  />
                  <PermissionButton 
                    role="guest" 
                    isActive={isPermissionActive('guest')}
                    onClick={() => handlePermissionToggle('guest')}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Add Tailwind CSS configuration
const TailwindConfig = () => {
  return (
    <style jsx global>{`
      :root {
        --color-primary: #5D5CDE;
      }
      .text-primary { color: var(--color-primary); }
      .bg-primary { background-color: var(--color-primary); }
      .border-primary { border-color: var(--color-primary); }
      .ring-primary { --tw-ring-color: var(--color-primary); }
      .hover\\:bg-primary\\/80:hover { background-color: rgba(93, 92, 222, 0.8); }
      .hover\\:text-primary\\/80:hover { color: rgba(93, 92, 222, 0.8); }
    `}</style>
  );
};

// Export the components
export default function App(): ReactElement {
  return (
    <>
      <TailwindConfig />
      <ApiPopupManager />
    </>
  );
}
