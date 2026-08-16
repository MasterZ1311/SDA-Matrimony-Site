import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ChurchService } from './church.service';

@ApiTags('SDA Church Hierarchy Directory')
@Controller('church')
export class ChurchController {
  constructor(private readonly churchService: ChurchService) {}

  @Get('divisions')
  @ApiOperation({ summary: 'List all General Conference World Divisions' })
  async getDivisions() {
    return this.churchService.getDivisions();
  }

  @Get('unions')
  @ApiOperation({ summary: 'List Unions (optionally filtered by Division)' })
  @ApiQuery({ name: 'divisionId', required: false })
  async getUnions(@Query('divisionId') divisionId?: string) {
    return this.churchService.getUnions(divisionId);
  }

  @Get('conferences')
  @ApiOperation({ summary: 'List Conferences/Missions (optionally filtered by Union)' })
  @ApiQuery({ name: 'unionId', required: false })
  async getConferences(@Query('unionId') unionId?: string) {
    return this.churchService.getConferences(unionId);
  }

  @Get('local-churches')
  @ApiOperation({ summary: 'List Local Congregations (optionally filtered by Conference)' })
  @ApiQuery({ name: 'conferenceId', required: false })
  async getLocalChurches(@Query('conferenceId') conferenceId?: string) {
    return this.churchService.getLocalChurches(conferenceId);
  }
}
