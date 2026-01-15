import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { NewsletterService } from './newsletter.service';
import { SubscribeNewsletterDto, UnsubscribeNewsletterDto } from './dto/newsletter.dto';

@ApiTags('newsletter')
@Controller('newsletter')
export class NewsletterController {
  constructor(private readonly newsletterService: NewsletterService) {}

  @Post('subscribe')
  @ApiOperation({ summary: 'Subscribe to newsletter' })
  subscribe(@Body() data: SubscribeNewsletterDto) {
    return this.newsletterService.subscribe(data);
  }

  @Post('unsubscribe')
  @ApiOperation({ summary: 'Unsubscribe from newsletter' })
  unsubscribe(@Body() data: UnsubscribeNewsletterDto) {
    return this.newsletterService.unsubscribe(data.email);
  }

  @Get('unsubscribe')
  @ApiOperation({ summary: 'Unsubscribe via GET link (for email links)' })
  unsubscribeViaLink(@Query('email') email: string) {
    return this.newsletterService.unsubscribe(email);
  }
}
