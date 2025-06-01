import { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Globe, 
  Moon, 
  Sun,
  CreditCard,
  Save,
  Check,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('profile');
  const { user } = useAuth();
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    language: 'en',
    emailNotifications: true,
    projectUpdates: true,
    teamChanges: true,
    openaiApiKey: '',
    openaiModel: '',
    openaiBaseUrl: ''
  });

  useEffect(() => {
    if (user) {
      // Load settings from Supabase
      const loadSettings = async () => {
        try {
          // First try to get existing settings
          const { data: settings, error: settingsError } = await supabase
            .from('settings')
            .select('*')
            .eq('user_id', user.id)
            .single();

          if (settingsError && settingsError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
            throw settingsError;
          }

          if (settings) {
            setFormData(prev => ({
              ...prev,
              openaiApiKey: settings.openai_api_key || '',
              openaiModel: settings.openai_model || 'gpt-3.5-turbo',
              openaiBaseUrl: settings.openai_base_url || ''
            }));
          } else {
            // Create default settings if none exist
            const { error: createError } = await supabase
              .from('settings')
              .insert({
                user_id: user.id,
                openai_model: 'gpt-3.5-turbo'
              });

            if (createError) throw createError;
          }
        } catch (error) {
          console.error('Error loading settings:', error);
          setErrorMessage('Failed to load settings');
        }
      };

      loadSettings();
    }
  }, [user]);

  const handleSaveSettings = async () => {
    if (!user) return;

    setSaveStatus('saving');
    setErrorMessage('');

    try {
      const { error } = await supabase
        .from('settings')
        .upsert({
          user_id: user.id,
          openai_api_key: formData.openaiApiKey,
          openai_model: formData.openaiModel || 'gpt-3.5-turbo',
          openai_base_url: formData.openaiBaseUrl
        });

      if (error) throw error;
      
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaveStatus('error');
      setErrorMessage('Failed to save settings. Please try again.');
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Settings</h1>
        <p className="text-gray-600 dark:text-gray-300">Manage your account settings and preferences.</p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="md:flex">
          {/* Sidebar navigation */}
          <div className="md:w-64 border-r border-gray-200 dark:border-gray-700 md:border-b-0 border-b">
            <nav className="py-4">
              <button 
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center px-4 py-2 text-sm ${
                  activeTab === 'profile' 
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                }`}
              >
                <User size={18} className="mr-3" />
                <span>Profile</span>
              </button>
              
              <button 
                onClick={() => setActiveTab('notifications')}
                className={`w-full flex items-center px-4 py-2 text-sm ${
                  activeTab === 'notifications' 
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                }`}
              >
                <Bell size={18} className="mr-3" />
                <span>Notifications</span>
              </button>
              
              <button 
                onClick={() => setActiveTab('security')}
                className={`w-full flex items-center px-4 py-2 text-sm ${
                  activeTab === 'security' 
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                }`}
              >
                <Shield size={18} className="mr-3" />
                <span>Security</span>
              </button>
              
              <button 
                onClick={() => setActiveTab('appearance')}
                className={`w-full flex items-center px-4 py-2 text-sm ${
                  activeTab === 'appearance' 
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                }`}
              >
                {theme === 'dark' ? <Moon size={18} className="mr-3" /> : <Sun size={18} className="mr-3" />}
                <span>Appearance</span>
              </button>
              
              <button 
                onClick={() => setActiveTab('language')}
                className={`w-full flex items-center px-4 py-2 text-sm ${
                  activeTab === 'language' 
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                }`}
              >
                <Globe size={18} className="mr-3" />
                <span>Language</span>
              </button>
              
              <button 
                onClick={() => setActiveTab('billing')}
                className={`w-full flex items-center px-4 py-2 text-sm ${
                  activeTab === 'billing' 
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                }`}
              >
                <CreditCard size={18} className="mr-3" />
                <span>Billing</span>
              </button>

              <button 
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center px-4 py-2 text-sm ${
                  activeTab === 'settings' 
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                }`}
              >
                <SettingsIcon size={18} className="mr-3" />
                <span>API Settings</span>
              </button>
            </nav>
          </div>
          
          {/* Content area */}
          <div className="flex-1 p-6">
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>
                
                <div className="mb-6">
                  <div className="flex items-center">
                    <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 text-2xl font-bold mr-4">
                      AJ
                    </div>
                    <div>
                      <button className="px-3 py-1.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200">
                        Change avatar
                      </button>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">JPG, GIF or PNG. 1MB max.</p>
                    </div>
                  </div>
                </div>
                
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full bg-gray-100 dark:bg-gray-700 border-0 rounded-lg py-2 px-3 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-gray-100 dark:bg-gray-700 border-0 rounded-lg py-2 px-3 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Company
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full bg-gray-100 dark:bg-gray-700 border-0 rounded-lg py-2 px-3 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200"
                    />
                  </div>
                  
                  <div className="pt-4">
                    <button type="button" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex items-center">
                      <Save size={16} className="mr-2" />
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            )}
            
            {activeTab === 'notifications' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Notification Settings</h2>
                
                <div className="space-y-4">
                  <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Email Notifications</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Receive email notifications for important updates
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="emailNotifications"
                          checked={formData.emailNotifications}
                          onChange={handleChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                  
                  <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Project Updates</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Get notified when projects are updated
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="projectUpdates"
                          checked={formData.projectUpdates}
                          onChange={handleChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                  
                  <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Team Changes</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Receive notifications about team membership changes
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="teamChanges"
                          checked={formData.teamChanges}
                          onChange={handleChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <button type="button" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex items-center">
                      <Save size={16} className="mr-2" />
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'appearance' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Appearance Settings</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-3">Theme</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div 
                        className={`
                          border rounded-lg p-4 cursor-pointer flex items-center
                          ${theme === 'light' 
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                            : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'}
                        `}
                        onClick={() => theme === 'dark' && toggleTheme()}
                      >
                        <Sun size={24} className="text-amber-500 mr-3" />
                        <div>
                          <h4 className="font-medium">Light Mode</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Use light theme</p>
                        </div>
                        {theme === 'light' && (
                          <div className="ml-auto w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                            <Check size={12} className="text-white" />
                          </div>
                        )}
                      </div>
                      
                      <div 
                        className={`
                          border rounded-lg p-4 cursor-pointer flex items-center
                          ${theme === 'dark' 
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                            : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'}
                        `}
                        onClick={() => theme === 'light' && toggleTheme()}
                      >
                        <Moon size={24} className="text-indigo-500 mr-3" />
                        <div>
                          <h4 className="font-medium">Dark Mode</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Use dark theme</p>
                        </div>
                        {theme === 'dark' && (
                          <div className="ml-auto w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                            <Check size={12} className="text-white" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-3">Font Size</h3>
                    <div className="max-w-md">
                      <input 
                        type="range" 
                        min="0" 
                        max="2" 
                        step="1" 
                        defaultValue="1"
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-1">
                        <span>Small</span>
                        <span>Normal</span>
                        <span>Large</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'language' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Language Settings</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Interface Language
                    </label>
                    <select
                      name="language"
                      value={formData.language}
                      onChange={handleSelectChange}
                      className="w-full max-w-md bg-gray-100 dark:bg-gray-700 border-0 rounded-lg py-2 px-3 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                      <option value="it">Italian</option>
                      <option value="pt">Portuguese</option>
                      <option value="ru">Russian</option>
                      <option value="zh">Chinese</option>
                      <option value="ja">Japanese</option>
                    </select>
                  </div>
                  
                  <div className="pt-4">
                    <button type="button" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex items-center">
                      <Save size={16} className="mr-2" />
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'security' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Security Settings</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-3">Change Password</h3>
                    <div className="space-y-4 max-w-md">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Current Password
                        </label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          className="w-full bg-gray-100 dark:bg-gray-700 border-0 rounded-lg py-2 px-3 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          New Password
                        </label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          className="w-full bg-gray-100 dark:bg-gray-700 border-0 rounded-lg py-2 px-3 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          className="w-full bg-gray-100 dark:bg-gray-700 border-0 rounded-lg py-2 px-3 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200"
                        />
                      </div>
                      
                      <div>
                        <button type="button" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex items-center">
                          <Shield size={16} className="mr-2" />
                          Update Password
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <h3 className="font-medium mb-3">Two-Factor Authentication</h3>
                    <div className="flex items-center justify-between max-w-md">
                      <div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          Add an extra layer of security to your account
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          Currently: <span className="text-red-500 dark:text-red-400">Disabled</span>
                        </p>
                      </div>
                      <button type="button" className="px-3 py-1.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200">
                        Setup
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'billing' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Billing Information</h2>
                
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
                  <div className="flex">
                    <div className="flex-1">
                      <h3 className="font-medium text-blue-800 dark:text-blue-300">Current Plan: Premium</h3>
                      <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">Your plan renews on October 15, 2023</p>
                    </div>
                    <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm transition-colors duration-200">
                      Upgrade Plan
                    </button>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-3">Payment Method</h3>
                    <div className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg max-w-md">
                      <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded mr-3">
                        <CreditCard size={20} />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Visa ending in 4242</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Expires 08/2024</p>
                      </div>
                      <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                        Edit
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-3">Billing History</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
                            <th className="px-4 py-3">Date</th>
                            <th className="px-4 py-3">Amount</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Invoice</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                          <tr>
                            <td className="px-4 py-3 text-sm">September 15, 2023</td>
                            <td className="px-4 py-3 text-sm">$49.99</td>
                            <td className="px-4 py-3">
                              <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                Paid
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <button className="text-blue-600 dark:text-blue-400 hover:underline">
                                Download
                              </button>
                            </td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 text-sm">August 15, 2023</td>
                            <td className="px-4 py-3 text-sm">$49.99</td>
                            <td className="px-4 py-3">
                              <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                Paid
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <button className="text-blue-600 dark:text-blue-400 hover:underline">
                                Download
                              </button>
                            </td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 text-sm">July 15, 2023</td>
                            <td className="px-4 py-3 text-sm">$49.99</td>
                            <td className="px-4 py-3">
                              <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                Paid
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <button className="text-blue-600 dark:text-blue-400 hover:underline">
                                Download
                              </button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">API Settings</h2>
                
                <div className="space-y-4 max-w-md">
                  {saveStatus === 'error' && (
                    <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-3 flex items-start">
                      <AlertCircle className="text-red-500 mt-0.5 mr-2\" size={16} />
                      <p className="text-sm text-red-700 dark:text-red-300">{errorMessage}</p>
                    </div>
                  )}

                  {saveStatus === 'success' && (
                    <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-3 flex items-start">
                      <Check className="text-green-500 mt-0.5 mr-2" size={16} />
                      <p className="text-sm text-green-700 dark:text-green-300">Settings saved successfully!</p>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      OpenAI API Key
                    </label>
                    <div className="relative">
                      <input
                        type={showApiKey ? 'text' : 'password'}
                        value={formData.openaiApiKey}
                        onChange={(e) => setFormData({ ...formData, openaiApiKey: e.target.value })}
                        className="w-full bg-gray-100 dark:bg-gray-700 border-0 rounded-lg py-2 pl-3 pr-10 focus:ring-2 focus:ring-blue-500"
                        placeholder="sk-..."
                      />
                      <button
                        type="button"
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="absolute right-2 top-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      >
                        {showApiKey ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      OpenAI Model
                    </label>
                    <input
                      type="text"
                      value={formData.openaiModel}
                      onChange={(e) => setFormData({ ...formData, openaiModel: e.target.value })}
                      className="w-full bg-gray-100 dark:bg-gray-700 border-0 rounded-lg py-2 px-3 focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter model name (e.g. gpt-3.5-turbo)"
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Enter the name of the OpenAI model you want to use
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      OpenAI Base URL (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.openaiBaseUrl}
                      onChange={(e) => setFormData({ ...formData, openaiBaseUrl: e.target.value })}
                      className="w-full bg-gray-100 dark:bg-gray-700 border-0 rounded-lg py-2 px-3 focus:ring-2 focus:ring-blue-500"
                      placeholder="https://api.openai.com/v1"
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Leave empty to use the default OpenAI API endpoint
                    </p>
                  </div>

                  <div>
                    <button
                      onClick={handleSaveSettings}
                      disabled={saveStatus === 'saving'}
                      className={`
                        px-4 py-2 rounded-lg transition-colors duration-200 flex items-center
                        ${saveStatus === 'saving'
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700'}
                        text-white
                      `}
                    >
                      <Save size={16} className="mr-2" />
                      {saveStatus === 'saving' ? 'Saving...' : 'Save API Settings'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}