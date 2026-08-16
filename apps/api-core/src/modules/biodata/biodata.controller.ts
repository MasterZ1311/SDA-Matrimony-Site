import { Controller, Get, Param, Res, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { BiodataService } from './biodata.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('SDA Biodata PDF Generator')
@Controller('biodata')
export class BiodataController {
  constructor(private readonly biodataService: BiodataService) {}

  @Get(':profileId/download')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Generate and download printable Seventh-day Adventist Biodata PDF' })
  async downloadBiodata(@Param('profileId') profileId: string, @Res() res: Response) {
    const pdfBuffer = await this.biodataService.generateBiodataPdf(profileId);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=SDA_Biodata_${profileId.slice(0, 8)}.pdf`,
      'Content-Length': pdfBuffer.length,
    });

    res.end(pdfBuffer);
  }
}
