import React from 'react'
import { Settings, AlertCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'

export function SettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Configure your application settings</p>
      </div>
      
      <Card className="text-center py-12">
        <CardContent>
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 bg-gradient-to-br from-gray-500 to-slate-600 rounded-full">
              <Settings className="h-12 w-12 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Application Settings</h2>
            <p className="text-gray-600 max-w-md">
              Settings management is being redesigned for the new e-commerce platform with enhanced configuration options.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-lg">
              <AlertCircle className="h-4 w-4" />
              <span>E-commerce configuration settings coming soon</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}