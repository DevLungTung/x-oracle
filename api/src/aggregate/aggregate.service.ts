import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from '../prisma.service'
import { RedisService } from '../redis.service'
import { AggregateDto } from './dto/aggregate.dto'
import { LatestAggregateByIdDto, LatestAggregateDto } from './dto/latest-aggregate.dto'

@Injectable()
export class AggregateService {
  constructor(private prisma: PrismaService, private readonly redis: RedisService) {}

  async create(aggregateDto: AggregateDto) {
    const _timestamp = new Date(aggregateDto.timestamp)
    const data: Prisma.AggregateUncheckedCreateInput = {
      timestamp: _timestamp,
      value: aggregateDto.value,
      aggregatorId: aggregateDto.aggregatorId
    }

    await this.redis.set(
      `latestAggregate:${aggregateDto.aggregatorId.toString()}`,
      JSON.stringify({
        timestamp: _timestamp.toISOString(),
        value: aggregateDto.value.toString()
      })
    )

    return await this.prisma.aggregate.create({ data })
  }

  async findAll(params: {
    skip?: number
    take?: number
    cursor?: Prisma.AggregateWhereUniqueInput
    where?: Prisma.AggregateWhereInput
    orderBy?: Prisma.AggregateOrderByWithRelationInput
  }) {
    const { skip, take, cursor, where, orderBy } = params
    return await this.prisma.aggregate.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy
    })
  }

  async findOne(aggregateWhereUniqueInput: Prisma.AggregateWhereUniqueInput) {
    return await this.prisma.aggregate.findUnique({
      where: aggregateWhereUniqueInput
    })
  }

  async update(params: { where: Prisma.AggregateWhereUniqueInput; aggregateDto: AggregateDto }) {
    const { where, aggregateDto } = params
    return await this.prisma.aggregate.update({
      data: aggregateDto,
      where
    })
  }

  async remove(where: Prisma.AggregateWhereUniqueInput) {
    return await this.prisma.aggregate.delete({
      where
    })
  }

  /*
   * `findLatest` is used by Aggregator heartbeat process that
   * periodically requests the latest aggregated data.
   */
  async findLatest(latestAggregateDto: LatestAggregateDto) {
    const { aggregatorHash } = latestAggregateDto
    const query = Prisma.sql`SELECT aggregate_id as id, timestamp, value, aggregator_id as "aggregatorId"
      FROM aggregates
      WHERE aggregator_id = (SELECT aggregator_id FROM aggregators WHERE aggregator_hash = ${aggregatorHash})
      ORDER BY timestamp DESC
      LIMIT 1;`
    const result: Prisma.AggregateScalarFieldEnum[] = await this.prisma.$queryRaw(query)
    if (result && result.length == 1) {
      return {
        id: result[0]['id'],
        value: Number(result[0]['value']),
        timestamp: result[0]['timestamp'],
        aggregatorId: result[0]['aggregatorId']
      }
    } else {
      return null
    }
  }

  async findLatestByAggregatorId(latestAggregateByIdDto: LatestAggregateByIdDto) {
    const { aggregatorId } = latestAggregateByIdDto

    const redisKey = `latestAggregate:${aggregatorId.toString()}`
    const rawResult = await this.redis.get(redisKey)
    if (!rawResult) {
      return await this.findLatestByAggregatorIdFromPrisma(aggregatorId)
    }
    const { timestamp, value } = JSON.parse(rawResult)
    return { timestamp: timestamp.toString(), value: value.toString() }
  }

  async findLatestByAggregatorIdFromPrisma(aggregatorId) {
    const prismaResult = await this.prisma.aggregate.findFirst({
      where: { aggregatorId: Number(aggregatorId) },
      orderBy: { timestamp: 'desc' }
    })
    if (!prismaResult) {
      return { timestamp: '', value: null }
    }

    const { timestamp, value } = prismaResult
    return { timestamp: new Date(timestamp).getTime(), value: value.toString() }
  }

  /*
   * `findLatest` is used by Aggregator heartbeat process that
   * periodically requests the latest aggregated data.
   */
  async findLatestByName(name: string) {
    const query = Prisma.sql`SELECT aggregate_id as id, timestamp, value, aggregator_id as "aggregatorId"
        FROM aggregates
        WHERE aggregator_id = (SELECT aggregator_id FROM aggregators WHERE name_hash = ${name})
        ORDER BY timestamp DESC
        LIMIT 1;`
    const result: Prisma.AggregateScalarFieldEnum[] = await this.prisma.$queryRaw(query)
    if (result && result.length == 1) {
      return {
        id: result[0]['id'],
        value: Number(result[0]['value']),
        timestamp: result[0]['timestamp'],
        aggregatorId: result[0]['aggregatorId']
      }
    } else {
      return null
    }
  }
}
