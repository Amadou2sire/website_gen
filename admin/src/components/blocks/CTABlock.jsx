import React from 'react';

const CTABlock = ({ data, onChange }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        onChange({ ...data, [name]: value });
    };

    return (
        <div className="space-y-4 p-4 border rounded bg-gray-50">
            <h3 className="font-bold text-gray-700">Call to Action (CTA)</h3>
            <div>
                <label className="block text-sm font-medium">Headline</label>
                <input
                    type="text"
                    name="headline"
                    value={data.headline || ''}
                    onChange={handleChange}
                    className="w-full border rounded p-2"
                />
            </div>
            <div>
                <label className="block text-sm font-medium">Subheadline</label>
                <input
                    type="text"
                    name="subheadline"
                    value={data.subheadline || ''}
                    onChange={handleChange}
                    className="w-full border rounded p-2"
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium">Button Text</label>
                    <input
                        type="text"
                        name="button_text"
                        value={data.button_text || ''}
                        onChange={handleChange}
                        className="w-full border rounded p-2"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Button Link</label>
                    <input
                        type="text"
                        name="button_link"
                        value={data.button_link || ''}
                        onChange={handleChange}
                        className="w-full border rounded p-2"
                    />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium">Section Background</label>
                    <input
                        type="color"
                        name="bgColor"
                        value={data.bgColor || '#2563eb'}
                        onChange={handleChange}
                        className="w-full h-10 border rounded p-1"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Text Color</label>
                    <input
                        type="color"
                        name="textColor"
                        value={data.textColor || '#ffffff'}
                        onChange={handleChange}
                        className="w-full h-10 border rounded p-1"
                    />
                </div>
            </div>
        </div>
    );
};

export default CTABlock;
