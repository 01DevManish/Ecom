import { Controller, Get, Post, Delete, Body, Query, Headers, HttpException, HttpStatus } from '@nestjs/common';
import { SitesService } from './sites.service';
import { AuthService } from '../auth/auth.service';

@Controller('sites')
export class SitesController {
  constructor(
    private readonly sitesService: SitesService,
    private readonly authService: AuthService,
  ) {}

  private requireAdmin(authHeader: string) {
    if (!authHeader) throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    const token = authHeader.replace('Bearer ', '');
    const auth = this.authService.verifyToken(token);
    if (!auth || auth.role !== 'admin') {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    return auth;
  }

  @Get()
  async getSites() {
    return this.sitesService.listSites();
  }

  @Post()
  async createSite(@Headers('authorization') authHeader: string, @Body() body: any) {
    this.requireAdmin(authHeader);
    return this.sitesService.createSite(body);
  }

  @Delete()
  async deleteSite(@Headers('authorization') authHeader: string, @Query('id') id: string) {
    this.requireAdmin(authHeader);
    return this.sitesService.deleteSite(id);
  }
}
