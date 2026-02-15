import ImageUpload from '../ImageUpload';

const HeroBlock = ({ data, onChange }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        onChange({ ...data, [name]: value });
    };

    const handleImageChange = (url) => {
        onChange({ ...data, image_url: url });
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Main Headline</label>
                        <input
                            type="text"
                            name="headline"
                            value={data.headline || ''}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Subheadline</label>
                        <textarea
                            name="subheadline"
                            value={data.subheadline || ''}
                            onChange={handleChange}
                            rows="3"
                            className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                        />
                    </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-dashed border-gray-300">
                    <ImageUpload
                        label="Hero Background / Illustration"
                        value={data.image_url}
                        onChange={handleImageChange}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6 border-t pt-6">
                <div className="space-y-4">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Call to Action</h4>
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="text"
                            name="cta_text"
                            placeholder="Button Text"
                            value={data.cta_text || ''}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-2.5 text-sm"
                        />
                        <input
                            type="text"
                            name="cta_link"
                            placeholder="Button Link (#)"
                            value={data.cta_link || ''}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-2.5 text-sm"
                        />
                    </div>
                </div>
                <div className="space-y-4">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Theme Colors</h4>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                            <input
                                type="color"
                                name="headlineColor"
                                value={data.headlineColor || '#111827'}
                                onChange={handleChange}
                                className="w-10 h-10 border rounded-full overflow-hidden p-0"
                            />
                            <span className="text-xs font-medium text-gray-600">Headline</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="color"
                                name="buttonColor"
                                value={data.buttonColor || '#2563eb'}
                                onChange={handleChange}
                                className="w-10 h-10 border rounded-full overflow-hidden p-0"
                            />
                            <span className="text-xs font-medium text-gray-600">Button</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroBlock;
