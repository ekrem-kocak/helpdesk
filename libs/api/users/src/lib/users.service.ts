import { Prisma, PrismaService, User } from '@helpdesk/api/data-access-db';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findOneById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    return this.prisma.user.findMany({
      skip: params.skip,
      take: params.take,
      cursor: params.cursor,
      where: params.where,
      orderBy: params.orderBy,
    });
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data });
  }
}
