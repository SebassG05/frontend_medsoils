import { useParams } from 'react-router-dom'

/** /dissemination/:slug — interview detail. Placeholder until the detail task lands. */
export default function InterviewPage() {
  const { slug } = useParams()
  return (
    <div className="min-h-screen bg-white">
      <h1 className="text-4xl font-extrabold text-gray-900 text-center pt-24">{slug}</h1>
    </div>
  )
}
