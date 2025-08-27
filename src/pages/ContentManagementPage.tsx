import React from 'react'
import { FileText, AlertCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'

export function ContentManagementPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">Content Management</h1>
        <p className="text-gray-600 mt-1">Manage your blog posts and content</p>
      </div>
      
      <Card className="text-center py-12">
        <CardContent>
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full">
              <FileText className="h-12 w-12 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Content Management</h2>
            <p className="text-gray-600 max-w-md">
              Content management features are being enhanced for the new e-commerce platform.
            </p>
            <div className="flex items-center gap-2 text-sm text-indigo-600 bg-indigo-50 px-4 py-2 rounded-lg">
              <AlertCircle className="h-4 w-4" />
              <span>Focus on e-commerce functionality - content features coming soon</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}