import React, { Dispatch, FC } from 'react'
import { HoldingPage } from '.'
import { Button } from '@sohaveaniceday/component-library'
import { generateBackgroundImage } from '../../util'
import { colorScheme } from '../../static'

type LandingPageProps = {
  setDisplayAboutPage: Dispatch<React.SetStateAction<boolean>>
}

export const AboutPage: FC<LandingPageProps> = ({
  setDisplayAboutPage,
}: LandingPageProps) => {
  return (
    <HoldingPage
      style={{ backgroundImage: generateBackgroundImage(1) }}
      scrollable
    >
      <div
        className='flex flex-col h-full p-5 overflow-auto text-white align-middle'
        style={{ fontFamily: 'Bebas' }}
      >
        <div className='m-auto text-center'>
          <div className='mb-4 text-3xl'>About</div>
          <div className='mb-6 text-lg'>
            Movie Matcher is an app that helps 2 users find the perfect movie to
            watch.
          </div>
          <div className='mb-4 text-3xl'>How</div>
          <div className='mb-6 text-lg'>
            Users take it in turns to pick a shortlist of 3 movies each, then
            rate their preferences based on those movies.
            <br />
            <br />A special algorithm then works out the ideal match. It will
            also help you to see where the film is available to watch.
            <br />
            <br />
            No more endless scrolling and debating - <br />
            get watching now!
          </div>
          <Button
            type='button'
            cssClasses={[
              'focus:outline-none',
              'w-40',
              'mx-auto',
              'text-xl',
              'mb-6',
            ]}
            value='User 1 Start'
            onClick={() => setDisplayAboutPage(false)}
            border
            rounded
            style={{
              borderColor: `#${colorScheme.medium}`,
              backgroundColor: `#${colorScheme.user1Light}`,
            }}
          />
        </div>
      </div>
    </HoldingPage>
  )
}
