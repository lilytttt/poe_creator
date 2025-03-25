<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>API Tools Dashboard</title>
    
    <!-- Import React, ReactDOM, and Typescript -->
    <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <script src="https://cdn.tailwindcss.com"></script>
    
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    colors: {
                        primary: '#5D5CDE',
                    },
                },
            },
        }
    </script>
    
    <style>
        .modal {
            transition: opacity 0.3s ease, visibility 0.3s ease;
        }
        .modal-content {
            transform: scale(0.95);
            transition: transform 0.3s ease;
        }
        .modal.active .modal-content {
            transform: scale(1);
        }
        .api-list::-webkit-scrollbar {
            width: 6px;
        }
        .api-list::-webkit-scrollbar-track {
            background: rgba(0,0,0,0.05);
            border-radius: 3px;
        }
        .api-list::-webkit-scrollbar-thumb {
            background: rgba(0,0,0,0.2);
            border-radius: 3px;
        }
        .dark .api-list::-webkit-scrollbar-track {
            background: rgba(255,255,255,0.05);
        }
        .dark .api-list::-webkit-scrollbar-thumb {
            background: rgba(255,255,255,0.2);
        }
    </style>
</head>
<body class="bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 min-h-screen">
    <div id="root"></div>

    <script type="text/babel" data-type="module">
        // Dark mode detection - runs immediately
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.documentElement.classList.add('dark');
        }
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
            if (event.matches) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        });

        // TypeScript type definitions
        /** @typedef {'active' | 'inactive' | 'maintenance'} ApiStatus */
        
        /**
         * @typedef {Object} ApiInfo
         * @property {number} id
         * @property {string} name
         * @property {string} url
         * @property {string} description
         * @property {ApiStatus} status
         */

        // Sample Data
        /** @type {ApiInfo[]} */
        const initialApiData = [
            {
                id: 1,
                name: 'Weather API',
                url: 'https://api.weather.example',
                description: 'Provides real-time weather data for locations worldwide with forecasting capabilities.',
                status: 'active'
            },
            {
                id: 2,
                name: 'Payment Gateway',
                url: 'https://payment.example/api/v2',
                description: 'Handles secure payment processing with support for multiple currencies and payment methods.',
                status: 'active'
            },
            {
                id: 3,
                name: 'User Authentication',
                url: 'https://auth.example/api',
                description: 'Manages user authentication with OAuth2 support and multi-factor authentication.',
                status: 'maintenance'
            },
            {
                id: 4,
                name: 'Content Delivery',
                url: 'https://cdn.example/api',
                description: 'Global content delivery network for distributing media assets and static content.',
                status: 'inactive'
            }
        ];

        // React Components
        
        /**
         * Header component with title and theme toggle
         * @param {Object} props
         * @param {() => void} props.toggleTheme
         */
        const Header = ({ toggleTheme }) => {
            return (
                <header className="bg-white dark:bg-gray-800 shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex justify-between items-center">
                            <h1 className="text-2xl font-bold text-primary">Tools Dashboard</h1>
                            <div className="flex items-center space-x-3">
                                <button 
                                    onClick={toggleTheme}
                                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 hidden dark:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 dark:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </header>
            );
        };

        /**
         * API Card Component
         * @param {Object} props
         * @param {() => void} props.onCheckDetails
         */
        const ApiToolCard = ({ onCheckDetails }) => {
            return (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="rounded-full bg-primary/10 p-3 mr-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-semibold">API Connector</h2>
                        </div>
                        <p className="mt-3 text-gray-600 dark:text-gray-400">Connect and manage multiple APIs in one place. Edit configurations and monitor status.</p>
                        <div className="mt-5">
                            <button 
                                onClick={onCheckDetails}
                                className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                            >
                                Check Details
                            </button>
                        </div>
                    </div>
                </div>
            );
        };

        /**
         * Tool Card Component
         * @param {Object} props
         * @param {string} props.title
         * @param {string} props.description
         * @param {string} props.buttonText
         * @param {string} props.iconColor
         * @param {React.ReactNode} props.icon
         */
        const ToolCard = ({ title, description, buttonText, iconColor, icon }) => {
            return (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className={`rounded-full ${iconColor} p-3 mr-4`}>
                                {icon}
                            </div>
                            <h2 className="text-xl font-semibold">{title}</h2>
                        </div>
                        <p className="mt-3 text-gray-600 dark:text-gray-400">{description}</p>
                        <div className="mt-5">
                            <button className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 px-4 py-2 rounded-md transition-colors duration-200">
                                {buttonText}
                            </button>
                        </div>
                    </div>
                </div>
            );
        };

        /**
         * API Item Component
         * @param {Object} props
         * @param {ApiInfo} props.api
         * @param {(id: number) => void} props.onEdit
         */
        const ApiItem = ({ api, onEdit }) => {
            // Determine status badge color
            let statusBadgeClass = 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
            if (api.status === 'active') {
                statusBadgeClass = 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
            } else if (api.status === 'maintenance') {
                statusBadgeClass = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
            } else if (api.status === 'inactive') {
                statusBadgeClass = 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
            }
            
            return (
                <div className="bg-gray-50 dark:bg-gray-750 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-start">
                        <div>
                            <h4 className="text-lg font-medium">{api.name}</h4>
                            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{api.url}</div>
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadgeClass}`}>
                            {api.status.charAt(0).toUpperCase() + api.status.slice(1)}
                        </span>
                    </div>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">{api.description}</p>
                    <div className="mt-4 flex justify-end">
                        <button 
                            onClick={() => onEdit(api.id)} 
                            className="text-primary hover:text-primary/80 font-medium flex items-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                        </button>
                    </div>
                </div>
            );
        };

        /**
         * API Modal Component
         * @param {Object} props
         * @param {boolean} props.isOpen
         * @param {() => void} props.onClose
         * @param {ApiInfo[]} props.apiData
         * @param {(id: number) => void} props.onEdit
         * @param {() => void} props.onAddNew
         */
        const ApiModal = ({ isOpen, onClose, apiData, onEdit, onAddNew }) => {
            if (!isOpen) return null;
            
            return (
                <div className={`modal fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4 ${isOpen ? 'active opacity-100 visible' : 'opacity-0 invisible'} z-50`}>
                    <div className="modal-content bg-white dark:bg-gray-800 rounded-lg w-full max-w-3xl shadow-xl max-h-[90vh] flex flex-col">
                        {/* Modal Header */}
                        <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center">
                            <h3 className="text-xl font-semibold">API Connections</h3>
                            <button 
                                onClick={onClose}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        {/* Modal Body */}
                        <div className="overflow-y-auto flex-grow api-list p-6">
                            <div className="grid gap-6">
                                {apiData.map(api => (
                                    <ApiItem 
                                        key={api.id} 
                                        api={api} 
                                        onEdit={onEdit} 
                                    />
                                ))}
                            </div>
                        </div>
                        
                        {/* Modal Footer */}
                        <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-end">
                            <button 
                                onClick={onAddNew}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors mr-2"
                            >
                                Add New API
                            </button>
                            <button 
                                onClick={onClose}
                                className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-md transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            );
        };

        /**
         * Edit API Modal Component
         * @param {Object} props
         * @param {boolean} props.isOpen
         * @param {() => void} props.onClose
         * @param {(api: ApiInfo) => void} props.onSave
         * @param {ApiInfo | null} props.currentApi
         */
        const EditApiModal = ({ isOpen, onClose, onSave, currentApi }) => {
            if (!isOpen) return null;
            
            const isNewApi = !currentApi;
            const [formData, setFormData] = React.useState({
                id: currentApi?.id || -1,
                name: currentApi?.name || '',
                url: currentApi?.url || '',
                description: currentApi?.description || '',
                status: currentApi?.status || 'active'
            });
            
            // Update form when currentApi changes
            React.useEffect(() => {
                if (currentApi) {
                    setFormData({
                        id: currentApi.id,
                        name: currentApi.name,
                        url: currentApi.url,
                        description: currentApi.description,
                        status: currentApi.status
                    });
                } else {
                    setFormData({
                        id: -1,
                        name: '',
                        url: '',
                        description: '',
                        status: 'active'
                    });
                }
            }, [currentApi]);
            
            /**
             * @param {React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>} e
             */
            const handleChange = (e) => {
                const { id, value } = e.target;
                setFormData(prev => ({
                    ...prev,
                    [id.replace('edit-api-', '')]: value
                }));
            };
            
            /**
             * @param {React.FormEvent} e
             */
            const handleSubmit = (e) => {
                e.preventDefault();
                if (!formData.name || !formData.url) {
                    alert('Name and URL are required fields');
                    return;
                }
                onSave(formData);
            };
            
            return (
                <div className={`modal fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4 ${isOpen ? 'active opacity-100 visible' : 'opacity-0 invisible'} z-50`}>
                    <div className="modal-content bg-white dark:bg-gray-800 rounded-lg w-full max-w-lg shadow-xl">
                        {/* Modal Header */}
                        <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center">
                            <h3 className="text-xl font-semibold">
                                {isNewApi ? 'Add New API' : 'Edit API'}
                            </h3>
                            <button 
                                onClick={onClose}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        {/* Edit Form */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label htmlFor="edit-api-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">API Name</label>
                                <input 
                                    type="text" 
                                    id="edit-api-name" 
                                    value={formData.name}
                                    onChange={handleChange}
                                    required 
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary focus:border-primary text-base"
                                />
                            </div>
                            <div>
                                <label htmlFor="edit-api-url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">API URL</label>
                                <input 
                                    type="url" 
                                    id="edit-api-url" 
                                    value={formData.url}
                                    onChange={handleChange}
                                    required 
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary focus:border-primary text-base"
                                />
                            </div>
                            <div>
                                <label htmlFor="edit-api-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                                <textarea 
                                    id="edit-api-description" 
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="3" 
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary focus:border-primary text-base"
                                ></textarea>
                            </div>
                            <div>
                                <label htmlFor="edit-api-status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                                <select 
                                    id="edit-api-status" 
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary focus:border-primary text-base"
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="maintenance">Maintenance</option>
                                </select>
                            </div>
                            
                            {/* Modal Footer */}
                            <div className="pt-4 flex justify-end space-x-3">
                                <button 
                                    type="submit"
                                    className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md transition-colors"
                                >
                                    Save Changes
                                </button>
                                <button 
                                    type="button"
                                    onClick={onClose}
                                    className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-md transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            );
        };

        // Main App Component
        const App = () => {
            // State
            const [apiData, setApiData] = React.useState(initialApiData);
            const [isApiModalOpen, setIsApiModalOpen] = React.useState(false);
            const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
            const [currentApi, setCurrentApi] = React.useState(null);
            
            // Methods
            const toggleTheme = () => {
                document.documentElement.classList.toggle('dark');
            };
            
            const handleCheckDetails = () => {
                setIsApiModalOpen(true);
            };
            
            const handleCloseApiModal = () => {
                setIsApiModalOpen(false);
            };
            
            /**
             * @param {number | null} apiId
             */
            const handleOpenEditModal = (apiId) => {
                if (apiId === null) {
                    // Adding new API
                    setCurrentApi(null);
                } else {
                    // Editing existing API
                    const api = apiData.find(a => a.id === apiId);
                    setCurrentApi(api || null);
                }
                setIsEditModalOpen(true);
            };
            
            const handleCloseEditModal = () => {
                setIsEditModalOpen(false);
            };
            
            /**
             * @param {ApiInfo} apiInfo
             */
            const handleSaveApi = (apiInfo) => {
                if (apiInfo.id === -1) {
                    // Add new API
                    const newId = Math.max(0, ...apiData.map(api => api.id)) + 1;
                    setApiData([...apiData, { ...apiInfo, id: newId }]);
                } else {
                    // Update existing API
                    setApiData(apiData.map(api => 
                        api.id === apiInfo.id ? apiInfo : api
                    ));
                }
                setIsEditModalOpen(false);
            };
            
            return (
                <>
                    <Header toggleTheme={toggleTheme} />
                    
                    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* API Tool Card */}
                            <ApiToolCard onCheckDetails={handleCheckDetails} />
                            
                            {/* Analytics Dashboard Card */}
                            <ToolCard 
                                title="Analytics Dashboard"
                                description="Track and visualize key metrics from your connected systems."
                                buttonText="Open Dashboard"
                                iconColor="bg-green-100 dark:bg-green-900/30"
                                icon={
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                }
                            />
                            
                            {/* Document Generator Card */}
                            <ToolCard 
                                title="Document Generator"
                                description="Create, edit, and manage documents from templates."
                                buttonText="Create Document"
                                iconColor="bg-blue-100 dark:bg-blue-900/30"
                                icon={
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                                    </svg>
                                }
                            />
                        </div>
                    </main>
                    
                    {/* API Modal */}
                    <ApiModal 
                        isOpen={isApiModalOpen}
                        onClose={handleCloseApiModal}
                        apiData={apiData}
                        onEdit={handleOpenEditModal}
                        onAddNew={() => handleOpenEditModal(null)}
                    />
                    
                    {/* Edit API Modal */}
                    <EditApiModal 
                        isOpen={isEditModalOpen}
                        onClose={handleCloseEditModal}
                        onSave={handleSaveApi}
                        currentApi={currentApi}
                    />
                </>
            );
        };

        // Render the App
        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(<App />);
    </script>
</body>
</html>
