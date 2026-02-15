import React, { useState } from 'react';
import { Search, X, Check } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

// Icons stored in kebab-case to ensure compatibility with Lucide CDN on the public site
const COMMON_ICONS = [
    'zap', 'star', 'check', 'shield', 'rocket', 'heart', 'smile', 'thumbs-up',
    'image', 'video', 'music', 'camera', 'phone', 'mail', 'map-pin', 'clock',
    'user', 'users', 'settings', 'search', 'bell', 'calendar', 'briefcase', 'database',
    'cloud', 'hard-drive', 'cpu', 'monitor', 'smartphone', 'tablet', 'battery', 'wifi',
    'award', 'bar-chart', 'book', 'coffee', 'gift', 'globe', 'layers', 'layout',
    'lock', 'message-square', 'navigation', 'pie-chart', 'send', 'tool', 'truck'
];

// Helper to convert kebab-case to PascalCase for Lucide React components
const toPascalCase = (str) => {
    return str.replace(/(^\w|-\w)/g, (match) => match.replace(/-/, '').toUpperCase());
};

const DynamicIcon = ({ name, size = 20, className = '' }) => {
    if (!name) return <LucideIcons.Search size={size} className={className} />;

    // Convert e.g. "thumbs-up" to "ThumbsUp"
    const pascalName = toPascalCase(name);
    const IconComponent = LucideIcons[pascalName] || LucideIcons['Zap'];

    return <IconComponent size={size} className={className} />;
};

const IconPicker = ({ value, onChange, label }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');

    const filteredIcons = COMMON_ICONS.filter(icon =>
        icon.toLowerCase().includes(search.toLowerCase())
    );

    const handleSelect = (iconName) => {
        onChange(iconName);
        setIsOpen(false);
    };

    return (
        <div className="relative">
            {label && <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2 ml-1">{label}</label>}

            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-primary/50 transition-all shadow-sm group"
            >
                <div className="flex items-center gap-3">
                    <div className="size-9 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-primary transition-colors group-hover:bg-primary/5">
                        <DynamicIcon name={value} size={20} />
                    </div>
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
                        {value ? value.replace(/-/g, ' ') : 'Select an icon...'}
                    </span>
                </div>
                <span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-colors">expand_more</span>
            </button>

            {isOpen && (
                <div className="absolute z-50 mt-2 w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-4 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
                    <div className="flex items-center gap-2 mb-4 bg-slate-50 dark:bg-slate-800 p-2 rounded-xl border border-slate-100 dark:border-slate-700">
                        <LucideIcons.Search size={16} className="text-slate-400 ml-2" />
                        <input
                            type="text"
                            placeholder="Search icons..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-transparent outline-none text-xs font-bold py-1"
                            autoFocus
                        />
                        <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                            <LucideIcons.X size={16} />
                        </button>
                    </div>

                    <div className="grid grid-cols-4 gap-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar p-1">
                        {filteredIcons.map(icon => (
                            <button
                                key={icon}
                                type="button"
                                onClick={() => handleSelect(icon)}
                                className={`
                                    p-4 rounded-xl flex flex-col items-center gap-2 transition-all active:scale-[0.95]
                                    ${value === icon
                                        ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                        : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400'}
                                `}
                            >
                                <DynamicIcon name={icon} size={24} />
                                <span className="text-[8px] font-black uppercase tracking-tight truncate w-full text-center">{icon.replace(/-/g, ' ')}</span>
                            </button>
                        ))}
                    </div>

                    {filteredIcons.length === 0 && (
                        <div className="py-10 text-center space-y-2">
                            <span className="material-symbols-outlined text-slate-200 dark:text-slate-700 !text-4xl">search_off</span>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">No icons match "{search}"</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default IconPicker;
export { DynamicIcon };
