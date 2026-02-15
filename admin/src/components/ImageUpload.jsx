import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ImageUpload = ({ value, onChange, label }) => {
    const [uploading, setUploading] = useState(false);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        setUploading(true);
        try {
            const response = await axios.post('http://localhost:8000/api/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            onChange(response.data.url);
            toast.success("File uploaded to server");
        } catch (error) {
            toast.error("Upload failed");
            console.error(error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-3">
            {label && <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">{label}</label>}
            <div className="flex flex-col gap-4">
                <div className="relative aspect-square w-full max-w-[200px] border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-center bg-slate-50 dark:bg-slate-900 overflow-hidden group transition-all hover:border-primary/50">
                    {value ? (
                        <>
                            <img src={value} alt="Preview" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button
                                    type="button"
                                    onClick={() => onChange('')}
                                    className="p-2 bg-red-500 text-white rounded-full shadow-lg hover:scale-110 transition-transform"
                                >
                                    <span className="material-symbols-outlined !text-sm">delete</span>
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="text-slate-300 dark:text-slate-700 flex flex-col items-center">
                            <span className="material-symbols-outlined !text-4xl mb-2">image</span>
                            <span className="text-[10px] font-black uppercase tracking-widest">No Selection</span>
                        </div>
                    )}
                    {uploading && (
                        <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 flex items-center justify-center backdrop-blur-sm">
                            <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent"></div>
                        </div>
                    )}
                </div>

                <div className="space-y-4 flex-1">
                    <label className={`
                        flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-white cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-all font-bold text-[11px] uppercase tracking-widest shadow-sm
                        ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
                    `}>
                        <span className="material-symbols-outlined !text-lg">cloud_upload</span>
                        {uploading ? 'Processing...' : 'Upload Local'}
                        <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} disabled={uploading} />
                    </label>

                    <div className="relative">
                        <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest absolute -top-2 left-3 bg-white dark:bg-slate-900 px-1">Or URL</span>
                        <input
                            type="text"
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            placeholder="https://images.unsplash.com/..."
                            className="w-full text-xs border border-slate-200 dark:border-slate-800 rounded-xl p-3 bg-white dark:bg-slate-900 focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-slate-300 font-mono"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageUpload;
