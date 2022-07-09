import React from 'react';
import { storiesOf } from '@storybook/react';
import styled from 'styled-components';

import TimePicker from '../src/';

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 10vh;
  width: 100%;
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
`;

storiesOf('Timepicker', module)
  .addDecorator((Story) => (
    <Wrapper>
      <Story />
    </Wrapper>
  ))
  .add('default', () => <TimePicker name="time" defaultValue={new Date()} />)
  .add('use12Hours', () => (
    <TimePicker name="time" use12Hours defaultValue={new Date()} />
  ))
  .add('use12Hours - no seconds - step - readonly', () => (
    <TimePicker
      name="time"
      defaultValue={new Date()}
      inputReadOnly
      use12Hours
      minuteStep={15}
      showSecond={false}
    />
  ));
