// app/features/page.tsx
import React from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Truck, 
  Database,
  Zap,
  Clock,
  Globe,
  Award,
  Headphones,
  ArrowRight
} from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const metadata = {
  title: 'Why CellTech | Enterprise-Grade Cell Phone Parts',
  description: 'Discover why 500+ service centers choose CellTech for wholesale cell phone parts. Verified OEM quality, real-time inventory, and next-day shipping.',
};

export default function FeaturesPage() {
  const features = [
    {
      title: 'Original Quality',
      description: 'Source direct OEM and high-quality refurbished components with verified authenticity. Every part is tested and graded before reaching your workbench.',
      icon: ShieldCheck
    },
    {
      title: 'Smart Inventory',
      description: 'Real-time stock levels and automated back-order notifications for wholesale bulk orders. Never promise a part you cannot deliver.',
      icon: Database
    },
    {
      title: 'Next-Day Shipping',
      description: 'Optimized logistics for B2B partners ensuring your workbench stays fully operational. Orders placed by 3PM ship same day.',
      icon: Truck
    }
  ];

  const additionalBenefits = [
    {
      title: 'Lightning Fast',
      description: 'API-first architecture with sub-100ms response times.',
      icon: Zap
    },
    {
      title: '24/7 Support',
      description: 'Technical support team available around the clock.',
      icon: Headphones
    },
    {
      title: 'Global Reach',
      description: 'Shipping to 40+ countries with localized fulfillment.',
      icon: Globe
    },
    {
      title: 'Quality Guarantee',
      description: '90-day warranty on all parts with hassle-free returns.',
      icon: Award
    },
    {
      title: 'Real-Time Sync',
      description: 'Inventory updates every 60 seconds. Never oversell.',
      icon: Clock
    },
    {
      title: 'Bulk Pricing',
      description: 'Volume discounts starting at 50+ units per SKU.',
      icon: Database
    }
  ];

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="pt-32 pb-16 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-micro text-ct-accent mb-4 tracking-widest">WHY CELLTECH</p>
          <h1 className="heading-display text-4xl sm:text-5xl lg:text-6xl text-ct-text mb-6">
            BUILT FOR <span className="text-ct-accent">ENTERPRISE</span>
          </h1>
          <p className="text-ct-text-secondary text-lg leading-relaxed">
            The professional wholesale alternative. Engineered for high-volume service centers 
            that demand reliability, speed, and uncompromising quality.
          </p>
        </div>
      </section>

      {/* Main Features */}
      <section className="py-16 px-6 lg:px-12 bg-ct-bg-secondary/30 border-y border-ct-text-secondary/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <div 
                key={i} 
                className="p-8 rounded-2xl bg-ct-bg-secondary/50 border border-ct-text-secondary/5 
                           group hover:border-ct-accent/20 transition-all duration-300
                           hover:shadow-[0_0_30px_rgba(0,229,192,0.1)]"
              >
                <div className="w-14 h-14 rounded-xl bg-ct-accent/10 flex items-center justify-center mb-6 
                                group-hover:bg-ct-accent/20 transition-all">
                  <feature.icon className="text-ct-accent" size={28} />
                </div>
                <h3 className="text-ct-text font-bold text-xl mb-4">{feature.title}</h3>
                <p className="text-ct-text-secondary leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Benefits Grid */}
      <section className="py-24 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-micro text-ct-accent mb-4 tracking-widest">ADDITIONAL BENEFITS</p>
            <h2 className="heading-display text-3xl sm:text-4xl">EVERYTHING YOU NEED</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {additionalBenefits.map((benefit, i) => (
              <div 
                key={i} 
                className="p-6 rounded-xl bg-ct-bg-secondary/30 border border-ct-text-secondary/5 
                           hover:border-ct-accent/10 transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-ct-accent/10 flex items-center justify-center flex-shrink-0
                                  group-hover:bg-ct-accent/20 transition-all">
                    <benefit.icon className="text-ct-accent" size={20} />
                  </div>
                  <div>
                    <h4 className="text-ct-text font-semibold mb-1">{benefit.title}</h4>
                    <p className="text-ct-text-secondary text-sm leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 lg:px-12 bg-ct-bg-secondary/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="heading-display text-4xl lg:text-5xl text-ct-accent mb-2">500+</p>
              <p className="text-ct-text-secondary text-sm uppercase tracking-wider">Service Centers</p>
            </div>
            <div>
              <p className="heading-display text-4xl lg:text-5xl text-ct-accent mb-2">10K+</p>
              <p className="text-ct-text-secondary text-sm uppercase tracking-wider">Parts SKUs</p>
            </div>
            <div>
              <p className="heading-display text-4xl lg:text-5xl text-ct-accent mb-2">99.7%</p>
              <p className="text-ct-text-secondary text-sm uppercase tracking-wider">Fulfillment Rate</p>
            </div>
            <div>
              <p className="heading-display text-4xl lg:text-5xl text-ct-accent mb-2">24h</p>
              <p className="text-ct-text-secondary text-sm uppercase tracking-wider">Average Delivery</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 lg:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-12 rounded-3xl bg-ct-bg-secondary/80 border border-ct-accent/10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-ct-accent to-transparent" />
            <h2 className="heading-display text-3xl sm:text-4xl mb-6">
              READY TO <span className="text-ct-accent">SCALE?</span>
            </h2>
            <p className="text-ct-text-secondary text-lg mb-8 max-w-xl mx-auto">
              Join service centers already using CellTech to optimize their 
              component sourcing and reduce workbench downtime.
            </p>
            <Link href="/catalog">
              <Button size="lg" className="h-14 px-10">
                Explore Catalog <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
