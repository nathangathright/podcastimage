import './style.css'
import '@pqina/pintura/pintura.css'
import { openDefaultEditor } from '@pqina/pintura'

const app = document.querySelector('#app')
app.innerHTML = `
  <div class="sidebar">
    <div class="dropzone" id="dropzone-square" data-type="square">
      <div>Square Artwork<br><small>(1:1)</small></div>
      <input type="file" accept="image/*" style="display:none" />
      <img style="display:none" />
      <button type="button" class="edit-btn" style="display:none">Edit</button>
    </div>
    <div class="dropzone" id="dropzone-portrait" data-type="portrait">
      <div>Portrait Artwork<br><small>(3:4)</small></div>
      <input type="file" accept="image/*" style="display:none" />
      <img style="display:none" />
      <button type="button" class="edit-btn" style="display:none">Edit</button>
    </div>
    <div class="dropzone" id="dropzone-landscape" data-type="landscape">
      <div>Landscape Artwork<br><small>(16:9)</small></div>
      <input type="file" accept="image/*" style="display:none" />
      <img style="display:none" />
      <button type="button" class="edit-btn" style="display:none">Edit</button>
    </div>
  </div>
  <div class="main">
    <div class="skeleton-section" id="show-page">
      <div class="skeleton-artwork" id="show-artwork"></div>
      <div class="nowplaying-meta">
          <div class="skeleton-title" style="width:60%;height:1.5rem;"></div>
          <div class="skeleton-text" style="width:40%;height:1rem;"></div>
          <div class="skeleton-text" style="width:100%;height:0.75rem;"></div>
          <div class="skeleton-text" style="width:100%;height:0.75rem;"></div>
          <div class="skeleton-text" style="width:100%;height:0.75rem;"></div>
      </div>
      <div class="skeleton-episodes-list">
        <div class="skeleton-episode">
          <div class="skeleton-episode-art"></div>
          <div class="skeleton-episode-meta">
            <div class="skeleton-title" style="width:80%;height:1rem;"></div>
            <div class="skeleton-text" style="width:60%;height:0.75rem;"></div>
          </div>
        </div>
        <div class="skeleton-episode">
          <div class="skeleton-episode-art"></div>
          <div class="skeleton-episode-meta">
            <div class="skeleton-title" style="width:80%;height:1rem;"></div>
            <div class="skeleton-text" style="width:60%;height:0.75rem;"></div>
          </div>
        </div>
        <div class="skeleton-episode">
          <div class="skeleton-episode-art"></div>
          <div class="skeleton-episode-meta">
            <div class="skeleton-title" style="width:80%;height:1rem;"></div>
            <div class="skeleton-text" style="width:60%;height:0.75rem;"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="skeleton-section" id="now-playing">
      <div class="nowplaying-artwork-row">
        <div class="skeleton-artwork" id="nowplaying-artwork"></div>
      </div>
      <div class="nowplaying-content">
        <div class="nowplaying-meta">
          <div class="skeleton-title" style="width:60%;height:1.5rem;"></div>
          <div class="skeleton-text" style="width:40%;height:1rem;"></div>
        </div>
        <div class="nowplaying-progress">
          <div class="skeleton-progress-bar"></div>
          <div class="nowplaying-progress-labels">
            <div class="skeleton-text" style="width:2.5rem;height:0.75rem;"></div>
            <div class="skeleton-text" style="width:2.5rem;height:0.75rem;"></div>
          </div>
        </div>
        <div class="nowplaying-controls">
          <div class="skeleton-btn skeleton-btn-skip"></div>
          <div class="skeleton-btn skeleton-btn-play"></div>
          <div class="skeleton-btn skeleton-btn-skip"></div>
        </div>
        <div class="nowplaying-more-btns">
          <div class="skeleton-btn skeleton-btn-small"></div>
          <div class="skeleton-btn skeleton-btn-small"></div>
          <div class="skeleton-btn skeleton-btn-small"></div>
        </div>
      </div>
    </div>
    <div class="skeleton-section" id="social-preview">
      <div class="skeleton-landscape" id="social-landscape"></div>
      <div class="skeleton-lower-third">
        <div class="skeleton-title"></div>
        <div class="skeleton-text"></div>
      </div>
    </div>
  </div>
`

