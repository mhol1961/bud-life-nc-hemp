import React from 'react'
import { Share2, AlertCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'

export function SocialHubPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">Social Hub</h1>
        <p className="text-gray-600 mt-1">Manage your social media presence</p>
      </div>
      
      <Card className="text-center py-12">
        <CardContent>
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full">
              <Share2 className="h-12 w-12 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Social Hub</h2>
            <p className="text-gray-600 max-w-md">
              Social media management features are being redesigned for better e-commerce integration.
            </p>
            <div className="flex items-center gap-2 text-sm text-violet-600 bg-violet-50 px-4 py-2 rounded-lg">
              <AlertCircle className="h-4 w-4" />
              <span>Social features being enhanced for product promotion</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}