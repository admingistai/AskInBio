import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function ErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Oops! Something went wrong
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          We encountered an error while processing your request.
        </p>
        <div className="space-x-4">
          <Button asChild>
            <Link href="/dashboard">
              Go to Dashboard
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">
              Go Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}