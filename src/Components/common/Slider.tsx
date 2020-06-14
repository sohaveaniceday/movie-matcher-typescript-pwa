import React, { FC } from 'react'
import { getClassName } from '../../util'
import {
  Slider as CompoundSlider,
  Rail,
  Handles,
  Tracks,
  Ticks,
} from 'react-compound-slider'

type SliderProps = {
  cssClasses: string[]
  range: number[]
  defaultValues: number[]
  displayTicks?: boolean
  displayTracks?: boolean
  onChange?: (values: readonly number[]) => void
  onUpdate?: (values: readonly number[]) => void
}

export const Slider: FC<SliderProps> = ({
  cssClasses,
  range: [min, max],
  defaultValues,
  displayTicks = false,
  displayTracks = false,
  onUpdate,
  onChange,
}: SliderProps) => {
  const SliderClassName = getClassName([...cssClasses])
  return (
    <div className={SliderClassName}>
      <CompoundSlider
        mode={2}
        step={1}
        domain={[min, max]}
        rootStyle={{
          position: 'relative',
          width: '100%',
        }}
        onUpdate={onUpdate}
        onChange={onChange}
        values={defaultValues}
      >
        <Rail>
          {({ getRailProps }) => (
            <>
              <div
                className='absolute w-full cursor-pointer'
                style={{
                  height: 42,
                  transform: 'translate(0%, -50%)',
                  borderRadius: 7,
                }}
                {...getRailProps()}
              />
              <div
                className='absolute w-full'
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: 14,
                  transform: 'translate(0%, -50%)',
                  borderRadius: 7,
                  pointerEvents: 'none',
                  backgroundColor: 'rgb(155,155,155)',
                }}
              />
            </>
          )}
        </Rail>
        <Handles>
          {({ handles, getHandleProps }) => (
            <>
              {handles.map(({ percent, id, value }) => (
                <div key={id}>
                  <div
                    className='absolute cursor-pointer'
                    style={{
                      left: `${percent}%`,
                      transform: 'translate(-50%, -50%)',
                      WebkitTapHighlightColor: 'rgba(0,0,0,0)',
                      zIndex: 5,
                      width: 28,
                      height: 42,
                      backgroundColor: 'none',
                    }}
                    {...getHandleProps(id)}
                  />
                  <div
                    role='slider'
                    aria-valuemin={min}
                    aria-valuemax={max}
                    aria-valuenow={value}
                    className='absolute bg-blue-500'
                    style={{
                      left: `${percent}%`,
                      transform: 'translate(-50%, -50%)',
                      zIndex: 2,
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      boxShadow: '1px 1px 1px 1px rgba(0, 0, 0, 0.3)',
                    }}
                  />
                </div>
              ))}
            </>
          )}
        </Handles>
        {displayTracks && (
          <Tracks left={false} right={false}>
            {({ tracks, getTrackProps }) => (
              <>
                {tracks.map(({ id, source, target }) => (
                  <div
                    key={id}
                    className='absolute bg-blue-700 cursor-pointer'
                    style={{
                      transform: 'translate(0%, -50%)',
                      height: 14,
                      zIndex: 1,
                      borderRadius: 7,
                      left: `${source.percent}%`,
                      width: `${target.percent - source.percent}%`,
                    }}
                    {...getTrackProps()}
                  />
                ))}
              </>
            )}
          </Tracks>
        )}
        {displayTicks && (
          <Ticks count={5}>
            {({ ticks }) => (
              <div className='slider-ticks'>
                {ticks.map(({ id, percent }) => (
                  <div key={id}>
                    <div
                      className='absolute bg-gray-700'
                      style={{
                        marginTop: 14,
                        width: 1,
                        height: 5,
                        left: `${percent}%`,
                      }}
                    />
                    <div
                      className='absolute text-center'
                      style={{
                        marginTop: 22,
                        fontSize: 10,
                        marginLeft: `${-(100 / 5) / 2}%`,
                        width: `${100 / 5}%`,
                        left: `${percent}%`,
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </Ticks>
        )}
      </CompoundSlider>
    </div>
  )
}
