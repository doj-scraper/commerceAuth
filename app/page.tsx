// app/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  Settings, 
  Layers, 
  Search,
  Database,
  Smartphone
} from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function LandingPage() {
  const features = [
    {
      title: 'Original Quality',
      description: 'Source direct OEM and high-quality refurbished components with verified authenticity.',
      icon: ShieldCheck
    },
    {
      title: 'Smart Inventory',
      description: 'Real-time stock levels and automated back-order notifications for wholesale bulk orders.',
      icon: Database
    },
    {
      title: 'Next-Day Shipping',
      description: 'Optimized logistics for B2B partners ensuring your workbench stays fully operational.',
      icon: Truck
    }
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative pt-40 pb-24 px-6 lg:px-12 max-w-7xl mx-auto overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[500px] h-[500px] bg-ct-accent/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-3xl">
          <Badge variant="accent" className="mb-6 uppercase tracking-[0.2em] font-bold">New Catalog V3.0</Badge>
          <h1 className="heading-display text-5xl sm:text-6xl lg:text-7xl mb-8 leading-[0.9]">
            PRECISION <span className="text-ct-accent">COMPONENTS</span> FOR ENTERPRISE REPAIR
          </h1>
          <p className="text-ct-text-secondary text-lg lg:text-xl mb-10 max-w-2xl leading-relaxed">
            The professional wholesale alternative. Access a data-driven inventory of 
            verified cell phone parts, curated for high-volume service centers and 
            enterprise repair teams.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/catalog">
              <Button size="lg" className="h-14 px-8 text-base">
                Explore Inventory <ArrowRight className="ml-2" size={18} />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="h-14 px-8 text-base">
              Become a Partner
            </Button>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-24 px-6 lg:px-12 bg-ct-bg-secondary/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <div key={i} className="p-8 rounded-2xl bg-ct-bg-secondary/50 border border-ct-text-secondary/5 group hover:border-ct-accent/20 transition-all">
                <div className="w-12 h-12 rounded-xl bg-ct-accent/10 flex items-center justify-center mb-6 group-hover:bg-ct-accent/20 transition-all">
                  <feature.icon className="text-ct-accent" size={24} />
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

      {/* CTA Section */}
      <section className="py-24 px-6 lg:px-12 text-center">
        <div className="max-w-4xl mx-auto p-12 rounded-3xl bg-ct-bg-secondary/80 border border-ct-accent/10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-ct-accent to-transparent" />
          <h2 className="heading-display text-4xl mb-6">READY TO <span className="text-ct-accent">SCALE?</span></h2>
          <p className="text-ct-text-secondary text-lg mb-10 max-w-xl mx-auto">
            Join 500+ service centers using our smart catalog to optimize their 
            component sourcing and reduce workbench downtime.
          </p>
          <Link href="/catalog">
            <Button size="lg" className="h-14 px-10">
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

function Badge({ children, variant = "default", className = "" }: { children: React.ReactNode, variant?: string, className?: string }) {
  const variants: Record<string, string> = {
    accent: "bg-ct-accent/10 text-ct-accent border-ct-accent/20",
    default: "bg-ct-bg-secondary text-ct-text-secondary border-ct-text-secondary/20",
  }
  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-bold ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
