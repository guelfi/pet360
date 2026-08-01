import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // ===========================================
  // NEGOCIO
  // ===========================================

  const business = await prisma.business.upsert({
    where: { slug: 'petshop-demo' },
    update: {},
    create: {
      name: 'PetShop Demo',
      slug: 'petshop-demo',
      phone: '11999999999',
      email: 'contato@petshopdemo.com',
      businessTypes: ['PETSHOP', 'VETERINARY', 'GROOMING'],
      address: 'Rua das Flores, 123',
      city: 'Sao Paulo',
      state: 'SP',
      zipCode: '01310-100',
    },
  });

  console.log('Business created:', business.name);

  // ===========================================
  // USUARIOS (um por role, mesma senha, para testar RBAC via email/senha)
  // ===========================================

  const passwordHash = await bcrypt.hash('Admin246#', 10);

  const admin = await prisma.user.upsert({
    where: { businessId_email: { businessId: business.id, email: 'admin@petshopdemo.com' } },
    update: { passwordHash },
    create: {
      businessId: business.id,
      name: 'Administrador',
      email: 'admin@petshopdemo.com',
      phone: '11999999999',
      role: 'OWNER',
      passwordHash,
    },
  });

  const vet = await prisma.user.upsert({
    where: { businessId_email: { businessId: business.id, email: 'vet@petshopdemo.com' } },
    update: { passwordHash },
    create: {
      businessId: business.id,
      name: 'Dr. Carlos Silva',
      email: 'vet@petshopdemo.com',
      phone: '11988888888',
      role: 'VET',
      crmv: '12345-SP',
      passwordHash,
    },
  });

  const manager = await prisma.user.upsert({
    where: { businessId_email: { businessId: business.id, email: 'gerente@petshopdemo.com' } },
    update: { passwordHash },
    create: {
      businessId: business.id,
      name: 'Fernanda Souza',
      email: 'gerente@petshopdemo.com',
      phone: '11966666666',
      role: 'ADMIN',
      passwordHash,
    },
  });

  const groomer = await prisma.user.upsert({
    where: { businessId_email: { businessId: business.id, email: 'groomer@petshopdemo.com' } },
    update: { passwordHash },
    create: {
      businessId: business.id,
      name: 'Juliana Alves',
      email: 'groomer@petshopdemo.com',
      phone: '11955555555',
      role: 'GROOMER',
      passwordHash,
    },
  });

  const attendant = await prisma.user.upsert({
    where: { businessId_email: { businessId: business.id, email: 'atendente@petshopdemo.com' } },
    update: { passwordHash },
    create: {
      businessId: business.id,
      name: 'Bruno Costa',
      email: 'atendente@petshopdemo.com',
      phone: '11944444444',
      role: 'ATTENDANT',
      passwordHash,
    },
  });

  const trainer = await prisma.user.upsert({
    where: { businessId_email: { businessId: business.id, email: 'trainer@petshopdemo.com' } },
    update: { passwordHash },
    create: {
      businessId: business.id,
      name: 'Rafael Nunes',
      email: 'trainer@petshopdemo.com',
      phone: '11933333333',
      role: 'TRAINER',
      passwordHash,
    },
  });

  console.log('Users created: admin, vet, manager, groomer, attendant, trainer (senha: Admin246#)');

  // ===========================================
  // SERVICOS
  // ===========================================

  const services = await Promise.all([
    prisma.service.upsert({
      where: { id: 'service-consulta' },
      update: {},
      create: {
        id: 'service-consulta',
        businessId: business.id,
        name: 'Consulta Veterinaria',
        description: 'Consulta clinica geral',
        category: 'VETERINARY',
        duration: 30,
        price: 150,
        requiresVet: true,
      },
    }),
    prisma.service.upsert({
      where: { id: 'service-banho-p' },
      update: {},
      create: {
        id: 'service-banho-p',
        businessId: business.id,
        name: 'Banho Pequeno Porte',
        description: 'Banho para caes de pequeno porte',
        category: 'GROOMING',
        duration: 60,
        price: 50,
        acceptedSizes: ['MINI', 'SMALL'],
      },
    }),
    prisma.service.upsert({
      where: { id: 'service-banho-m' },
      update: {},
      create: {
        id: 'service-banho-m',
        businessId: business.id,
        name: 'Banho Medio Porte',
        description: 'Banho para caes de medio porte',
        category: 'GROOMING',
        duration: 90,
        price: 70,
        acceptedSizes: ['MEDIUM'],
      },
    }),
    prisma.service.upsert({
      where: { id: 'service-banho-g' },
      update: {},
      create: {
        id: 'service-banho-g',
        businessId: business.id,
        name: 'Banho Grande Porte',
        description: 'Banho para caes de grande porte',
        category: 'GROOMING',
        duration: 120,
        price: 100,
        acceptedSizes: ['LARGE', 'GIANT'],
      },
    }),
    prisma.service.upsert({
      where: { id: 'service-tosa' },
      update: {},
      create: {
        id: 'service-tosa',
        businessId: business.id,
        name: 'Tosa Higienica',
        description: 'Tosa higienica completa',
        category: 'GROOMING',
        duration: 45,
        price: 40,
      },
    }),
    prisma.service.upsert({
      where: { id: 'service-vacina' },
      update: {},
      create: {
        id: 'service-vacina',
        businessId: business.id,
        name: 'Aplicacao de Vacina',
        description: 'Aplicacao de vacinas (valor da vacina nao incluso)',
        category: 'VETERINARY',
        duration: 15,
        price: 30,
        requiresVet: true,
      },
    }),
  ]);

  console.log('Services created:', services.length);

  // ===========================================
  // TUTORES
  // ===========================================

  const tutor = await prisma.tutor.upsert({
    where: { businessId_cpf: { businessId: business.id, cpf: '12345678900' } },
    update: {},
    create: {
      businessId: business.id,
      name: 'Maria Santos',
      cpf: '12345678900',
      phone: '11977777777',
      email: 'maria@email.com',
      address: 'Av. Paulista, 1000',
      city: 'Sao Paulo',
      state: 'SP',
    },
  });

  const tutor2 = await prisma.tutor.upsert({
    where: { businessId_cpf: { businessId: business.id, cpf: '22233344455' } },
    update: {},
    create: {
      businessId: business.id,
      name: 'Joao Pereira',
      cpf: '22233344455',
      phone: '11977776666',
      email: 'joao@email.com',
      address: 'Rua Augusta, 500',
      city: 'Sao Paulo',
      state: 'SP',
    },
  });

  const tutor3 = await prisma.tutor.upsert({
    where: { businessId_cpf: { businessId: business.id, cpf: '33344455566' } },
    update: {},
    create: {
      businessId: business.id,
      name: 'Ana Costa',
      cpf: '33344455566',
      phone: '11977775555',
      email: 'ana@email.com',
      address: 'Rua Oscar Freire, 200',
      city: 'Sao Paulo',
      state: 'SP',
    },
  });

  console.log('Tutors created: 3');

  // ===========================================
  // PETS
  // ===========================================

  const petThor = await prisma.pet.upsert({
    where: { id: 'pet-thor' },
    update: {},
    create: {
      id: 'pet-thor',
      businessId: business.id,
      tutorId: tutor.id,
      name: 'Thor',
      species: 'DOG',
      breed: 'Golden Retriever',
      size: 'LARGE',
      gender: 'MALE',
      birthDate: new Date('2020-03-15'),
    },
  });

  const petMimi = await prisma.pet.upsert({
    where: { id: 'pet-mimi' },
    update: {},
    create: {
      id: 'pet-mimi',
      businessId: business.id,
      tutorId: tutor.id,
      name: 'Mimi',
      species: 'CAT',
      breed: 'Siames',
      size: 'SMALL',
      gender: 'FEMALE',
      birthDate: new Date('2021-07-20'),
    },
  });

  const petRex = await prisma.pet.upsert({
    where: { id: 'pet-rex' },
    update: {},
    create: {
      id: 'pet-rex',
      businessId: business.id,
      tutorId: tutor2.id,
      name: 'Rex',
      species: 'DOG',
      breed: 'Labrador',
      size: 'LARGE',
      gender: 'MALE',
      birthDate: new Date('2019-05-10'),
    },
  });

  const petLuna = await prisma.pet.upsert({
    where: { id: 'pet-luna' },
    update: {},
    create: {
      id: 'pet-luna',
      businessId: business.id,
      tutorId: tutor3.id,
      name: 'Luna',
      species: 'CAT',
      breed: 'Persa',
      size: 'SMALL',
      gender: 'FEMALE',
      birthDate: new Date('2022-01-05'),
    },
  });

  const petBob = await prisma.pet.upsert({
    where: { id: 'pet-bob' },
    update: {},
    create: {
      id: 'pet-bob',
      businessId: business.id,
      name: 'Bob',
      species: 'DOG',
      breed: 'SRD',
      size: 'MEDIUM',
      gender: 'MALE',
      estimatedAge: '2 anos (estimado)',
      isNeutered: true,
    },
  });

  const petNina = await prisma.pet.upsert({
    where: { id: 'pet-nina' },
    update: {},
    create: {
      id: 'pet-nina',
      businessId: business.id,
      tutorId: tutor2.id,
      name: 'Nina',
      species: 'CAT',
      breed: 'SRD',
      size: 'SMALL',
      gender: 'FEMALE',
      isNeutered: true,
    },
  });

  console.log('Pets created: 6');

  // ===========================================
  // MARKETPLACE CATEGORIES
  // ===========================================

  await Promise.all([
    prisma.marketplaceCategory.upsert({
      where: { slug: 'racoes' },
      update: {},
      create: { name: 'Racoes', slug: 'racoes', description: 'Racoes para caes e gatos', order: 1 },
    }),
    prisma.marketplaceCategory.upsert({
      where: { slug: 'petiscos' },
      update: {},
      create: { name: 'Petiscos', slug: 'petiscos', description: 'Petiscos e snacks', order: 2 },
    }),
    prisma.marketplaceCategory.upsert({
      where: { slug: 'acessorios' },
      update: {},
      create: { name: 'Acessorios', slug: 'acessorios', description: 'Coleiras, guias e acessorios', order: 3 },
    }),
    prisma.marketplaceCategory.upsert({
      where: { slug: 'brinquedos' },
      update: {},
      create: { name: 'Brinquedos', slug: 'brinquedos', description: 'Brinquedos para pets', order: 4 },
    }),
    prisma.marketplaceCategory.upsert({
      where: { slug: 'higiene' },
      update: {},
      create: { name: 'Higiene', slug: 'higiene', description: 'Produtos de higiene', order: 5 },
    }),
    prisma.marketplaceCategory.upsert({
      where: { slug: 'medicamentos' },
      update: {},
      create: { name: 'Medicamentos', slug: 'medicamentos', description: 'Medicamentos e suplementos', order: 6 },
    }),
  ]);

  console.log('Marketplace categories created');

  // ===========================================
  // PRODUTOS E ESTOQUE
  // ===========================================

  const products = await Promise.all([
    prisma.product.upsert({
      where: { id: 'product-racao-premium' },
      update: {},
      create: {
        id: 'product-racao-premium',
        businessId: business.id,
        name: 'Racao Premium Caes Adultos 15kg',
        brand: 'PetNutri',
        sku: 'RAC-PREM-15',
        category: 'RACAO',
        forSpecies: ['DOG'],
        costPrice: 120,
        salePrice: 189.9,
        currentStock: 24,
        minStock: 5,
        unit: 'un',
      },
    }),
    prisma.product.upsert({
      where: { id: 'product-shampoo' },
      update: {},
      create: {
        id: 'product-shampoo',
        businessId: business.id,
        name: 'Shampoo Neutro Pet 500ml',
        brand: 'CleanPet',
        sku: 'SHP-NEU-500',
        category: 'HIGIENE',
        forSpecies: ['DOG', 'CAT'],
        costPrice: 15,
        salePrice: 32.9,
        currentStock: 40,
        minStock: 10,
        unit: 'un',
      },
    }),
    prisma.product.upsert({
      where: { id: 'product-brinquedo' },
      update: {},
      create: {
        id: 'product-brinquedo',
        businessId: business.id,
        name: 'Brinquedo Mordedor Resistente',
        brand: 'FunPet',
        sku: 'BRI-MORD-01',
        category: 'BRINQUEDOS',
        forSpecies: ['DOG'],
        costPrice: 8,
        salePrice: 24.9,
        currentStock: 3,
        minStock: 5,
        unit: 'un',
      },
    }),
    prisma.product.upsert({
      where: { id: 'product-coleira' },
      update: {},
      create: {
        id: 'product-coleira',
        businessId: business.id,
        name: 'Coleira Ajustavel M',
        brand: 'ComfortPet',
        sku: 'COL-AJUST-M',
        category: 'ACESSORIOS',
        forSpecies: ['DOG', 'CAT'],
        costPrice: 18,
        salePrice: 45,
        currentStock: 15,
        minStock: 5,
        unit: 'un',
      },
    }),
  ]);

  console.log('Products created:', products.length);

  for (const product of products) {
    const hasMovement = await prisma.stockMovement.findFirst({ where: { productId: product.id } });
    if (!hasMovement) {
      await prisma.stockMovement.create({
        data: {
          productId: product.id,
          type: 'PURCHASE',
          quantity: product.currentStock,
          previousStock: 0,
          newStock: product.currentStock,
          unitCost: product.costPrice,
          totalCost: Number(product.costPrice) * Number(product.currentStock),
          notes: 'Estoque inicial (seed)',
        },
      });
    }
  }

  console.log('Initial stock movements created');

  // ===========================================
  // AGENDAMENTOS
  // ===========================================

  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const in3Days = new Date(now);
  in3Days.setDate(now.getDate() + 3);
  const in5Days = new Date(now);
  in5Days.setDate(now.getDate() + 5);

  const apptConsultaThor = await prisma.appointment.upsert({
    where: { id: 'appt-thor-consulta' },
    update: {},
    create: {
      id: 'appt-thor-consulta',
      businessId: business.id,
      tutorId: tutor.id,
      petId: petThor.id,
      serviceId: 'service-consulta',
      professionalId: vet.id,
      appointmentType: 'CONSULTATION',
      scheduledDate: yesterday,
      scheduledTime: '10:00',
      duration: 30,
      status: 'COMPLETED',
      price: 150,
      finalPrice: 150,
      paymentStatus: 'PAID',
      paymentMethod: 'PIX',
      completedAt: yesterday,
    },
  });

  const apptVacinaThor = await prisma.appointment.upsert({
    where: { id: 'appt-thor-vacina' },
    update: {},
    create: {
      id: 'appt-thor-vacina',
      businessId: business.id,
      tutorId: tutor.id,
      petId: petThor.id,
      serviceId: 'service-vacina',
      professionalId: vet.id,
      appointmentType: 'VACCINE',
      scheduledDate: yesterday,
      scheduledTime: '11:00',
      duration: 15,
      status: 'COMPLETED',
      price: 30,
      finalPrice: 30,
      paymentStatus: 'PAID',
      paymentMethod: 'PIX',
      completedAt: yesterday,
    },
  });

  await prisma.appointment.upsert({
    where: { id: 'appt-mimi-banho' },
    update: {},
    create: {
      id: 'appt-mimi-banho',
      businessId: business.id,
      tutorId: tutor.id,
      petId: petMimi.id,
      serviceId: 'service-banho-p',
      professionalId: groomer.id,
      appointmentType: 'GROOMING',
      scheduledDate: in3Days,
      scheduledTime: '14:00',
      duration: 60,
      status: 'SCHEDULED',
      price: 50,
      finalPrice: 50,
    },
  });

  await prisma.appointment.upsert({
    where: { id: 'appt-rex-tosa' },
    update: {},
    create: {
      id: 'appt-rex-tosa',
      businessId: business.id,
      tutorId: tutor2.id,
      petId: petRex.id,
      serviceId: 'service-tosa',
      professionalId: groomer.id,
      appointmentType: 'GROOMING',
      scheduledDate: in5Days,
      scheduledTime: '09:30',
      duration: 45,
      status: 'CONFIRMED',
      confirmedAt: now,
      price: 40,
      finalPrice: 40,
    },
  });

  console.log('Appointments created: 4');

  // ===========================================
  // PRONTUARIO E VACINAS
  // ===========================================

  const medicalRecord = await prisma.medicalRecord.upsert({
    where: { id: 'medrec-thor-01' },
    update: {},
    create: {
      id: 'medrec-thor-01',
      businessId: business.id,
      petId: petThor.id,
      vetId: vet.id,
      appointmentId: apptConsultaThor.id,
      recordDate: yesterday,
      recordType: 'CONSULTATION',
      weight: 32.5,
      temperature: 38.5,
      heartRate: 90,
      respiratoryRate: 22,
      bodyCondition: 3,
      chiefComplaint: 'Check-up de rotina',
      physicalExam: 'Animal alerta, hidratado, sem alteracoes relevantes ao exame fisico.',
      diagnosis: 'Saudavel',
      treatment: 'Nenhum tratamento necessario',
      instructions: 'Manter rotina de vacinacao e vermifugacao.',
      returnDate: in3Days,
    },
  });

  await prisma.prescription.upsert({
    where: { id: 'presc-thor-01' },
    update: {},
    create: {
      id: 'presc-thor-01',
      medicalRecordId: medicalRecord.id,
      medication: 'Vermifugo Drontal Plus',
      dosage: '1 comprimido a cada 10kg',
      frequency: 'Dose unica',
      duration: '1 dia',
      route: 'Oral',
      instructions: 'Administrar em jejum de 2 horas.',
    },
  });

  console.log('Medical record + prescription created');

  const nextDose = new Date(yesterday);
  nextDose.setFullYear(nextDose.getFullYear() + 1);

  await prisma.vaccineRecord.upsert({
    where: { id: 'vacc-thor-v10' },
    update: {},
    create: {
      id: 'vacc-thor-v10',
      businessId: business.id,
      petId: petThor.id,
      vetId: vet.id,
      appointmentId: apptVacinaThor.id,
      vaccineType: 'V10',
      vaccineName: 'Vacina V10 (Polivalente)',
      manufacturer: 'Zoetis',
      batchNumber: 'LOTE-2026-045',
      applicationDate: yesterday,
      nextDoseDate: nextDose,
    },
  });

  console.log('Vaccine record created');

  // ===========================================
  // ADOCAO
  // ===========================================

  await prisma.adoptionAnimal.upsert({
    where: { id: 'adopt-bob' },
    update: {},
    create: {
      id: 'adopt-bob',
      businessId: business.id,
      petId: petBob.id,
      rescueDate: new Date('2026-05-01'),
      rescueLocation: 'Encontrado na Rua das Flores',
      status: 'AVAILABLE',
      isVaccinated: true,
      isNeutered: true,
      isDewormed: true,
      goodWithKids: true,
      goodWithDogs: true,
      energyLevel: 'MEDIO',
      description: 'Bob e um cao docil, ja castrado e vacinado, procurando um lar cheio de carinho.',
      adoptionFee: 150,
    },
  });

  await prisma.adoptionInquiry.upsert({
    where: { id: 'inquiry-bob-01' },
    update: {},
    create: {
      id: 'inquiry-bob-01',
      adoptionAnimalId: 'adopt-bob',
      name: 'Camila Rocha',
      email: 'camila@email.com',
      phone: '11922221111',
      message: 'Ola, tenho interesse em adotar o Bob. Moro em casa com quintal.',
    },
  });

  const adoptNina = await prisma.adoptionAnimal.upsert({
    where: { id: 'adopt-nina' },
    update: {},
    create: {
      id: 'adopt-nina',
      businessId: business.id,
      petId: petNina.id,
      rescueDate: new Date('2026-02-10'),
      status: 'ADOPTED',
      adoptedDate: new Date('2026-03-01'),
      isVaccinated: true,
      isNeutered: true,
      isDewormed: true,
      goodWithKids: true,
      description: 'Nina foi resgatada filhote e ja encontrou seu lar definitivo.',
    },
  });

  await prisma.adoption.upsert({
    where: { id: 'adoption-nina-joao' },
    update: {},
    create: {
      id: 'adoption-nina-joao',
      adoptionAnimalId: adoptNina.id,
      tutorId: tutor2.id,
      applicationDate: new Date('2026-02-15'),
      interviewDate: new Date('2026-02-20'),
      homeVisitDate: new Date('2026-02-25'),
      adoptionDate: new Date('2026-03-01'),
      stage: 'COMPLETED',
    },
  });

  console.log('Adoption records created');

  // ===========================================
  // HOSPEDAGEM / HOTEL
  // ===========================================

  const boardingRoom = await prisma.boardingRoom.upsert({
    where: { businessId_name: { businessId: business.id, name: 'Suite Individual' } },
    update: {},
    create: {
      businessId: business.id,
      name: 'Suite Individual',
      code: 'S01',
      roomType: 'INDIVIDUAL',
      acceptedSpecies: ['DOG', 'CAT'],
      acceptedSizes: ['MINI', 'SMALL', 'MEDIUM'],
      capacity: 1,
      dailyRate: 120,
      amenities: ['Ar condicionado', 'Camera', 'Cama ortopedica'],
      hasCamera: true,
    },
  });

  console.log('Boarding room created');

  const checkIn = new Date(now);
  checkIn.setDate(now.getDate() - 2);
  const checkOut = new Date(now);
  checkOut.setDate(now.getDate() + 1);

  const boarding = await prisma.boarding.upsert({
    where: { id: 'boarding-rex-01' },
    update: {},
    create: {
      id: 'boarding-rex-01',
      businessId: business.id,
      tutorId: tutor2.id,
      petId: petRex.id,
      roomId: boardingRoom.id,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      status: 'CHECKED_IN',
      actualCheckIn: checkIn,
      dailyRate: 120,
      totalDays: 3,
      subtotal: 360,
      totalAmount: 360,
      paymentStatus: 'PARTIAL',
      paidAmount: 120,
      feedingSchedule: '2x ao dia (manha e noite)',
      foodType: 'Racao propria do tutor',
      emergencyContact: 'Joao Pereira',
      emergencyPhone: '11977776666',
    },
  });

  await prisma.boardingUpdate.upsert({
    where: { id: 'boarding-update-01' },
    update: {},
    create: {
      id: 'boarding-update-01',
      boardingId: boarding.id,
      userId: attendant.id,
      updateType: 'PHOTO',
      content: 'Rex esta se adaptando bem e brincando no jardim.',
      sentToTutor: true,
      sentAt: now,
    },
  });

  await prisma.boardingService.upsert({
    where: { id: 'boarding-service-01' },
    update: {},
    create: {
      id: 'boarding-service-01',
      boardingId: boarding.id,
      serviceName: 'Banho extra',
      serviceDate: now,
      price: 50,
      isCompleted: true,
      completedAt: now,
    },
  });

  console.log('Boarding records created');

  // ===========================================
  // DAYCARE / CRECHE
  // ===========================================

  const daycarePackage = await prisma.daycarePackage.upsert({
    where: { id: 'daycare-mensal' },
    update: {},
    create: {
      id: 'daycare-mensal',
      businessId: business.id,
      name: 'Plano Mensal',
      description: 'Plano mensal com 20 diarias',
      packageType: 'MONTHLY',
      daysIncluded: 20,
      validityDays: 30,
      shift: 'FULL',
      price: 800,
      activities: ['Passeio', 'Socializacao', 'Brincadeiras'],
    },
  });

  console.log('Daycare package created');

  const daycareStart = new Date(now);
  daycareStart.setDate(now.getDate() - 10);

  const enrollment = await prisma.daycareEnrollment.upsert({
    where: { id: 'daycare-enroll-luna' },
    update: {},
    create: {
      id: 'daycare-enroll-luna',
      packageId: daycarePackage.id,
      tutorId: tutor3.id,
      petId: petLuna.id,
      startDate: daycareStart,
      totalCredits: 20,
      usedCredits: 6,
      remainingCredits: 14,
      amount: 800,
      paymentStatus: 'PAID',
      paidAt: daycareStart,
    },
  });

  const attendanceDay = new Date(now);
  attendanceDay.setDate(now.getDate() - 1);
  attendanceDay.setHours(0, 0, 0, 0);
  const checkInTime = new Date(attendanceDay);
  checkInTime.setHours(8, 0, 0, 0);
  const checkOutTime = new Date(attendanceDay);
  checkOutTime.setHours(18, 0, 0, 0);

  await prisma.daycareAttendance.upsert({
    where: { enrollmentId_date: { enrollmentId: enrollment.id, date: attendanceDay } },
    update: {},
    create: {
      enrollmentId: enrollment.id,
      date: attendanceDay,
      checkInTime,
      checkOutTime,
      status: 'COMPLETED',
      behaviorNotes: 'Luna brincou bastante e socializou bem com os outros gatos.',
      activities: ['Brincadeiras', 'Socializacao'],
    },
  });

  console.log('Daycare enrollment created');

  // ===========================================
  // VENDAS E FINANCEIRO
  // ===========================================

  const sale = await prisma.sale.upsert({
    where: { id: 'sale-001' },
    update: {},
    create: {
      id: 'sale-001',
      businessId: business.id,
      tutorId: tutor.id,
      userId: attendant.id,
      subtotal: 214.8,
      totalAmount: 214.8,
      paymentMethod: 'CREDIT_CARD',
      paymentStatus: 'PAID',
      installments: 1,
    },
  });

  await prisma.saleItem.upsert({
    where: { id: 'sale-item-001' },
    update: {},
    create: {
      id: 'sale-item-001',
      saleId: sale.id,
      productId: 'product-racao-premium',
      description: 'Racao Premium Caes Adultos 15kg',
      quantity: 1,
      unitPrice: 189.9,
      totalPrice: 189.9,
      itemType: 'PRODUCT',
    },
  });

  await prisma.saleItem.upsert({
    where: { id: 'sale-item-002' },
    update: {},
    create: {
      id: 'sale-item-002',
      saleId: sale.id,
      productId: 'product-brinquedo',
      description: 'Brinquedo Mordedor Resistente',
      quantity: 1,
      unitPrice: 24.9,
      totalPrice: 24.9,
      itemType: 'PRODUCT',
    },
  });

  console.log('Sale created');

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  await prisma.cashRegister.upsert({
    where: { businessId_date: { businessId: business.id, date: today } },
    update: {},
    create: {
      businessId: business.id,
      date: today,
      cashTotal: 50,
      pixTotal: 150,
      creditTotal: 214.8,
      totalRevenue: 414.8,
      netAmount: 414.8,
      salesCount: 1,
      servicesCount: 2,
    },
  });

  console.log('Cash register created');

  // ===========================================
  // MARKETING
  // ===========================================

  await prisma.campaign.upsert({
    where: { id: 'campaign-lembrete-vacina' },
    update: {},
    create: {
      id: 'campaign-lembrete-vacina',
      businessId: business.id,
      name: 'Lembrete Anual de Vacinacao',
      type: 'WHATSAPP_BULK',
      message: 'Ola! A vacinacao do seu pet esta proxima do vencimento. Agende ja!',
      segmentType: 'VACCINE_DUE',
      status: 'SENT',
      completedAt: yesterday,
      totalRecipients: 42,
      sentCount: 40,
      failedCount: 2,
      responseCount: 15,
    },
  });

  console.log('Campaign created');

  // ===========================================
  // WHATSAPP
  // ===========================================

  await prisma.whatsAppMessage.upsert({
    where: { id: 'wa-msg-001' },
    update: {},
    create: {
      id: 'wa-msg-001',
      businessId: business.id,
      remoteJid: '5511977777777@s.whatsapp.net',
      direction: 'OUTBOUND',
      content: 'Ola Maria! Lembramos que o Thor tem consulta agendada.',
      tutorId: tutor.id,
      petId: petThor.id,
      appointmentId: apptConsultaThor.id,
      status: 'DELIVERED',
      sentAt: yesterday,
      deliveredAt: yesterday,
    },
  });

  await prisma.whatsAppMessage.upsert({
    where: { id: 'wa-msg-002' },
    update: {},
    create: {
      id: 'wa-msg-002',
      businessId: business.id,
      remoteJid: '5511977777777@s.whatsapp.net',
      direction: 'INBOUND',
      content: 'Obrigada, estaremos la!',
      tutorId: tutor.id,
      status: 'READ',
      sentAt: yesterday,
      readAt: yesterday,
    },
  });

  await prisma.messageTemplate.upsert({
    where: { businessId_type: { businessId: business.id, type: 'APPOINTMENT_REMINDER' } },
    update: {},
    create: {
      businessId: business.id,
      name: 'Lembrete de Agendamento',
      type: 'APPOINTMENT_REMINDER',
      content:
        'Ola {{tutorName}}! Lembramos que {{petName}} tem {{serviceName}} agendado para {{date}} as {{time}}.',
      variables: ['tutorName', 'petName', 'serviceName', 'date', 'time'],
    },
  });

  await prisma.messageTemplate.upsert({
    where: { businessId_type: { businessId: business.id, type: 'VACCINE_REMINDER' } },
    update: {},
    create: {
      businessId: business.id,
      name: 'Lembrete de Vacina',
      type: 'VACCINE_REMINDER',
      content: 'Ola {{tutorName}}! A vacina {{vaccineName}} de {{petName}} vence em breve.',
      variables: ['tutorName', 'petName', 'vaccineName'],
    },
  });

  console.log('WhatsApp messages and templates created');

  // ===========================================
  // PET SITTERS (plataforma, independente do negocio)
  // ===========================================

  const petSitter = await prisma.petSitter.upsert({
    where: { email: 'cuidador@petsitter-demo.com' },
    update: { passwordHash },
    create: {
      name: 'Patricia Mendes',
      email: 'cuidador@petsitter-demo.com',
      phone: '11911112222',
      passwordHash,
      bio: 'Cuidadora de pets ha 5 anos, apaixonada por animais de todos os portes.',
      address: 'Rua Harmonia, 300',
      city: 'Sao Paulo',
      state: 'SP',
      acceptedSpecies: ['DOG', 'CAT'],
      acceptedSizes: ['MINI', 'SMALL', 'MEDIUM', 'LARGE'],
      hasOwnTransport: true,
      hasYard: true,
      status: 'APPROVED',
      approvedAt: new Date('2026-01-10'),
      isVerified: true,
      averageRating: 4.8,
      totalReviews: 1,
      totalBookings: 1,
    },
  });

  const sitterService = await prisma.petSitterService.upsert({
    where: { id: 'sitter-service-hospedagem' },
    update: {},
    create: {
      id: 'sitter-service-hospedagem',
      petSitterId: petSitter.id,
      serviceType: 'BOARDING',
      name: 'Hospedagem na casa da cuidadora',
      description: 'Seu pet fica hospedado com muito carinho e cuidado.',
      priceType: 'PER_DAY',
      price: 80,
      maxPets: 2,
      includesFood: false,
      includesMeds: true,
    },
  });

  const sitterBooking = await prisma.petSitterBooking.upsert({
    where: { id: 'sitter-booking-001' },
    update: {},
    create: {
      id: 'sitter-booking-001',
      petSitterId: petSitter.id,
      serviceId: sitterService.id,
      tutorName: 'Maria Santos',
      tutorEmail: 'maria@email.com',
      tutorPhone: '11977777777',
      petName: 'Thor',
      petSpecies: 'DOG',
      petSize: 'LARGE',
      startDate: new Date('2026-04-01'),
      endDate: new Date('2026-04-05'),
      totalDays: 4,
      pricePerUnit: 80,
      subtotal: 320,
      serviceFee: 32,
      totalAmount: 352,
      sitterPayout: 288,
      status: 'COMPLETED',
      confirmedAt: new Date('2026-03-25'),
      paymentStatus: 'PAID',
      paidAt: new Date('2026-03-26'),
      completedAt: new Date('2026-04-05'),
    },
  });

  await prisma.petSitterReview.upsert({
    where: { bookingId: sitterBooking.id },
    update: {},
    create: {
      bookingId: sitterBooking.id,
      petSitterId: petSitter.id,
      rating: 5,
      title: 'Excelente cuidado!',
      comment: 'A Patricia cuidou super bem do Thor, recomendo muito!',
    },
  });

  console.log('Pet sitter records created');

  // ===========================================
  // MARKETPLACE
  // ===========================================

  const seller = await prisma.marketplaceSeller.upsert({
    where: { email: 'vendedor@petshopdemo.com' },
    update: { passwordHash },
    create: {
      name: 'PetShop Demo Store',
      email: 'vendedor@petshopdemo.com',
      phone: '11999999999',
      passwordHash,
      companyName: 'PetShop Demo Ltda',
      sellerType: 'BUSINESS',
      city: 'Sao Paulo',
      state: 'SP',
      isVerified: true,
      isActive: true,
      approvedAt: new Date('2026-01-05'),
    },
  });

  const racaoCategory = await prisma.marketplaceCategory.findUnique({ where: { slug: 'racoes' } });

  if (racaoCategory) {
    const listing = await prisma.marketplaceListing.upsert({
      where: { sellerId_slug: { sellerId: seller.id, slug: 'racao-premium-caes-15kg' } },
      update: {},
      create: {
        sellerId: seller.id,
        categoryId: racaoCategory.id,
        title: 'Racao Premium para Caes Adultos 15kg',
        slug: 'racao-premium-caes-15kg',
        description: 'Racao premium completa para caes adultos de todos os portes, rica em proteinas.',
        shortDescription: 'Racao premium 15kg',
        brand: 'PetNutri',
        forSpecies: ['DOG'],
        price: 189.9,
        compareAtPrice: 219.9,
        stock: 30,
        status: 'ACTIVE',
        publishedAt: new Date('2026-01-06'),
        salesCount: 5,
        averageRating: 4.7,
        totalReviews: 1,
      },
    });

    const order = await prisma.marketplaceOrder.upsert({
      where: { orderNumber: 'ORD-2026-0001' },
      update: {},
      create: {
        sellerId: seller.id,
        orderNumber: 'ORD-2026-0001',
        buyerName: 'Carlos Eduardo',
        buyerEmail: 'carlos@email.com',
        buyerPhone: '11911223344',
        shippingAddress: 'Rua das Palmeiras, 45',
        shippingCity: 'Sao Paulo',
        shippingState: 'SP',
        shippingZipCode: '01310-200',
        subtotal: 189.9,
        totalAmount: 189.9,
        commission: 18.99,
        sellerPayout: 170.91,
        paymentMethod: 'CREDIT_CARD',
        paymentStatus: 'PAID',
        paidAt: new Date('2026-01-15'),
        status: 'DELIVERED',
        shippedAt: new Date('2026-01-16'),
        deliveredAt: new Date('2026-01-20'),
      },
    });

    await prisma.marketplaceOrderItem.upsert({
      where: { id: 'mkt-order-item-001' },
      update: {},
      create: {
        id: 'mkt-order-item-001',
        orderId: order.id,
        listingId: listing.id,
        title: listing.title,
        quantity: 1,
        unitPrice: 189.9,
        totalPrice: 189.9,
      },
    });

    await prisma.marketplaceReview.upsert({
      where: { id: 'mkt-review-001' },
      update: {},
      create: {
        id: 'mkt-review-001',
        listingId: listing.id,
        sellerId: seller.id,
        buyerName: 'Carlos Eduardo',
        buyerEmail: 'carlos@email.com',
        rating: 5,
        title: 'Otima racao!',
        comment: 'Meu cachorro adorou, chegou rapido.',
        isVerified: true,
      },
    });
  }

  console.log('Marketplace records created');

  console.log('Seed completed successfully!');
  console.log('');
  console.log('Login (email/senha, todos com senha Admin246#):');
  console.log('  OWNER      admin@petshopdemo.com');
  console.log('  ADMIN      gerente@petshopdemo.com');
  console.log('  VET        vet@petshopdemo.com');
  console.log('  GROOMER    groomer@petshopdemo.com');
  console.log('  ATTENDANT  atendente@petshopdemo.com');
  console.log('  TRAINER    trainer@petshopdemo.com');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
