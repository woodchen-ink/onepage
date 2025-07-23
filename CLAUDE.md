# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is "CZL在线工具箱" (CZL Online Toolbox) - a Next.js-based web application that provides a collection of useful online tools including video players, utility tools, image processing, and developer tools.

## Development Commands

```bash
# Start development server with Turbopack
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run ESLint
npm run lint
```

## Architecture

### Tech Stack
- **Framework**: Next.js 15.1.0 with App Router
- **UI Library**: shadcn/ui components based on Radix UI
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Video Players**: XGPlayer, AliPlayer, CKPlayer, DPlayer

### Project Structure

The codebase follows Next.js App Router structure:

- `app/` - Next.js app router pages and layouts
  - `(default)/tools/` - Tool pages (isolated route group)
  - `(player)/` - Video player pages (isolated route group)
- `components/` - Reusable React components
  - `ui/` - shadcn/ui base components
  - `tools/` - Tool-specific form components
  - `player/` - Video player components
  - `layout/` - Layout components (nav, iframe)
- `lib/` - Utility functions and configurations
  - `tools.ts` - Tool definitions and navigation structure
  - `utils.ts` - Common utility functions
- `functions/api/` - Serverless functions for API endpoints
- `public/` - Static assets

### Key Features

1. **Video Players**: Multiple HTML5 video players with support for various formats (m3u8, mp4, flv)
2. **Utility Tools**: Traffic converter, time converter, Douyin downloader, GitHub proxy
3. **Image Tools**: SVG converter, image compression, watermark, stamp extraction
4. **DevOps Tools**: Cache clearing for EdgeOne/Cloudflare, Docker mirror service
5. **SEO Tools**: URL submission to Bing and Baidu
6. **VPS Monitoring**: Links to external VPS promotion monitoring

### Tool Configuration

Tools are centrally configured in `lib/tools.ts` with the following structure:
- Organized into sections (视频播放器, AI工具, 实用工具, etc.)
- Each tool has name, href, and Lucide icon
- Navigation is automatically generated from this configuration

### Component Patterns

- Form components follow the pattern: `{tool-name}-form.tsx`
- Player components are wrapped in iframe layouts for isolation
- Uses shadcn/ui components consistently across the application
- All forms use React hook patterns with proper TypeScript typing

### Deployment

- Designed for deployment on Vercel
- Static export capability with `out/` directory
- EdgeOne configuration present in `edgeone.json`
- Serverless functions in `functions/api/` for backend functionality

## Development Notes

- The project uses Chinese language primarily for UI text
- Analytics integration with custom tracking (analytics.czl.net)
- No test framework currently configured
- ESLint configuration uses Next.js recommended settings
- Uses Turbopack for faster development builds