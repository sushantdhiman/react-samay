import React from 'react';
import styled from 'styled-components';
import { storiesOf } from '@storybook/react';
import { startOfDay } from 'date-fns';

import { TimePicker } from '../src/';

const Wrapper = styled.div`
  /* System font stack */
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
`;

function WithReset() {
  const [state, setState] = React.useState(new Date());

  const onReset = () => {
    setState(startOfDay(new Date()));
  };

  const onNow = () => {
    setState(new Date());
  };

  return (
    <div>
      <button onClick={onReset}>reset</button>
      <button onClick={onNow}>now</button>
      <br />
      <br />
      <TimePicker value={state} onChange={setState} />
    </div>
  );
}

storiesOf('Timepicker/Interaction', module)
  .addDecorator((Story) => (
    <Wrapper>
      <Story />
    </Wrapper>
  ))
  .add('changing values', () => <WithReset />);
