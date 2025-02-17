import { BadRequestException, Injectable } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';

import { CreateCountryDto } from './dto/create-country.dto';

@Injectable()
export class CountriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateCountryDto) {
    const existingCountry = await this.prisma.country.findFirst({
      where: { name: data.name },
    });

    if (existingCountry) {
      throw new BadRequestException('El país ya está registrado.');
    }

    const country = await this.prisma.country.create({
      data: {
        name: data.name,
        code: data.code,
        phone_code: data.phone_code,
        currency_code: data.currency_code,
        currency_name: data.currency_name,
        currency_symbol: data.currency_symbol,
        flag: data.flag,
        language: data.language,
        capital: data.capital,
        is_active: data.is_active,
      },
    });

    return { message: 'País creado exitosamente', country };
  }

  async findAll() {
    return this.prisma.country.findMany();
  }
}
