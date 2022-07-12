import React from 'react';
import { storiesOf } from '@storybook/react';
import { startOfDay } from 'date-fns';

import { Wrapper } from './helper';
import { TimePicker } from '../src/';

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
