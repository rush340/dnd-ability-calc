import React from 'react';
import {
  SCORE_COSTS,
  DEFAULT_INITIAL_POINTS,
  INITIAL_ABILITY_SCORES,
} from './abilities.js';
import AbilitiesPanel from './AbilitiesPanel.js';
import './App.css';


function RemainingPointsDisplay(props) {
  return (
    <div className="points-container">
      <div><strong>Remaining points:</strong></div>
      <div className="points">{props.remaining} / {props.max}</div>
    </div>
  );
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      points: DEFAULT_INITIAL_POINTS,
      abilities: Object.assign({}, INITIAL_ABILITY_SCORES),
    };

    this.increaseAbility = this.increaseAbility.bind(this);
    this.decreaseAbility = this.decreaseAbility.bind(this);
  }

  addToAbility(ability, value) {
    const oldValue = this.state.abilities[ability];
    const newValue = oldValue + value;

    if (SCORE_COSTS[newValue] === undefined) {
      // the new value is not allowed
      return;
    }

    const changeCost = SCORE_COSTS[newValue] - SCORE_COSTS[oldValue];
    if (changeCost > this.state.points) {
      // there are not enough points remaining for this change
      return;
    }

    const updatedPoints = this.state.points - changeCost;
    const updatedAbility = {
      [ability]: this.state.abilities[ability] + value,
    };
    this.setState({
      points: updatedPoints,
      abilities: Object.assign({}, this.state.abilities, updatedAbility),
    });
  }

  increaseAbility(ability) {
    this.addToAbility(ability, 1);
  }

  decreaseAbility(ability) {
    this.addToAbility(ability, -1);
  }

  render() {
    return (
      <div className="app">
        <h1>D&amp;D 5e Point Buy Calculator</h1>
        <RemainingPointsDisplay
          remaining={this.state.points}
          max={DEFAULT_INITIAL_POINTS}
        />
        <AbilitiesPanel
          abilityScores={this.state.abilities}
          increaseAbility={this.increaseAbility}
          decreaseAbility={this.decreaseAbility}
          points={this.state.points}
        />
      </div>
    );
  }
}

export default App;
