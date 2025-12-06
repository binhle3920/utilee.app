<p align="center">
  <img src="public/logo/logo-192.png" alt="Utilee Logo" width="80" height="80" />
</p>

<h1 align="center">Utilee</h1>

<p align="center">
  <strong>A free, privacy-focused collection of developer tools</strong>
</p>

<p align="center">
  <a href="https://utilee.app">🌐 Live Demo</a> •
  <a href="#features">Features</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#tech-stack">Tech Stack</a>
</p>

<p align="center">
  <img src="https://img.shields.io/coderabbit/prs/github/binhle3920/utilee.app?utm_source=oss&utm_medium=github&utm_campaign=binhle3920%2Futilee.app&labelColor=171717&color=FF570A&link=https%3A%2F%2Fcoderabbit.ai&label=CodeRabbit+Reviews" alt="CodeRabbit Pull Request Reviews" />
</p>

---

## ✨ Features

Utilee provides a suite of productivity tools designed for developers, all running client-side for maximum privacy.

### 📝 Text Tools

| Tool | Description |
|------|-------------|
| **Offline Notes** | Create and organize notes with a rich text editor. All data saved locally for privacy and offline access. |
| **Lorem Ipsum Generator** | Generate customizable placeholder text for designs and mockups. |
| **Text Comparison** | Compare two texts side-by-side with an intuitive diff viewer. |
| **JSON Formatter** | Format and beautify JSON data for better readability. |
| **Password Generator** | Generate strong, secure passwords with customizable options. |

### 🖼️ Image Tools

| Tool | Description |
|------|-------------|
| **Image Converter** | Convert images between formats with batch processing support. |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Yarn or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/binhle3920/utilee.app.git
cd utilee.app

# Install dependencies
yarn install

# Start development server
yarn dev
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `yarn dev` | Start development server with HMR |
| `yarn build` | Build for production |
| `yarn preview` | Preview production build locally |
| `yarn lint` | Run ESLint |

---

## 🛠️ Tech Stack

- **Framework:** [React 18](https://react.dev/) with TypeScript
- **Build Tool:** [Vite](https://vitejs.dev/)
- **UI Library:** [Ant Design](https://ant.design/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Rich Text Editor:** [TipTap](https://tiptap.dev/)
- **State Management:** [Zustand](https://zustand-demo.pmnd.rs/)
- **Routing:** [React Router](https://reactrouter.com/)
- **Hosting:** [Firebase Hosting](https://firebase.google.com/products/hosting)

---

## 🔒 Privacy

Utilee is designed with privacy in mind:

- **Client-side processing** — All tools run entirely in your browser
- **Local storage** — Notes and preferences are stored locally on your device
- **No data collection** — Your data never leaves your browser

---

## 📁 Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── common/         # Shared components
│   ├── layouts/        # Layout components
│   └── loadings/       # Loading states
├── containers/         # Page containers
│   ├── dashboard/      # Dashboard screen
│   └── tools/          # Tool screens
│       ├── image-tools/
│       └── text-tools/
├── hooks/              # Custom React hooks
├── routes/             # Route configuration
└── utils/              # Utilities and constants
```

---

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

---

## 📄 License

This project is private and not licensed for public use.

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/binhle3920">binhle3920</a>
</p>
