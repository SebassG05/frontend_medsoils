import { useState } from 'react'
import { imageSources } from '../../utils/media'

const initials = name =>
  name
    .replace(/\b(Prof|Dr|Mr|Mrs|Ms)\.?\s+/gi, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join('')

/** Interviewee photo, or their initials when there is none. Decorative next to the name. */
export default function Avatar({ person, size = 40 }) {
  const box = { width: size, height: size }
  const [failed, setFailed] = useState(false)
  if (person.photo && !failed) {
    const { webp, fallback } = imageSources(person.photo.src)
    return (
      <span className="block shrink-0 overflow-hidden rounded-full bg-orange-100" style={box}>
        <picture className="block h-full w-full">
          <source type="image/webp" srcSet={webp} sizes={`${size}px`} />
          <img
            src={fallback}
            alt=""
            width={size}
            height={size}
            loading="lazy"
            decoding="async"
            onError={() => setFailed(true)}
            className="block h-full w-full object-cover"
          />
        </picture>
      </span>
    )
  }
  return (
    <span
      aria-hidden="true"
      className="flex shrink-0 items-center justify-center rounded-full bg-orange-100 font-semibold text-orange-800"
      style={{ ...box, fontSize: Math.round(size * 0.36) }}
    >
      {initials(person.name)}
    </span>
  )
}
