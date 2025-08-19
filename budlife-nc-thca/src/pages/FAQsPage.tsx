import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Shield, Leaf, Scale, Truck, TestTube, HelpCircle, Clock } from 'lucide-react'

interface FAQ {
  id: string
  question: string
  answer: string
  category: string
}

const FAQsPage = () => {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState('all')

  const faqs: FAQ[] = [
    // THCA & Hemp Basics
    {
      id: 'what-is-thca',
      category: 'thca-basics',
      question: 'What is THCA?',
      answer: 'THCA (Tetrahydrocannabinolic Acid) is a natural, non-psychoactive compound found in raw cannabis and hemp plants. It serves as the direct precursor to delta-9 THC. When THCA is exposed to heat through smoking, vaping, or baking (a process called decarboxylation), it transforms into THC, which produces psychoactive effects.'
    },
    {
      id: 'thca-vs-hemp',
      category: 'thca-basics',
      question: 'Is THCA flower the same as hemp flower?',
      answer: 'No, they are different products. THCA flower is specifically bred for high levels of THCA and produces potent psychoactive effects when heated. Hemp flower is typically bred for higher CBD content with very low THCA/THC levels, resulting in mild or non-intoxicating properties. THCA flower is more closely related to traditional cannabis in its effects, while hemp flower is known for wellness benefits without the high.'
    },
    {
      id: 'does-thca-get-high',
      category: 'thca-basics',
      question: 'Does THCA flower get you high?',
      answer: 'THCA itself does not cause psychoactive effects in its raw, unheated state. However, when THCA flower is smoked, vaped, or baked, the heat converts THCA into delta-9 THC, which produces a traditional cannabis high. So consuming THCA flower through these heated methods will produce psychoactive effects.'
    },
    
    // Legality
    {
      id: 'is-thca-legal',
      category: 'legal',
      question: 'Is THCA flower legal?',
      answer: 'THCA flower is federally legal under the 2018 Farm Bill, provided it contains less than 0.3% delta-9 THC by dry weight. This federal compliance allows for production and shipping across most states. However, some states have enacted stricter "total THC" laws that account for potential THCA conversion, so always check your local and state regulations before purchasing or consuming.'
    },
    {
      id: 'federal-compliant',
      category: 'legal',
      question: 'What does "federally compliant THCA flower" mean?',
      answer: 'This means the flower contains less than 0.3% delta-9 THC by dry weight, as required by federal law under the 2018 Farm Bill. Products meeting this standard are legal at the federal level. Lab testing and clear labeling with Certificates of Analysis (COAs) are essential for verifying compliance and ensuring the product meets all legal requirements.'
    },
    {
      id: 'age-requirements',
      category: 'legal',
      question: 'What are the age requirements for purchasing THCA products?',
      answer: 'You must be 21 years or older to purchase THCA products. Age verification is required both when browsing our website and at checkout. This policy ensures compliance with regulations and responsible consumption practices.'
    },

    // Quality & Testing
    {
      id: 'lab-testing',
      category: 'quality',
      question: 'How do you ensure product quality and safety?',
      answer: 'Every batch of our THCA flower undergoes comprehensive third-party lab testing for potency, purity, pesticides, heavy metals, and microbials. We provide complete Certificates of Analysis (COAs) for all products, ensuring transparency and compliance. Our 15,000 sq ft climate-controlled indoor facility maintains temperature and humidity within 1% tolerance for optimal growing conditions.'
    },
    {
      id: 'organic-cultivation',
      category: 'quality',
      question: 'Are your products organically grown?',
      answer: 'Yes, we use 100% organic cultivation methods in our state-of-the-art indoor facility. Our plants are grown in organic super-soil enriched with beneficial microbes, completely free from pesticides and harmful chemicals. Each plant receives individual care throughout its 16-week journey, followed by a 30+ day curing process for enhanced flavor and potency.'
    },
    {
      id: 'storage-recommendations',
      category: 'quality',
      question: 'How should I store THCA flower?',
      answer: 'Store THCA flower in an airtight container, away from light, heat, and moisture. Proper storage protects cannabinoids and terpenes, preserving freshness, potency, and flavor profile. Keep your products in a cool, dark place like a pantry or dedicated storage area. Avoid refrigeration as it can introduce moisture.'
    },

    // Usage & Effects
    {
      id: 'consumption-methods',
      category: 'usage',
      question: 'What are the different ways to consume THCA flower?',
      answer: 'THCA flower can be consumed through various methods: smoking (joints, pipes, bongs), vaporizing (dry herb vaporizers), or incorporating into edibles after decarboxylation (heating in an oven). Each method offers different onset times and duration of effects. Vaporizing is often preferred as it provides better flavor and may be less harsh than smoking.'
    },
    {
      id: 'onset-duration',
      category: 'usage',
      question: 'How long do the effects last?',
      answer: 'When smoked or vaped, effects typically begin within minutes and can last 1-4 hours depending on the amount consumed and individual tolerance. For edibles made with decarboxylated THCA flower, effects may take 30 minutes to 2 hours to onset and can last 4-8 hours. Start with small amounts and wait to assess effects before consuming more.'
    },
    {
      id: 'first-time-users',
      category: 'usage',
      question: 'I\'m new to THCA flower. What should I know?',
      answer: 'Start low and go slow. Begin with a very small amount (1-2 small puffs if smoking/vaping) and wait at least 15-30 minutes to assess effects before consuming more. Have water and snacks available, choose a comfortable environment, and avoid driving or operating machinery. Remember that THCA flower produces similar effects to traditional cannabis when heated.'
    },

    // Shipping & Policies
    {
      id: 'shipping-policy',
      category: 'shipping',
      question: 'Do you offer free shipping?',
      answer: 'Yes! We offer FREE SHIPPING on all orders over $125. All orders are shipped with discreet packaging and tracking information. We use reliable carriers to ensure your products arrive safely and securely.'
    },
    {
      id: 'shipping-restrictions',
      category: 'shipping',
      question: 'Do you ship to all states?',
      answer: 'We ship to most states where THCA products are legal. However, some states have restrictions on hemp-derived products with THCA content. Currently, we cannot ship to: Arkansas, Hawaii, Idaho, Kansas, Louisiana, Oklahoma, Oregon, Rhode Island, Utah, and Vermont. Always check your local laws before ordering.'
    },
    {
      id: 'discreet-packaging',
      category: 'shipping',
      question: 'Is shipping discreet?',
      answer: 'Absolutely. All orders are shipped in plain, unmarked packaging with no indication of contents. Your privacy and discretion are our top priorities. Packages are professionally sealed and include only necessary shipping labels and tracking information.'
    },
    {
      id: 'satisfaction-guarantee',
      category: 'shipping',
      question: 'What is your return policy?',
      answer: 'We stand behind our products with a satisfaction guarantee. If you\'re not completely satisfied with your purchase, contact us at hello@budlifenc.com within 30 days. We\'ll work with you to make it right – your trust is our top priority. Note that due to the nature of hemp products, returns must meet certain conditions for safety and legal compliance.'
    },

    // General Hemp Questions
    {
      id: 'hemp-benefits',
      category: 'general',
      question: 'What are the potential benefits of hemp products?',
      answer: 'Hemp products, including THCA flower, may offer various potential benefits according to user reports and preliminary research. These may include relaxation, stress relief, improved sleep quality, and general wellness support. However, we make no medical claims about our products. The FDA has not evaluated these statements, and our products are not intended to diagnose, treat, cure, or prevent any disease.'
    },
    {
      id: 'drug-testing',
      category: 'general',
      question: 'Will THCA flower show up on a drug test?',
      answer: 'Yes, THCA flower may cause you to fail a drug test. When THCA is heated and converts to THC, or even through natural decarboxylation over time, it can result in detectable THC metabolites in your system. If you are subject to drug testing for employment or other purposes, we strongly advise against using THCA products.'
    },
    {
      id: 'contact-support',
      category: 'general',
      question: 'How can I contact customer support?',
      answer: 'Our customer support team is here to help! You can reach us at hello@budlifenc.com for any questions about products, orders, or general inquiries. You can also follow us on social media @budlifeguys on Facebook, Instagram, and TikTok for updates and educational content. We strive to respond to all inquiries within 24 hours.'
    }
  ]

  const categories = [
    { id: 'all', name: 'All Questions', icon: HelpCircle },
    { id: 'thca-basics', name: 'THCA Basics', icon: Leaf },
    { id: 'legal', name: 'Legal & Compliance', icon: Scale },
    { id: 'quality', name: 'Quality & Testing', icon: TestTube },
    { id: 'usage', name: 'Usage & Effects', icon: Clock },
    { id: 'shipping', name: 'Shipping & Policies', icon: Truck },
    { id: 'general', name: 'General Questions', icon: Shield }
  ]

  const filteredFAQs = activeCategory === 'all' 
    ? faqs 
    : faqs.filter(faq => faq.category === activeCategory)

  const toggleFAQ = (id: string) => {
    setActiveId(activeId === id ? null : id)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-forest-900 via-forest-800 to-emerald-900 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">
              Frequently Asked
              <span className="block text-emerald-400">Questions</span>
            </h1>
            <p className="text-xl text-cream-200 max-w-3xl mx-auto leading-relaxed">
              Everything you need to know about THCA flower, hemp products, quality standards, and our commitment to transparency.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Filter */}
          <div className="mb-12">
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((category) => {
                const Icon = category.icon
                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                      activeCategory === category.id
                        ? 'bg-emerald-600 text-white shadow-lg transform scale-105'
                        : 'bg-white text-forest-700 border border-forest-200 hover:bg-emerald-50 hover:border-emerald-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {category.name}
                  </button>
                )
              })}
            </div>
          </div>

          {/* FAQ Items */}
          <div className="space-y-4">
            {filteredFAQs.map((faq, index) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="bg-white border border-forest-100 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full px-8 py-6 text-left flex items-center justify-between group hover:bg-emerald-50 transition-colors duration-200"
                >
                  <span className="text-lg font-semibold text-forest-900 group-hover:text-emerald-700 pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-6 h-6 text-emerald-600 flex-shrink-0 transition-transform duration-300 ${
                      activeId === faq.id ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>
                
                <AnimatePresence>
                  {activeId === faq.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-emerald-100"
                    >
                      <div className="px-8 py-6 text-forest-700 leading-relaxed bg-gradient-to-r from-emerald-25 to-white">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {/* Contact Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-20 bg-gradient-to-br from-emerald-600 to-forest-700 rounded-3xl p-12 text-white text-center"
          >
            <HelpCircle className="w-16 h-16 mx-auto mb-6 text-emerald-300" />
            <h3 className="text-3xl font-bold mb-4">Still Have Questions?</h3>
            <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
              Our knowledgeable team is here to help. Reach out with any questions about our products, quality standards, or hemp regulations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="mailto:hello@budlifenc.com"
                className="bg-white text-emerald-700 px-8 py-4 rounded-xl font-semibold hover:bg-emerald-50 transition-colors duration-200 shadow-lg"
              >
                Email: hello@budlifenc.com
              </a>
              <span className="text-emerald-200 hidden sm:block">or</span>
              <a
                href="/contact"
                className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-emerald-700 transition-all duration-200"
              >
                Contact Form
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default FAQsPage