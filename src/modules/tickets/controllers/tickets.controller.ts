import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { TicketsService } from '../services/tickets.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import {
  ResponseInterceptor,
  ResponsePaginationInterceptor,
} from '@utils/interceptors';
import {
  CreateTicketDto,
  CreateTicketQrDto,
  ListTicketDto,
  ScanTicketQrDto,
} from '../dtos/tickets.dto';
import { GetCurrentUser } from 'modules/common/decorators';

@ApiTags('Ticket')
@ApiBearerAuth()
@Controller({ path: 'tickets', version: '1' })
export class TicketsController {
  constructor(private readonly service: TicketsService) {}

  @Post()
  @UseInterceptors(new ResponseInterceptor('ticket'))
  async createTicket(
    @Body() dto: CreateTicketDto,
    @GetCurrentUser('_id') userId: string,
  ) {
    return this.service.createTicket(dto, userId);
  }

  @Post('generate-qr')
  @UseInterceptors(new ResponseInterceptor('ticket'))
  async generateQr(
    @Body() dto: CreateTicketQrDto,
    @GetCurrentUser('_id') userId: string,
  ) {
    return this.service.generateQr(dto, userId);
  }

  @Post('scan-ticket')
  @UseInterceptors(new ResponseInterceptor('ticket'))
  async scanTicket(
    @Body() dto: ScanTicketQrDto,
    @GetCurrentUser('username') username: string,
  ) {
    return this.service.scanTicket(dto, username);
  }

  @Get()
  @UseInterceptors(new ResponsePaginationInterceptor('ticket'))
  async listTicket(
    @Query() dto: ListTicketDto,
    @GetCurrentUser('_id') userId: string,
  ) {
    return this.service.ticketList(dto, userId);
  }
}
