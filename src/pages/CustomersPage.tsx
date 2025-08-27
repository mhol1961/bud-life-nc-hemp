import React, { useState, useEffect } from 'react'
import { Users, AlertCircle, Upload, FileText, Trash2, Download, Mail, Phone, MapPin, Calendar } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { supabase } from '@/lib/supabase'
import { formatCurrency } from '@/lib/utils'

interface Customer {
  id: string
  email: string
  first_name: string
  last_name: string
  phone?: string
  address?: string
  city?: string
  state?: string
  zip_code?: string
  date_of_birth?: string
  total_orders?: number
  total_spent?: number
  last_order_date?: string
  source?: string
  created_at: string
}

interface CSVRow {
  email: string
  first_name: string
  last_name: string
  phone?: string
  address?: string
  city?: string
  state?: string
  zip_code?: string
  date_of_birth?: string
}

export function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [uploadResults, setUploadResults] = useState<{success: number, errors: string[]} | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([])

  useEffect(() => {
    loadCustomers()
  }, [])

  const loadCustomers = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setCustomers(data || [])
    } catch (err: any) {
      console.error('Failed to load customers:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const parseCSV = (text: string): CSVRow[] => {
    const lines = text.trim().split('\n')
    if (lines.length < 2) throw new Error('CSV must have at least a header row and one data row')
    
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/["']/g, ''))
    const rows: CSVRow[] = []
    
    // Required headers mapping
    const headerMap = {
      email: ['email', 'email_address', 'e-mail'],
      first_name: ['first_name', 'firstname', 'fname', 'first'],
      last_name: ['last_name', 'lastname', 'lname', 'last'],
      phone: ['phone', 'phone_number', 'mobile', 'tel'],
      address: ['address', 'street', 'address1'],
      city: ['city'],
      state: ['state', 'region', 'province'],
      zip_code: ['zip', 'zip_code', 'zipcode', 'postal_code'],
      date_of_birth: ['date_of_birth', 'dob', 'birthdate', 'birth_date']
    }
    
    // Find column indices
    const columnIndices: Record<string, number> = {}
    for (const [field, possibleHeaders] of Object.entries(headerMap)) {
      const index = headers.findIndex(h => possibleHeaders.includes(h))
      if (index !== -1) columnIndices[field] = index
    }
    
    // Check for required fields
    if (!columnIndices.email || !columnIndices.first_name || !columnIndices.last_name) {
      throw new Error('CSV must contain email, first_name, and last_name columns')
    }
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/["']/g, ''))
      if (values.length < headers.length) continue // Skip incomplete rows
      
      const row: CSVRow = {
        email: values[columnIndices.email] || '',
        first_name: values[columnIndices.first_name] || '',
        last_name: values[columnIndices.last_name] || ''
      }
      
      // Add optional fields if present
      if (columnIndices.phone) row.phone = values[columnIndices.phone]
      if (columnIndices.address) row.address = values[columnIndices.address]
      if (columnIndices.city) row.city = values[columnIndices.city]
      if (columnIndices.state) row.state = values[columnIndices.state]
      if (columnIndices.zip_code) row.zip_code = values[columnIndices.zip_code]
      if (columnIndices.date_of_birth) row.date_of_birth = values[columnIndices.date_of_birth]
      
      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (emailRegex.test(row.email) && row.first_name && row.last_name) {
        rows.push(row)
      }
    }
    
    return rows
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    
    try {
      setUploading(true)
      setError('')
      setUploadResults(null)
      
      const text = await file.text()
      const rows = parseCSV(text)
      
      if (rows.length === 0) {
        throw new Error('No valid customer data found in file')
      }
      
      // Import customers to database
      const errors: string[] = []
      let successCount = 0
      
      for (const row of rows) {
        try {
          const { error } = await supabase
            .from('customers')
            .upsert({
              ...row,
              source: 'csv_import',
              total_orders: 0,
              total_spent: 0
            }, {
              onConflict: 'email',
              ignoreDuplicates: false
            })
          
          if (error) {
            errors.push(`Error importing ${row.email}: ${error.message}`)
          } else {
            successCount++
          }
        } catch (err: any) {
          errors.push(`Error importing ${row.email}: ${err.message}`)
        }
      }
      
      setUploadResults({ success: successCount, errors })
      await loadCustomers() // Refresh the customer list
      
    } catch (err: any) {
      setError(err.message || 'Failed to process file')
    } finally {
      setUploading(false)
      if (event.target) event.target.value = '' // Reset file input
    }
  }

  const exportTemplate = () => {
    const headers = 'email,first_name,last_name,phone,address,city,state,zip_code,date_of_birth\n'
    const example = 'john@example.com,John,Doe,555-123-4567,123 Main St,Anytown,CA,12345,1990-01-01\n'
    const csvContent = headers + example
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'customer_import_template.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const filteredCustomers = customers.filter(customer =>
    searchQuery === '' ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    `${customer.first_name} ${customer.last_name}`.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">Customer Management</h1>
        <p className="text-gray-600 mt-1">Manage your customer relationships and import leads</p>
      </div>

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Import Customer Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => document.getElementById('csv-upload')?.click()}
                disabled={uploading}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload CSV/Excel
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={exportTemplate}>
                <Download className="h-4 w-4 mr-2" />
                Download Template
              </Button>
            </div>
            <input
              id="csv-upload"
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileUpload}
              className="hidden"
            />
            <p className="text-sm text-gray-600">
              Upload a CSV or Excel file with customer data. Required columns: email, first_name, last_name. 
              Optional: phone, address, city, state, zip_code, date_of_birth.
            </p>
          </div>

          {uploadResults && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {uploadResults.success} imported successfully
                </Badge>
                {uploadResults.errors.length > 0 && (
                  <Badge variant="destructive">
                    {uploadResults.errors.length} errors
                  </Badge>
                )}
              </div>
              {uploadResults.errors.length > 0 && (
                <details className="text-sm">
                  <summary className="cursor-pointer text-red-600 font-medium">
                    View errors ({uploadResults.errors.length})
                  </summary>
                  <div className="mt-2 space-y-1">
                    {uploadResults.errors.slice(0, 5).map((error, index) => (
                      <div key={index} className="text-red-600">{error}</div>
                    ))}
                    {uploadResults.errors.length > 5 && (
                      <div className="text-gray-500">...and {uploadResults.errors.length - 5} more</div>
                    )}
                  </div>
                </details>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Customer List */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Customers ({customers.length})
            </CardTitle>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Search customers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-3 py-1 border rounded-md text-sm w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-gray-600">Loading customers...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-600">{error}</p>
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                {searchQuery ? 'No customers match your search' : 'No customers found. Import some customer data to get started.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left p-3 font-medium">Customer</th>
                    <th className="text-left p-3 font-medium">Contact</th>
                    <th className="text-left p-3 font-medium">Location</th>
                    <th className="text-left p-3 font-medium">Orders</th>
                    <th className="text-left p-3 font-medium">Total Spent</th>
                    <th className="text-left p-3 font-medium">Source</th>
                    <th className="text-left p-3 font-medium">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <div>
                          <div className="font-medium">
                            {customer.first_name} {customer.last_name}
                          </div>
                          <div className="text-sm text-gray-600">{customer.email}</div>
                        </div>
                      </td>
                      <td className="p-3">
                        {customer.phone && (
                          <div className="flex items-center gap-1 text-sm">
                            <Phone className="h-4 w-4 text-gray-400" />
                            {customer.phone}
                          </div>
                        )}
                      </td>
                      <td className="p-3">
                        {customer.city && customer.state && (
                          <div className="flex items-center gap-1 text-sm">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            {customer.city}, {customer.state}
                          </div>
                        )}
                      </td>
                      <td className="p-3">
                        <Badge variant="secondary">
                          {customer.total_orders || 0}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <span className="font-medium text-green-600">
                          {formatCurrency(customer.total_spent || 0)}
                        </span>
                      </td>
                      <td className="p-3">
                        <Badge 
                          variant={customer.source === 'csv_import' ? 'outline' : 'secondary'}
                          className={customer.source === 'csv_import' ? 'border-blue-200 text-blue-700 bg-blue-50' : ''}
                        >
                          {customer.source || 'direct'}
                        </Badge>
                      </td>
                      <td className="p-3 text-sm text-gray-600">
                        {new Date(customer.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}