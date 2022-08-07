import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArtRepository } from 'src/Repository/art.repository';
import { ArtistRepository } from 'src/Repository/artist.repository';
import { CategoryRepository } from '../../Repository/category.repository';

@Injectable()
export class DistributionService {
    constructor(
        @InjectRepository(ArtRepository)
        @InjectRepository(CategoryRepository)
        @InjectRepository(ArtistRepository)
        private artRepository: ArtRepository,
        private categoryRepository: CategoryRepository,
        private artistRepository: ArtistRepository,
    ) { }

    // 작가 별 분배포인트 계산 (한명. id로)
    async calculateDistribution(id: number): Promise<any> {
        const list = await this.artRepository.find({
            where: [
                { artistId: id }
            ]
        }); // 작가명이 id인 사람의 작품들 배열 ==> 여기서 카테고리 명만 빼서 배열에 저장하자. 카테고리 명에 따른 분배 포인트들의 합 구하기.

        const categoryArray = []; // 각 작품들의 카테고리 id들 저장되어 있음
        const downloadCountArray = []; // 각 작품들의 다운로드 횟수 저장되어 있음
        list.forEach((element) => {
            categoryArray.push(element.categoryId);
            downloadCountArray.push(element.downloadCount);
        })

        //console.log(categoryArray); // [1,2,3]

        let categoryList = [];

        for (let i = 0; i < categoryArray.length; i++) {
            categoryList.push(await this.categoryRepository.find({
                where: [{ id: categoryArray[i] }]
            })
            )
        }
        const categoryPoint = [];

        categoryList.forEach((element) => {
            categoryPoint.push(element[0].downloadDistribution);
        })

        const calculatedPoint = [];

        for (let i = 0; i < categoryPoint.length; i++) {
            calculatedPoint.push(categoryPoint[i] * downloadCountArray[i]);
        }

        // console.log(calculatedPoint);

        const pointSum = calculatedPoint.reduce((sum, currVal) => { // 전체 포인트 합
            return sum + currVal;
        }, 0);

        // console.log(pointSum);

        return pointSum;
        
    }

    // 작가 별 분배포인트 계산 (한명. 이름으로)
    async calculateDistributionByName(name: string): Promise<any> {

        // 작가 이름으로 작가의 id를 알아내자.
        const id = (await this.artistRepository.findOne({
            where: {
                name: name
            }
        })).id;

        const list = await this.artRepository.find({
            where: [
                { artistId: id } // art 엔티티에서.
            ]
        }); // 작가명이 id인 사람의 작품들 배열 ==> 여기서 카테고리 명만 빼서 배열에 저장하자. 카테고리 명에 따른 분배 포인트들의 합 구하기.

        const categoryArray = []; // 각 작품들의 카테고리 id들 저장되어 있음
        const downloadCountArray = []; // 각 작품들의 다운로드 횟수 저장되어 있음
        list.forEach((element) => {
            categoryArray.push(element.categoryId);
            downloadCountArray.push(element.downloadCount);
        })

        //console.log(categoryArray); // [1,2,3]

        let categoryList = [];

        for (let i = 0; i < categoryArray.length; i++) {
            categoryList.push(await this.categoryRepository.find({
                where: [{ id: categoryArray[i] }]
            })
            )
        }
        const categoryPoint = [];

        categoryList.forEach((element) => {
            categoryPoint.push(element[0].downloadDistribution);
        })

        const calculatedPoint = [];

        for (let i = 0; i < categoryPoint.length; i++) {
            calculatedPoint.push(categoryPoint[i] * downloadCountArray[i]);
        }

        // console.log(calculatedPoint);

        const pointSum = calculatedPoint.reduce((sum, currVal) => { // 전체 포인트 합
            return sum + currVal;
        }, 0);

        // console.log(pointSum);

        return pointSum;
        
    }

    // 모든 작가 분배 포인트 계산
    async calculateDistributionAll(money: number): Promise<any> {
        const artistIdArray = await this.artistRepository.find();
        const nameArray = []; // 등록된 작가의 이름들
        for (const i of artistIdArray) {
            nameArray.push(i.name); // 작가들의 이름 배열에 넣기
        }

        const calculatedPoint = []; // 작가별 포인트 [15,6,0,0,0]
        for (const i of nameArray) {
            calculatedPoint.push(await this.calculateDistributionByName(i));
        }

        const pointSum = calculatedPoint.reduce((sum, currVal) => { // 전체 포인트 합
            return sum + currVal;
        }, 0);

        for (let i in calculatedPoint) {
            calculatedPoint[i] = calculatedPoint[i] / pointSum * money;
        }

        // https://ingnoh.tistory.com/133
        // 두 배열 하나의 객체로 합치기. (key: value)
        const result = nameArray.reduce((acc, curr, idx) => {
            acc[curr] = calculatedPoint[idx];
            return acc;
        }, new Object);

        return result;
    }
}