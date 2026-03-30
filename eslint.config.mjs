import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

export default [
  ...nextVitals,
  ...nextTs,
  {
    ignores: [
      '.next/**',
      '.copilot/**',
      '.gemini/**',
      '.rovodev/**',
      'out/**',
      'build/**',
      'coverage/**',
      '.github/**',
      'next-env.d.ts',
      'newFiles/**',
      'USEFULUI/**',
      'prisma/prismaGeneratorClient.js',
    ],
  },
];
