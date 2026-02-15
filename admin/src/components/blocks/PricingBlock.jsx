import React from 'react';
import { Plus, Trash } from 'lucide-react';

const PricingBlock = ({ data, onChange }) => {
    const plans = data.plans || [];

    const handleAddPlan = () => {
        onChange({
            ...data,
            plans: [...plans, { name: 'New Plan', price: '$29', features: ['Feature 1', 'Feature 2'], isPopular: false, buttonText: 'Get Started' }]
        });
    };

    const handleUpdatePlan = (index, field, value) => {
        const newPlans = [...plans];
        newPlans[index] = { ...newPlans[index], [field]: value };
        onChange({ ...data, plans: newPlans });
    };

    const handleRemovePlan = (index) => {
        onChange({ ...data, plans: plans.filter((_, i) => i !== index) });
    };

    return (
        <div className="space-y-6 p-4 bg-gray-50 rounded border">
            <h3 className="font-semibold text-gray-800">Pricing Plans</h3>
            <div className="space-y-8">
                {plans.map((plan, index) => (
                    <div key={index} className="p-4 bg-white border rounded shadow-sm relative">
                        <button
                            onClick={() => handleRemovePlan(index)}
                            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                        >
                            <Trash size={16} />
                        </button>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-500 uppercase">Plan Name</label>
                                <input
                                    type="text"
                                    value={plan.name}
                                    onChange={(e) => handleUpdatePlan(index, 'name', e.target.value)}
                                    className="w-full border-b focus:border-blue-500 outline-none py-1"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 uppercase">Price</label>
                                <input
                                    type="text"
                                    value={plan.price}
                                    onChange={(e) => handleUpdatePlan(index, 'price', e.target.value)}
                                    className="w-full border-b focus:border-blue-500 outline-none py-1"
                                />
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={plan.isPopular}
                                    onChange={(e) => handleUpdatePlan(index, 'isPopular', e.target.checked)}
                                    className="rounded border-gray-300"
                                />
                                <span className="text-sm font-medium text-gray-700">Recommended / Popular Plan</span>
                            </label>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Features (one per line)</label>
                            <textarea
                                value={plan.features.join('\n')}
                                onChange={(e) => handleUpdatePlan(index, 'features', e.target.value.split('\n'))}
                                className="w-full border rounded p-2 text-sm"
                                rows="3"
                                placeholder="Feature 1&#10;Feature 2"
                            />
                        </div>
                        <div className="mt-4">
                            <label className="block text-xs font-medium text-gray-500 uppercase">Button Text</label>
                            <input
                                type="text"
                                value={plan.buttonText}
                                onChange={(e) => handleUpdatePlan(index, 'buttonText', e.target.value)}
                                className="w-full border-b focus:border-blue-500 outline-none py-1"
                            />
                        </div>
                    </div>
                ))}
            </div>
            <button
                type="button"
                onClick={handleAddPlan}
                className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 p-3 rounded text-gray-500 hover:border-blue-400 hover:text-blue-500"
            >
                <Plus size={16} /> Add Pricing Plan
            </button>
        </div>
    );
};

export default PricingBlock;
