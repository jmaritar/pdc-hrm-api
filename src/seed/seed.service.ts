import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

@Injectable()
export class SeedService {
  async run() {
    console.info('🌱 Iniciando el seeding de la base de datos...');

    try {
      // Crear País
      const country = await prisma.country.create({
        data: { name: 'Guatemala', code: 'GT' },
      });

      // Crear Departamento
      const department = await prisma.department.create({
        data: { name: 'Izabal', country_id: country.id_country },
      });

      // Crear Municipio
      const municipality = await prisma.municipality.create({
        data: { name: 'Livingston', department_id: department.id_department },
      });

      // Crear Tipo de Empresa
      const companyType = await prisma.companyType.create({
        data: { name: 'Tecnología' },
      });

      // Crear Empresa
      const company = await prisma.company.create({
        data: {
          legal_name: 'PDC Solutions',
          trade_name: 'TechCorp',
          nit: '123456789',
          phone: '50212345678',
          email: 'contact@techcorp.com',
          address: 'Zona 10, Ciudad de Guatemala',
          company_type_id: companyType.id_company_type,
          country_id: country.id_country,
          department_id: department.id_department,
          municipality_id: municipality.id_municipality,
        },
      });

      // Hashear Contraseña
      const hashedPassword = bcrypt.hashSync('Password123!', 10);

      // Crear Usuarios
      const superAdmin = await prisma.user.create({
        data: {
          email: 'super@pdc.com',
          name: 'Super Admin',
          password: hashedPassword,
          role: 'SUPER_ADMIN',
        },
      });

      const admin = await prisma.user.create({
        data: {
          email: 'admin@pdc.com',
          name: 'Admin User',
          password: hashedPassword,
          role: 'ADMIN',
        },
      });

      const hrUser = await prisma.user.create({
        data: {
          email: 'hr@pdc.com',
          name: 'HR User',
          password: hashedPassword,
          role: 'HR',
        },
      });

      // Asociar Usuarios a la Empresa
      await prisma.userCompany.createMany({
        data: [
          { user_id: superAdmin.id_user, company_id: company.id_company },
          { user_id: admin.id_user, company_id: company.id_company },
          { user_id: hrUser.id_user, company_id: company.id_company },
        ],
      });

      // Crear Colaborador
      const collaborator = await prisma.collaborator.create({
        data: {
          name: 'John Doe',
          age: 30,
          email: 'johndoe@example.com',
          phone: '50298765432',
          address: 'Zona 5, Ciudad de Guatemala',
          salary: 10000,
          position: 'Desarrollador Senior',
        },
      });

      // Asociar Colaborador a la Empresa
      await prisma.collaboratorCompany.create({
        data: {
          collaborator_id: collaborator.id_collaborator,
          company_id: company.id_company,
          start_date: new Date(),
        },
      });

      // Crear Sesión de Usuario
      await prisma.session.create({
        data: {
          user_id: superAdmin.id_user,
          token: 'random_token',
          refresh_token: 'random_refresh_token',
          expires_at: new Date(Date.now() + 60 * 60 * 24 * 7 * 1000), // Expira en 7 días
          platform: 'Web',
          device_name: 'Chrome Browser',
          device_os: 'Windows 10',
          ip_address: '192.168.1.1',
        },
      });

      // Crear Logs de Auditoría
      await prisma.log.createMany({
        data: [
          {
            user_id: superAdmin.id_user,
            table_name: 'User',
            action: 'CREATE',
            record_id: superAdmin.id_user,
          },
          {
            user_id: superAdmin.id_user,
            table_name: 'Company',
            action: 'CREATE',
            record_id: company.id_company,
          },
        ],
      });

      console.info('✅ Seeding completado con éxito.');
    } catch (error) {
      console.error('❌ Error en el seeding:', error);
    } finally {
      await prisma.$disconnect();
    }
  }
}
