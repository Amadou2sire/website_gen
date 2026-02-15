import React, { useState, useMemo } from 'react';
import * as LucideIcons from 'lucide-react';
import { Search, X, Check } from 'lucide-react';

// Icons categorized for better ergonomics
// Names are stored in kebab-case for compatibility with public site CDN
const ICON_CATEGORIES = {
    'Communication': ['mail', 'message-square', 'phone', 'send', 'bell', 'megaphone', 'share-2', 'globe'],
    'Actions': ['zap', 'rocket', 'target', 'mouse-pointer-2', 'plus', 'trash-2', 'edit-3', 'save'],
    'Business': ['briefcase', 'bar-chart-4', 'pie-chart', 'trending-up', 'award', 'credit-card', 'dollar-sign', 'shield-check'],
    'Media': ['image', 'video', 'music', 'camera', 'play', 'monitor', 'smartphone', 'tablet', 'headphones'],
    'Navigation': ['map-pin', 'navigation', 'compass', 'flag', 'home', 'menu', 'arrow-right', 'chevron-right'],
    'Tools': ['settings', 'wrench', 'cpu', 'database', 'cloud', 'hard-drive', 'layers', 'layout', 'lock', 'key'],
    'General': ['star', 'heart', 'smile', 'thumbs-up', 'check', 'clock', 'user', 'users', 'search', 'filter']
};

// Helper to convert kebab-case to PascalCase for Lucide React components
const toPascalCase = (str) => {
    if (!str) return 'Zap';
    return str.replace(/(^\w|-\w)/g, (match) => match.replace(/-/, '').toUpperCase());
};

const DynamicIcon = ({ name, size = 20, className = '' }) => {
    if (!name) return <LucideIcons.Search size={size} className={className} />;

    const pascalName = toPascalCase(name);
    const IconComponent = LucideIcons[pascalName] || LucideIcons['Zap'];

    return <IconComponent size={size} className={className} />;
};

const IconPicker = ({ value, onChange, label }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');

    const filteredCategories = useMemo(() => {
        const result = {};
        const query = search.toLowerCase();

        Object.entries(ICON_CATEGORIES).forEach(([category, icons]) => {
            const filtered = icons.filter(icon => icon.toLowerCase().includes(query));
            if (filtered.length > 0) {
                result[category] = filtered;
            }
        });

        return result;
    }, [search]);

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
                <div className="absolute z-50 mt-2 w-full min-w-[320px] md:min-w-[420px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-4 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
                    {/* Header with Search */}
                    <div className="flex items-center gap-3 mb-4 bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700">
                        <Search size={18} className="text-slate-400 ml-2" />
                        <input
                            type="text"
                            placeholder="Find the perfect icon..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-transparent outline-none text-xs font-bold py-1 placeholder:text-slate-400"
                            autoFocus
                        />
                        {search && (
                            <button onClick={() => setSearch('')} className="text-slate-300 hover:text-slate-500 p-1">
                                <X size={16} />
                            </button>
                        )}
                    </div>

                    {/* Category Selector */}
                    {!search && (
                        <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-hide no-scrollbar">
                            <button
                                onClick={() => setActiveCategory('All')}
                                className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${activeCategory === 'All' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600'}`}
                            >
                                All
                            </button>
                            {Object.keys(ICON_CATEGORIES).map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${activeCategory === cat ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600'}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Icons Grid */}
                    <div className="max-h-80 overflow-y-auto pr-2 custom-scrollbar p-1">
                        {Object.entries(filteredCategories)
                            .filter(([category]) => activeCategory === 'All' || category === activeCategory || search)
                            .map(([category, icons]) => (
                                <div key={category} className="mb-6 last:mb-0">
                                    <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-300 mb-3 ml-1">{category}</h5>
                                    <div className="grid grid-cols-5 md:grid-cols-6 gap-2">
                                        {icons.map(icon => (
                                            <button
                                                key={icon}
                                                type="button"
                                                title={icon}
                                                onClick={() => handleSelect(icon)}
                                                className={`
                                                group p-3 rounded-xl flex flex-col items-center gap-2 transition-all active:scale-[0.95]
                                                ${value === icon
                                                        ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105 z-10'
                                                        : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400'}
                                            `}
                                            >
                                                <DynamicIcon name={icon} size={22} className={value === icon ? '' : 'group-hover:scale-110 transition-transform'} />
                                                <span className="text-[7px] font-black uppercase tracking-tight truncate w-full text-center opacity-60 group-hover:opacity-100">{icon.replace(/-/g, ' ')}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}

                        {Object.keys(filteredCategories).length === 0 && (
                            <div className="py-12 text-center space-y-3">
                                <div className="size-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto">
                                    <span className="material-symbols-outlined text-slate-200 dark:text-slate-700 !text-4xl">search_off</span>
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">No icons found for "{search}"</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default IconPicker;
export { DynamicIcon };
