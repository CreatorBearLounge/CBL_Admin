import { Req, Res, Injectable, BadRequestException, Request } from '@nestjs/common';
import * as multer from 'multer';
import * as AWS from 'aws-sdk';
import * as multerS3 from 'multer-s3';
import { S3Repository } from './s3.repository';
import { UploadFile } from './entities/s3.entity';
import { InjectRepository } from '@nestjs/typeorm';

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS,
  region: process.env.AWS_REGION
});


@Injectable()
export class S3Service {

  constructor(@InjectRepository(UploadFile) 
    private readonly s3Repository: S3Repository) {}

  async uploadImage(files: Express.Multer.File[],@Req() request, @Res() response) { 
    const uploadFiles = [];
    for(const element of files) {
      const file = new UploadFile();
      file.originalName =element.originalname;
      uploadFiles.push(file);
    }
    console.log(uploadFiles);
    // console.log(this.s3Repository);
    
    // try{
      // console.log(request.files[0].location)
      // return {data: await this.s3Repository.save(uploadFiles)};
    try{
      this.s3Repository.save(uploadFiles);
      console.log(request.files[0].location)
      return response.json(request.files[0].location);

    } catch(error) {
      throw new BadRequestException(error.message);
    }
  }

}