import React, { Dispatch, FC } from 'react'
import { HoldingPage, Icon, Button } from './common'
import { generateBackgroundImage } from '../util'
import { colorScheme } from '../static'

type LandingPageProps = {
  setDisplayLandingPage: Dispatch<React.SetStateAction<boolean>>
  setDisplayAboutPage: Dispatch<React.SetStateAction<boolean>>
}

export const LandingPage: FC<LandingPageProps> = ({
  setDisplayLandingPage,
  setDisplayAboutPage,
}: LandingPageProps) => {
  const buttons = (
    <>
      <Button
        type='button'
        cssClasses={[
          'focus:outline-none',
          'w-40',
          'sm:mx-4',
          'mx-auto',
          'mt-5',
        ]}
        value='About'
        onClick={() => {
          setDisplayAboutPage(true)
          setDisplayLandingPage(false)
        }}
        border
        rounded
        style={{
          borderColor: `#${colorScheme.medium}`,
          backgroundColor: `#${colorScheme.user1Light}`,
        }}
      />
      <Button
        type='button'
        cssClasses={[
          'focus:outline-none',
          'w-40',
          'sm:mx-4',
          'mx-auto',
          'mt-5',
        ]}
        value='User 1 Start'
        onClick={() => setDisplayLandingPage(false)}
        border
        rounded
        style={{
          borderColor: `#${colorScheme.medium}`,
          backgroundColor: `#${colorScheme.user1Light}`,
        }}
      />
    </>
  )

  return (
    <HoldingPage
      scrollable
      style={{ backgroundImage: generateBackgroundImage(1) }}
    >
      <div
        className='flex flex-col h-full p-5 overflow-auto text-white'
        style={{ fontFamily: 'Bebas' }}
      >
        <div className='m-auto text-center'>
          <Icon iconName='movie' className='w-24 h-24 mx-auto' />
          <div className='mx-auto text-4xl '>Movie Matcher</div>
          <div
            className='mx-auto text-xl text-white '
            style={{ fontFamily: 'Bebas' }}
          >
            Find the perfect movie.
          </div>
          <div className='sm:hidden'>
            <div className='flex flex-col text-xl'>{buttons}</div>
          </div>
          <div className='hidden sm:block'>
            <div className='flex flex-row justify-center text-xl'>
              {buttons}
            </div>
          </div>
        </div>
      </div>
    </HoldingPage>
  )
}
