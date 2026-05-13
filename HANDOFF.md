# PolyMind Development — Handoff Document

**Date:** May 14, 2026  
**Current Branch:** `dev/phase-1-chat-ui`  
**Status:** Phase 1 - Core Chat MVP (In Progress)  

---

## 🚀 Quick Start

```bash
# Install dependencies (if not already done)
npm install

# Start development server
npm run dev
# → http://localhost:5173

# Create a new commit after making changes
git add .
git commit -m "feat: [description]"

# Push changes to GitHub
git push origin dev/phase-1-chat-ui
```

---

## ✅ Completed (Steps 1-9)

### 1. Project Setup
- Vite + React + TypeScript scaffold initialized
- All dependencies installed (Zustand, React Router, Tailwind, react-markdown, etc.)

### 2. Configuration Files
- ✅ `tailwind.config.js` - Full design system with colors and typography
- ✅ `postcss.config.js` - PostCSS setup for Tailwind

### 3. Type Definitions
- ✅ `src/types/index.ts` - Message, Conversation, ModelDefinition, ChatOptions, ImageOptions

### 4. State Management (Zustand Stores)
- ✅ `src/stores/chatStore.ts` - Conversation, messages, streaming state
- ✅ `src/stores/settingsStore.ts` - API keys (localStorage persisted), theme, system prompt
- ✅ `src/stores/modelStore.ts` - 9 predefined models (Groq, Gemini, Mistral, Pollinations)

### 5. API Adapter Layer
- ✅ `src/adapters/base.ts` - BaseAdapter abstract class (pattern for all providers)
- ✅ `src/adapters/groq.ts` - Groq adapter with SSE streaming chat
- ✅ `src/adapters/index.ts` - AdapterRegistry (extensible for future providers)

### 6. Utilities
- ✅ `src/lib/streaming.ts` - SSE stream parser, error handling

### 7. Git Setup
- ✅ Remote: https://github.com/princeraj2572/Polymind.git
- ✅ Branches: `master` (main), `dev/phase-1-chat-ui` (active development)
- ✅ First commit pushed with all scaffolding

---

## 📋 Next Steps (Step 10 onwards)

### Step 10: UI Base Components
Create fundamental reusable components in `src/components/ui/`:
- [ ] `Button.tsx` - Primary, secondary, variants with Tailwind
- [ ] `Input.tsx` - Text input with focus states
- [ ] `Modal.tsx` - Dialog overlay
- [ ] `Select.tsx` - Dropdown component
- [ ] `Textarea.tsx` - Auto-resizing textarea

**Files to create:**
```
src/components/ui/
├── Button.tsx
├── Input.tsx
├── Textarea.tsx
├── Modal.tsx
├── Select.tsx
└── Badge.tsx
```

### Step 11: Layout Components
Create main layout structure in `src/components/layout/`:
- [ ] `Sidebar.tsx` - 220px fixed sidebar with nav items
- [ ] `TopBar.tsx` - Model selector, settings button
- [ ] `ContentArea.tsx` - Main content wrapper

### Step 12: Chat Components
Implement chat UI in `src/components/chat/`:
- [ ] `MessageList.tsx` - Display messages with auto-scroll
- [ ] `MessageBubble.tsx` - User/AI message styling with actions
- [ ] `InputBar.tsx` - Sticky input with send button
- [ ] `CodeBlock.tsx` - Syntax-highlighted code blocks
- [ ] `StreamingCursor.tsx` - Blinking cursor while streaming

### Step 13: Model Picker Component
- [ ] `src/components/models/ModelPicker.tsx` - Searchable dropdown

### Step 14: Global Styles
- [ ] `src/styles/globals.css` - CSS variables, resets
- [ ] `src/styles/animations.css` - Motion specs from spec
- [ ] `src/styles/markdown.css` - Markdown rendering styles

### Step 15: App Shell & Routes
- [ ] `src/App.tsx` - React Router + layout shell
- [ ] `src/pages/ChatPage.tsx` - Main chat interface
- [ ] `src/pages/SettingsPage.tsx` - API key manager
- [ ] `src/main.tsx` - React entry point

### Step 16: Groq Integration Testing
- [ ] Add test API key to .env.local
- [ ] Test streaming chat with real API
- [ ] Verify error handling

