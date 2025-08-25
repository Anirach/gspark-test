import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data
  await prisma.lendingInfo.deleteMany();
  await prisma.book.deleteMany();

  // Create sample books
  const books = await Promise.all([
    prisma.book.create({
      data: {
        title: 'The Elegance of Typography',
        author: 'Marcus Reed',
        isbn: '978-0-123456-78-9',
        genre: 'DESIGN',
        description: 'A comprehensive guide to the art and science of typography in modern design.',
        status: 'OWNED',
      }
    }),
    
    prisma.book.create({
      data: {
        title: 'Modern Architecture',
        author: 'Sarah Johnson',
        isbn: '978-0-987654-32-1',
        genre: 'ARCHITECTURE',
        description: 'Exploring contemporary architectural movements and their impact on urban design.',
        status: 'LENT',
        lendingInfo: {
          create: {
            borrowerName: 'Alex Thompson',
            borrowerContact: 'alex@email.com',
            dateLent: new Date('2024-03-01'),
            expectedReturn: new Date('2024-03-15'),
            notes: 'Borrowed for architecture class project'
          }
        }
      }
    }),
    
    prisma.book.create({
      data: {
        title: 'Digital Renaissance',
        author: 'Elena Martinez',
        isbn: '978-0-555666-77-8',
        genre: 'TECHNOLOGY',
        description: 'How technology is reshaping art, culture, and human creativity in the 21st century.',
        status: 'WISHLIST',
      }
    }),
    
    prisma.book.create({
      data: {
        title: 'The Art of Clean Code',
        author: 'Robert C. Martin',
        isbn: '978-0-132350-88-4',
        genre: 'TECHNOLOGY',
        description: 'A handbook of agile software craftsmanship.',
        status: 'OWNED',
      }
    }),
    
    prisma.book.create({
      data: {
        title: 'Sapiens: A Brief History of Humankind',
        author: 'Yuval Noah Harari',
        isbn: '978-0-062316-09-7',
        genre: 'HISTORY',
        description: 'From a renowned historian comes a groundbreaking narrative of humanity\'s creation and evolution.',
        status: 'OWNED',
      }
    }),
    
    prisma.book.create({
      data: {
        title: 'The Design of Everyday Things',
        author: 'Don Norman',
        isbn: '978-0-465050-65-0',
        genre: 'DESIGN',
        description: 'The ultimate guide to human-centered design.',
        status: 'LENT',
        lendingInfo: {
          create: {
            borrowerName: 'Maria Garcia',
            borrowerContact: '+1-555-0123',
            dateLent: new Date('2024-02-20'),
            expectedReturn: new Date('2024-03-20'),
            notes: 'Research for UX design thesis'
          }
        }
      }
    })
  ]);

  console.log(`✅ Created ${books.length} books`);
  
  // Show statistics
  const stats = {
    totalBooks: await prisma.book.count(),
    ownedBooks: await prisma.book.count({ where: { status: 'OWNED' } }),
    lentBooks: await prisma.book.count({ where: { status: 'LENT' } }),
    wishlistBooks: await prisma.book.count({ where: { status: 'WISHLIST' } }),
  };

  console.log('📊 Database Statistics:');
  console.log(`   Total Books: ${stats.totalBooks}`);
  console.log(`   Owned: ${stats.ownedBooks}`);
  console.log(`   Lent: ${stats.lentBooks}`);
  console.log(`   Wishlist: ${stats.wishlistBooks}`);
  
  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });