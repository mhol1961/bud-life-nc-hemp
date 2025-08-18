import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Leaf, Shield, Star, Award, ChevronDown } from 'lucide-react'

const HomePage = () => {
  return (
    <div className="min-h-screen bg-black text-cream">
      {/* Hero Section - Premium Full Screen */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-black via-black-800 to-forest-900">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-cannabis-texture opacity-5"></div>
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-float"></div>
          <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-forest-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-float" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-gold-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-float" style={{animationDelay: '4s'}}></div>
        </div>

        <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
          {/* Logo */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <img 
              src="/images/new-budlife-logo.png" 
              alt="BudLife Hemp NC"
              className="w-48 h-48 mx-auto mb-6 filter drop-shadow-2xl"
            />
          </motion.div>

          {/* Hero Text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h1 className="text-6xl lg:text-8xl font-bold mb-6 bg-gradient-to-r from-cream-100 via-emerald-300 to-gold-400 bg-clip-text text-transparent leading-tight">
              Premium THCA
              <br />
              <span className="text-4xl lg:text-6xl text-emerald-400">From the Mountains</span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-cream-400 mb-8 max-w-3xl mx-auto leading-relaxed">
              Experience North Carolina's finest hemp-derived THCA products. 
              Meticulously cultivated, rigorously tested, and crafted for connoisseurs.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link
                to="/products"
                className="group relative px-8 py-4 bg-gradient-to-r from-emerald-600 to-forest-600 hover:from-emerald-500 hover:to-forest-500 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-glow-lg flex items-center gap-2"
              >
                <span>Shop Premium THCA</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-forest-400 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity"></div>
              </Link>
              
              <Link
                to="/lab-results"
                className="px-8 py-4 border-2 border-cream-400 text-cream-100 hover:bg-cream-400 hover:text-black font-bold rounded-xl transition-all duration-300 flex items-center gap-2"
              >
                <Shield className="w-5 h-5" />
                View Lab Results
              </Link>
            </div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <ChevronDown className="w-6 h-6 text-cream-400 animate-bounce" />
          </motion.div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 bg-gradient-to-b from-black to-black-800">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section Header */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-gold-400 bg-clip-text text-transparent">
              Premium Strains
            </h2>
            <p className="text-xl text-cream-300 max-w-2xl mx-auto">
              Hand-selected, lab-tested, and cultivated with passion. Each strain tells a story of quality and craftsmanship.
            </p>
          </motion.div>

          {/* Product Grid */}
          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Jealousy Strain */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="group relative bg-gradient-to-br from-black-800 to-black-700 rounded-3xl overflow-hidden border border-forest-700 hover:border-emerald-500 transition-all duration-500 hover:shadow-glow-lg"
            >
              <div className="relative overflow-hidden">
                <img 
                  src="/images/jealousy_flower.png" 
                  alt="Jealousy Strain THCA Flower"
                  className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                <div className="absolute top-4 right-4 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Premium
                </div>
              </div>
              
              <div className="p-8">
                <h3 className="text-3xl font-bold mb-3 text-cream-100">Jealousy</h3>
                <p className="text-cream-300 mb-4 text-lg">A potent hybrid with stunning purple hues and an incredible terpene profile. Perfect for experienced users seeking premium quality.</p>
                
                {/* Size Options */}
                <div className="flex gap-4 mb-6">
                  <div className="flex-1 bg-black-700 rounded-xl p-4 border border-forest-600">
                    <div className="text-emerald-400 font-bold text-lg">3.5G</div>
                    <div className="text-cream-100 text-2xl font-bold">$35</div>
                  </div>
                  <div className="flex-1 bg-black-700 rounded-xl p-4 border border-forest-600">
                    <div className="text-emerald-400 font-bold text-lg">7G</div>
                    <div className="text-cream-100 text-2xl font-bold">$65</div>
                  </div>
                </div>

                <Link
                  to="/products/jealousy"
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  View Details
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>

            {/* Gushers Strain */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="group relative bg-gradient-to-br from-black-800 to-black-700 rounded-3xl overflow-hidden border border-forest-700 hover:border-emerald-500 transition-all duration-500 hover:shadow-glow-lg"
            >
              <div className="relative overflow-hidden">
                <img 
                  src="/images/gushers_flower.png" 
                  alt="Gushers Strain THCA Flower"
                  className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                <div className="absolute top-4 right-4 bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Top Shelf
                </div>
              </div>
              
              <div className="p-8">
                <h3 className="text-3xl font-bold mb-3 text-cream-100">Gushers</h3>
                <p className="text-cream-300 mb-4 text-lg">Sweet and fruity with dense, frosty buds. A customer favorite known for its exceptional flavor and smooth experience.</p>
                
                {/* Size Options */}
                <div className="flex gap-4 mb-6">
                  <div className="flex-1 bg-black-700 rounded-xl p-4 border border-forest-600">
                    <div className="text-emerald-400 font-bold text-lg">3.5G</div>
                    <div className="text-cream-100 text-2xl font-bold">$30</div>
                  </div>
                  <div className="flex-1 bg-black-700 rounded-xl p-4 border border-forest-600">
                    <div className="text-emerald-400 font-bold text-lg">7G</div>
                    <div className="text-cream-100 text-2xl font-bold">$55</div>
                  </div>
                </div>

                <Link
                  to="/products/gushers"
                  className="w-full bg-gradient-to-r from-emerald-600 to-forest-600 hover:from-emerald-500 hover:to-forest-500 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  View Details
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-gradient-to-b from-black-800 to-forest-900">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold mb-6 text-cream-100">
              The <span className="text-emerald-400">BudLife</span> Difference
            </h2>
            <p className="text-xl text-cream-300 max-w-2xl mx-auto">
              From the Blue Ridge Mountains to your door, we ensure every product meets our uncompromising standards.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Lab Tested */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center group"
            >
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-emerald-500 to-forest-500 rounded-full flex items-center justify-center group-hover:animate-glow transition-all duration-300">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-cream-100">Lab Tested</h3>
              <p className="text-cream-300 leading-relaxed">
                Every batch is third-party tested for potency, pesticides, and purity. COAs available for complete transparency.
              </p>
            </motion.div>

            {/* Premium Quality */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center group"
            >
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gold-500 to-gold-600 rounded-full flex items-center justify-center group-hover:animate-glow transition-all duration-300">
                <Award className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-cream-100">Premium Quality</h3>
              <p className="text-cream-300 leading-relaxed">
                Hand-selected strains cultivated with care. We never compromise on quality, ensuring only the finest products.
              </p>
            </motion.div>

            {/* North Carolina Grown */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center group"
            >
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-forest-500 to-emerald-500 rounded-full flex items-center justify-center group-hover:animate-glow transition-all duration-300">
                <Leaf className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-cream-100">NC Grown</h3>
              <p className="text-cream-300 leading-relaxed">
                Proudly cultivated in the beautiful mountains of North Carolina, where pure air and rich soil create exceptional hemp.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-900 via-forest-800 to-emerald-900">
        <div className="max-w-4xl mx-auto text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-5xl font-bold mb-6 text-cream-100">
              Ready to Experience Premium THCA?
            </h2>
            <p className="text-xl text-cream-200 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers who trust BudLife for their premium hemp needs. 
              Quality you can see, purity you can trust.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-black font-bold px-10 py-5 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-glow-lg"
            >
              <span className="text-xl">Shop Now</span>
              <ArrowRight className="w-6 h-6" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export { HomePage }
export default HomePage