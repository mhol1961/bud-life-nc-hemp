import React from 'react'
import { BarChart3, AlertCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'

export function AnalyticsDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-600 mt-1">Track your business performance</p>
      </div>
      
      <Card className="text-center py-12">
        <CardContent>
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full">
              <BarChart3 className="h-12 w-12 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
            <p className="text-gray-600 max-w-md">
              Advanced analytics features are being developed to track e-commerce performance.
            </p>
            <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-4 py-2 rounded-lg">
              <AlertCircle className="h-4 w-4" />
              <span>E-commerce analytics being integrated</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}