import { Controller, Get, Post, Delete, Query, Body, Headers, HttpException, HttpStatus } from '@nestjs/common';
import { AdminProductsService } from './products.service';
import { AuthService } from '../auth/auth.service';

@Controller('products')
export class AdminProductsController {
  constructor(
    private readonly productsService: AdminProductsService,
    private readonly authService: AuthService,
  ) {}

  private requireAdmin(authHeader: string) {
    if (!authHeader) throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    const token = authHeader.replace('Bearer ', '');
    const auth = this.authService.verifyToken(token);
    if (!auth || (auth.role !== 'admin' && auth.role !== 'team')) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    return auth;
  }

  @Get()
  async listProducts(@Query('skus') skus?: string) {
    if (skus === '1') return this.productsService.getSkus();
    return this.productsService.listAll();
  }

  @Delete()
  async deleteProduct(@Headers('authorization') authHeader: string, @Query('id') id?: string, @Query('clearAll') clearAll?: string) {
    this.requireAdmin(authHeader);
    if (clearAll === '1') return this.productsService.clearAll();
    if (!id) throw new HttpException('Product id is required', HttpStatus.BAD_REQUEST);
    return this.productsService.deleteById(id);
  }
}
