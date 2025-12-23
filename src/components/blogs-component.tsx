import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardTitle } from '@/components/ui/card'

import { MotionPreset } from '@/components/ui/motion-preset'

type BlogCard = {
  image: string
  alt: string
  date: string
  title: string
  author: string
  authorImg: string
  role: string
  blogLink: string
  authorProfileLink: string
}[]

const Blog = ({ blogCards }: { blogCards: BlogCard }) => {
  return (
    <section className='py-8 sm:py-16 lg:py-24'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='mb-12 text-center sm:mb-16 lg:mb-24'>
          <MotionPreset
            component='h2'
            className='relative z-10 mb-4 text-2xl font-bold md:text-3xl lg:text-4xl'
            fade
            slide={{ direction: 'down', offset: 50 }}
            blur
            transition={{ duration: 0.5 }}
          >
            <span className='relative z-10'>
              Latest From Our Blogs
              <span className='bg-primary absolute bottom-0 left-0 -z-10 h-px w-full' aria-hidden='true' />
            </span>
          </MotionPreset>

          <MotionPreset
            component='p'
            className='text-muted-foreground text-xl'
            fade
            blur
            slide={{ direction: 'down', offset: 50 }}
            delay={0.3}
            transition={{ duration: 0.5 }}
          >
            Explore new destinations, indulge in local cuisines, and immerse yourself in diverse cultures.
          </MotionPreset>
        </div>

        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
          {blogCards.map((card, index) => (
            <MotionPreset
              key={index}
              fade
              blur
              slide={{ direction: 'up' }}
              zoom={{ initialScale: 0.8 }}
              delay={0.6 + index * 0.1}
              transition={{ duration: 0.5 }}
            >
              <Card className='shadow-none'>
                <CardContent className='flex h-full items-center gap-6 max-lg:flex-col'>
                  <img src={card.image} alt='Robot' className='h-41 w-full rounded-xl object-cover' />
                  <div className='flex h-full flex-col gap-3'>
                    <p className='text-muted-foreground text-sm'>{card.date}</p>
                    <CardTitle className='flex-1 text-xl font-medium'>
                      <a href={card.blogLink}>{card.title}</a>
                    </CardTitle>
                    <a href={card.authorProfileLink} className='flex items-center gap-2'>
                      <Avatar>
                        <AvatarImage src={card.authorImg} alt={card.alt} className='size-8 rounded-full' />
                        <AvatarFallback className='rounded-full text-xs'>CH</AvatarFallback>
                      </Avatar>
                      <div className='flex flex-col'>
                        <span className='font-medium'>{card.author}</span>
                        <span className='text-muted-foreground text-xs'>{card.role}</span>
                      </div>
                    </a>
                  </div>
                </CardContent>
              </Card>
            </MotionPreset>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Blog
