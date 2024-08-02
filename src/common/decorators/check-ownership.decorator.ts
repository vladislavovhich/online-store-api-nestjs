import { SetMetadata, applyDecorators } from '@nestjs/common';

export const CheckOwnership = (resourceType: string, ownerKey = "userId{") => {
    return applyDecorators(
        SetMetadata('resourceType', resourceType),
        SetMetadata('ownerKey', ownerKey)
    );
}