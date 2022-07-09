import React from 'react';
import styled from 'styled-components';
import { storiesOf } from '@storybook/react';
import { mix, transparentize } from 'polished';

import RawTimePicker from '../../src/';
import {
  onChange,
  disabledHours,
  disabledMinutes,
  disabledSeconds,
} from './helper';

const TimePicker = styled(RawTimePicker).attrs({
  bg: 'tomato',
  color: 'white',
})`
  background-color: ${({ color, bg }) => mix(0.92, bg, color)};
  border-radius: 4px;
  width: 300px;
  .react-samay-input {
    padding: 8px;
    justify-content: center;
    color: ${({ color }) => color};
    border: 1px solid ${({ bg }) => bg};
    border-radius: 4px;
    &:focus {
      box-shadow: 0 0 0 1px ${({ color }) => color};
    }
  }
  /* input font style */
  .react-samay-panel-input,
  .react-samay-input {
    height: auto;
    font-size: 30px;
    font-weight: 300;
    font-variant-numeric: tabular-nums;
    border: none;
    text-align: center;
    &:focus {
      outline: none;
    }
  }
  .react-samay-panel-input {
    width: 100%;
    color: ${({ color }) => color};
    /* color: ${({ bg }) => bg}; */
    background-color: transparent;
    padding-top: 8px;
    padding-bottom: 8px;
  }
  .react-samay-input-time {
    font-size: inherit;
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
        background-color: ${({ color, bg }) => transparentize(0.3, color)};
      }
    }

    &.react-samay-panel-select-option-disabled {
      background-color: ${({ color }) => transparentize(0.8, color)};
      color: ${({ bg }) => bg};
    }
  }
  /* internal borders */
  .react-samay-panel-combobox {
    border-top: 1px solid ${transparentize(0.85, '#000')};
  }
  .react-samay-panel-select + .react-samay-panel-select {
    border-left: 1px solid ${transparentize(0.85, '#000')};
  }
`;

storiesOf('Timepicker', module)
  .add('default', () => (
    <TimePicker defaultValue={new Date()} onChange={onChange} />
  ))
  .add('disabled', () => (
    <TimePicker
      showSecond
      defaultValue={new Date()}
      onChange={onChange}
      disabledHours={disabledHours}
      disabledMinutes={disabledMinutes}
      disabledSeconds={disabledSeconds}
    />
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
      <h3>showHour=false</h3>
      <TimePicker defaultValue={new Date()} showHour={false} />
      <br />
      <h3>showMinute=false</h3>
      <TimePicker defaultValue={new Date()} showMinute={false} />
      <br />
      <h3>showSecond=false</h3>
      <TimePicker defaultValue={new Date()} showSecond={false} />
      <br />
      <h3>showMinute=false, showSecond=false</h3>
      <TimePicker
        defaultValue={new Date()}
        showMinute={false}
        showSecond={false}
      />
      <br />
      <h3>showHour=false, showSecond=false</h3>
      <TimePicker
        defaultValue={new Date()}
        showHour={false}
        showSecond={false}
      />
      <br />
      <h3>showHour=false, showMinute=false</h3>
      <TimePicker
        defaultValue={new Date()}
        showHour={false}
        showMinute={false}
      />
    </>
  ));
