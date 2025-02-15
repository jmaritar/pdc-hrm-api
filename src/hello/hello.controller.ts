import { Controller, Get } from '@nestjs/common';

@Controller()
export class HelloController {
  @Get()
  index(): string {
    return 'Welcome to the PDC API!';
  }
}
