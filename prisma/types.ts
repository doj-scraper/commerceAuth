// prisma/types.ts
import { Decimal } from '@prisma/client/runtime/library';

export interface CreatePartInput {
  primaryPhoneId: string;
  partTypeId: string;
  qualityId: string;
  compatiblePhoneIds: string[];
  supplier?: string | null;
  cost?: number | Decimal | null;
  price?: number | Decimal | null;
  initialStock?: number;
}