// Helper for dropzone logic
function setupDropzone(dropzoneId, aspect, onImage) {
  const dz = document.getElementById(dropzoneId)
  const input = dz.querySelector('input[type="file"]')
  const img = dz.querySelector('img')
  const editBtn = dz.querySelector('.edit-btn')

  dz.addEventListener('click', (e) => {
    if (e.target === editBtn) return // handled below
    input.click()
  })

  dz.addEventListener('dragover', (e) => {
    e.preventDefault(); dz.classList.add('dragover')
  })
  dz.addEventListener('dragleave', (e) => {
    dz.classList.remove('dragover')
  })
  dz.addEventListener('drop', (e) => {
    e.preventDefault(); dz.classList.remove('dragover')
    if (e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0])
  })
  input.addEventListener('change', () => {
    if (input.files.length) handleFile(input.files[0])
  })
  editBtn.addEventListener('click', (e) => {
    e.stopPropagation()
    if (!img.src) return
    openEditor(img.src)
  })

  function handleFile(file) {
    openEditor(file)
  }

  function openEditor(src) {
    const editor = openDefaultEditor({
      src,
      imageCropAspectRatio: aspect,
    })
    editor.on('process', (imageState) => {
      img.src = URL.createObjectURL(imageState.dest)
      img.style.display = 'block'
      editBtn.style.display = 'inline-block'
      onImage(img.src)
    })
  }
}

// State for images
let squareArt = null
let landscapeArt = null
let portraitArt = null

function updateCodeButtonVisibility() {
  codeButton.style.display = (squareArt || landscapeArt || portraitArt) ? 'block' : 'none'
}

function getImageType(src) {
  // Try to guess type from src (object URL), fallback to jpeg
  if (src && src.startsWith('blob:')) return 'image/jpeg'
  if (src && src.match(/\.png$/i)) return 'image/png'
  if (src && src.match(/\.jpe?g$/i)) return 'image/jpeg'
  if (src && src.match(/\.webp$/i)) return 'image/webp'
  return 'image/jpeg'
}

function getXmlTags() {
  const tags = []
  if (squareArt) tags.push(`<podcast:image\n  purpose="artwork"\n  type="${getImageType(squareArt)}"\n  aspect-ratio="1/1"\n  href="${squareArt}"\n/>`)
  if (landscapeArt) tags.push(`<podcast:image\n  purpose="artwork landscape"\n  type="${getImageType(landscapeArt)}"\n  aspect-ratio="16/9"\n  href="${landscapeArt}"\n/>`)
  if (portraitArt) tags.push(`<podcast:image\n  purpose="artwork portrait"\n  type="${getImageType(portraitArt)}"\n  aspect-ratio="3/4"\n  href="${portraitArt}"\n/>`)
  return tags.join('\n\n')
}

function highlightXml(xml) {
  // Improved XML syntax highlighter: do not add a slash at the start of self-closing tags
  return xml.replace(/(&lt;|<)([\w:-]+)([^>]*?)(\/?)(>|&gt;)/g, (m, lt, tag, attrs, selfclose, gt) => {
    let out = `<span class="xml-tag">${lt}${tag}</span>`
    if (attrs) {
      out += attrs.replace(/([\w:-]+)(=)("[^"]*")/g, (m, attr, eq, val) =>
        ` <span class="xml-attr">${attr}</span>${eq}<span class="xml-value">${val}</span>`
      )
    }
    out += selfclose ? `<span class="xml-tag">/</span>` : ''
    out += `<span class="xml-tag">${gt}</span>`
    return out
  })
}

// Setup dropzones
setupDropzone('dropzone-square', 1, (src) => {
  squareArt = src
  document.getElementById('show-artwork').style.backgroundImage = `url('${src}')`
  document.getElementById('show-artwork').style.backgroundSize = 'cover'
  document.getElementById('show-artwork').style.backgroundPosition = 'center'
  document.getElementById('nowplaying-artwork').style.backgroundImage = `url('${src}')`
  document.getElementById('nowplaying-artwork').style.backgroundSize = 'cover'
  document.getElementById('nowplaying-artwork').style.backgroundPosition = 'center'
  // If no landscapeArt, use squareArt for social preview
  if (!landscapeArt) {
    document.getElementById('social-landscape').style.backgroundImage = `url('${src}')`
    document.getElementById('social-landscape').style.backgroundSize = 'cover'
    document.getElementById('social-landscape').style.backgroundPosition = 'center'
  }
  updateCodeButtonVisibility()
})
setupDropzone('dropzone-landscape', 16/9, (src) => {
  landscapeArt = src
  document.getElementById('social-landscape').style.backgroundImage = `url('${src}')`
  document.getElementById('social-landscape').style.backgroundSize = 'cover'
  document.getElementById('social-landscape').style.backgroundPosition = 'center'
  document.getElementById('nowplaying-landscape').style.backgroundImage = `url('${src}')`
  document.getElementById('nowplaying-landscape').style.backgroundSize = 'cover'
  document.getElementById('nowplaying-landscape').style.backgroundPosition = 'center'
  updateCodeButtonVisibility()
})
setupDropzone('dropzone-portrait', 3/4, (src) => {
  portraitArt = src
  // Show immersive mode in Now Playing
  const nowPlaying = document.getElementById('now-playing')
  nowPlaying.classList.add('now-playing-immersive')
  // Add/replace immersive background
  let bg = nowPlaying.querySelector('.immersive-bg')
  if (!bg) {
    bg = document.createElement('div')
    bg.className = 'immersive-bg'
    nowPlaying.prepend(bg)
  }
  bg.style.backgroundImage = `url('${src}')`
  // Show immersive mode in Show Page
  const showPage = document.getElementById('show-page')
  showPage.classList.add('show-page-immersive')
  // Add/replace immersive background
  let showBG = showPage.querySelector('.immersive-bg')
  if (!showBG) {
    showBG = document.createElement('div')
    showBG.className = 'immersive-bg'
    showPage.prepend(showBG)
  }
  showBG.style.backgroundImage = `url('${src}')`
  updateCodeButtonVisibility()
})

// Add floating code button and modal dialog
const codeButton = document.createElement('button')
codeButton.className = 'floating-code-btn'
codeButton.textContent = 'Code'
codeButton.style.display = 'none'
document.body.appendChild(codeButton)

const codeDialog = document.createElement('div')
codeDialog.className = 'code-dialog-overlay'
codeDialog.innerHTML = `
  <div class="code-dialog" role="dialog" aria-modal="true" tabindex="-1">
    <button class="code-dialog-close" aria-label="Close">×</button>
    <h2>Code</h2>
    <pre class="code-block" style="margin-top:1.5rem;"></pre>
  </div>
`
codeDialog.style.display = 'none'
document.body.appendChild(codeDialog)

function openCodeDialog() {
  codeDialog.style.display = 'flex'
  codeDialog.querySelector('.code-dialog').focus()
  const xml = getXmlTags()
  const codeBlock = codeDialog.querySelector('.code-block')
  // Escape HTML for display
  const escaped = xml.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  codeBlock.innerHTML = highlightXml(escaped)
  // Add copy button if not present
  if (!codeDialog.querySelector('.copy-code-btn')) {
    const copyBtn = document.createElement('button')
    copyBtn.className = 'copy-code-btn'
    copyBtn.textContent = 'Copy'
    copyBtn.type = 'button'
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(xml)
      copyBtn.textContent = 'Copied!'
      setTimeout(() => { copyBtn.textContent = 'Copy' }, 1200)
    })
    codeBlock.parentElement.appendChild(copyBtn)
  }
}
function closeCodeDialog() {
  codeDialog.style.display = 'none'
}
codeButton.addEventListener('click', openCodeDialog)
codeDialog.querySelector('.code-dialog-close').addEventListener('click', closeCodeDialog)
codeDialog.addEventListener('click', (e) => {
  if (e.target === codeDialog) closeCodeDialog()
})
document.addEventListener('keydown', (e) => {
  if (codeDialog.style.display === 'flex' && (e.key === 'Escape' || e.key === 'Esc')) {
    closeCodeDialog()
  }
})
