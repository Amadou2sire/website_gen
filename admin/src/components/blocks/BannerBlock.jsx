import React from 'react';
import ImageUpload from '../ImageUpload';

const BannerBlock = ({ data, onChange }) => {
    const handleChange = (field, value) => {
        onChange({ ...data, [field]: value });
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Essential Content */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-primary !text-sm">edit_note</span>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Core Content</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Banner Text</label>
                        <input
                            type="text"
                            value={data.text || ''}
                            onChange={(e) => handleChange('text', e.target.value)}
                            className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm py-2.5 px-4 focus:ring-1 focus:ring-primary outline-none transition-all"
                            placeholder="e.g., Get 50% off today!"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Badge Text (Optional)</label>
                        <input
                            type="text"
                            value={data.badge || ''}
                            onChange={(e) => handleChange('badge', e.target.value)}
                            className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm py-2.5 px-4 focus:ring-1 focus:ring-primary outline-none transition-all"
                            placeholder="e.g., NEW or HOT"
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Link URL (Leave empty for no link)</label>
                    <input
                        type="text"
                        value={data.link || ''}
                        onChange={(e) => handleChange('link', e.target.value)}
                        className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm py-2.5 px-4 focus:ring-1 focus:ring-primary outline-none transition-all font-mono"
                        placeholder="e.g., /pricing or https://..."
                    />
                </div>
            </section>

            {/* Visual Identity */}
            <section className="space-y-6">
                <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-primary !text-sm">palette</span>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Visual Identity</h4>
                </div>

                <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-6">
                    <ImageUpload
                        label="Background Image (Optional)"
                        value={data.image_url}
                        onChange={(val) => handleChange('image_url', val)}
                    />

                    {data.image_url && (
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Overlay Opacity</label>
                                <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{Math.round((data.overlay_opacity || 0.4) * 100)}%</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.1"
                                value={data.overlay_opacity || 0.4}
                                onChange={(e) => handleChange('overlay_opacity', parseFloat(e.target.value))}
                                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary"
                            />
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block">Bg Color</label>
                            <div className="flex items-center gap-3 bg-white dark:bg-slate-800 p-2 rounded-xl border border-slate-100 dark:border-slate-700">
                                <input
                                    type="color"
                                    value={data.bgColor || '#3b82f6'}
                                    onChange={(e) => handleChange('bgColor', e.target.value)}
                                    className="w-10 h-10 rounded-lg border-none p-0 cursor-pointer overflow-hidden shadow-sm"
                                />
                                <span className="text-[10px] font-mono font-bold text-slate-400 tracking-tighter uppercase">{data.bgColor || '#3b82f6'}</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block">Text Color</label>
                            <div className="flex items-center gap-3 bg-white dark:bg-slate-800 p-2 rounded-xl border border-slate-100 dark:border-slate-700">
                                <input
                                    type="color"
                                    value={data.textColor || '#ffffff'}
                                    onChange={(e) => handleChange('textColor', e.target.value)}
                                    className="w-10 h-10 rounded-lg border-none p-0 cursor-pointer overflow-hidden shadow-sm"
                                />
                                <span className="text-[10px] font-mono font-bold text-slate-400 tracking-tighter uppercase">{data.textColor || '#ffffff'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Layout & Behavior */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-primary !text-sm">settings_input_component</span>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Layout & Behavior</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Alignment Toggle */}
                    <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-300 mb-0.5">Alignment</p>
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{data.alignment || 'center'}</p>
                        </div>
                        <div className="flex rounded-lg bg-slate-100 dark:bg-slate-900 p-1">
                            <button
                                onClick={() => handleChange('alignment', 'left')}
                                className={`p-1.5 rounded-md transition-all ${data.alignment === 'left' ? 'bg-white dark:bg-slate-700 shadow-sm text-primary' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                <span className="material-symbols-outlined !text-lg">format_align_left</span>
                            </button>
                            <button
                                onClick={() => handleChange('alignment', 'center')}
                                className={`p-1.5 rounded-md transition-all ${(data.alignment === 'center' || !data.alignment) ? 'bg-white dark:bg-slate-700 shadow-sm text-primary' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                <span className="material-symbols-outlined !text-lg">format_align_center</span>
                            </button>
                        </div>
                    </div>

                    {/* Behavior Toggles */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-300">Dismissible</p>
                            <button
                                onClick={() => handleChange('isDismissible', !data.isDismissible)}
                                className={`relative h-5 w-10 min-w-10 rounded-full transition-colors ${data.isDismissible ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'}`}
                            >
                                <div className={`absolute top-0.5 left-0.5 size-4 rounded-full bg-white transition-transform ${data.isDismissible ? 'translate-x-5' : 'translate-x-0'}`}></div>
                            </button>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-300">Glassmorphism</p>
                            <button
                                onClick={() => handleChange('isGlassmorphism', !data.isGlassmorphism)}
                                className={`relative h-5 w-10 min-w-10 rounded-full transition-colors ${data.isGlassmorphism ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'}`}
                            >
                                <div className={`absolute top-0.5 left-0.5 size-4 rounded-full bg-white transition-transform ${data.isGlassmorphism ? 'translate-x-5' : 'translate-x-0'}`}></div>
                            </button>
                        </div>

                        {data.badge && (
                            <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-300">Pulsing Badge</p>
                                <button
                                    onClick={() => handleChange('hasPulsingBadge', !data.hasPulsingBadge)}
                                    className={`relative h-5 w-10 min-w-10 rounded-full transition-colors ${data.hasPulsingBadge ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'}`}
                                >
                                    <div className={`absolute top-0.5 left-0.5 size-4 rounded-full bg-white transition-transform ${data.hasPulsingBadge ? 'translate-x-5' : 'translate-x-0'}`}></div>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default BannerBlock;
