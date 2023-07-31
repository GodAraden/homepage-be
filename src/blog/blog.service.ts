import { Inject, Injectable } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { PrismaClient } from '@prisma/client';
import { FetchBlogDto } from './dto/fetch-blog.dto';

@Injectable()
export class BlogService {
  @Inject('PrismaClient') private prisma: PrismaClient;

  create(createBlogDto: CreateBlogDto) {
    const { type: typeName, tags, ...data } = createBlogDto;
    return this.prisma.blog.create({
      data: {
        type: {
          connectOrCreate: {
            where: { typeName },
            create: { typeName },
          },
        },
        tag: {
          connectOrCreate: tags.map((tagName) => ({
            where: { tagName },
            create: { tagName },
          })),
        },
        ...data,
      },
      include: {
        tag: true,
      },
    });
  }

  async findList(fetchBlogDto: FetchBlogDto) {
    if (!['readNum', 'likeNum', 'postAt'].includes(fetchBlogDto.orderBy)) {
      fetchBlogDto.orderBy = 'postAt';
    }
    if (!['asc', 'desc'].includes(fetchBlogDto.order)) {
      fetchBlogDto.order = 'desc';
    }
    const query = {
      typeName: fetchBlogDto.type,
      tag: fetchBlogDto.tags
        ? { some: { tagName: { in: fetchBlogDto.tags } } }
        : undefined,
      OR: fetchBlogDto.keyword
        ? [
            { title: { contains: fetchBlogDto.keyword } },
            { description: { contains: fetchBlogDto.keyword } },
          ]
        : undefined,
      AND: [
        { postAt: { lte: fetchBlogDto.endDate } },
        { postAt: { gte: fetchBlogDto.startDate } },
      ],
    };
    const total = await this.prisma.blog.count({
      where: query,
    });
    const data = await this.prisma.blog.findMany({
      where: query,
      orderBy: { [fetchBlogDto.orderBy]: fetchBlogDto.order },
      select: {
        _count: { select: { comments: true } },
        id: true,
        title: true,
        description: true,
        author: true,
        typeName: true,
        tag: true,
        postAt: true,
        updateAt: true,
        readNum: true,
        likeNum: true,
      },
      skip: (fetchBlogDto.current - 1) * fetchBlogDto.pageSize,
      take: fetchBlogDto.pageSize,
    });
    return { data, total };
  }

  like(id: string) {
    return this.prisma.blog.update({
      where: { id },
      data: { likeNum: { increment: 1 } },
      select: {
        likeNum: true,
      },
    });
  }

  findOne(id: string) {
    return this.prisma.blog.update({
      where: { id },
      data: { readNum: { increment: 1 } },
      select: {
        _count: { select: { comments: true } },
        id: true,
        title: true,
        content: true,
        author: true,
        typeName: true,
        tag: true,
        postAt: true,
        updateAt: true,
        readNum: true,
        likeNum: true,
      },
    });
  }

  update(id: string, updateBlogDto: UpdateBlogDto) {
    const {
      type: typeName,
      deleteTags = [],
      createTags = [],
      updatedAt,
      ...data
    } = updateBlogDto;
    return this.prisma.blog.update({
      where: { id },
      data: {
        type: typeName
          ? {
              connectOrCreate: {
                where: { typeName },
                create: { typeName },
              },
            }
          : void 0,
        tag: {
          connectOrCreate: createTags.map((tagName) => ({
            where: { tagName },
            create: { tagName },
          })),
          disconnect: deleteTags.map((tagName) => ({
            tagName,
          })),
        },
        updateAt: updatedAt ?? new Date(),
        ...data,
      },
      include: {
        tag: true,
      },
    });
  }

  remove(id: string) {
    return this.prisma.blog.delete({
      where: { id },
      include: {
        tag: true,
      },
    });
  }
}
