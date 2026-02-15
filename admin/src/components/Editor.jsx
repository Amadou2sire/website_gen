import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

// Import block components
import HeroBlock from './blocks/HeroBlock';
import TextBlock from './blocks/TextBlock';
import FeaturesBlock from './blocks/FeaturesBlock';
import CTABlock from './blocks/CTABlock';
import BannerBlock from './blocks/BannerBlock';
import PricingBlock from './blocks/PricingBlock';
import SliderBlock from './blocks/SliderBlock';
import TestimonialBlock from './blocks/TestimonialBlock';

const BLOCK_TYPES = {
    'hero': { component: HeroBlock, label: 'Hero Section', icon: 'view_headline', desc: 'Full-width header with CTA', defaultData: { headline: 'New Hero', subheadline: 'Subtitle here', cta_text: 'Learn More', cta_link: '#', headlineColor: '#111827', buttonColor: '#1337ec' } },
    'text': { component: TextBlock, label: 'Rich Text', icon: 'article', desc: 'Rich text and typography', defaultData: { content: '<p>Enter text here...</p>' } },
    'slider': { component: SliderBlock, label: 'Image Slider', icon: 'gallery_thumbnail', desc: 'Carousel of images', defaultData: { full_screen: true, slides: [{ headline: 'Welcome', subheadline: 'Discover our story', image_url: '', cta_text: 'Start Now', cta_link: '#' }] } },
    'features': { component: FeaturesBlock, label: 'Features Grid', icon: 'grid_view', desc: '3-column highlight grid', defaultData: { features: [{ title: 'Feature 1', description: 'Description', icon: 'zap' }] } },
    'cta': { component: CTABlock, label: 'Call to Action', icon: 'ads_click', desc: 'Conversion focused banner', defaultData: { headline: 'Ready to start?', subheadline: 'Join us today', button_text: 'Get Started', button_link: '#', bgColor: '#1337ec', textColor: '#ffffff' } },
    'banner': { component: BannerBlock, label: 'Promo Banner', icon: 'label', desc: 'Small announcement bar', defaultData: { text: 'Big News! Check out our latest update.', bgColor: '#1337ec', textColor: '#ffffff', link: '#' } },
    'pricing': { component: PricingBlock, label: 'Pricing Table', icon: 'payments', desc: 'Subscription model display', defaultData: { plans: [{ name: 'Basic', price: '$9', features: ['Feature A', 'Feature B'], isPopular: false, buttonText: 'Buy' }] } },
    'testimonial': { component: TestimonialBlock, label: 'Testimonials', icon: 'format_quote', desc: 'Customer social proof', defaultData: { testimonials: [{ author: 'User', role: 'Dev', content: 'Great!' }] } }
};