### Step 17: Polish & Features
- [ ] Chat history persistence (localStorage)
- [ ] Keyboard shortcuts (Ctrl+K, Ctrl+Enter)
- [ ] Loading skeletons
- [ ] Error toasts/messages
- [ ] Responsive mobile layout

---

## 🏗️ Architecture Reference

### Folder Structure
```
polymind/
├── src/
│   ├── adapters/          ← API integrations (Groq, Gemini, etc.)
│   ├── components/
│   │   ├── layout/        ← Sidebar, TopBar, ContentArea
│   │   ├── chat/          ← MessageList, InputBar, etc.
│   │   ├── models/        ← ModelPicker
│   │   └── ui/            ← Button, Input, Modal, etc.
│   ├── pages/             ← Route components (ChatPage, SettingsPage)
│   ├── stores/            ← Zustand stores (chat, settings, models)
│   ├── lib/               ← Utilities (streaming, storage, etc.)
│   ├── types/             ← TypeScript interfaces
│   ├── styles/            ← Global CSS
│   └── main.tsx           ← Entry point
├── tailwind.config.js
├── postcss.config.js
├── vite.config.ts
├── package.json
└── index.html
```

### Data Flow (Chat Message)
```
User types → InputBar.onSubmit()
  ↓
chatStore.addMessage(userMessage)
  ↓
adapterRegistry.getAdapter(modelId)
  ↓
adapter.chat(messages, options) → AsyncGenerator
  ↓
for await (chunk) → chatStore.appendChunk()
  ↓
MessageBubble re-renders (streamed text appears)
  ↓
stream ends → chatStore.finalizeMessage()
```

### Color Palette (Design System)
```
Background:    #0A0A0F (base), #111118 (surface), #18181F (elevated)
Accent:        #5B5BFF (primary), #7B7BFF (glow)
Text:          #F0F0FF (primary), #8888AA (secondary)
Status:        #22C55E (success), #EF4444 (error), #06B6D4 (streaming)
```

---

## 🧪 Testing & Debugging

### Run Dev Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
npm run preview
```

### Git Workflow
```bash
# Check current branch
git branch

# Switch branches
git checkout dev/phase-1-chat-ui

# After making changes
git add .
git commit -m "feat: [description]"
git push origin dev/phase-1-chat-ui

# View branches on GitHub
# https://github.com/princeraj2572/Polymind/branches
```

### Common Issues
- **Tailwind classes not applying:** Ensure `content` array in `tailwind.config.js` includes all file paths
- **Zustand store not persisting:** settingsStore uses `persist` middleware with `polymind-settings` key
- **Groq API errors:** Check API key format (should start with `gsk_`)

---

## 📌 Key Implementation Notes

### Groq Adapter
- Model: `mixtral-8x7b-32768` (free tier)
- Endpoint: `https://api.groq.com/openai/v1/chat/completions`
- Streaming: SSE with `stream: true` parameter
- Required header: `Authorization: Bearer {key}`

### Stores (Zustand)
- **chatStore:** Per-conversation message history, active conversation ID, streaming state
- **settingsStore:** Persisted to `localStorage` with key `polymind-settings`
- **modelStore:** Lists all available models, tracks selected model

### Design System
- Tailwind utilities with custom colors
- No hardcoded colors in components—use Tailwind classes
- Animations: fade, slide, pulse-cyan, blink

---

## 🔗 Links & Resources

- **GitHub Repo:** https://github.com/princeraj2572/Polymind
- **Active Branch:** https://github.com/princeraj2572/Polymind/tree/dev/phase-1-chat-ui
- **Groq API Docs:** https://console.groq.com/docs/speech-text
- **Tailwind Docs:** https://tailwindcss.com/docs
- **Zustand Docs:** https://github.com/pmndrs/zustand

---

## 📝 Session Notes

**What was built this session:**
1. Complete project scaffolding with Vite + React + TypeScript
2. Design system via Tailwind (colors, typography, animations)
3. Three Zustand stores for state management (chat, settings, models)
4. API adapter pattern with Groq implementation + streaming
5. Utility functions for SSE parsing and error handling
6. Git repo setup with master + dev branches pushed to GitHub

**Next person:** Start with Step 10 - UI Base Components. All boilerplate is done; now focus on building the React components and integrating the existing adapters.

---

**Last Updated:** May 14, 2026  
**Branch:** dev/phase-1-chat-ui  
**Ready to Continue:** Yes ✅
