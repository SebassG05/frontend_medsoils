import { COPY } from '../../data/dissemination/copy'

/**
 * Self-hosted audio interview. The native <audio controls> is keyboard and
 * screen-reader accessible in every browser; nothing downloads until play.
 */
export default function AudioPlayer({ src, title, captions = [] }) {
  return (
    <div className="rounded-[var(--radius-card)] border border-gray-200 bg-white p-4 sm:p-5 shadow-[var(--shadow-card)]">
      <audio controls preload="none" src={src} aria-label={title} className="w-full">
        {captions.map(c => (
          <track key={c.src} kind="captions" src={c.src} srcLang={c.srclang} label={c.label} />
        ))}
        {COPY.player.audioFallback}
      </audio>
    </div>
  )
}
