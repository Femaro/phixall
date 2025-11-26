# Mobile Web Favicon Setup

## Overview
The mobile web favicon configuration has been updated in the codebase. You need to create the actual favicon image files and place them in the `public` directory.

## Required Files

Place these files in the `public` directory:

1. **favicon.ico** - Standard favicon (16x16, 32x32, 48x48 sizes)
2. **icon.svg** - SVG icon (already exists, but ensure it's the latest design)
3. **apple-icon.svg** - Apple touch icon SVG (already exists)
4. **apple-touch-icon.png** - PNG version for Apple devices (180x180px)
5. **icon-192.png** - PWA icon (192x192px)
6. **icon-512.png** - PWA icon (512x512px)
7. **favicon-32x32.png** - Standard favicon (32x32px)
8. **favicon-16x16.png** - Standard favicon (16x16px)

## Image Specifications

### Apple Touch Icon
- **Size**: 180x180px
- **Format**: PNG
- **Background**: Can be transparent or solid color (#7C3AED)
- **Content**: Phixall logo/icon

### PWA Icons
- **icon-192.png**: 192x192px, PNG format
- **icon-512.png**: 512x512px, PNG format
- **Background**: Solid color or transparent
- **Content**: Phixall logo/icon

### Standard Favicons
- **favicon-16x16.png**: 16x16px, PNG format
- **favicon-32x32.png**: 32x32px, PNG format
- **favicon.ico**: Multi-size ICO file (16x16, 32x32, 48x48)

## Generation Tools

You can use these tools to generate favicons:
- [Favicon Generator](https://realfavicongenerator.net/)
- [Favicon.io](https://favicon.io/)
- [Canva](https://www.canva.com/) - Design and export

## Current Configuration

The following files are already configured in the codebase:

### `src/app/metadata.ts`
- Icon configuration for all sizes
- Apple touch icon references
- PWA manifest icons

### `src/app/layout.tsx`
- HTML head tags for all favicon types
- Apple touch icon link
- Manifest link

### `public/manifest.json`
- PWA icon references
- Theme color: #7C3AED

## Testing

After adding the files, test on:
1. **Desktop browsers**: Chrome, Firefox, Safari, Edge
2. **Mobile browsers**: iOS Safari, Chrome Mobile
3. **PWA**: Add to home screen on mobile devices
4. **Bookmarks**: Check favicon appears in bookmarks

## Notes

- The existing `icon.svg` and `apple-icon.svg` files should work, but PNG versions are recommended for better mobile browser compatibility
- Ensure all images use the Phixall brand colors (#7C3AED primary)
- Test on actual mobile devices to verify favicon display
- Clear browser cache if favicons don't update immediately

