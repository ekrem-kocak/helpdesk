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

export const autoFilterSoftDeletedExtension = Prisma.defineExtension({
  name: 'auto-filter-soft-deleted',
  query: {
    $allModels: {
      async $allOperations({ model, operation, args, query }) {
        if (
          operation === 'findFirst' ||
          operation === 'findMany' ||
          operation === 'count'
        ) {
          // If the developer has explicitly specified the 'deletedAt' field in the query,
          // do not apply our filter. (For example: When listing deleted items in the admin panel)
          if (args.where && 'deletedAt' in args.where) {
            return query(args);
          }

          // By default, add the deletedAt: null filter
          return query({
            ...args,
            where: {
              ...(args.where as object),
              deletedAt: null,
            },
          });
        }

        // Other operations (create, update, delete, findUnique, etc.) should proceed as usual
        return query(args);
      },
    },
  },
});
