import React, { useState } from 'react';
import { Search, X, Check } from 'lucide-react';

const COMMON_ICONS = [
    'zap', 'star', 'check', 'shield', 'rocket', 'heart', 'smile', 'thumbs-up',
    'image', 'video', 'music', 'camera', 'phone', 'mail', 'map-pin', 'clock',
    'user', 'users', 'settings', 'search', 'bell', 'calendar', 'briefcase', 'database',
    'cloud', 'hard-drive', 'cpu', 'monitor', 'smartphone', 'tablet', 'battery', 'wifi'
];

const IconPicker = ({ value, onChange, label }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');

    const filteredIcons = COMMON_ICONS.filter(icon =>
        icon.toLowerCase().includes(search.toLowerCase())
    );

    const handleSelect = (icon) => {
        onChange(icon);
        setIsOpen(false);
    };

    return (
        <div className="relative">
            {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}

            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-2.5 border rounded-lg bg-white hover:border-blue-400 transition"
            >
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-gray-600">
                        {/* Dynamic Icon Rendering (Placeholder or simple i tag) */}
                        {value ? <i data-lucide={value} className="w-5 h-5"></i> : <Search size={16} />}
                    </div>
                    <span className="text-sm font-medium text-gray-700 capitalize">
                        {value || 'Select an icon...'}
                    </span>
                </div>
                <Search size={16} className="text-gray-400" />
            </button>

            {isOpen && (
                <div className="absolute z-50 mt-2 w-full bg-white border rounded-xl shadow-2xl p-4 animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center gap-2 mb-4 border-b pb-2">
                        <Search size={16} className="text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search icons..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full outline-none text-sm"
                            autoFocus
                        />
                        <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
                            <X size={16} />
                        </button>
                    </div>

                    <div className="grid grid-cols-4 gap-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                        {filteredIcons.map(icon => (
                            <button
                                key={icon}
                                type="button"
                                onClick={() => handleSelect(icon)}
                                className={`
                                    p-3 rounded-lg flex flex-col items-center gap-1 transition-all
                                    ${value === icon ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-gray-100 text-gray-600'}
                                `}
                            >
                                <i data-lucide={icon} className="w-5 h-5"></i>
                                <span className="text-[10px] truncate w-full text-center capitalize">{icon}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default IconPicker;
