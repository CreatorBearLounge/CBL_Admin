import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Category } from 'src/Entity/category.entity';
import { DistributionService } from './distribution.service';

@ApiTags('distribution')
@Controller('distribution')
export class DistributionController {
    constructor(private readonly distributionService: DistributionService) { }
    // 작가 별 분배포인트 계산
    @Post()
    @ApiOperation({ summary: '작가 별 분배포인트 계산 API', description: '작가 별 분배포인트 계산' })
    @ApiCreatedResponse({ description: '작가 별 분배포인트 계산', type: Category })
    calculateDistributionAll(@Body('money') money: number): Promise<number[]> {
        return this.distributionService.calculateDistributionAll(money);
    }

    // 작가 한명 분배포인트 계산 테스트
    @Get('/:name')
    calculateDistributionByName(@Param('name') name: string): Promise<number> {
        return this.distributionService.calculateDistributionByName(name);
    }
}
