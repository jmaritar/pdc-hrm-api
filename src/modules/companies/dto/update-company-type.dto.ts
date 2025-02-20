import { PartialType } from '@nestjs/swagger';

import { CreateCompanyTypeDto } from './create-company-type.dto';

export class UpdateCompanyTypeDto extends PartialType(CreateCompanyTypeDto) {}
