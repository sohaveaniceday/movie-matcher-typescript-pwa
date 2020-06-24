import React, { useState } from 'react'
import { InputsAndRatings } from './InputsAndRatings'
import { Result } from './Result'
import { LandingPage } from './LandingPage'
import { AboutPage } from './AboutPage'
import { FullPageWrapper } from './common'
import { colorScheme } from '../static'
import { Icon } from './common'

export const Home = () => {
  const [displayResult, setDisplayResult] = useState<boolean>(false)
  const [displayLandingPage, setDisplayLandingPage] = useState<boolean>(true)
  const [displayAboutPage, setDisplayAboutPage] = useState<boolean>(false)

  return (
    <FullPageWrapper>
      <div className='hidden h-full mx-auto lg:block'>
        <div className='p-5 text-center'>
          Movie Matcher is currently only available on mobile
        </div>
      </div>
      <div className='h-full lg:hidden'>
        <div
          className='flex flex-col h-full'
          style={{ backgroundColor: `#${colorScheme.dark}` }}
        >
          <nav
            className='flex w-full h-16'
            onClick={() => {
              window.location.reload()
            }}
          >
            <div
              className='m-auto text-4xl text-white'
              style={{ fontFamily: 'Bebas' }}
            >
              <div className='flex flex-inline'>
                Movie{' '}
                <Icon iconName='movie' className='w-10 h-10 mx-2 my-auto' />
                Matcher
              </div>
            </div>
          </nav>
          <main className='relative h-full overflow-auto'>
            {displayLandingPage ? (
              <LandingPage
                setDisplayLandingPage={setDisplayLandingPage}
                setDisplayAboutPage={setDisplayAboutPage}
              />
            ) : displayAboutPage ? (
              <AboutPage setDisplayAboutPage={setDisplayAboutPage} />
            ) : displayResult ? (
              <Result />
            ) : (
              <InputsAndRatings setDisplayResult={setDisplayResult} />
            )}
          </main>
        </div>
      </div>
    </FullPageWrapper>
  )
}
