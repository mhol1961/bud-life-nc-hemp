import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Shield, Download, Eye, ChevronDown, ChevronUp, CheckCircle, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface LabResult {
  parameter: string
  result: string
  limit: string
  status: 'pass' | 'fail' | 'not-tested'
  unit?: string
}

interface COAData {
  id: string
  productName: string
  batchNumber: string
  testDate: string
  labName: string
  certificateNumber: string
  pdfUrl: string
  imageUrl: string
  cannabinoids: LabResult[]
  pesticides: LabResult[]
  heavyMetals: LabResult[]
  microbials: LabResult[]
  residualSolvents: LabResult[]
}

const coaData: COAData[] = [
  {
    id: 'jealousy-aaa-indoor',
    productName: 'Jealousy Strain - AAA Indoor THCA',
    batchNumber: 'JLS-2024-001',
    testDate: '2024-01-15',
    labName: 'Green Scientific Labs',
    certificateNumber: 'GSL-COA-2024-001567',
    pdfUrl: '/coa/Jealousy AAA Indoor THCA.pdf',
    imageUrl: '/images/jealousy_flower.png',
    cannabinoids: [
      { parameter: 'THCA', result: '24.8', limit: 'N/A', status: 'pass', unit: '%' },
      { parameter: 'THC', result: '0.18', limit: '≤0.3', status: 'pass', unit: '%' },
      { parameter: 'CBD', result: '0.12', limit: 'N/A', status: 'pass', unit: '%' },
      { parameter: 'CBDA', result: '0.08', limit: 'N/A', status: 'pass', unit: '%' },
      { parameter: 'CBG', result: '0.92', limit: 'N/A', status: 'pass', unit: '%' },
      { parameter: 'Total Cannabinoids', result: '26.1', limit: 'N/A', status: 'pass', unit: '%' },
    ],
    pesticides: [
      { parameter: 'Abamectin', result: 'ND', limit: '0.1', status: 'pass', unit: 'ppm' },
      { parameter: 'Acephate', result: 'ND', limit: '0.1', status: 'pass', unit: 'ppm' },
      { parameter: 'Acequinocyl', result: 'ND', limit: '0.1', status: 'pass', unit: 'ppm' },
      { parameter: 'Acetamiprid', result: 'ND', limit: '0.1', status: 'pass', unit: 'ppm' },
      { parameter: 'Aldicarb', result: 'ND', limit: '0.1', status: 'pass', unit: 'ppm' },
    ],
    heavyMetals: [
      { parameter: 'Arsenic', result: '<0.02', limit: '0.2', status: 'pass', unit: 'ppm' },
      { parameter: 'Cadmium', result: '<0.02', limit: '0.2', status: 'pass', unit: 'ppm' },
      { parameter: 'Lead', result: '<0.02', limit: '0.5', status: 'pass', unit: 'ppm' },
      { parameter: 'Mercury', result: '<0.01', limit: '0.1', status: 'pass', unit: 'ppm' },
    ],
    microbials: [
      { parameter: 'Total Yeast & Mold', result: '<100', limit: '1000', status: 'pass', unit: 'CFU/g' },
      { parameter: 'E. Coli', result: 'ND', limit: '1', status: 'pass', unit: 'CFU/g' },
      { parameter: 'Salmonella', result: 'ND', limit: '1', status: 'pass', unit: 'CFU/g' },
    ],
    residualSolvents: [
      { parameter: 'Acetone', result: 'ND', limit: '5000', status: 'pass', unit: 'ppm' },
      { parameter: 'Benzene', result: 'ND', limit: '2', status: 'pass', unit: 'ppm' },
      { parameter: 'Butane', result: 'ND', limit: '5000', status: 'pass', unit: 'ppm' },
      { parameter: 'Ethanol', result: 'ND', limit: '5000', status: 'pass', unit: 'ppm' },
    ],
  },
  {
    id: 'gushers-top-shelf',
    productName: 'Gushers Strain - Top Shelf THCA',
    batchNumber: 'GSH-2024-002',
    testDate: '2024-01-18',
    labName: 'Green Scientific Labs',
    certificateNumber: 'GSL-COA-2024-001578',
    pdfUrl: '/coa/Gushers Top Shelf THCA.pdf',
    imageUrl: '/images/gushers_flower.png',
    cannabinoids: [
      { parameter: 'THCA', result: '22.4', limit: 'N/A', status: 'pass', unit: '%' },
      { parameter: 'THC', result: '0.21', limit: '≤0.3', status: 'pass', unit: '%' },
      { parameter: 'CBD', result: '0.09', limit: 'N/A', status: 'pass', unit: '%' },
      { parameter: 'CBDA', result: '0.06', limit: 'N/A', status: 'pass', unit: '%' },
      { parameter: 'CBG', result: '1.18', limit: 'N/A', status: 'pass', unit: '%' },
      { parameter: 'Total Cannabinoids', result: '23.9', limit: 'N/A', status: 'pass', unit: '%' },
    ],
    pesticides: [
      { parameter: 'Abamectin', result: 'ND', limit: '0.1', status: 'pass', unit: 'ppm' },
      { parameter: 'Acephate', result: 'ND', limit: '0.1', status: 'pass', unit: 'ppm' },
      { parameter: 'Acequinocyl', result: 'ND', limit: '0.1', status: 'pass', unit: 'ppm' },
      { parameter: 'Acetamiprid', result: 'ND', limit: '0.1', status: 'pass', unit: 'ppm' },
      { parameter: 'Aldicarb', result: 'ND', limit: '0.1', status: 'pass', unit: 'ppm' },
    ],
    heavyMetals: [
      { parameter: 'Arsenic', result: '<0.02', limit: '0.2', status: 'pass', unit: 'ppm' },
      { parameter: 'Cadmium', result: '<0.02', limit: '0.2', status: 'pass', unit: 'ppm' },
      { parameter: 'Lead', result: '<0.02', limit: '0.5', status: 'pass', unit: 'ppm' },
      { parameter: 'Mercury', result: '<0.01', limit: '0.1', status: 'pass', unit: 'ppm' },
    ],
    microbials: [
      { parameter: 'Total Yeast & Mold', result: '<100', limit: '1000', status: 'pass', unit: 'CFU/g' },
      { parameter: 'E. Coli', result: 'ND', limit: '1', status: 'pass', unit: 'CFU/g' },
      { parameter: 'Salmonella', result: 'ND', limit: '1', status: 'pass', unit: 'CFU/g' },
    ],
    residualSolvents: [
      { parameter: 'Acetone', result: 'ND', limit: '5000', status: 'pass', unit: 'ppm' },
      { parameter: 'Benzene', result: 'ND', limit: '2', status: 'pass', unit: 'ppm' },
      { parameter: 'Butane', result: 'ND', limit: '5000', status: 'pass', unit: 'ppm' },
      { parameter: 'Ethanol', result: 'ND', limit: '5000', status: 'pass', unit: 'ppm' },
    ],
  },
]

function LabResultsTable({ results, title }: { results: LabResult[], title: string }) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="bg-white rounded-xl border border-emerald-100 overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 bg-gradient-to-r from-emerald-50 to-forest-50 hover:from-emerald-100 hover:to-forest-100 transition-colors flex items-center justify-between text-left"
      >
        <h3 className="text-lg font-semibold text-black-900">{title}</h3>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-emerald-600" />
        ) : (
          <ChevronDown className="w-5 h-5 text-emerald-600" />
        )}
      </button>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Parameter
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Result
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Limit
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {results.map((result, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {result.parameter}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {result.result} {result.unit}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {result.limit} {result.unit}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {result.status === 'pass' ? (
                            <>
                              <CheckCircle className="w-4 h-4 text-emerald-500 mr-2" />
                              <span className="text-sm font-medium text-emerald-600">PASS</span>
                            </>
                          ) : (
                            <>
                              <AlertCircle className="w-4 h-4 text-red-500 mr-2" />
                              <span className="text-sm font-medium text-red-600">FAIL</span>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function COACard({ coa }: { coa: COAData }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-2xl shadow-xl border border-emerald-100 overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-forest-700 text-white p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2">{coa.productName}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm opacity-90">
              <div>
                <p><span className="font-medium">Batch:</span> {coa.batchNumber}</p>
                <p><span className="font-medium">Test Date:</span> {coa.testDate}</p>
              </div>
              <div>
                <p><span className="font-medium">Lab:</span> {coa.labName}</p>
                <p><span className="font-medium">Certificate:</span> {coa.certificateNumber}</p>
              </div>
            </div>
          </div>
          <img 
            src={coa.imageUrl} 
            alt={coa.productName}
            className="w-20 h-20 rounded-lg object-cover border-2 border-white/20"
          />
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mt-6">
          <a
            href={coa.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-emerald-700 hover:bg-emerald-50 px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center"
          >
            <Eye className="w-4 h-4 mr-2" />
            View Certificate
          </a>
          <a
            href={coa.pdfUrl}
            download
            className="bg-emerald-800 hover:bg-emerald-900 text-white px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center"
          >
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </a>
          <Link
            to={`/products/${coa.id}`}
            className="bg-transparent border border-white hover:bg-white hover:text-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center"
          >
            View Product
          </Link>
        </div>
      </div>
      
      {/* Results Tables */}
      <div className="p-6 space-y-4">
        <LabResultsTable results={coa.cannabinoids} title="Cannabinoid Profile" />
        <LabResultsTable results={coa.pesticides} title="Pesticide Analysis" />
        <LabResultsTable results={coa.heavyMetals} title="Heavy Metals" />
        <LabResultsTable results={coa.microbials} title="Microbial Analysis" />
        <LabResultsTable results={coa.residualSolvents} title="Residual Solvents" />
      </div>
    </motion.div>
  )
}

export function LabResultsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-forest-50">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/hero/lab_results_testing.jpg" 
            alt="Professional Hemp Laboratory Testing"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/80 to-forest-700/80" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="w-10 h-10" />
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Lab Results & Certificates
            </h1>
            <p className="text-xl lg:text-2xl mb-8 opacity-90 max-w-3xl mx-auto leading-relaxed">
              Complete transparency through third-party lab testing. Every batch is rigorously analyzed 
              for potency, purity, and safety to ensure you receive only the highest quality products.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <div className="bg-white/20 px-6 py-3 rounded-full">
                <span className="font-semibold">✓ Third-Party Tested</span>
              </div>
              <div className="bg-white/20 px-6 py-3 rounded-full">
                <span className="font-semibold">✓ Full Spectrum Analysis</span>
              </div>
              <div className="bg-white/20 px-6 py-3 rounded-full">
                <span className="font-semibold">✓ ISO Certified Labs</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testing Process */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-black-900 mb-6">
              Our Testing Standards
            </h2>
            <p className="text-xl text-forest-600 max-w-3xl mx-auto">
              Every product undergoes comprehensive analysis to ensure compliance, safety, and quality
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { title: 'Cannabinoid Profile', description: 'Complete analysis of all cannabinoids including THCA, THC, CBD, and minor cannabinoids' },
              { title: 'Pesticide Testing', description: 'Screen for over 400 pesticides to ensure products are free from harmful chemicals' },
              { title: 'Heavy Metals', description: 'Test for arsenic, cadmium, lead, and mercury to guarantee product safety' },
              { title: 'Microbial Analysis', description: 'Check for harmful bacteria, yeast, and mold to ensure product purity' },
              { title: 'Residual Solvents', description: 'Verify absence of processing solvents and contaminants' },
            ].map((test, index) => (
              <motion.div
                key={test.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-lg border border-emerald-100 hover:shadow-xl transition-shadow"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-forest-600 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-black-900 mb-3">
                  {test.title}
                </h3>
                <p className="text-forest-600 text-sm leading-relaxed">
                  {test.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* COA Cards */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-black-900 mb-6">
              Current Product Certificates
            </h2>
            <p className="text-xl text-forest-600">
              View detailed lab results for all our premium THCA products
            </p>
          </motion.div>
          
          <div className="space-y-12">
            {coaData.map((coa) => (
              <COACard key={coa.id} coa={coa} />
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-black-900 mb-6">
              Questions About Our Testing?
            </h2>
            <p className="text-xl text-forest-600 mb-8 max-w-3xl mx-auto">
              Our team is here to help you understand our lab results and quality assurance processes.
            </p>
            <Link
              to="/contact"
              className="bg-gradient-to-r from-emerald-600 to-forest-700 hover:from-emerald-700 hover:to-forest-800 text-white px-8 py-4 rounded-lg font-semibold transition-colors inline-flex items-center"
            >
              Contact Our Quality Team
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
