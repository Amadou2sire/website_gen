import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const UISettings = () => {
    const [settings, setSettings] = useState({
        brand_primary: '#3b82f6',
        brand_hover: '#2563eb'
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/settings');
            setSettings(response.data);
        } catch (error) {
            toast.error("Error fetching settings");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await axios.put('http://localhost:8000/api/settings', settings);
            toast.success("UI Settings updated! Site rebuilding...");
        } catch (error) {
            toast.error("Error saving settings");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark">
            <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 sticky top-0 z-10">
                <div className="flex items-center gap-2 text-sm">
                    <span className="text-slate-400 font-medium">Dashboard</span>
                    <span className="material-symbols-outlined text-slate-300 !text-sm">chevron_right</span>
                    <span className="font-bold text-slate-800 dark:text-white">UI Settings</span>
                </div>
            </header>

            <div className="p-8 max-w-4xl">
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm">
                        <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-50 dark:border-slate-800">
                            <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                                <span className="material-symbols-outlined">palette</span>
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-slate-800 dark:text-white">Global Branding</h2>
                                <p className="text-xs text-slate-400">Manage your site's primary colors and interaction styles.</p>
                            </div>
                        </div>

                        <form onSubmit={handleSave} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Brand Primary */}
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Primary Color</label>
                                        <span className="text-[10px] font-mono font-bold text-slate-300">{settings.brand_primary}</span>
                                    </div>
                                    <div className="relative group">
                                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 transition-all hover:border-primary/30">
                                            <div className="relative size-12 rounded-xl overflow-hidden shadow-sm border-2 border-white dark:border-slate-700">
                                                <input
                                                    type="color"
                                                    value={settings.brand_primary}
                                                    onChange={e => setSettings({ ...settings, brand_primary: e.target.value })}
                                                    className="absolute inset-0 size-full cursor-pointer scale-150"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Main Brand</p>
                                                <p className="text-[10px] text-slate-400">Buttons, active states, and highlights.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Brand Hover */}
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Hover Color</label>
                                        <span className="text-[10px] font-mono font-bold text-slate-300">{settings.brand_hover}</span>
                                    </div>
                                    <div className="relative group">
                                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 transition-all hover:border-primary/30">
                                            <div className="relative size-12 rounded-xl overflow-hidden shadow-sm border-2 border-white dark:border-slate-700">
                                                <input
                                                    type="color"
                                                    value={settings.brand_hover}
                                                    onChange={e => setSettings({ ...settings, brand_hover: e.target.value })}
                                                    className="absolute inset-0 size-full cursor-pointer scale-150"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Interactive Hover</p>
                                                <p className="text-[10px] text-slate-400">Explicit color shown when hovering elements.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-slate-50 dark:border-slate-800 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-primary/20 active:scale-[0.98] transition-all disabled:opacity-50"
                                >
                                    <span className={`material-symbols-outlined !text-lg ${isSaving ? 'animate-spin' : ''}`}>
                                        {isSaving ? 'sync' : 'save'}
                                    </span>
                                    {isSaving ? 'Saving Changes...' : 'Save UI Settings'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Preview Section */}
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <span className="material-symbols-outlined !text-8xl">visibility</span>
                        </div>
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2">
                            Live Preview
                        </h4>
                        <div className="flex flex-wrap gap-6 items-center">
                            <button
                                style={{ backgroundColor: settings.brand_primary }}
                                className="px-6 py-2.5 rounded-xl text-white text-xs font-bold shadow-lg transition-all hover:scale-105"
                                onMouseOver={e => e.currentTarget.style.backgroundColor = settings.brand_hover}
                                onMouseOut={e => e.currentTarget.style.backgroundColor = settings.brand_primary}
                            >
                                Sample Button
                            </button>
                            <span
                                style={{ color: settings.brand_primary }}
                                className="text-sm font-bold cursor-pointer hover:underline transition-all"
                                onMouseOver={e => e.currentTarget.style.color = settings.brand_hover}
                                onMouseOut={e => e.currentTarget.style.color = settings.brand_primary}
                            >
                                Example Link
                            </span>
                            <div className="flex items-center gap-2">
                                <div style={{ backgroundColor: settings.brand_primary }} className="size-3 rounded-full animate-pulse"></div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none">Status Indicator</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UISettings;
