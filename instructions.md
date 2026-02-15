# Instructions Projet : StaticCMS (FastAPI + React)

Ce document définit la structure et les règles de codage pour la création du CMS de sites statiques.

## 1. Architecture du Projet
L'arborescence doit respecter cette structure :
- `/backend` : API FastAPI, modèles SQLAlchemy, scripts de génération (SSG).
- `/admin` : Dashboard React + Tailwind (Client-side).
- `/output` : Dossier de destination pour le site statique généré (HTML/CSS).

---

## 2. Spécifications Backend (FastAPI)

### Modèles de Données (SQLAlchemy)
Créer une table `Content` avec les champs suivants :
- `id`: Integer (PK)
- `title`: String (60 chars max)
- `slug`: String (Unique, indexé pour le SEO)
- `meta_description`: String (160 chars max)
- `body`: Text (Contenu HTML/Markdown)
- `is_published`: Boolean
- `created_at`: DateTime

### Endpoints Requis
1. `POST /api/pages` : Créer une page.
2. `GET /api/pages` : Lister toutes les pages.
3. `PUT /api/pages/{id}` : Modifier une page.
4. `POST /api/build` : Déclencher le script de génération statique.

---

## 3. Spécifications Frontend (React + Tailwind CDN)

### Stack Technique
- **Framework :** React (Vite.js recommandé pour la rapidité).
- **Style :** Tailwind CSS via CDN (dans `index.html`).
- **State Management :** `useState` / `useEffect` (simple).

### Composants à créer
- `Sidebar.jsx` : Navigation admin.
- `Editor.jsx` : Formulaire avec champs SEO et zone de texte pour le contenu.
- `BuildButton.jsx` : Bouton appelant l'API `/build` avec indicateur de succès.

---

## 4. Logique de Génération Statique (SSG)

Le script de build (dans `backend/generator.py`) doit :
1. Lire toutes les pages `is_published=True` en base de données.
2. Utiliser **Jinja2** pour injecter les données dans un template `base.html`.
3. Générer un fichier `index.html` pour chaque page dans le dossier `/output`.
4. Générer automatiquement un fichier `sitemap.xml`.

---

## 5. Normes SEO à respecter
- **Génération du Slug :** Auto-générer à partir du titre (ex: "Mon Article" -> "mon-article").
- **Tags Meta :** Chaque fichier HTML généré doit inclure `<title>` et `<meta name="description">`.
- **Performance :** Aucun JavaScript inutile sur le site généré (le site statique final doit être pur HTML/CSS).

---

## 6. Variables d'environnement (.env)
```env
DATABASE_URL=sqlite:///./cms.db
SECRET_KEY=votre_cle_secrete_jwt
OUTPUT_DIR=../output