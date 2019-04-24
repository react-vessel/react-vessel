import React from 'react';
import { render } from 'react-dom';
import { Vessel } from 'react-vessel';

import App from './App';

render(
  <Vessel>
    <App />
  </Vessel>,
  document.getElementById('root'),
);
