import React from 'react';
import { Plus, Trash, User } from 'lucide-react';

const TestimonialBlock = ({ data, onChange }) => {
    const testimonials = data.testimonials || [];

    const handleAdd = () => {
        onChange({
            ...data,
            testimonials: [...testimonials, { author: 'John Doe', role: 'CEO at Company', content: 'Incredible tool that changed our workflow.', avatar: '' }]
        });
    };

    const handleUpdate = (index, field, value) => {
        const next = [...testimonials];
        next[index] = { ...next[index], [field]: value };
        onChange({ ...data, testimonials: next });
    };

    const handleRemove = (index) => {
        onChange({ ...data, testimonials: testimonials.filter((_, i) => i !== index) });
    };

    return (
        <div className="space-y-6 p-4 bg-gray-50 rounded border">
            <h3 className="font-semibold text-gray-800">User Testimonials</h3>
            <div className="space-y-4">
                {testimonials.map((item, index) => (
                    <div key={index} className="p-4 bg-white border rounded shadow-sm relative space-y-3">
                        <button
                            onClick={() => handleRemove(index)}
                            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                        >
                            <Trash size={14} />
                        </button>
                        <div className="flex gap-4">
                            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                                <User size={20} className="text-gray-400" />
                            </div>
                            <div className="flex-1 space-y-2">
                                <input
                                    type="text"
                                    placeholder="Author Name"
                                    value={item.author}
                                    onChange={(e) => handleUpdate(index, 'author', e.target.value)}
                                    className="w-full border-b text-sm font-bold outline-none"
                                />
                                <input
                                    type="text"
                                    placeholder="Role / Company"
                                    value={item.role}
                                    onChange={(e) => handleUpdate(index, 'role', e.target.value)}
                                    className="w-full border-b text-xs text-gray-500 outline-none"
                                />
                            </div>
                        </div>
                        <textarea
                            placeholder="Testimonial content..."
                            value={item.content}
                            onChange={(e) => handleUpdate(index, 'content', e.target.value)}
                            className="w-full border rounded p-2 text-sm italic text-gray-600"
                            rows="3"
                        />
                    </div>
                ))}
            </div>
            <button
                type="button"
                onClick={handleAdd}
                className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 p-2 rounded text-gray-500 hover:border-blue-400 hover:text-blue-500 text-sm"
            >
                <Plus size={16} /> Add Testimonial
            </button>
        </div>
    );
};

export default TestimonialBlock;
