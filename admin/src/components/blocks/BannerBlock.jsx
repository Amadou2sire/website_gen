import React from 'react';

const BannerBlock = ({ data, onChange }) => {
    const handleChange = (field, value) => {
        onChange({ ...data, [field]: value });
    };

    return (
        <div className="space-y-4 p-4 bg-gray-50 rounded border">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Banner Text</label>
                    <input
                        type="text"
                        value={data.text || ''}
                        onChange={(e) => handleChange('text', e.target.value)}
                        className="w-full border rounded p-2 mt-1"
                        placeholder="Special Offer: 50% Off!"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Background Color</label>
                    <input
                        type="color"
                        value={data.bgColor || '#3b82f6'}
                        onChange={(e) => handleChange('bgColor', e.target.value)}
                        className="w-full h-10 border rounded p-1 mt-1"
                    />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Link URL (Optional)</label>
                    <input
                        type="text"
                        value={data.link || ''}
                        onChange={(e) => handleChange('link', e.target.value)}
                        className="w-full border rounded p-2 mt-1"
                        placeholder="/promo"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Text Color</label>
                    <input
                        type="color"
                        value={data.textColor || '#ffffff'}
                        onChange={(e) => handleChange('textColor', e.target.value)}
                        className="w-full h-10 border rounded p-1 mt-1"
                    />
                </div>
            </div>
        </div>
    );
};

export default BannerBlock;
