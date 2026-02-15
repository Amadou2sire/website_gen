import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const Sidebar = () => {
    const [isBuilding, setIsBuilding] = useState(false);

    const handleBuild = async () => {
        setIsBuilding(true);
        try {
            await axios.post('http://localhost:8000/api/generate');
            toast.success("Site built successfully! Deployment complete.");
        } catch (error) {
            console.error("Build failed", error);
            toast.error("Build process failed. Check server logs.");
        } finally {
            setIsBuilding(false);
        }
    };

    const navSections = [
        {
            title: "Content Management",
            items: [
                { label: "Dashboard", to: "/", icon: "dashboard" },
                { label: "Pages", to: "/", icon: "description" },
                { label: "New Page", to: "/editor/new", icon: "add_circle" },
            ]
        },
        {
            title: "Structure",
            items: [
                { label: "Navigation", to: "/menus", icon: "list" },
                { label: "UI Settings", to: "/settings", icon: "palette" },
                { label: "Footer", to: "/menus", icon: "view_agenda" },
            ]
        },
        {
            title: "Assets",
            items: [
                { label: "Media Library", to: "#", icon: "image" },
            ]
        }
    ];

    return (
        <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-background-dark flex flex-col fixed h-full z-20">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                    <div className="bg-primary p-1.5 rounded-lg text-white shadow-lg shadow-primary/20">
                        <span className="material-symbols-outlined">dashboard_customize</span>
                    </div>
                    <div>
                        <h1 className="text-sm font-bold leading-none">StaticCMS</h1>
                        <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mt-1">Enterprise Admin</p>
                    </div>
                </div>
            </div>

            <nav className="flex-1 overflow-y-auto p-4 space-y-6">
                {navSections.map((section, idx) => (
                    <div key={idx} className="space-y-1">
                        <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                            {section.title}
                        </p>
                        {section.items.map((item) => (
                            <NavLink
                                key={item.label}
                                to={item.to}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-3 py-2 rounded-lg transition-all group ${isActive
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                                    }`
                                }
                            >
                                <span className={`material-symbols-outlined !text-[20px] ${item.icon === 'add_circle' ? 'text-emerald-500' : ''
                                    }`}>
                                    {item.icon}
                                </span>
                                <span className="text-sm font-medium">{item.label}</span>
                            </NavLink>
                        ))}
                    </div>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <button
                    onClick={handleBuild}
                    disabled={isBuilding}
                    className={`w-full py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-lg active:scale-[0.98] ${isBuilding
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        : 'bg-primary text-white hover:bg-blue-700 shadow-blue-500/20'
                        }`}
                >
                    <span className={`material-symbols-outlined !text-[18px] ${isBuilding ? 'animate-spin' : ''}`}>
                        {isBuilding ? 'sync' : 'rocket_launch'}
                    </span>
                    {isBuilding ? 'Building...' : 'Build Site'}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
