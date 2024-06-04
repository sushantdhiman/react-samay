import React from 'react';
import { startOfDay } from 'date-fns';
import { TimePicker } from '../src/';

function WithReset() {
  const [state, setState] = React.useState(new Date());

  const onReset = () => {
    setState(startOfDay(new Date()));
  };

  const onNow = () => {
    setState(new Date());
  };

  const onFocus = () => {
    console.log('Focused');
  };

  return (
    <div>
      <button onClick={onReset}>reset</button>
      <button onClick={onNow}>now</button>
      <br />
      <br />
      <TimePicker value={state} onChange={setState} onFocus={onFocus} />
    </div>
  );
}

export default {
  title: 'Timepicker/Interaction',
  decorators: [],
};

export const ChangingValues = () => <WithReset />;

ChangingValues.story = {
  name: 'changing values',
};
