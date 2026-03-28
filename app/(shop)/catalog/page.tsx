// app/(shop)/catalog/page.tsx
import React from 'react';
import { CatalogExplorer } from '../../../components/catalog/CatalogExplorer';

export default function CatalogPage() {
  return (
    <div className="min-h-screen pt-20 pb-12 px-6 lg:px-12 max-w-7xl mx-auto">
      <header className="mb-10">
        <p className="text-micro text-ct-accent mb-3 tracking-widest">CellTech B2B Explorer</p>
        <h1 className="heading-display text-4xl sm:text-5xl lg:text-6xl text-ct-text mb-4">
          PARTS <span className="text-ct-accent">CATALOG</span>
        </h1>
        <p className="text-ct-text-secondary text-sm lg:text-base max-w-2xl leading-relaxed">
          Access our complete inventory of original and high-quality replacement parts. 
          Use the command search or taxonomy filters to locate specific components.
        </p>
      </header>

      <CatalogExplorer />
    </div>
  );
}
