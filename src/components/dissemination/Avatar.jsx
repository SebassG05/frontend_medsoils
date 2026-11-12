import MediaImage from '../collections/MediaImage'

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
  if (person.photo) {
    return (
      <span className="block shrink-0 overflow-hidden rounded-full" style={box}>
        <MediaImage
          media={{ type: 'photo', src: person.photo.src, alt: '', color: '#e7d7c5', width: size, height: size }}
          alt=""
          sizes={`${size}px`}
          className="h-full w-full"
        />
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
