import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import ImageUpload from './ImageUpload';

const MenuManager = () => {
    const [menus, setMenus] = useState([]);
    const [selectedMenu, setSelectedMenu] = useState(null);
    const [isCreating, setIsCreating] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        logo_url: '',
        items: [],
        cta_text: '',
        cta_link: '',
        cta_color: '#1337ec'
    });

    useEffect(() => {
        fetchMenus();
    }, []);

    const fetchMenus = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/menus');
            setMenus(response.data);
        } catch (error) {
            toast.error("Error fetching menus");
        }
    };

    const handleCreateClick = () => {
        setIsCreating(true);
        setSelectedMenu(null);
        setFormData({
            title: '',
            logo_url: '',
            items: [],
            cta_text: '',
            cta_link: '',
            cta_color: '#1337ec'
        });
    };

    const handleEditClick = (menu) => {
        setIsCreating(false);
        setSelectedMenu(menu);
        setFormData({
            title: menu.title,
            logo_url: menu.logo_url || '',
            items: menu.items || [],
            cta_text: menu.cta_text || '',
            cta_link: menu.cta_link || '',
            cta_color: menu.cta_color || '#1337ec'
        });
    };

    const handleAddItem = (parentItems = null) => {
        const newItem = { label: '', url: '', children: [] };
        if (parentItems) {
            parentItems.push(newItem);
            setFormData({ ...formData });
        } else {
            setFormData(prev => ({
                ...prev,
                items: [...prev.items, newItem]
            }));
        }
    };

    const handleRemoveItem = (index, parentItems = null) => {
        if (parentItems) {
            parentItems.splice(index, 1);
            setFormData({ ...formData });
        } else {
            setFormData(prev => ({
                ...prev,
                items: prev.items.filter((_, i) => i !== index)
            }));
        }
    };

    const handleItemChange = (item, field, value) => {
        item[field] = value;
        setFormData({ ...formData });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = {
                title: formData.title,
                logo_url: formData.logo_url,
                items: formData.items,
                cta_text: formData.cta_text,
                cta_link: formData.cta_link,
                cta_color: formData.cta_color
            };

            if (selectedMenu) {
                await axios.put(`http://localhost:8000/api/menus/${selectedMenu.id}`, data);
                toast.success("Menu updated successfully");
            } else {
                await axios.post('http://localhost:8000/api/menus', data);
                toast.success("Menu created successfully");
            }
            setIsCreating(false);
            fetchMenus();
        } catch (error) {
            toast.error("Error saving menu");
        }
    };

    const renderMenuItems = (items, level = 0) => {
        return (
            <div className={`space-y-3 ${level > 0 ? 'ml-8 border-l-2 border-slate-100 dark:border-slate-800 pl-4 py-2' : ''}`}>
                {items.map((item, index) => (
                    <div key={index} className="space-y-2">
                        <div className="flex gap-2 items-center bg-white dark:bg-slate-800/50 p-2 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm transition-all hover:border-primary/50">
                            <span className="material-symbols-outlined text-slate-300 !text-lg cursor-grab">drag_indicator</span>
                            <div className="flex-1 grid grid-cols-2 gap-2">
                                <input
                                    type="text"
                                    placeholder="Label"
                                    value={item.label}
                                    onChange={e => handleItemChange(item, 'label', e.target.value)}
                                    className="border-none bg-transparent text-sm focus:ring-0 font-bold text-slate-700 dark:text-slate-200"
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="URL (e.g. /about or #)"
                                    value={item.url}
                                    onChange={e => handleItemChange(item, 'url', e.target.value)}
                                    className="border-none bg-transparent text-sm text-slate-400 focus:ring-0 font-mono"
                                    required
                                />
                            </div>
                            <div className="flex items-center gap-1">
                                {level === 0 && (
                                    <button
                                        type="button"
                                        onClick={() => handleAddItem(item.children)}
                                        className="p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                        title="Add Sub-item"
                                    >
                                        <span className="material-symbols-outlined !text-lg">add_circle</span>
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={() => handleRemoveItem(index, items)}
                                    className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                >
                                    <span className="material-symbols-outlined !text-lg">delete</span>
                                </button>
                            </div>
                        </div>
                        {item.children && item.children.length > 0 && renderMenuItems(item.children, level + 1)}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark">
            {/* Top Bar */}
            <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 sticky top-0 z-10">
                <div className="flex items-center gap-2 text-sm">
                    <span className="text-slate-400 font-medium">Dashboard</span>
                    <span className="material-symbols-outlined text-slate-300 !text-sm">chevron_right</span>
                    <span className="font-bold text-slate-800 dark:text-white">Navigation Manager</span>
                </div>
                {!isCreating && !selectedMenu && (
                    <button onClick={handleCreateClick} className="bg-primary hover:bg-blue-700 text-white px-4 py-2 rounded font-medium flex items-center gap-2 transition-all shadow-sm active:scale-[0.98]">
                        <span className="material-symbols-outlined !text-lg">add</span>
                        <span>Create Menu</span>
                    </button>
                )}
            </header>

            <div className="p-8">
                <div className="grid grid-cols-12 gap-8">
                    {/* Left Panel: Menu List */}
                    <div className="col-span-4 space-y-4">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Available Menus</h3>
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                            {menus.length === 0 && !isCreating && (
                                <div className="p-12 text-center text-slate-400">
                                    <span className="material-symbols-outlined !text-4xl opacity-20 mb-2">list_alt</span>
                                    <p className="text-sm">No menus configured</p>
                                </div>
                            )}
                            {menus.map(menu => (
                                <div
                                    key={menu.id}
                                    onClick={() => handleEditClick(menu)}
                                    className={`p-4 cursor-pointer transition-all flex items-center justify-between group border-b border-slate-50 last:border-0 dark:border-slate-800 ${selectedMenu?.id === menu.id ? 'bg-primary/5 text-primary border-l-4 border-l-primary' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-300'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className={`material-symbols-outlined !text-xl ${selectedMenu?.id === menu.id ? 'text-primary' : 'text-slate-300'}`}>menu_book</span>
                                        <span className="text-sm font-bold">{menu.title}</span>
                                    </div>
                                    <span className="material-symbols-outlined !text-lg opacity-0 group-hover:opacity-100 transition-all text-slate-300 translate-x-1 group-hover:translate-x-0">chevron_right</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Panel: Editor */}
                    <div className="col-span-8">
                        {(selectedMenu || isCreating) ? (
                            <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="space-y-6">
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Menu Label</label>
                                                <input
                                                    type="text"
                                                    value={formData.title}
                                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                                    placeholder="Main Navigation"
                                                    className="w-full border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 rounded-xl p-3 text-sm focus:ring-1 focus:ring-primary outline-none transition-all font-bold"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-6 pt-4 border-t border-slate-50 dark:border-slate-800">
                                                <h4 className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                                    <span className="size-1.5 rounded-full bg-primary"></span>
                                                    Call to Action
                                                </h4>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-1.5">
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Button Text</label>
                                                        <input
                                                            type="text"
                                                            value={formData.cta_text}
                                                            onChange={e => setFormData({ ...formData, cta_text: e.target.value })}
                                                            placeholder="Contact Us"
                                                            className="w-full border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg p-2.5 text-xs outline-none focus:ring-1 focus:ring-primary"
                                                        />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Button Link</label>
                                                        <input
                                                            type="text"
                                                            value={formData.cta_link}
                                                            onChange={e => setFormData({ ...formData, cta_link: e.target.value })}
                                                            placeholder="#form"
                                                            className="w-full border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg p-2.5 text-xs outline-none focus:ring-1 focus:ring-primary font-mono"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Button Color</label>
                                                    <div className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
                                                        <input
                                                            type="color"
                                                            value={formData.cta_color}
                                                            onChange={e => setFormData({ ...formData, cta_color: e.target.value })}
                                                            className="w-10 h-10 border-0 p-0 bg-transparent cursor-pointer rounded-lg overflow-hidden"
                                                        />
                                                        <input
                                                            type="text"
                                                            value={formData.cta_color}
                                                            onChange={e => setFormData({ ...formData, cta_color: e.target.value })}
                                                            className="flex-1 bg-transparent border-none text-xs font-mono font-bold outline-none ring-0"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Brand Identity</label>
                                            <div className="bg-slate-50/50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 p-6 h-full flex flex-col items-center justify-center">
                                                <ImageUpload
                                                    label="Upload Logo"
                                                    value={formData.logo_url}
                                                    onChange={(url) => setFormData({ ...formData, logo_url: url })}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-t border-slate-50 dark:border-slate-800 pt-8">
                                        <div className="flex justify-between items-center mb-6">
                                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Navigation Structure</h4>
                                            <button
                                                type="button"
                                                onClick={() => handleAddItem()}
                                                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/10 px-3 py-2 rounded-lg transition-all"
                                            >
                                                <span className="material-symbols-outlined !text-lg">add</span>
                                                Add Root Link
                                            </button>
                                        </div>

                                        {formData.items.length === 0 ? (
                                            <div className="py-16 bg-slate-50/50 dark:bg-slate-800/50 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-3xl text-center">
                                                <span className="material-symbols-outlined !text-4xl text-slate-200 mb-2">account_tree</span>
                                                <p className="text-xs text-slate-400 font-medium">No links added yet.</p>
                                            </div>
                                        ) : (
                                            renderMenuItems(formData.items)
                                        )}
                                    </div>
                                </div>

                                <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                    <button
                                        type="button"
                                        onClick={() => { setSelectedMenu(null); setIsCreating(false); }}
                                        className="px-6 py-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex items-center gap-2 bg-emerald-600 text-white px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-700 shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-all"
                                    >
                                        <span className="material-symbols-outlined !text-lg">save</span>
                                        Save Configuration
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 p-24 text-center flex flex-col items-center justify-center space-y-4">
                                <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 text-slate-200 dark:text-slate-700 rounded-full flex items-center justify-center shadow-inner">
                                    <span className="material-symbols-outlined !text-4xl">ads_click</span>
                                </div>
                                <div>
                                    <p className="text-lg font-bold text-slate-800 dark:text-white">Workspace Ready</p>
                                    <p className="text-sm text-slate-400 mt-1 max-w-[280px] mx-auto">Select a menu from the list to start building your site's navigation structure.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MenuManager;
