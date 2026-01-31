import { Prisma } from '../../generated/prisma/client';

export const softDeleteExtension = Prisma.defineExtension({
  name: 'soft-delete',
  model: {
    $allModels: {
      async softDelete<M, A>(
        this: M,
        args: { where: Prisma.Args<M, 'update'>['where'] },
      ): Promise<Prisma.Result<M, A, 'update'>> {
        const context = Prisma.getExtensionContext(this);
        return (context as any).update({
          ...args,
          data: {
            deletedAt: new Date(),
          },
        });
      },

      async restore<M, A>(
        this: M,
        args: { where: Prisma.Args<M, 'update'>['where'] },
      ): Promise<Prisma.Result<M, A, 'update'>> {
        const context = Prisma.getExtensionContext(this);
        return (context as any).update({
          ...args,
          data: {
            deletedAt: null,
          },
        });
      },
    },
  },
});
