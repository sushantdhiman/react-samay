import { scan } from 'react-scan';
import { Preview } from '@storybook/react';

import '../index.css';

const preview: Preview = {
  parameters: {},
};

export default preview;

scan({
  enabled: true,
  log: true,
});
