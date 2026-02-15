import React, { useEffect } from 'react';
import { Plus, Trash, GripVertical } from 'lucide-react';
import IconPicker from '../IconPicker';

const FeaturesBlock = ({ data, onChange }) => {
    const features = data.features || [];

    // Force Lucide icons to refresh when icons are updated
    useEffect(() => {
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }, [features]);

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
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                    <div key={index} className="group relative border rounded-xl bg-white p-5 shadow-sm hover:shadow-md transition-all border-gray-100">
                        <button
                            type="button"
                            onClick={() => handleRemoveFeature(index)}
                            className="absolute -top-2 -right-2 p-1.5 bg-white border rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition shadow-sm hover:bg-red-50"
                        >
                            <Trash size={14} />
                        </button>

                        <div className="space-y-4">
                            <IconPicker
                                value={feature.icon}
                                onChange={(val) => handleFeatureChange(index, 'icon', val)}
                            />
                            <div className="space-y-2">
                                <input
                                    type="text"
                                    placeholder="Feature Title"
                                    value={feature.title}
                                    onChange={(e) => handleFeatureChange(index, 'title', e.target.value)}
                                    className="w-full border-b border-transparent focus:border-blue-500 outline-none font-bold text-gray-800"
                                />
                                <textarea
                                    placeholder="Description"
                                    value={feature.description}
                                    onChange={(e) => handleFeatureChange(index, 'description', e.target.value)}
                                    className="w-full text-sm text-gray-500 outline-none resize-none"
                                    rows="2"
                                />
                            </div>
                        </div>
                    </div>
                ))}

                <button
                    type="button"
                    onClick={handleAddFeature}
                    className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center text-gray-400 hover:text-blue-500 hover:border-blue-200 hover:bg-blue-50 transition gap-2"
                >
                    <div className="p-3 bg-gray-50 rounded-full group-hover:bg-white transition">
                        <Plus size={24} />
                    </div>
                    <span className="text-sm font-bold uppercase tracking-widest">Add New Feature</span>
                </button>
            </div>
        </div>
    );
};

export default FeaturesBlock;
