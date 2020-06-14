import React, { FC } from 'react'
import { getClassName } from '../../util'
import {
  Slider as CompoundSlider,
  Rail,
  Handles,
  Tracks,
  Ticks,
} from 'react-compound-slider'

// const domain = [0, 500]
// const defaultValues = [450, 400, 300, 150]

type SliderProps = {
  cssClasses: string[]
  range: number[]
  defaultValues: number[]
  displayTicks?: boolean
  onChange?: (values: readonly number[]) => void
  onUpdate?: (values: readonly number[]) => void
}

export const Slider: FC<SliderProps> = ({
  cssClasses,
  range: [min, max],
  defaultValues,
  displayTicks = false,
  onChange,
  onUpdate,
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
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: 42,
                  transform: 'translate(0%, -50%)',
                  borderRadius: 7,
                  cursor: 'pointer',
                  // border: '1px solid white',
                }}
                {...getRailProps()}
              />
              <div
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
                    style={{
                      left: `${percent}%`,
                      position: 'absolute',
                      transform: 'translate(-50%, -50%)',
                      WebkitTapHighlightColor: 'rgba(0,0,0,0)',
                      zIndex: 5,
                      width: 28,
                      height: 42,
                      cursor: 'pointer',
                      // border: '1px solid white',
                      backgroundColor: 'none',
                    }}
                    {...getHandleProps(id)}
                  />
                  <div
                    role='slider'
                    aria-valuemin={min}
                    aria-valuemax={max}
                    aria-valuenow={value}
                    style={{
                      left: `${percent}%`,
                      position: 'absolute',
                      transform: 'translate(-50%, -50%)',
                      zIndex: 2,
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      boxShadow: '1px 1px 1px 1px rgba(0, 0, 0, 0.3)',
                      backgroundColor: '#ffc400',
                    }}
                  />
                </div>
              ))}
            </>
          )}
        </Handles>
        <Tracks left={false} right={false}>
          {({ tracks, getTrackProps }) => (
            <>
              {tracks.map(({ id, source, target }) => (
                <div
                  key={id}
                  style={{
                    position: 'absolute',
                    transform: 'translate(0%, -50%)',
                    height: 14,
                    zIndex: 1,
                    backgroundColor: '#b28900',
                    borderRadius: 7,
                    cursor: 'pointer',
                    left: `${source.percent}%`,
                    width: `${target.percent - source.percent}%`,
                  }}
                  {...getTrackProps()}
                />
              ))}
            </>
          )}
        </Tracks>
        {displayTicks && (
          <Ticks count={5}>
            {({ ticks }) => (
              <div className='slider-ticks'>
                {ticks.map(({ id, percent, value }) => (
                  <div key={id}>
                    <div
                      style={{
                        position: 'absolute',
                        marginTop: 14,
                        width: 1,
                        height: 5,
                        backgroundColor: 'rgb(200,200,200)',
                        left: `${percent}%`,
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        marginTop: 22,
                        fontSize: 10,
                        textAlign: 'center',
                        marginLeft: `${-(100 / 5) / 2}%`,
                        width: `${100 / 5}%`,
                        left: `${percent}%`,
                      }}
                    >
                      {/* {format && format(value)} */}
                    </div>
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
