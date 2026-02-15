import React, { useState } from 'react';
import HeroBlock from './blocks/HeroBlock';
import TextBlock from './blocks/TextBlock';
import FeaturesBlock from './blocks/FeaturesBlock';
import FeaturesImageBlock from './blocks/FeaturesImageBlock';
import CTABlock from './blocks/CTABlock';
import BannerBlock from './blocks/BannerBlock';
import PricingBlock from './blocks/PricingBlock';
import SliderBlock from './blocks/SliderBlock';
import TestimonialBlock from './blocks/TestimonialBlock';
import { Trash, ArrowUp, ArrowDown, Plus } from 'lucide-react';

const BLOCK_TYPES = {
    'slider': { component: SliderBlock, label: 'Pro Slider', defaultData: { full_screen: true, slides: [{ headline: 'Welcome', subheadline: 'Discover our story', image_url: '', cta_text: 'Start Now', cta_link: '#' }] } },
    'hero': { component: HeroBlock, label: 'Hero Section', defaultData: { headline: 'New Hero', subheadline: 'Subtitle here', cta_text: 'Learn More', cta_link: '#', headlineColor: '#111827', buttonColor: '#2563eb', image_url: '' } },
    'text': { component: TextBlock, label: 'Rich Text', defaultData: { content: '<p>Enter text here...</p>' } },
    'features': { component: FeaturesBlock, label: 'Features Grid (Icons)', defaultData: { features: [{ title: 'Feature 1', description: 'Description', icon: 'zap' }] } },
    'features_image': { component: FeaturesImageBlock, label: 'Features Grid (Images)', defaultData: { section_title: '', section_subtitle: '', columns: 3, features: [{ title: 'Feature 1', description: 'Description', image_url: '' }] } },
    'cta': { component: CTABlock, label: 'Call to Action', defaultData: { headline: 'Ready to start?', subheadline: 'Join us today', button_text: 'Get Started', button_link: '#', bgColor: '#2563eb', textColor: '#ffffff' } },
    'banner': { component: BannerBlock, label: 'Promo Banner', defaultData: { text: 'Big News! Check out our latest update.', bgColor: '#3b82f6', textColor: '#ffffff', link: '#' } },
    'pricing': { component: PricingBlock, label: 'Pricing Table', defaultData: { plans: [{ name: 'Basic', price: '$9', features: ['Feature A', 'Feature B'], isPopular: false, buttonText: 'Buy' }] } },
    'testimonial': { component: TestimonialBlock, label: 'Testimonials', defaultData: { testimonials: [{ author: 'User', role: 'Dev', content: 'Great!' }] } }
};

const BlockManager = ({ blocks, onChange }) => {
    const [selectedType, setSelectedType] = useState('text');
    const [expandedBlocks, setExpandedBlocks] = useState({});

    const toggleExpand = (id) => {
        setExpandedBlocks(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const handleAddBlock = () => {
        const id = crypto.randomUUID();
        const newBlock = {
            id,
            type: selectedType,
            data: { ...BLOCK_TYPES[selectedType].defaultData }
        };
        onChange([...blocks, newBlock]);
        setExpandedBlocks(prev => ({ ...prev, [id]: true }));
    };

    const handleRemoveBlock = (index) => {
        const newBlocks = blocks.filter((_, i) => i !== index);
        onChange(newBlocks);
    };

    const handleMoveBlock = (index, direction) => {
        if (direction === -1 && index === 0) return;
        if (direction === 1 && index === blocks.length - 1) return;

        const newBlocks = [...blocks];
        const temp = newBlocks[index];
        newBlocks[index] = newBlocks[index + direction];
        newBlocks[index + direction] = temp;
        onChange(newBlocks);
    };

    const handleBlockChange = (index, newData) => {
        const newBlocks = [...blocks];
        newBlocks[index] = { ...newBlocks[index], data: newData };
        onChange(newBlocks);
    };

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                {blocks.map((block, index) => {
                    const blockType = BLOCK_TYPES[block.type];
                    const BlockComponent = blockType?.component;
                    if (!BlockComponent) return null;
                    const isExpanded = expandedBlocks[block.id] !== false;

                    return (
                        <div key={block.id} className="border rounded-lg shadow-sm bg-white overflow-hidden transition-all duration-200">
                            <div
                                className={`p-3 flex justify-between items-center border-b cursor-pointer hover:bg-gray-50 ${isExpanded ? 'bg-gray-100' : 'bg-white'}`}
                                onClick={() => toggleExpand(block.id)}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 text-blue-600 rounded">
                                        <Plus size={14} />
                                    </div>
                                    <span className="font-bold text-sm text-gray-800 uppercase tracking-tight">
                                        {blockType.label}
                                    </span>
                                    {!isExpanded && (
                                        <span className="text-xs text-gray-400 truncate max-w-xs italic">
                                            {JSON.stringify(block.data).substring(0, 60)}...
                                        </span>
                                    )}
                                </div>
                                <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                                    <button
                                        type="button"
                                        onClick={() => handleMoveBlock(index, -1)}
                                        disabled={index === 0}
                                        className="p-1.5 hover:bg-white rounded hover:text-blue-600 disabled:text-gray-300 transition"
                                        title="Move Up"
                                    >
                                        <ArrowUp size={16} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleMoveBlock(index, 1)}
                                        disabled={index === blocks.length - 1}
                                        className="p-1.5 hover:bg-white rounded hover:text-blue-600 disabled:text-gray-300 transition"
                                        title="Move Down"
                                    >
                                        <ArrowDown size={16} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveBlock(index)}
                                        className="p-1.5 hover:bg-white rounded hover:text-red-600 transition"
                                        title="Remove Block"
                                    >
                                        <Trash size={16} />
                                    </button>
                                </div>
                            </div>
                            {isExpanded && (
                                <div className="p-6 bg-white">
                                    <BlockComponent
                                        data={block.data}
                                        onChange={(newData) => handleBlockChange(index, newData)}
                                    />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="flex gap-2 p-4 bg-gray-50 rounded-lg border border-dashed border-gray-300 justify-center">
                <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="border rounded p-2"
                >
                    {Object.entries(BLOCK_TYPES).map(([key, value]) => (
                        <option key={key} value={key}>{value.label}</option>
                    ))}
                </select>
                <button
                    type="button"
                    onClick={handleAddBlock}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                    <Plus size={18} className="mr-1" /> Add Block
                </button>
            </div>
        </div>
    );
};

export default BlockManager;
