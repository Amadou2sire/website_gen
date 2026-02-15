import React, { useState } from 'react';
import axios from 'axios';
import { Play } from 'lucide-react';
import { toast } from 'react-toastify';

const BuildButton = () => {
    const [loading, setLoading] = useState(false);

    const handleBuild = async () => {
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:8000/api/build');
            toast.success(response.data.message);
        } catch (error) {
            toast.error("Build failed: " + (error.response?.data?.detail || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleBuild}
            disabled={loading}
            className={`flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            <Play size={16} />
            {loading ? 'Building...' : 'Build Site'}
        </button>
    );
};

export default BuildButton;
