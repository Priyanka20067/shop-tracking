import { useState } from 'react';
import { User, LogOut, Settings, HelpCircle, Bell } from 'lucide-react';

export default function ProfileHeader() {
  const [isOpen, setIsOpen] = useState(false);
  
  // Custom color theme
  const theme = {
    primary: '#8A2BE2', // Vibrant purple
    secondary: '#FF6B6B', // Coral
    background: '#F8F9FA',
    text: '#333333',
    hover: '#E6E0FF'
  };
  
  return (
    <div className="w-full bg-white shadow-md p-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Logo and navigation */}
        <div className="flex items-center space-x-10">
          <h1 className="text-xl font-bold" style={{ color: theme.primary }}>Brand</h1>
          <nav>
            <ul className="flex space-x-6">
              <li className="font-medium text-gray-700 hover:text-gray-900">Home</li>
              <li className="font-medium text-gray-700 hover:text-gray-900">Products</li>
              <li className="font-medium text-gray-700 hover:text-gray-900">About</li>
              <li className="font-medium text-gray-700 hover:text-gray-900">Contact</li>
            </ul>
          </nav>
        </div>
        
        {/* Profile section with hover animation */}
        <div className="relative">
          <div 
            className="flex items-center space-x-2 cursor-pointer p-2 rounded-full transition-all duration-300 ease-in-out"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
            style={{ 
              backgroundColor: isOpen ? theme.hover : 'transparent',
              borderColor: isOpen ? theme.primary : 'transparent',
              borderWidth: '2px'
            }}
          >
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: theme.primary }}
            >
              <User size={20} color="white" />
            </div>
            <span className="font-medium">John Doe</span>
          </div>
          
          {/* Dropdown menu with animation */}
          <div 
            className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg overflow-hidden transition-all duration-300 ease-in-out origin-top-right ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
            style={{ backgroundColor: theme.background }}
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
          >
            <div className="py-2">
              <div className="px-4 py-3 border-b border-gray-200">
                <p className="text-sm font-medium" style={{ color: theme.text }}>Signed in as</p>
                <p className="text-sm font-bold truncate" style={{ color: theme.primary }}>john.doe@example.com</p>
              </div>
              
              {[
                { label: 'Your Profile', icon: <User size={16} /> },
                { label: 'Settings', icon: <Settings size={16} /> },
                { label: 'Notifications', icon: <Bell size={16} /> },
                { label: 'Help & Support', icon: <HelpCircle size={16} /> }
              ].map((item, index) => (
                <a
                  key={index}
                  href="#"
                  className="flex items-center px-4 py-2 hover:bg-gray-100 transition-colors duration-150"
                >
                  <span className="mr-2" style={{ color: theme.primary }}>{item.icon}</span>
                  <span style={{ color: theme.text }}>{item.label}</span>
                </a>
              ))}
              
              <div className="border-t border-gray-200 mt-2">
                <a
                  href="#"
                  className="flex items-center px-4 py-2 hover:bg-gray-100 transition-colors duration-150"
                >
                  <span className="mr-2" style={{ color: theme.secondary }}><LogOut size={16} /></span>
                  <span style={{ color: theme.text }}>Sign out</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}