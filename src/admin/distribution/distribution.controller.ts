import { Body, Controller, Get, Param, Post, Render } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Category } from 'src/Entity/category.entity';
import { DistributionService } from './distribution.service';

@ApiTags('distribution')
@Controller('distribution')
export class DistributionController {
    constructor(private readonly distributionService: DistributionService) { }

    @Get()
    @Render('index')
    root() {
        return { message: "총 수익을 입력하세요" };
    }

    // 작가 별 분배포인트 계산
    @Post()
    @ApiOperation({ summary: '작가 별 분배포인트 계산 API', description: '작가 별 분배포인트 계산' })
    @ApiCreatedResponse({ description: '작가 별 분배포인트 계산', type: Category })
    async calculateDistributionAll(@Body('money') money: number): Promise<number[]> {
        // return this.distributionService.calculateDistributionAll(money);
        const result = await this.distributionService.calculateDistributionAll(money);
        return result;
    }

    // // 작가 별 분배포인트 계산
    // @Post()
    // // @Render('index')
    // @ApiOperation({ summary: '작가 별 분배포인트 계산 API', description: '작가 별 분배포인트 계산' })
    // @ApiCreatedResponse({ description: '작가 별 분배포인트 계산', type: Category })
    // async calculateDistributionAll2(@Body('money') money: number) {
    //     // return {result: await this.distributionService.calculateDistributionAll(money)};
    //     const result = await this.distributionService.calculateDistributionAll(money);

    //     // var o = {
    //     //     bob: 'For sure',
    //     //     roger: 'Unknown',
    //     //     donkey: 'What an ass'
    //     // }, mustacheFormattedData = { 'people': [] };

    //     // // var o = result1, mustacheFormattedData = { 'people': [] };

    //     // for (var prop in o) {
    //     //     if (o.hasOwnProperty(prop)) {
    //     //         mustacheFormattedData['people'].push({
    //     //             'key': prop,
    //     //             'value': o[prop]
    //     //         });
    //     //     }
    //     // }

    //     // console.log("m: ", mustacheFormattedData);


    //     // return {people: mustacheFormattedData.people};
    //     return {result: result};
    // }

    // 작가 한명 분배포인트 계산 테스트
    @Get('/:name')
    calculateDistributionByName(@Param('name') name: string): Promise<number> {
        return this.distributionService.calculateDistributionByName(name);
    }
}
