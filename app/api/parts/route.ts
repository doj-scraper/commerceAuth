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

    const formattedParts = parts.map((part) => {
      const brandName = part.primaryPhone.model.brand.name;
      const brand: 'Apple' | 'Samsung' =
        brandName === 'Apple' || brandName === 'Samsung' ? brandName : 'Apple';
      return {
        ...part,
        brand,
        // Convert Decimal to cents (integer)
        price: part.price ? Math.round(Number(part.price) * 100) : 0,
        cost: part.cost ? Math.round(Number(part.cost) * 100) : null,
      };
    });

    return NextResponse.json({ success: true, parts: formattedParts });
  } catch (error) {
    console.error('Error fetching parts:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch parts' },
      { status: 500 }
    );
  }
}
