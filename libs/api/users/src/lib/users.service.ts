import { Prisma, PrismaService, User } from '@helpdesk/api/data-access-db';
import { PageDto, PageMetaDto, PageOptionsDto } from '@helpdesk/api/shared';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findOneById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findOneByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<User>> {
    const [data, itemCount] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        skip: pageOptionsDto.skip,
        take: pageOptionsDto.take,
        orderBy: { createdAt: pageOptionsDto.order },
      }),
      this.prisma.user.count(),
    ]);
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(data, pageMetaDto);
  }

  async create(data: Prisma.UserCreateInput) {
    return this.prisma.user.create({ data });
  }

  async delete(id: string) {
    return this.prisma.user.softDelete({ where: { id } });
  }
}
