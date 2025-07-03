# Podcast Image Tag Demo

A sample UI demonstrating the power of the podcast image tag for RSS feeds.

## 🎯 What is this?

This tool demonstrates how podcasters can use image tags with purpose tokens to provide different image assets for different use cases in podcast apps. Instead of forcing apps to crop or stretch a single square artwork image, podcasters can specify purpose-built images for different contexts.

## 🚀 Live Demo

**Try it out:** [nathangathright.github.io/podcastimage/](https://nathangathright.github.io/podcastimages/)

**Video walkthrough:** [YouTube Demo](https://www.youtube.com/watch?v=5-ntFwX-u_Y)

## 💡 The Problem

Current podcast RSS feeds typically only provide a single square artwork image. This creates issues when apps need different aspect ratios:

- **Apple Podcasts** uses 3:4 portrait images for full-page show art and now-playing screens
- **Social sharing** works best with 16:9 landscape images  
- **Show pages** may benefit from different compositions than episode art

Apps either have to:
- Crop images awkwardly
- Ask podcasters for separate assets (like Apple's layered PSD requirement)
- Use suboptimal image presentations

## ✨ The Solution

The podcast image tag allows podcasters to specify multiple images with different **purpose tokens**:

```xml
<podcast:image purpose="artwork" href="square-image.jpg" />
<podcast:image purpose="social" href="landscape-image.jpg" />
<podcast:image purpose="canvas" href="portrait-image.jpg" />
```

### Purpose Tokens

- `artwork` - 1:1 aspect ratio (traditional square podcast art)
- `social` - 16:9 aspect ratio (optimized for social media sharing)
- `canvas` - 3:4 aspect ratio (portrait orientation for full-screen displays)

## 🎮 How to Use the Demo

1. **Upload images** - Drag and drop images for different purposes
2. **Preview contexts** - See how your images look in different app contexts:
   - Show page layout
   - Now playing screen
   - Social sharing preview
3. **Generate XML** - Click the "code" button to get sample RSS XML
4. **Copy and implement** - Use the generated XML in your podcast RSS feed

## 🔧 For Podcast App Developers

Anyone can define custom purpose tokens for their app. Simply:

1. Choose a purpose token name
2. Document your requirements (aspect ratio, resolution, file type, safe areas)
3. Look for images with your purpose token in RSS feeds
4. Implement the enhanced experience in your app

## 🤝 Contributing

This project serves as a reference implementation for the podcast image tag specification. Feel free to fork, modify, or use as inspiration for your own implementations.

---

*For more information about podcast namespace extensions, visit the [Podcast Namespace](https://github.com/Podcastindex-org/podcast-namespace).* 