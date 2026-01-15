import { Controller, Post, Get, Body, Query, Param, Res, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import type { Response } from 'express';
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

  /**
   * Track email opens via tracking pixel
   * Returns a 1x1 transparent GIF
   */
  @Get('track/open/:campaignId/:subscriberId')
  @ApiOperation({ summary: 'Track email open (tracking pixel)' })
  async trackOpen(
    @Param('campaignId') campaignId: string,
    @Param('subscriberId') subscriberId: string,
    @Res() res: Response,
  ) {
    // Track the email open in background (non-blocking)
    this.newsletterService.trackEmailOpen(campaignId, subscriberId).catch(err => {
      console.error('Error tracking email open:', err);
    });

    // Return a 1x1 transparent GIF immediately
    const pixel = Buffer.from(
      'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
      'base64'
    );

    res.writeHead(HttpStatus.OK, {
      'Content-Type': 'image/gif',
      'Content-Length': pixel.length,
      'Cache-Control': 'no-store, no-cache, must-revalidate, private',
      'Pragma': 'no-cache',
      'Expires': '0',
    });
    res.end(pixel);
  }

  /**
   * Track link clicks and redirect to actual URL
   */
  @Get('track/click/:campaignId/:subscriberId')
  @ApiOperation({ summary: 'Track link click and redirect' })
  async trackClick(
    @Param('campaignId') campaignId: string,
    @Param('subscriberId') subscriberId: string,
    @Query('url') targetUrl: string,
    @Res() res: Response,
  ) {
    // Track the click in background (non-blocking)
    this.newsletterService.trackEmailClick(campaignId, subscriberId).catch(err => {
      console.error('Error tracking email click:', err);
    });

    // Redirect to the actual URL
    if (targetUrl) {
      res.redirect(HttpStatus.FOUND, decodeURIComponent(targetUrl));
    } else {
      res.status(HttpStatus.BAD_REQUEST).send('Missing target URL');
    }
  }
}
