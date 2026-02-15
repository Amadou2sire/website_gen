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

    // Panel state for responsiveness
    const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 1024);

    useEffect(() => {
        if (isEditing) fetchPage();

        const handleResize = () => {
            if (window.innerWidth < 1024) setSidebarOpen(false);
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

                <div className="flex items-center gap-2 md:gap-4">
                    {/* Viewport Toggles */}
                    <div className="hidden lg:flex items-center gap-1 rounded-xl bg-slate-100 dark:bg-slate-800 p-1 mr-2">
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

                    {/* Unified Panel Toggle */}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className={`lg:hidden flex size-9 md:size-10 items-center justify-center rounded-lg border transition-all ${sidebarOpen ? 'bg-primary border-primary text-white' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'}`}
                    >
                        <span className="material-symbols-outlined !text-xl md:!text-2xl">{sidebarOpen ? 'close_fullscreen' : 'construction'}</span>
                    </button>

                    <button onClick={handleSubmit} className="flex items-center gap-2 rounded-lg bg-primary px-3 md:px-5 py-2 text-xs md:text-sm font-bold text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all">
                        <span className="material-symbols-outlined !text-[18px] md:!text-[20px]">cloud_upload</span>
                        <span className="hidden xs:inline">{isEditing ? 'Update Page' : 'Publish Page'}</span>
                    </button>
                </div>
            </header>

            <main className="flex flex-1 overflow-hidden relative">
                {/* Unified Sidebar: Library + Settings */}
                <aside className={`
                    absolute lg:relative z-30 flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 shadow-2xl lg:shadow-none
                    ${sidebarOpen ? 'translate-x-0 w-80' : '-translate-x-full w-0 lg:w-0'}
                `}>
                    {/* Top Section: Block Library (Fixed Height) */}
                    <div className="h-[40%] flex flex-col border-b border-slate-200 dark:border-slate-800 min-h-[300px]">
                        <div className="p-4 border-b border-slate-50 dark:border-slate-800 shrink-0 bg-slate-50/50 dark:bg-slate-900/50">
                            <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Block Library</h2>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                            {Object.entries(BLOCK_TYPES).map(([type, block]) => (
                                <div
                                    key={type}
                                    onClick={() => handleAddBlock(type)}
                                    className="group cursor-pointer rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 shadow-sm hover:border-primary hover:shadow-md transition-all active:scale-[0.98] flex items-center gap-4"
                                >
                                    <div className="size-10 shrink-0 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-hover:bg-primary/5 transition-colors">
                                        <span className="material-symbols-outlined text-xl text-slate-300 group-hover:text-primary transition-all">{block.icon}</span>
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate">{block.label}</h3>
                                        <p className="text-[10px] text-slate-400 truncate">{block.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bottom Section: Settings (Contextual) */}
                    <div className="flex-1 flex flex-col min-h-0 bg-slate-50/10">
                        <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between shrink-0">
                            <h2 className="text-xs font-black uppercase tracking-widest text-slate-400">
                                {selectedBlockId ? 'Block Configuration' : 'Page Settings'}
                            </h2>
                            {selectedBlockId && (
                                <button onClick={() => setSelectedBlockId(null)} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors group">
                                    <span className="material-symbols-outlined !text-lg text-slate-400 group-hover:text-slate-600">close</span>
                                </button>
                            )}
                        </div>

                        <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
                            {!selectedBlockId ? (
                                <section className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-bold">Page Title</label>
                                            <input
                                                className="w-full rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm py-2 px-3 focus:ring-1 focus:ring-primary outline-none transition-all"
                                                type="text"
                                                value={formData.title}
                                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                placeholder="Enter page title..."
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-bold">SEO Description</label>
                                            <textarea
                                                className="w-full rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm py-2 px-3 h-20 focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
                                                placeholder="Briefly describe this page..."
                                                value={formData.meta_description}
                                                onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                                            ></textarea>
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-300">Published</p>
                                            <button
                                                onClick={() => setFormData({ ...formData, is_published: !formData.is_published })}
                                                className={`relative h-5 w-9 rounded-full transition-colors ${formData.is_published ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'}`}
                                            >
                                                <div className={`absolute top-0.5 left-0.5 size-4 rounded-full bg-white transition-transform ${formData.is_published ? 'translate-x-4' : 'translate-x-0'}`}></div>
                                            </button>
                                        </div>
                                    </div>
                                </section>
                            ) : (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
                                        <span className="material-symbols-outlined text-primary !text-lg shrink-0">{BLOCK_TYPES[selectedBlock.type].icon}</span>
                                        <span className="text-sm font-bold uppercase tracking-tight truncate">{BLOCK_TYPES[selectedBlock.type].label}</span>
                                    </div>

                                    {(() => {
                                        const BlockComp = BLOCK_TYPES[selectedBlock.type].component;
                                        return <BlockComp
                                            data={selectedBlock.data}
                                            onChange={(newData) => handleBlockDataChange(selectedBlock.id, newData)}
                                        />;
                                    })()}

                                    <button onClick={() => setSelectedBlockId(null)} className="w-full mt-4 rounded-lg border-2 border-primary text-primary py-2 text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all">
                                        Done Configuring
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </aside>

                {/* Overlay for mobile sidebars */}
                {sidebarOpen && (
                    <div
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] z-20 transition-opacity duration-300"
                    />
                )}

                {/* Center Panel: Live Canvas */}
                <section className="flex-1 overflow-y-auto p-4 md:p-8 canvas-bg custom-scrollbar flex flex-col items-center">
                    <div className={`w-full transition-all duration-300 ${viewMode === 'mobile' ? 'max-w-[375px]' : viewMode === 'tablet' ? 'max-w-[768px]' : 'max-w-4xl'}`}>
                        {formData.blocks.length === 0 ? (
                            <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-10 md:p-20 text-center bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
                                <span className="material-symbols-outlined !text-4xl md:!text-6xl text-slate-200 dark:text-slate-700 mb-4 block">draft_orders</span>
                                <h3 className="text-lg md:text-xl font-bold text-slate-400">Clean Slate</h3>
                                <p className="text-xs md:text-sm text-slate-400 mt-2">Pick a block from the left tools to start building your story.</p>
                                <button onClick={() => setSidebarOpen(true)} className="mt-6 lg:hidden bg-primary text-white px-6 py-2 rounded-lg text-sm font-bold shadow-lg shadow-primary/20">Open Tools</button>
                            </div>
                        ) : (
                            <div className="space-y-6 md:space-y-8 pb-32">
                                {formData.blocks.map((block, idx) => (
                                    <div
                                        key={block.id}
                                        onClick={(e) => { e.stopPropagation(); setSelectedBlockId(block.id); setSidebarOpen(true); }}
                                        className={`relative rounded-xl transition-all ${selectedBlockId === block.id
                                            ? 'ring-2 ring-primary bg-white dark:bg-slate-900 shadow-2xl scale-[1.01] z-10'
                                            : 'hover:ring-2 hover:ring-slate-300 dark:hover:ring-slate-700 bg-white/80 dark:bg-slate-900/80 grayscale-[0.2]'
                                            }`}
                                    >
                                        {/* Block Toolbar */}
                                        {selectedBlockId === block.id && (
                                            <div className="absolute -top-12 left-0 flex items-center gap-1 rounded-lg bg-primary p-1 text-white shadow-xl z-20 animate-in fade-in slide-in-from-bottom-2 duration-200">
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
                                                <span className={`material-symbols-outlined !text-3xl mb-1 ${selectedBlockId === block.id ? 'text-primary' : 'text-slate-400'}`}>{BLOCK_TYPES[block.type].icon}</span>
                                                <p className="text-[10px] font-black uppercase tracking-widest">{BLOCK_TYPES[block.type].label}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* New Block Dropzone */}
                        <div
                            onClick={() => setSidebarOpen(true)}
                            className="mt-8 group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 py-10 md:py-12 transition-all hover:border-primary hover:bg-white dark:hover:bg-slate-900"
                        >
                            <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 transition-all group-hover:bg-primary group-hover:text-white shadow-sm">
                                <span className="material-symbols-outlined">add</span>
                            </div>
                            <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-primary transition-colors px-4 text-center">Add block to grow page</p>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Editor;
