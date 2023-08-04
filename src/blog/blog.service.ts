import { Inject, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { FetchBlogDto } from './dto/fetch-blog.dto';

import { getStartOfDay, getStartOfMonth } from 'src/utils/parse';
import { TypeService } from 'src/type/type.service';
import { TagService } from 'src/tag/tag.service';

@Injectable()
export class BlogService {
  private statCache = new Map<string, any>();

  @Inject('PrismaClient') private prisma: PrismaClient;

  constructor(
    private typeService: TypeService,
    private tagService: TagService,
  ) {}

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
      tags: fetchBlogDto.tags
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

  // 获取博客统计图，别想着再动这个接口，水很深
  async getStat(role: string) {
    /**
     * Shift 一样的写法，但仔细一想好像也挺河里，已知：
     * 1. Prisma 目前没有办法对时间段做聚类操作，故不缓存每次都要 *上百次* SQL
     * 2. 整个系统中只有我（Admin）能对博客统计的结果造成影响
     * 3. 我（Admin）发完博客之后可能顺手查看一下当前的所有博客的统计结果
     * 4. 此接口返回结果中数据的最小粒度是 天
     * 故，这算是最优解：
     * 1. 每天第一次访问此接口，正常查询，并将日期与结果存入 Cache，同时试图删除旧 Cache
     * 2. 后面普通用户访问此接口，发现有 Cache 直接返回（几 ms 的响应时间）
     * 3. 我（Admin）访问此接口，正常查询，更新 Cache
     */
    const today = getStartOfDay(0).toLocaleDateString();
    if (role !== Role.admin && this.statCache.has(today)) {
      return this.statCache.get(today);
    }
    this.statCache.delete(getStartOfDay(1).toLocaleDateString());

    // 获取每个分类下博客发布情况
    const typeRes = await this.typeService.findAll();
    const radarOptionMax = Math.max(
      ...typeRes.map((item) => item._count.blogs),
    );

    // 获取每个标签下博客发布情况
    const tagRes = (await this.tagService.findAll()).sort(
      (a, b) => b._count.blogs - a._count.blogs,
    );

    // 获取过去六个月每个月的博客发布情况
    const postGroupByMonth = [];
    const monthXAxis = [];
    for (let i = 5; i >= 0; i--) {
      const begin = getStartOfMonth(i);
      const end = getStartOfMonth(i - 1);
      postGroupByMonth.push(
        this.prisma.blog.count({ where: { postAt: { gte: begin, lte: end } } }),
      );
      monthXAxis.push(begin.toLocaleDateString());
    }
    const monthValue = await Promise.all(postGroupByMonth);

    // 获取过去六个月每天的博客发布情况
    const postGroupByDay = [];
    for (let i = 179; i >= 0; i--) {
      const begin = getStartOfDay(i);
      const end = getStartOfDay(i - 1);
      postGroupByDay.push(
        new Promise(async (resolve) => {
          const count = await this.prisma.blog.count({
            where: { postAt: { gte: begin, lte: end } },
          });
          resolve([begin.toLocaleDateString(), count]);
        }),
      );
    }
    const dayValue = await Promise.all(postGroupByDay);

    // 合并接口之后就是没眼看，，
    const res = {
      radarOption: {
        indicator: typeRes.map((item) => ({
          name: item.typeName,
          max: radarOptionMax + Math.ceil(radarOptionMax / 6),
        })),
        value: typeRes.map((item) => item._count.blogs),
      },
      lineOption: {
        xAxis: monthXAxis.map((item: string) =>
          item.split('/').slice(0, 2).join('-'),
        ),
        value: monthValue,
      },
      heatMapOption: dayValue,
      pieOption: typeRes.map((item) => ({
        value: item._count.blogs,
        name: item.typeName,
      })),
      directOption: {
        xAxis: tagRes.map((item) => item.tagName),
        value: tagRes.map((item) => item._count.blogs),
      },
    };

    this.statCache.set(today, res);
    return res;
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
