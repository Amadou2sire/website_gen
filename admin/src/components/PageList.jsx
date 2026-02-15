import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const PageList = () => {
    const [pages, setPages] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');

    useEffect(() => {
        fetchPages();
    }, []);

    const fetchPages = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/pages');
            setPages(response.data);
        } catch (error) {
            console.error("Error fetching pages", error);
            toast.error("Failed to load pages");
        }
    };

    const filteredPages = pages.filter(page => {
        const matchesSearch = page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            page.slug.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'All' ||
            (filterStatus === 'Published' && page.is_published) ||
            (filterStatus === 'Draft' && !page.is_published);
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark">
            {/* Top Bar */}
            <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 sticky top-0 z-10">
                <div className="flex items-center gap-2 text-sm">
                    <span className="text-slate-400 font-medium">Dashboard</span>
                    <span className="material-symbols-outlined text-slate-300 !text-sm">chevron_right</span>
                    <span className="font-bold text-slate-800 dark:text-white">Pages</span>
                </div>
                <Link to="/editor/new" className="bg-primary hover:bg-blue-700 text-white px-4 py-2 rounded font-medium flex items-center gap-2 transition-all shadow-sm active:scale-[0.98]">
                    <span className="material-symbols-outlined !text-lg">add</span>
                    <span>New Page</span>
                </Link>
            </header>

            <div className="p-8">
                {/* Filter Bar */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 mb-6 flex flex-wrap items-center gap-4 shadow-sm">
                    <div className="relative flex-1 min-w-[240px]">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                        <input
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-primary focus:border-primary text-sm transition-all"
                            placeholder="Search pages..."
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <select
                            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg py-2 pl-3 pr-8 text-sm text-slate-600 dark:text-slate-300 focus:ring-primary outline-none"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="All">All Statuses</option>
                            <option value="Published">Published</option>
                            <option value="Draft">Draft</option>
                        </select>
                    </div>
                </div>

                {/* Data Table */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                                    <th className="py-4 px-6 text-sm font-bold text-slate-500 uppercase tracking-widest w-1/3">Page Title</th>
                                    <th className="py-4 px-6 text-sm font-bold text-slate-500 uppercase tracking-widest">Slug</th>
                                    <th className="py-4 px-6 text-sm font-bold text-slate-500 uppercase tracking-widest text-center">Status</th>
                                    <th className="py-4 px-6 text-sm font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {filteredPages.map((page) => (
                                    <tr key={page.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors group">
                                        <td className="py-4 px-6">
                                            <div className="flex flex-col">
                                                <Link to={`/editor/${page.id}`} className="font-bold text-slate-900 dark:text-white hover:text-primary transition-colors">
                                                    {page.title}
                                                </Link>
                                                <span className="text-[11px] text-slate-400 mt-0.5">ID: {page.id}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <code className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-500 font-mono">
                                                {page.slug}
                                            </code>
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${page.is_published
                                                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                                                }`}>
                                                {page.is_published ? 'Published' : 'Draft'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                                                <Link
                                                    to={`/editor/${page.id}`}
                                                    className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-lg text-slate-500 hover:text-primary transition-all shadow-sm border border-transparent hover:border-slate-200"
                                                    title="Edit Page"
                                                >
                                                    <span className="material-symbols-outlined !text-lg">edit</span>
                                                </Link>
                                                {page.is_published && (
                                                    <a
                                                        href={`http://localhost:8000/output/${page.slug}.html`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-lg text-slate-500 hover:text-emerald-500 transition-all shadow-sm border border-transparent hover:border-slate-200"
                                                        title="Live Preview"
                                                    >
                                                        <span className="material-symbols-outlined !text-lg">visibility</span>
                                                    </a>
                                                )}
                                                <button
                                                    className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-slate-400 hover:text-red-500 transition-all shadow-sm border border-transparent hover:border-red-100"
                                                    title="Delete Page"
                                                >
                                                    <span className="material-symbols-outlined !text-lg">delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredPages.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="py-20 text-center">
                                            <div className="flex flex-col items-center justify-center text-slate-400">
                                                <span className="material-symbols-outlined !text-6xl opacity-20 mb-4">find_in_page</span>
                                                <p className="text-lg font-medium">No pages found</p>
                                                <p className="text-sm">Try adjusting your search or filters</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PageList;
