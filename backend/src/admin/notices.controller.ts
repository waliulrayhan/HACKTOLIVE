import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminService } from './admin.service';

@ApiTags('notices')
@Controller('notices')
export class NoticesController {
  constructor(private readonly adminService: AdminService) {}

  @Get('active')
  @ApiOperation({ summary: 'Get active notices for homepage banner' })
  getActiveNotices() {
    return this.adminService.getActiveNotices();
  }

  @Get('latest')
  @ApiOperation({ summary: 'Get the latest active notice for quick display' })
  getLatestNotice() {
    return this.adminService.getLatestActiveNotice();
  }
}
