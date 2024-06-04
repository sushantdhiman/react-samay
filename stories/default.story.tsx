import React from 'react';

import { TimePicker } from '../src/';
import {
  Wrapper,
  onChange,
  disabledHours,
  disabledMinutes,
  disabledSeconds,
} from './helper';

export default {
  title: 'Timepicker/Basics',

  decorators: [
    (Story: React.ElementType) => (
      <Wrapper>
        <Story />
      </Wrapper>
    ),
  ],
};

export const Readme = () => {
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
};

Readme.story = {
  name: 'readme',
};

export const Default = () => (
  <TimePicker defaultValue={new Date()} onChange={onChange} />
);

Default.story = {
  name: 'default',
};

export const Disabled = () => (
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
);

Disabled.story = {
  name: 'disabled',
};

export const Hidden = () => (
  <TimePicker
    showSecond
    defaultValue={new Date()}
    onChange={onChange}
    hideDisabledOptions
    disabledHours={() => [0, 1, 2, 3, 4, 5, 6, 7, 8, 22, 23]}
    disabledMinutes={() => [0, 2, 4, 6, 8]}
  />
);

Hidden.story = {
  name: 'hidden',
};

export const Step = () => (
  <TimePicker defaultValue={new Date()} minuteStep={15} showSecond={false} />
);

Step.story = {
  name: 'step',
};

export const _12Hours = () => (
  <TimePicker
    use12Hours
    showSecond={false}
    defaultValue={new Date()}
    onChange={onChange}
  />
);

_12Hours.story = {
  name: '12hours',
};

export const Format = () => (
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
    <TimePicker defaultValue={new Date()} showHour={false} showSecond={false} />
    <br />
    <h5>showHour=false, showMinute=false</h5>
    <TimePicker defaultValue={new Date()} showHour={false} showMinute={false} />
  </>
);

Format.story = {
  name: 'format',
};
