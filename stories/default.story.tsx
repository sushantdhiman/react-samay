import React from 'react';
import styled from 'styled-components';
import { storiesOf } from '@storybook/react';
import { mix, transparentize } from 'polished';

import { TimePicker as RawTimePicker } from '../src/';
import {
  onChange,
  disabledHours,
  disabledMinutes,
  disabledSeconds,
} from './helper';

const Wrapper = styled.div`
  /* System font stack */
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
`;

const TimePicker = styled(RawTimePicker).attrs({
  bg: 'tomato',
  color: 'white',
})`
  background-color: ${({ color, bg }) => mix(0.92, bg, color)};
  border-radius: 4px;
  width: 300px;

  /* input font style */
  .react-samay-panel-input,
  .react-samay-input {
    border: 1px solid ${({ bg }) => bg};
    border-radius: 4px;
    height: auto;
    width: 100%;
    font-size: 30px;
    font-weight: 300;
    background-color: transparent;
    border: none;
    text-align: center;
    color: ${({ color }) => color};
    padding-top: 8px;
    padding-bottom: 8px;
    &:focus {
      outline: none;
    }
  }
  /* panel hover/focus styles */
  .react-samay-panel-select {
    max-height: 200px;
  }
  .react-samay-panel-select li {
    color: ${({ color }) => color};
    font-size: 13px;
    padding: 5px;
    line-height: 1;
    height: auto;
    text-align: center;
    &:hover,
    &:focus {
      background-color: ${({ color }) => transparentize(0.9, color)};
    }
    &:focus {
      outline: none;
      &:before {
        content: '➤';
        position: absolute;
        left: 1.9em;
      }
    }
    &.react-samay-panel-select-option-selected {
      background-color: ${({ color }) => transparentize(0.2, color)};
      color: ${({ bg }) => bg};
      &:hover,
      &:focus {
        background-color: ${({ color }) => transparentize(0.3, color)};
      }
    }

    &.react-samay-panel-select-option-disabled {
      background-color: ${({ color }) => transparentize(0.8, color)};
      color: ${({ bg }) => bg};
    }
  }

  .react-samay-panel-combobox {
    background-color: ${({ color, bg }) => mix(0.92, bg, color)};
    border-top: 1px solid ${transparentize(0.85, '#000')};
    border-radius: 0px 0px 4px 4px;
  }

  .react-samay-panel-select + .react-samay-panel-select {
    border-left: 1px solid ${transparentize(0.85, '#000')};
  }
`;

storiesOf('Timepicker/Basics', module)
  .addDecorator((Story) => (
    <Wrapper>
      <Story />
    </Wrapper>
  ))
  .add('readme', () => {
    return (
      <>
        <h2>React-Samay</h2>
        <p>
          Time picker library for React.js. Find out more on{' '}
          <a
            href="https://github.com/sushantdhiman/react-samay"
            rel="noreferrer"
            target="_blank"
          >
            Github
          </a>
        </p>
      </>
    );
  })
  .add('no theme', () => (
    <RawTimePicker
      style={{ width: 250 }}
      defaultValue={new Date()}
      onChange={onChange}
    />
  ))
  .add('default', () => (
    <TimePicker defaultValue={new Date()} onChange={onChange} />
  ))
  .add('disabled', () => (
    <>
      <h5>disabled=true</h5>
      <TimePicker disabled defaultValue={new Date()} onChange={onChange} />
      <br />
      <h5>disabledHours,disabledMinutes,disabledSeconds</h5>
      <TimePicker
        showSecond
        defaultValue={new Date()}
        onChange={onChange}
        disabledHours={disabledHours}
        disabledMinutes={disabledMinutes}
        disabledSeconds={disabledSeconds}
      />
    </>
  ))
  .add('hidden', () => (
    <TimePicker
      showSecond
      defaultValue={new Date()}
      onChange={onChange}
      hideDisabledOptions
      disabledHours={() => [0, 1, 2, 3, 4, 5, 6, 7, 8, 22, 23]}
      disabledMinutes={() => [0, 2, 4, 6, 8]}
    />
  ))
  .add('step', () => (
    <TimePicker defaultValue={new Date()} minuteStep={15} showSecond={false} />
  ))
  .add('12hours', () => (
    <TimePicker
      use12Hours
      showSecond={false}
      defaultValue={new Date()}
      onChange={onChange}
    />
  ))
  .add('input-readonly', () => (
    <TimePicker
      defaultValue={new Date()}
      minuteStep={15}
      showSecond={false}
      inputReadOnly
    />
  ))
  .add('format', () => (
    <>
      <h5>showHour=false</h5>
      <TimePicker defaultValue={new Date()} showHour={false} />
      <br />
      <h5>showMinute=false</h5>
      <TimePicker defaultValue={new Date()} showMinute={false} />
      <br />
      <h5>showSecond=false</h5>
      <TimePicker defaultValue={new Date()} showSecond={false} />
      <br />
      <h5>showMinute=false, showSecond=false</h5>
      <TimePicker
        defaultValue={new Date()}
        showMinute={false}
        showSecond={false}
      />
      <br />
      <h5>showHour=false, showSecond=false</h5>
      <TimePicker
        defaultValue={new Date()}
        showHour={false}
        showSecond={false}
      />
      <br />
      <h5>showHour=false, showMinute=false</h5>
      <TimePicker
        defaultValue={new Date()}
        showHour={false}
        showMinute={false}
      />
    </>
  ));
