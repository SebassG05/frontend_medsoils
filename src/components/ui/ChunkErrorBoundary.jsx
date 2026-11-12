import { Component } from 'react'

/**
 * Catches a failed lazy-route import (offline, or a stale chunk after a deploy)
 * and shows `fallback(retry)` instead of a blank page. Retrying reloads the
 * page, which also picks up the new chunk names after a deploy.
 */
export default class ChunkErrorBoundary extends Component {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error) {
    console.error(error)
  }

  retry = () => window.location.reload()

  render() {
    if (this.state.failed) {
      return this.props.fallback ? this.props.fallback(this.retry) : <DefaultFallback onRetry={this.retry} />
    }
    return this.props.children
  }
}

function DefaultFallback({ onRetry }) {
  return (
    <div role="alert" className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="text-lg text-gray-700">We couldn’t load this page.</p>
      <button
        type="button"
        onClick={onRetry}
        className="inline-flex min-h-11 items-center px-5 py-2 rounded-full text-sm font-semibold bg-orange-700 text-white hover:bg-orange-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2"
      >
        Try again
      </button>
    </div>
  )
}
