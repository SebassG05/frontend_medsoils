import { useState } from 'react'
import { imageSources } from '../../utils/media'

/**
 * <picture> for a collection photo or a video poster: AVIF → WebP → JPEG,
 * responsive srcset, intrinsic width/height (no CLS) and the media's dominant
 * colour behind it until the image has decoded.
 *
 * `priority` is for the one image that is likely the LCP element.
 */
export default function MediaImage({ media, sizes, priority = false, alt, className = '', imgClassName = '' }) {
  const [loaded, setLoaded] = useState(false)
  const src = media.type === 'video' ? media.poster : media.src
  const { avif, webp, fallback } = imageSources(src)

  return (
    <picture className={`block ${className}`} style={{ backgroundColor: media.color }}>
      <source type="image/avif" srcSet={avif} sizes={sizes} />
      <source type="image/webp" srcSet={webp} sizes={sizes} />
      <img
        src={fallback}
        alt={alt ?? media.alt}
        width={media.width}
        height={media.height}
        sizes={sizes}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        onLoad={() => setLoaded(true)}
        draggable={false}
        className={`block h-full w-full object-cover transition-opacity duration-[var(--motion-slow)] ease-out-expo motion-reduce:transition-none ${loaded ? 'opacity-100' : 'opacity-0'} ${imgClassName}`}
      />
    </picture>
  )
}
