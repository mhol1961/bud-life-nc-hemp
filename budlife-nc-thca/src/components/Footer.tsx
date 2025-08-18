import React from 'react'
import { Link } from 'react-router-dom'
import { Leaf, Mail, Phone, MapPin, Facebook, Instagram, Twitter, Shield, Truck, Award } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  const productCategories = [
    { name: 'THCA Flower', href: '/products?category=flower' },
    { name: 'CBD Gummies', href: '/products?category=edibles' },
    { name: 'Tinctures', href: '/products?category=concentrates' },
    { name: 'Topicals', href: '/products?category=topicals' },
  ]

  const companyLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'Lab Results', href: '/lab-results' },
    { name: 'Contact', href: '/contact' },
    { name: 'Blog', href: '/blog' },
  ]

  const supportLinks = [
    { name: 'Shipping Info', href: '/shipping' },
    { name: 'Returns', href: '/returns' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Track Order', href: '/track-order' },
  ]

  const legalLinks = [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Refund Policy', href: '/refund-policy' },
    { name: 'Age Verification', href: '/age-verification' },
  ]

  return (
    <footer className="bg-stone-900 text-stone-300">
      {/* Trust Badges Section */}
      <div className="border-b border-stone-800">
        <div className="container-premium py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-sage-600 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-white">Lab Tested</h4>
                <p className="text-sm text-stone-400">Third-party verified COAs</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-sage-600 rounded-full flex items-center justify-center">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-white">Fast Shipping</h4>
                <p className="text-sm text-stone-400">Free shipping over $75</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-sage-600 rounded-full flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-white">Premium Quality</h4>
                <p className="text-sm text-stone-400">North Carolina grown hemp</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container-premium py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 sage-gradient rounded-lg flex items-center justify-center">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">BudLife NC</h1>
                <p className="text-xs text-stone-400 -mt-0.5">Premium THCA</p>
              </div>
            </Link>
            <p className="text-stone-400 mb-6 leading-relaxed">
              North Carolina's premier source for lab-tested, premium THCA products. 
              We're committed to providing the highest quality hemp-derived products 
              while maintaining full compliance with state and federal regulations.
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-sage-400" />
                <span className="text-sm">hello@budlifenc.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-sage-400" />
                <span className="text-sm">(828) 555-0123</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-sage-400" />
                <span className="text-sm">Asheville, North Carolina</span>
              </div>
            </div>
          </div>

          {/* Products Column */}
          <div>
            <h3 className="font-semibold text-white mb-4">Products</h3>
            <ul className="space-y-3">
              {productCategories.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-stone-400 hover:text-sage-400 transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-stone-400 hover:text-sage-400 transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h3 className="font-semibold text-white mb-4">Support</h3>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-stone-400 hover:text-sage-400 transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="border-t border-stone-800">
        <div className="container-premium py-8">
          <div className="max-w-md">
            <h3 className="font-semibold text-white mb-2">Stay Updated</h3>
            <p className="text-stone-400 text-sm mb-4">
              Get the latest news about new products and exclusive offers.
            </p>
            <div className="flex space-x-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-stone-800 border border-stone-700 rounded-lg text-white placeholder-stone-500 focus:border-sage-500 focus:outline-none"
              />
              <button className="btn-primary">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-stone-800">
        <div className="container-premium py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-sm text-stone-400">
              © {currentYear} BudLife NC. All rights reserved.
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap justify-center md:justify-end space-x-6">
              {legalLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-stone-400 hover:text-sage-400 transition-colors text-sm"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-stone-400 hover:text-sage-400 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-stone-400 hover:text-sage-400 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-stone-400 hover:text-sage-400 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Legal Disclaimers */}
      <div className="bg-stone-950 border-t border-stone-800">
        <div className="container-premium py-4">
          <div className="text-xs text-stone-500 leading-relaxed">
            <p className="mb-2">
              <strong>Legal Disclaimer:</strong> These statements have not been evaluated by the Food and Drug Administration. 
              Hemp-derived products are not intended to diagnose, treat, cure, or prevent any disease. 
              Products have not been evaluated by the FDA and are not intended for human consumption.
            </p>
            <p className="mb-2">
              <strong>Age Restriction:</strong> You must be 21 years or older to purchase or use these products. 
              Keep out of reach of children and pets.
            </p>
            <p>
              <strong>Legal Hemp:</strong> All products contain less than 0.3% Delta-9 THC by dry weight 
              and are legal under the 2018 Farm Bill. Check your local laws before purchasing.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}