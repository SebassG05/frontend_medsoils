import Wave from '../shared/Wave'

/**
 * The pale-sky gradient + white wave used at the top of /resources, sized for
 * sub-pages. Content (breadcrumbs, header) sits on top and can overlap the wave.
 */
export default function SkyBand({ children }) {
  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-64 sm:h-80 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #dcf6f8 0%, #edfcfd 50%, #dcf6f8 100%)' }}
      >
        <Wave className="absolute bottom-0 left-0 h-16" />
      </div>
      <div className="relative">{children}</div>
    </div>
  )
}
