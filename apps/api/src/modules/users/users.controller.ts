import { Controller, Get, Put, Delete, Param, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UpdateUserDto } from './dto/update-user.dto';

// Gestao de equipe (listar/editar/remover outros usuarios do negocio) -
// perfil proprio continua em GET /auth/me, que nao passa por aqui.
@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('PROPRIETARIO', 'ADMINISTRADOR')
@ApiBearerAuth()
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Listar usuarios do negocio' })
  async findAll(@Request() req: any) {
    return this.usersService.findByBusinessId(req.user.businessId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar usuario por ID' })
  async findOne(@Param('id') id: string, @Request() req: any) {
    return this.usersService.findOne(id, req.user.businessId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar usuario' })
  async update(@Param('id') id: string, @Body() data: UpdateUserDto, @Request() req: any) {
    return this.usersService.update(id, req.user.businessId, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover usuario' })
  async delete(@Param('id') id: string, @Request() req: any) {
    return this.usersService.delete(id, req.user.businessId);
  }
}
