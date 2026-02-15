# StaticCMS - Landing Page Builder & SSG

StaticCMS is a powerful, block-based landing page builder that generates optimized static HTML websites. It combines a modern React-based admin dashboard with a high-performance FastAPI backend.

##  Features

- **Block-Based Editor**: Build pages by stacking Hero, Features, CTA, Pricing, and Testimonial blocks.
- **Unified API**: Standardized operations on port `8000`.
- **Static Site Generation (SSG)**: One-click build exports your content to pure HTML/CSS.
- **Media Management**: Integrated local image upload system.
- **SEO Ready**: Automatic slug generation, meta description management, and clean HTML output.
- **Pro Slider**: High-end cinematic sliders powered by Swiper.js.

##  Tech Stack

- **Backend**: FastAPI (Python), SQLAlchemy (SQLite), Jinja2 (Templating).
- **Frontend**: React (Vite), Tailwind CSS, Lucide Icons.
- **Storage**: SQLite for content, `/output` for static assets.

##  Installation

### Backend Setup
1. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
2. Install dependencies:
   ```bash
   pip install -r backend/requirements.txt
   ```
3. Configure `.env`:
   ```env
   DATABASE_URL=sqlite:///./cms.db
   SECRET_KEY=your_secret_key
   OUTPUT_DIR=./output
   ```

### Frontend Setup
1. Navigate to the admin directory:
   ```bash
   cd admin
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

##  How to Run

### 1. Start the Backend
From the root directory:
```bash
uvicorn backend.main:app --reload --port 8000
```

### 2. Start the Frontend (Admin Dashboard)
From the `admin` directory:
```bash
npm run dev
```

##  Project Structure

- `/backend`: FastAPI models, schemas, and API endpoints.
- `/admin`: React source code for the dashboard.
- `/output`: Target directory for the generated static site.
- `cms.db`: SQLite database file.

##  Port Standardization
All components communicate via port **8000**. Ensure no other applications are using this port during development.

##  Git Workflows

### Standard Commit Cycle
```bash
git add .
git commit -m "Your descriptive message here"
git push origin main
```

### Useful Commands
- **Check Status**: `git status`
- **View History**: `git log --oneline`
- **Discard Changes**: `git checkout -- .`
- **Pull Latest**: `git pull origin main`
