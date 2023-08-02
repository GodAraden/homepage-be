import { Inject, Injectable } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { PrismaClient } from '@prisma/client';
import { FetchBlogDto } from './dto/fetch-blog.dto';

@Injectable()
export class BlogService {
  @Inject('PrismaClient') private prisma: PrismaClient;

  // 创建博客，并 关联或创建 现有的 分类或标签
  create(createBlogDto: CreateBlogDto) {
    const { typeName, tags, ...data } = createBlogDto;
    return this.prisma.blog.create({
      data: {
        type: {
          connectOrCreate: {
            where: { typeName },
            create: { typeName },
          },
        },
        tags: {
          connectOrCreate: tags.map((tagName) => ({
            where: { tagName },
            create: { tagName },
          })),
        },
        ...data,
      },
      include: {
        tags: true,
      },
    });
  }

  // 根据传入参数获取博客列表
  async findList(fetchBlogDto: FetchBlogDto) {
    // 设置默认排序方式
    if (!['readNum', 'likeNum', 'postAt'].includes(fetchBlogDto.orderBy)) {
      fetchBlogDto.orderBy = 'postAt';
    }
    if (!['asc', 'desc'].includes(fetchBlogDto.order)) {
      fetchBlogDto.order = 'desc';
    }
    // 查询参数
    const query = {
      typeName: fetchBlogDto.typeName,
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
    // 该查询条件下的博客总数，用于分页
    const total = await this.prisma.blog.count({
      where: query,
    });
    // 查询语句，会筛掉 content
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
        tags: true,
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
        description: true,
        content: true,
        author: true,
        typeName: true,
        tags: true,
        postAt: true,
        updateAt: true,
        readNum: true,
        likeNum: true,
      },
    });
  }

  update(id: string, updateBlogDto: UpdateBlogDto) {
    const {
      typeName,
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
        tags: {
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
        tags: true,
      },
    });
  }

  remove(id: string) {
    return this.prisma.blog.delete({
      where: { id },
      include: {
        tags: true,
      },
    });
  }
}
