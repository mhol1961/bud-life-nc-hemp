import React from 'react'
import { Image, AlertCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'

export function MediaLibraryPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">Media Library</h1>
        <p className="text-gray-600 mt-1">Manage your images and media files</p>
      </div>
      
      <Card className="text-center py-12">
        <CardContent>
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full">
              <Image className="h-12 w-12 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Media Library</h2>
            <p className="text-gray-600 max-w-md">
              Media management features are being optimized for the e-commerce platform.
            </p>
            <div className="flex items-center gap-2 text-sm text-teal-600 bg-teal-50 px-4 py-2 rounded-lg">
              <AlertCircle className="h-4 w-4" />
              <span>Media features being integrated with product management</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}