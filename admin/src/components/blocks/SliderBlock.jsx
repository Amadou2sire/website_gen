import React from 'react';
import { Plus, Trash, ArrowUp, ArrowDown, Settings2 } from 'lucide-react';
import ImageUpload from '../ImageUpload';

const SliderBlock = ({ data, onChange }) => {
    const slides = data.slides || [];

    const handleAddSlide = () => {
        const newSlides = [...slides, {
            headline: 'New Slide',
            subheadline: 'Enter details here',
            image_url: '',
            cta_text: 'Learn More',
            cta_link: '#'
        }];
        onChange({ ...data, slides: newSlides });
    };

    const handleRemoveSlide = (index) => {
        const newSlides = slides.filter((_, i) => i !== index);
        onChange({ ...data, slides: newSlides });
    };

    const handleSlideChange = (index, field, value) => {
        const newSlides = [...slides];
        newSlides[index] = { ...newSlides[index], [field]: value };
        onChange({ ...data, slides: newSlides });
    };

    const handleToggleSetting = (field) => {
        onChange({ ...data, [field]: !data[field] });
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border">
                <div className="flex items-center gap-3 text-gray-700">
                    <Settings2 size={20} className="text-blue-500" />
                    <span className="font-bold uppercase tracking-widest text-xs">Slider Settings</span>
                </div>
                <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={data.full_screen}
                            onChange={() => handleToggleSetting('full_screen')}
                            className="w-4 h-4 rounded text-blue-600"
                        />
                        <span className="text-sm font-medium">Full Screen Height</span>
                    </label>
                </div>
            </div>

            <div className="space-y-6">
                {slides.map((slide, index) => (
                    <div key={index} className="border rounded-2xl bg-white overflow-hidden shadow-sm border-gray-100 group">
                        <div className="bg-gray-50 px-6 py-3 flex justify-between items-center border-b">
                            <span className="text-xs font-bold text-gray-500 uppercase">Slide #{index + 1}</span>
                            <button
                                onClick={() => handleRemoveSlide(index)}
                                className="text-red-400 hover:text-red-600 transition"
                            >
                                <Trash size={16} />
                            </button>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Headline</label>
                                    <input
                                        type="text"
                                        value={slide.headline}
                                        onChange={(e) => handleSlideChange(index, 'headline', e.target.value)}
                                        className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Subheadline</label>
                                    <textarea
                                        value={slide.subheadline}
                                        onChange={(e) => handleSlideChange(index, 'subheadline', e.target.value)}
                                        rows="2"
                                        className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">CTA Text</label>
                                        <input
                                            type="text"
                                            value={slide.cta_text}
                                            onChange={(e) => handleSlideChange(index, 'cta_text', e.target.value)}
                                            className="w-full border rounded-lg p-2.5 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">CTA Link</label>
                                        <input
                                            type="text"
                                            value={slide.cta_link}
                                            onChange={(e) => handleSlideChange(index, 'cta_link', e.target.value)}
                                            className="w-full border rounded-lg p-2.5 text-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <ImageUpload
                                    label="Slide Background"
                                    value={slide.image_url}
                                    onChange={(url) => handleSlideChange(index, 'image_url', url)}
                                />
                            </div>
                        </div>
                    </div>
                ))}

                <button
                    type="button"
                    onClick={handleAddSlide}
                    className="w-full py-6 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-gray-400 hover:text-blue-500 hover:border-blue-200 hover:bg-blue-50 transition gap-2"
                >
                    <Plus size={24} />
                    <span className="font-bold uppercase tracking-widest text-xs">Add Slide</span>
                </button>
            </div>
        </div>
    );
};

export default SliderBlock;
