import React from 'react';
import Loadable from '../../src/index';
import Loading from './Loading';
import delay from '../utils/delay';
import path from 'path';

const LoadableNested = Loadable({
  loader: () => import(/* webpackChunkName: 'ExampleNested' */ './ExampleNested'),
  loading: Loading,
});

export default class Example extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      display: false,
    };
  }


  render () {
    const onClick = () => {
      this.setState({
        display: true
      });
    }
    return (
      <div>
        <h1>Hello from a loadable component</h1>
        <span onClick={onClick}>Click to load nested component</span>
        {
          this.state.display ? <LoadableNested/> : null
        }

      </div>
    );
  }
}
