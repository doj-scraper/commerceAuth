// app/api/parts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search');
  const brand = searchParams.get('brand');
  const model = searchParams.get('model');
  const quality = searchParams.get('quality');

  const where: Prisma.PartMasterWhereInput = {
    AND: [
      search ? { searchIndex: { contains: search, mode: 'insensitive' } } : {},
      brand ? { primaryPhone: { model: { brand: { name: { contains: brand, mode: 'insensitive' } } } } } : {},
      model ? { primaryPhone: { model: { name: { contains: model, mode: 'insensitive' } } } } : {},
      quality ? { quality: { name: { contains: quality, mode: 'insensitive' } } } : {},
    ],
  };

  try {
    const parts = await prisma.partMaster.findMany({
      where,
      include: {
        partType: { include: { bucket: true } },
        quality: true,
        primaryPhone: { include: { model: { include: { brand: true } } } },
        compatibilities: { include: { phone: { include: { model: { include: { brand: true } } } } } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formattedParts = parts.map((part) => ({
      ...part,
      // Convert Decimal to cents (integer)
      price: part.price ? Math.round(Number(part.price) * 100) : null,
      cost: part.cost ? Math.round(Number(part.cost) * 100) : null,
    }));

    return NextResponse.json(formattedParts);
  } catch (error: any) {
    console.error('Error fetching parts:', error);
    return NextResponse.json({ error: 'Failed to fetch parts', details: error.message, stack: error.stack }, { status: 500 });
  }
}
