import React from 'react';
import { Plus, Trash, GripVertical, Sparkles } from 'lucide-react';
import IconPicker from '../IconPicker';

const FeaturesBlock = ({ data, onChange }) => {
    const features = data.features || [];

    const handleAddFeature = () => {
        const newFeatures = [...features, { title: '', description: '', icon: 'zap' }];
        onChange({ ...data, features: newFeatures });
    };

    const handleRemoveFeature = (index) => {
        const newFeatures = features.filter((_, i) => i !== index);
        onChange({ ...data, features: newFeatures });
    };

    const handleFeatureChange = (index, field, value) => {
        const newFeatures = [...features];
        newFeatures[index] = { ...newFeatures[index], [field]: value };
        onChange({ ...data, features: newFeatures });
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header / Intro */}
            <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-primary !text-sm">view_quilt</span>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Features Configuration</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((feature, index) => (
                    <div key={index} className="group relative border-2 border-slate-100 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 p-6 transition-all hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 active:scale-[0.99]">
                        {/* Remove Button */}
                        <button
                            type="button"
                            onClick={() => handleRemoveFeature(index)}
                            className="absolute -top-3 -right-3 size-8 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-full text-red-500 shadow-lg flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-950 transition-all opacity-0 group-hover:opacity-100 z-10"
                        >
                            <Trash size={14} />
                        </button>

                        <div className="space-y-6">
                            {/* Icon Picker Integration */}
                            <IconPicker
                                value={feature.icon}
                                onChange={(val) => handleFeatureChange(index, 'icon', val)}
                                label={`Icon ${index + 1}`}
                            />

                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Title</label>
                                    <input
                                        type="text"
                                        placeholder="e.g., Ultra Fast Speed"
                                        value={feature.title}
                                        onChange={(e) => handleFeatureChange(index, 'title', e.target.value)}
                                        className="w-full rounded-xl border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 text-sm font-bold py-2.5 px-4 focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-slate-300"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Description</label>
                                    <textarea
                                        placeholder="Describe this feature..."
                                        value={feature.description}
                                        onChange={(e) => handleFeatureChange(index, 'description', e.target.value)}
                                        className="w-full text-xs text-slate-500 dark:text-slate-400 border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 rounded-xl py-2.5 px-4 focus:ring-1 focus:ring-primary outline-none transition-all h-20 resize-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Add New Feature Call to Action */}
                <button
                    type="button"
                    onClick={handleAddFeature}
                    className="group relative border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-10 flex flex-col items-center justify-center text-slate-400 hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all gap-4 min-h-[280px]"
                >
                    <div className="size-14 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all shadow-sm group-hover:shadow-lg group-hover:shadow-primary/20">
                        <Plus size={28} />
                    </div>
                    <div className="text-center">
                        <span className="text-[10px] font-black uppercase tracking-widest block">Add Feature</span>
                        <span className="text-[9px] font-medium text-slate-400 dark:text-slate-500 mt-1 block">Expand your offering</span>
                    </div>
                </button>
            </div>

            {/* Optimization Tip */}
            <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 flex items-start gap-4">
                <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Sparkles className="text-primary" size={16} />
                </div>
                <div>
                    <h5 className="text-[11px] font-black uppercase tracking-widest text-primary mb-1">UX Tip</h5>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed font-bold">
                        Keep your feature titles short (2-4 words) and descriptions concise for better mobile readability and a cleaner grid layout.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default FeaturesBlock;