const Editor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = !!id && id !== 'new';

    const [formData, setFormData] = useState({
        title: '',
        blocks: [],
        meta_description: '',
        is_published: false
    });
    const [selectedBlockId, setSelectedBlockId] = useState(null);
    const [viewMode, setViewMode] = useState('desktop');

    // Panel states for responsiveness
    const [leftPanelOpen, setLeftPanelOpen] = useState(window.innerWidth > 1280);
    const [rightPanelOpen, setRightPanelOpen] = useState(window.innerWidth > 1024);

    useEffect(() => {
        if (isEditing) fetchPage();

        const handleResize = () => {
            if (window.innerWidth < 1280) setLeftPanelOpen(false);
            if (window.innerWidth < 1024) setRightPanelOpen(false);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [id]);

    const fetchPage = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/pages/${id}`);
            const data = response.data;
            setFormData({
                title: data.title,
                blocks: data.blocks || [],
                meta_description: data.meta_description || '',
                is_published: data.is_published
            });
        } catch (error) {
            toast.error("Error fetching page");
        }
    };

    const handleAddBlock = (type) => {
        const id = crypto.randomUUID();
        const newBlock = {
            id,
            type,
            data: { ...BLOCK_TYPES[type].defaultData }
        };
        setFormData(prev => ({ ...prev, blocks: [...prev.blocks, newBlock] }));
        setSelectedBlockId(id);
        if (window.innerWidth < 1280) setLeftPanelOpen(false);
        setRightPanelOpen(true);
    };

    const handleRemoveBlock = (blockId) => {
        setFormData(prev => ({ ...prev, blocks: prev.blocks.filter(b => b.id !== blockId) }));
        if (selectedBlockId === blockId) setSelectedBlockId(null);
    };

    const handleMoveBlock = (index, direction) => {
        if ((direction === -1 && index === 0) || (direction === 1 && index === formData.blocks.length - 1)) return;
        const newBlocks = [...formData.blocks];
        const temp = newBlocks[index];
        newBlocks[index] = newBlocks[index + direction];
        newBlocks[index + direction] = temp;
        setFormData(prev => ({ ...prev, blocks: newBlocks }));
    };

    const handleBlockDataChange = (blockId, newData) => {
        setFormData(prev => ({
            ...prev,
            blocks: prev.blocks.map(b => b.id === blockId ? { ...b, data: newData } : b)
        }));
    };

    const handleSubmit = async () => {
        try {
            const payload = { ...formData, body: '' };
            if (isEditing) {
                await axios.put(`http://localhost:8000/api/pages/${id}`, payload);
                toast.success("Page updated");
            } else {
                await axios.post('http://localhost:8000/api/pages', payload);
                toast.success("Page created");
                navigate('/');
            }
        } catch (error) {
            toast.error("Error saving page");
        }
    };

    const selectedBlock = formData.blocks.find(b => b.id === selectedBlockId);

    return (
        <div className="flex h-screen flex-col overflow-hidden bg-background-light dark:bg-background-dark font-display relative">
            {/* Top Nav Bar */}
            <header className="flex h-16 items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 md:px-6 z-40 shrink-0">
                <div className="flex items-center gap-2 md:gap-4 overflow-hidden">
                    <button onClick={() => navigate('/')} className="flex size-9 md:size-10 shrink-0 items-center justify-center rounded-lg bg-primary text-white shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
                        <span className="material-symbols-outlined !text-xl md:!text-2xl">arrow_back</span>
                    </button>
                    <div className="hidden sm:block truncate">
                        <h1 className="text-sm md:text-base font-bold leading-tight truncate">{formData.title || 'Untitled Page'}</h1>
                        <p className="text-[9px] md:text-[10px] text-slate-500 uppercase tracking-widest font-bold">{isEditing ? 'Editing Mode' : 'Drafting Mode'}</p>
                    </div>
                </div>

                {/* Viewport Toggles (Hidden on very small screens) */}
                <div className="hidden lg:flex items-center gap-1 rounded-xl bg-slate-100 dark:bg-slate-800 p-1 mx-4">
                    {[
                        { id: 'desktop', icon: 'desktop_windows' },
                        { id: 'tablet', icon: 'tablet_mac' },
                        { id: 'mobile', icon: 'smartphone' }
                    ].map(m => (
                        <button
                            key={m.id}
                            onClick={() => setViewMode(m.id)}
                            className={`flex h-8 w-10 items-center justify-center rounded-lg transition-all ${viewMode === m.id ? 'bg-white dark:bg-slate-700 shadow-sm text-primary' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <span className="material-symbols-outlined !text-[20px]">{m.icon}</span>
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-2 md:gap-4">
                    {/* Panel Toggles for Mobile/Small Screens */}
                    <button
                        onClick={() => setLeftPanelOpen(!leftPanelOpen)}
                        className={`xl:hidden flex size-9 md:size-10 items-center justify-center rounded-lg border transition-all ${leftPanelOpen ? 'bg-primary border-primary text-white' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'}`}
                    >
                        <span className="material-symbols-outlined !text-xl md:!text-2xl">grid_view</span>
                    </button>
                    <button
                        onClick={() => setRightPanelOpen(!rightPanelOpen)}
                        className={`lg:hidden flex size-9 md:size-10 items-center justify-center rounded-lg border transition-all ${rightPanelOpen ? 'bg-primary border-primary text-white' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'}`}
                    >
                        <span className="material-symbols-outlined !text-xl md:!text-2xl">settings</span>
                    </button>

                    <div className="hidden sm:block h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>

                    <button onClick={handleSubmit} className="flex items-center gap-2 rounded-lg bg-primary px-3 md:px-5 py-2 text-xs md:text-sm font-bold text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all">
                        <span className="material-symbols-outlined !text-[18px] md:!text-[20px]">cloud_upload</span>
                        <span className="hidden xs:inline">{isEditing ? 'Update' : 'Publish'}</span>
                    </button>
                </div>
            </header>

            <main className="flex flex-1 overflow-hidden relative">
                {/* Left Panel: Block Library */}
                <aside className={`
                    absolute xl:relative z-30 flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300
                    ${leftPanelOpen ? 'translate-x-0 w-72' : '-translate-x-full w-0 xl:w-0'}
                `}>
                    <div className="p-4 border-b border-slate-50 dark:border-slate-800 shrink-0">
                        <div className="flex justify-between items-center xl:block">
                            <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Block Library</h2>
                            <button onClick={() => setLeftPanelOpen(false)} className="xl:hidden p-1 text-slate-400 hover:text-slate-600">
                                <span className="material-symbols-outlined !text-lg">close</span>
                            </button>
                        </div>
                        <div className="mt-4 relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 !text-sm">search</span>
                            <input className="w-full rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 pl-10 text-sm py-2 outline-none focus:ring-1 focus:ring-primary" placeholder="Find block..." type="text" />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                        {Object.entries(BLOCK_TYPES).map(([type, block]) => (
                            <div
                                key={type}
                                onClick={() => handleAddBlock(type)}
                                className="group cursor-pointer rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 shadow-sm hover:border-primary hover:shadow-md transition-all active:scale-[0.98]"
                            >
                                <div className="mb-3 aspect-video w-full rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-hover:bg-primary/5 transition-colors">
                                    <span className="material-symbols-outlined text-3xl text-slate-300 group-hover:text-primary transition-all scale-100 group-hover:scale-110">{block.icon}</span>
                                </div>
                                <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200">{block.label}</h3>
                                <p className="text-[10px] text-slate-400 mt-0.5">{block.desc}</p>
                            </div>
                        ))}
                    </div>
                </aside>

                {/* Overlay for mobile sidebars */}
                {(leftPanelOpen || rightPanelOpen) && (
                    <div
                        onClick={() => { setLeftPanelOpen(false); setRightPanelOpen(false); }}
                        className="xl:hidden absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] z-20 transition-opacity duration-300"
                    />
                )}

                {/* Center Panel: Live Canvas */}
                <section className="flex-1 overflow-y-auto p-4 md:p-8 canvas-bg custom-scrollbar relative flex flex-col items-center">
                    <div className={`w-full transition-all duration-300 ${viewMode === 'mobile' ? 'max-w-[375px]' : viewMode === 'tablet' ? 'max-w-[768px]' : 'max-w-4xl'}`}>
                        {formData.blocks.length === 0 ? (
                            <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-10 md:p-20 text-center bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
                                <span className="material-symbols-outlined !text-4xl md:!text-6xl text-slate-200 dark:text-slate-700 mb-4 block">draft_orders</span>
                                <h3 className="text-lg md:text-xl font-bold text-slate-400">Empty Canvas</h3>
                                <p className="text-xs md:text-sm text-slate-400 mt-2">Add blocks from the library to start building your page.</p>
                                <button onClick={() => setLeftPanelOpen(true)} className="mt-6 xl:hidden bg-primary text-white px-6 py-2 rounded-lg text-sm font-bold shadow-lg shadow-primary/20">Open Library</button>
                            </div>
                        ) : (
                            <div className="space-y-6 md:space-y-8 pb-32">
                                {formData.blocks.map((block, idx) => (
                                    <div
                                        key={block.id}
                                        onClick={(e) => { e.stopPropagation(); setSelectedBlockId(block.id); setRightPanelOpen(true); }}
                                        className={`relative rounded-xl transition-all ${selectedBlockId === block.id
                                            ? 'ring-2 ring-primary bg-white dark:bg-slate-900 shadow-2xl'
                                            : 'hover:ring-2 hover:ring-slate-300 dark:hover:ring-slate-700 bg-white/80 dark:bg-slate-900/80'
                                            }`}
                                    >
                                        {/* Block Toolbar */}
                                        {selectedBlockId === block.id && (
                                            <div className="absolute -top-12 left-0 flex items-center gap-1 rounded-lg bg-primary p-1 text-white shadow-xl z-10 animate-in fade-in slide-in-from-bottom-2 duration-200">
                                                <button className="flex h-8 w-8 items-center justify-center rounded hover:bg-white/20 transition-colors cursor-grab">
                                                    <span className="material-symbols-outlined !text-[18px]">drag_indicator</span>
                                                </button>
                                                <div className="h-4 w-px bg-white/30 mx-1"></div>
                                                <span className="px-2 text-[10px] font-black uppercase tracking-widest hidden xs:inline">{BLOCK_TYPES[block.type].label}</span>
                                                <div className="h-4 w-px bg-white/30 mx-1"></div>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleMoveBlock(idx, -1); }}
                                                    disabled={idx === 0}
                                                    className="flex h-8 w-8 items-center justify-center rounded hover:bg-white/20 disabled:opacity-30"
                                                >
                                                    <span className="material-symbols-outlined !text-[18px]">arrow_upward</span>
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleMoveBlock(idx, 1); }}
                                                    disabled={idx === formData.blocks.length - 1}
                                                    className="flex h-8 w-8 items-center justify-center rounded hover:bg-white/20 disabled:opacity-30"
                                                >
                                                    <span className="material-symbols-outlined !text-[18px]">arrow_downward</span>
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleRemoveBlock(block.id); }}
                                                    className="flex h-8 w-8 items-center justify-center rounded hover:bg-red-500 transition-colors"
                                                >
                                                    <span className="material-symbols-outlined !text-[18px]">delete</span>
                                                </button>
                                            </div>
                                        )}

                                        <div className="p-4 border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden min-h-[100px] flex items-center justify-center cursor-pointer">
                                            <div className="text-center opacity-70 group-hover:opacity-100 transition-opacity">
                                                <span className={`material-symbols-outlined !text-3xl mb-2 ${selectedBlockId === block.id ? 'text-primary' : 'text-slate-400'}`}>{BLOCK_TYPES[block.type].icon}</span>
                                                <p className="text-xs font-bold uppercase tracking-widest">{BLOCK_TYPES[block.type].label}</p>
                                                {!selectedBlockId && <p className="text-[9px] mt-1 italic text-slate-400">Click to configure</p>}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* New Block Dropzone */}
                        <div
                            onClick={() => setLeftPanelOpen(true)}
                            className="mt-8 group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 py-10 md:py-12 transition-all hover:border-primary hover:bg-white dark:hover:bg-slate-900"
                        >
                            <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 transition-all group-hover:bg-primary group-hover:text-white shadow-sm">
                                <span className="material-symbols-outlined">add</span>
                            </div>
                            <p className="mt-4 text-xs md:text-sm font-bold text-slate-400 group-hover:text-primary transition-colors px-4 text-center">Add block from the library</p>
                        </div>
                    </div>
                </section>

                {/* Right Panel: Contextual Settings */}
                <aside className={`
                    absolute lg:relative right-0 z-30 flex flex-col h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 transition-all duration-300 shadow-2xl lg:shadow-none
                    ${rightPanelOpen ? 'translate-x-0 w-80' : 'translate-x-full w-0 lg:w-0'}
                `}>
                    <div className="border-b border-slate-100 dark:border-slate-800 p-4 bg-slate-50/50 dark:bg-slate-900/50 flex justify-between items-center shrink-0">
                        <h2 className="text-xs font-black uppercase tracking-widest text-slate-400">Settings</h2>
                        <button onClick={() => setRightPanelOpen(false)} className="lg:hidden p-1 text-slate-400 hover:text-slate-600">
                            <span className="material-symbols-outlined !text-lg">close</span>
                        </button>
                    </div>

                    {!selectedBlockId ? (
                        <div className="flex-1 overflow-y-auto p-5 space-y-8 custom-scrollbar">
                            <section className="space-y-4">
                                <h3 className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                    <span className="size-1.5 rounded-full bg-primary"></span>
                                    Page Metadata
                                </h3>
                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Page Title</label>
                                        <input
                                            className="w-full rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm py-2 px-3 focus:ring-1 focus:ring-primary outline-none transition-all"
                                            type="text"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            placeholder="Enter page title..."
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">SEO Description</label>
                                        <textarea
                                            className="w-full rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm py-2 px-3 h-24 focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
                                            placeholder="Briefly describe this page for search engines..."
                                            value={formData.meta_description}
                                            onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                                        ></textarea>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
                                        <div>
                                            <p className="text-[11px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-300">Public Status</p>
                                            <p className="text-[10px] text-slate-400 mt-1">{formData.is_published ? 'Visible to everyone' : 'Private draft'}</p>
                                        </div>
                                        <button
                                            onClick={() => setFormData({ ...formData, is_published: !formData.is_published })}
                                            className={`relative h-6 w-11 rounded-full transition-colors ${formData.is_published ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'}`}
                                        >
                                            <div className={`absolute top-1 left-1 size-4 rounded-full bg-white transition-transform ${formData.is_published ? 'translate-x-5' : 'translate-x-0'}`}></div>
                                        </button>
                                    </div>
                                </div>
                            </section>

                            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-900/50 flex gap-3">
                                <span className="material-symbols-outlined text-blue-500 !text-xl">info</span>
                                <p className="text-[10px] text-blue-700 dark:text-blue-300 font-medium leading-relaxed">
                                    Select any block on the canvas to edit its content and styling directly.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col overflow-hidden">
                            <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between shrink-0">
                                <div className="flex items-center gap-2 truncate">
                                    <span className="material-symbols-outlined text-primary !text-lg shrink-0">{BLOCK_TYPES[selectedBlock.type].icon}</span>
                                    <span className="text-sm font-bold truncate">{BLOCK_TYPES[selectedBlock.type].label}</span>
                                </div>
                                <button onClick={() => setSelectedBlockId(null)} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors group">
                                    <span className="material-symbols-outlined !text-lg text-slate-400 group-hover:text-slate-600">close</span>
                                </button>
                            </div>

                            {/* Tabs */}
                            <div className="flex border-b border-slate-100 dark:border-slate-800 bg-slate-50/10 shrink-0">
                                <button className="flex-1 border-b-2 border-primary py-3 text-[10px] font-black uppercase tracking-widest text-primary">Content</button>
                                <button className="flex-1 border-b-2 border-transparent py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors">Style</button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 md:p-5 custom-scrollbar">
                                {(() => {
                                    const BlockComp = BLOCK_TYPES[selectedBlock.type].component;
                                    return <BlockComp
                                        data={selectedBlock.data}
                                        onChange={(newData) => handleBlockDataChange(selectedBlock.id, newData)}
                                    />;
                                })()}
                            </div>

                            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 shrink-0">
                                <button onClick={() => { setSelectedBlockId(null); if (window.innerWidth < 1024) setRightPanelOpen(false); }} className="w-full rounded-lg bg-primary py-2.5 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-primary/20 hover:bg-blue-700 active:scale-[0.98] transition-all">
                                    Done Editing
                                </button>
                            </div>
                        </div>
                    )}
                </aside>
            </main>
        </div>
    );
};

export default Editor;
