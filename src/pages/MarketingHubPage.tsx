import React from 'react'
import { Megaphone, AlertCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'

export function MarketingHubPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">Marketing Hub</h1>
        <p className="text-gray-600 mt-1">Manage your marketing campaigns</p>
      </div>
      
      <Card className="text-center py-12">
        <CardContent>
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full">
              <Megaphone className="h-12 w-12 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Marketing Hub</h2>
            <p className="text-gray-600 max-w-md">
              Marketing automation features are being integrated with the new e-commerce system.
            </p>
            <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 px-4 py-2 rounded-lg">
              <AlertCircle className="h-4 w-4" />
              <span>E-commerce priority - marketing tools coming soon</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}