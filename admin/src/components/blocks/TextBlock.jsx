import React from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const TextBlock = ({ data, onChange }) => {
    const handleChange = (content) => {
        onChange({ ...data, content });
    };

    const modules = {
        toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
            ['link', 'image'],
            ['clean']
        ],
    };

    return (
        <div className="space-y-4 p-4 border rounded bg-gray-50">
            <h3 className="font-bold text-gray-700">Rich Text</h3>
            <div className="bg-white">
                <ReactQuill
                    theme="snow"
                    value={data.content || ''}
                    onChange={handleChange}
                    modules={modules}
                />
            </div>
        </div>
    );
};

export default TextBlock;
