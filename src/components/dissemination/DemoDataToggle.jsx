import { useSearchParams } from 'react-router-dom'

const STATES = [
  ['', 'Real data'],
  ['0', 'Empty'],
  ['1', 'One'],
  ['4', '4'],
  ['12', 'Demo 12'],
  ['50', '50'],
  ['worst', 'Worst case'],
]

/**
 * DEV ONLY (loaded behind import.meta.env.DEV in DisseminationSection).
 * Swaps the interview dataset at the data boundary via ?demo=interviews&n=…
 * so designers can flip between demo, worst-case, empty and long lists.
 */
export default function DemoDataToggle() {
  const [params, setParams] = useSearchParams()
  const current = params.get('demo') === 'interviews' ? (params.get('n') ?? '12') : ''

  const select = value => {
    setParams(prev => {
      const next = new URLSearchParams(prev)
      if (value) { next.set('demo', 'interviews'); next.set('n', value) } else { next.delete('demo'); next.delete('n') }
      return next
    }, { replace: true })
  }

  return (
    <div
      role="group"
      aria-label="Dev: interview dataset"
      className="fixed bottom-4 left-1/2 z-[90] flex -translate-x-1/2 gap-0.5 rounded-full bg-gray-200/95 p-1 font-sans text-xs shadow-lg"
    >
      {STATES.map(([value, label]) => (
        <button
          key={value || 'real'}
          type="button"
          aria-pressed={current === value}
          onClick={() => select(value)}
          className={`rounded-full px-3 py-1.5 font-medium ${current === value ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'}`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
