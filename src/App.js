import React from 'react';
import { Provider } from 'react-redux';
import store from './store/index';
import LogInteractionScreen from './components/LogInteractionScreen';

function App() {
  return (
    <Provider store={store}>
      <LogInteractionScreen />
    </Provider>
  );
}

export default App;