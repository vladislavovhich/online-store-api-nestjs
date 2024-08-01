import { SetMetadata } from '@nestjs/common';

export const CheckOwnership = (resourceType: string) => SetMetadata('resourceType', resourceType);