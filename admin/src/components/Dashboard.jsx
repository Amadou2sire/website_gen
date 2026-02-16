import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';

const Dashboard = () => {
    const [stats, setStats] = useState({ pages: 0, published_pages: 0, menus: 0 });
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [statsRes, recentRes] = await Promise.all([
                    axios.get('http://localhost:8000/api/dashboard/stats'),
                    axios.get('http://localhost:8000/api/dashboard/recent')
                ]);
                setStats(statsRes.data);
                setRecentActivity(recentRes.data);
            } catch (error) {
                console.error("Error fetching dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="p-8 flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Tableau de bord</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">Bienvenue sur votre gestionnaire de contenu statique.</p>
            </header>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm transition-all hover:shadow-md">
                    <div className="flex items-center gap-4">
                        <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-xl text-blue-600 dark:text-blue-400">
                            <span className="material-symbols-outlined text-2xl">description</span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Pages Totales</p>
                            <h3 className="text-2xl font-bold">{stats.pages}</h3>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm transition-all hover:shadow-md">
                    <div className="flex items-center gap-4">
                        <div className="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-xl text-emerald-600 dark:text-emerald-400">
                            <span className="material-symbols-outlined text-2xl">check_circle</span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Pages Publiées</p>
                            <h3 className="text-2xl font-bold">{stats.published_pages}</h3>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm transition-all hover:shadow-md">
                    <div className="flex items-center gap-4">
                        <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-xl text-purple-600 dark:text-purple-400">
                            <span className="material-symbols-outlined text-2xl">menu</span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Menus Actifs</p>
                            <h3 className="text-2xl font-bold">{stats.menus}</h3>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity (WordPress style) */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                        <h2 className="font-bold text-lg flex items-center gap-2">
                            <span className="material-symbols-outlined text-slate-400">history</span>
                            Activité récente
                        </h2>
                        <NavLink to="/pages" className="text-sm text-primary font-medium hover:underline">
                            Voir toutes les pages
                        </NavLink>
                    </div>
                    <div className="divide-y divide-slate-100 dark:divide-slate-700">
                        {recentActivity.length > 0 ? (
                            recentActivity.map((item) => (
                                <div key={`${item.type}-${item.id}`} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors flex items-center justify-between group">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2 rounded-lg ${item.type === 'page' ? 'bg-blue-50 text-blue-500' : 'bg-purple-50 text-purple-500'}`}>
                                            <span className="material-symbols-outlined text-xl">
                                                {item.type === 'page' ? 'html' : 'menu'}
                                            </span>
                                        </div>
                                        <div>
                                            <NavLink to={`/editor/${item.id}`} className="font-semibold text-slate-800 dark:text-slate-100 group-hover:text-primary transition-colors">
                                                {item.title}
                                            </NavLink>
                                            <p className="text-xs text-slate-400 mt-1">
                                                Modifié le {new Date(item.date).toLocaleString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md ${item.status === 'published' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                            }`}>
                                            {item.status === 'published' ? 'Publiée' : 'Brouillon'}
                                        </span>
                                        <NavLink to={`/editor/${item.id}`} className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-lg text-slate-400">
                                            <span className="material-symbols-outlined text-[18px]">edit</span>
                                        </NavLink>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-12 text-center text-slate-400">
                                <span className="material-symbols-outlined text-4xl block mb-2 text-slate-200">sentiment_neutral</span>
                                <p>Aucune activité récente pour le moment.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                        <h2 className="font-bold text-lg mb-4">Actions rapides</h2>
                        <div className="grid grid-cols-1 gap-3">
                            <NavLink to="/editor/new" className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 hover:border-primary/50 hover:bg-primary/5 transition-all group">
                                <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-lg text-emerald-600 group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined">add_circle</span>
                                </div>
                                <span className="font-medium text-sm">Nouvelle Page</span>
                            </NavLink>
                            <NavLink to="/menus" className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 hover:border-primary/50 hover:bg-primary/5 transition-all group">
                                <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg text-purple-600 group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined">menu</span>
                                </div>
                                <span className="font-medium text-sm">Gérer les Menus</span>
                            </NavLink>
                            <NavLink to="/settings" className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 hover:border-primary/50 hover:bg-primary/5 transition-all group">
                                <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-lg text-slate-600 dark:text-slate-400 group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined">settings</span>
                                </div>
                                <span className="font-medium text-sm">Configuration</span>
                            </NavLink>
                        </div>
                    </div>

                    <div className="bg-primary/10 border border-primary/20 p-6 rounded-2xl">
                        <h3 className="font-bold text-primary mb-2 flex items-center gap-2">
                            <span className="material-symbols-outlined text-[18px]">lightbulb</span>
                            Astuce
                        </h3>
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                            Pensez à cliquer sur "Build Site" dans la barre latérale pour mettre à jour la version statique de votre site après chaque modification.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
