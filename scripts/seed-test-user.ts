/**
 * Seed Script - Test User for Glass Profile Demo
 * Creates a test user with sample links to demonstrate the Apple Liquid Glass profile page
 */

import { prisma } from '../lib/prisma'

async function seedTestUser() {
  console.log('🌱 Seeding test user for glass profile demo...')

  try {
    // Create test user
    const user = await prisma.user.upsert({
      where: { username: 'demo' },
      update: {},
      create: {
        id: 'demo-user-id',
        username: 'demo',
        displayName: 'Demo User',
        bio: 'Welcome to my beautiful glass profile! This is powered by the Apple Liquid Glass design system.',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332a331?w=150&h=150&fit=crop&crop=face',
      },
    })

    console.log('✅ Created user:', user.username)

    // Create sample links
    const links = [
      {
        title: 'My Portfolio Website',
        url: 'https://portfolio.example.com',
        thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=64&h=64&fit=crop',
        order: 0,
      },
      {
        title: 'GitHub Profile',
        url: 'https://github.com/username',
        thumbnail: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
        order: 1,
      },
      {
        title: 'Twitter / X',
        url: 'https://twitter.com/username',
        thumbnail: 'https://abs.twimg.com/responsive-web/client-web/icon-ios.b1fc7275.png',
        order: 2,
      },
      {
        title: 'LinkedIn Profile',
        url: 'https://linkedin.com/in/username',
        thumbnail: 'https://content.linkedin.com/content/dam/me/business/en-us/amp/brand-site/v2/bg/LI-Bug.svg.original.svg',
        order: 3,
      },
      {
        title: 'YouTube Channel',
        url: 'https://youtube.com/@username',
        thumbnail: 'https://www.youtube.com/s/desktop/f506bd8b/img/favicon_32x32.png',
        order: 4,
      },
      {
        title: 'Instagram',
        url: 'https://instagram.com/username',
        thumbnail: 'https://static.cdninstagram.com/rsrc.php/v3/yx/r/tBxa1IFcTNM.png',
        order: 5,
      },
    ]

    // Delete existing links for this user first
    await prisma.link.deleteMany({
      where: { userId: user.id }
    })

    for (const linkData of links) {
      const link = await prisma.link.create({
        data: {
          ...linkData,
          userId: user.id,
        },
      })
      console.log('✅ Created link:', link.title)
    }

    // Delete existing themes for this user first
    await prisma.theme.deleteMany({
      where: { userId: user.id }
    })

    // Create a sample theme
    const theme = await prisma.theme.create({
      data: {
        userId: user.id,
        name: 'Glass Theme',
        preset: 'DEFAULT',
        primaryColor: '#ffffff',
        backgroundColor: 'transparent',
        fontFamily: 'Inter',
      },
    })

    console.log('✅ Created theme:', theme.name)

    // Add some sample click events for analytics
    const firstLink = await prisma.link.findFirst({
      where: { userId: user.id },
    })

    if (firstLink) {
      // Create some sample clicks from the past few days
      const now = new Date()
      for (let i = 0; i < 5; i++) {
        const clickDate = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000)) // i days ago
        await prisma.clickEvent.create({
          data: {
            linkId: firstLink.id,
            clickedAt: clickDate,
            country: i % 2 === 0 ? 'US' : 'CA',
            device: i % 2 === 0 ? 'mobile' : 'desktop',
          },
        })
      }

      // Update click count
      await prisma.link.update({
        where: { id: firstLink.id },
        data: { clicks: 5 },
      })

      console.log('✅ Added sample click analytics')
    }

    console.log('\n🎉 Test user seeded successfully!')
    console.log('👀 Visit: http://localhost:3000/demo to see the glass profile')

  } catch (error) {
    console.error('❌ Error seeding test user:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the seed function
if (require.main === module) {
  seedTestUser()
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
}

export default seedTestUser