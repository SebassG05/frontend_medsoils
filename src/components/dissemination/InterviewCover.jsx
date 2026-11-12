import { useState } from 'react'
import { FileText, Headphones, Play } from 'lucide-react'
import MediaImage from '../collections/MediaImage'
import { parseYouTubeId, youtubeThumb } from '../../utils/youtube'

const TYPE_ICON = { video: Play, audio: Headphones, text: FileText }

/**
 * The picture for an interview, filling its (aspect-ratio-sized) parent:
 * 1. `cover.src` → responsive AVIF/WebP via MediaImage;
 * 2. otherwise a YouTube `mediaUrl` → its thumbnail (WebP, JPEG fallback);
 * 3. otherwise a branded block in `cover.color` with the type icon.
 * `cover.color` is always the background, so nothing jumps while loading.
 */
export default function InterviewCover({ interview, sizes, priority = false, size = 'hq', className = 'relative', imgClassName = '' }) {
  const { cover, type, mediaUrl } = interview
  const youtubeId = parseYouTubeId(mediaUrl)
  const [thumbSize, setThumbSize] = useState(size)

  let content
  if (cover.src) {
    content = (
      <MediaImage
        media={{ type: 'photo', src: cover.src, alt: cover.alt, color: cover.color, width: cover.width, height: cover.height }}
        sizes={sizes}
        priority={priority}
        className="h-full w-full"
        imgClassName={imgClassName}
      />
    )
  } else if (youtubeId) {
    const thumb = youtubeThumb(youtubeId, thumbSize)
    content = (
      <picture className="block h-full w-full">
        <source type="image/webp" srcSet={thumb.webp} />
        <img
          src={thumb.jpg}
          alt={cover.alt}
          width={thumbSize === 'maxres' ? 1280 : 480}
          height={thumbSize === 'maxres' ? 720 : 360}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          fetchpriority={priority ? 'high' : 'auto'}
          // maxres doesn't exist for every video; YouTube then serves a 120px grey image.
          onLoad={e => { if (thumbSize === 'maxres' && e.currentTarget.naturalWidth <= 120) setThumbSize('hq') }}
          onError={() => thumbSize === 'maxres' && setThumbSize('hq')}
          draggable={false}
          className={`block h-full w-full object-cover ${imgClassName}`}
        />
      </picture>
    )
  } else {
    const Icon = TYPE_ICON[type]
    content = (
      <div role="img" aria-label={cover.alt} className="flex h-full w-full items-center justify-center bg-gradient-to-br from-white/15 to-black/25">
        <Icon aria-hidden="true" className="size-1/5 max-h-24 text-white/35" strokeWidth={1.4} />
      </div>
    )
  }

  return (
    // `className` positions the box (default `relative`; cards pass `absolute inset-0` inside an aspect-ratio parent).
    <div className={`overflow-hidden ${className}`} style={{ backgroundColor: cover.color }}>
      {content}
    </div>
  )
}
