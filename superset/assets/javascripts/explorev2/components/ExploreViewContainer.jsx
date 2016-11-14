import React from 'react';
import ChartContainer from './ChartContainer';
import ControlPanelsContainer from './ControlPanelsContainer';
import QueryAndSaveBtns from '../../explore/components/QueryAndSaveBtns';

export default class ExploreViewContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      height: this.getHeight(),
    };
  }

  getHeight() {
    const navHeight = 90;
    return `${window.innerHeight - navHeight}px`;
  }

  render() {
    return (
      <div
        className="container-fluid"
        style={{
          height: this.state.height,
          overflow: 'hidden',
        }}
      >
        <div className="row">
          <div className="col-sm-4">
            <QueryAndSaveBtns
              canAdd="True"
              onQuery={() => {}}
            />
            <br /><br />
            <ControlPanelsContainer />
          </div>
          <div className="col-sm-8">
            <ChartContainer
              height={this.state.height}
            />
          </div>
        </div>
      </div>
    );
  }
}
