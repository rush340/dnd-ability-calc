// TODO refactor

import React from 'react';
import {
  SCORE_COSTS,
  DEFAULT_INITIAL_POINTS,
  INITIAL_ABILITY_SCORES,
  getAbilityModifierString
} from './abilities.js';
import './App.css';


function AbilityChangeControl(props) {
  const label = props.increase ? 'Increase' : 'Decrease';

  // we show a minus for positive costs because we're conveying the effect
  // on the remaining point value
  const plusOrMinus = props.cost >= 0 ? '-' : '+';
  const costLabel = props.disabled ?
    '' :
    `(${plusOrMinus}${Math.abs(props.cost)} point${Math.abs(props.cost) > 1 ? 's' : ''})`;
  return (
    <div className="ability-change-control">
      <button
        onClick={props.onClick}
        disabled={props.disabled}
      >
        {label}<br />
        {costLabel}
      </button>
    </div>
  );
}

function Ability(props) {
  const modifier = getAbilityModifierString(props.score);
  return (
    <div className="ability">
      <div className="ability-name"><strong>{props.name}</strong></div>
      <div>Score: {props.score}</div>
      <div>Modifier: {modifier}</div>
      <AbilityChangeControl
        increase={true}
        onClick={props.increaseClick}
        cost={props.increaseCost}
        disabled={!props.canIncrease}
      />
      <AbilityChangeControl
        increase={false}
        onClick={props.decreaseClick}
        cost={props.decreaseCost}
        disabled={!props.canDecrease}
      />
    </div>
  );
}

function Abilities(props) {
  const abilities = [];
  for (let [ability, score] of Object.entries(props.abilityScores)) {
    const increaseClick = () => props.increaseAbility(ability);
    const decreaseClick = () => props.decreaseAbility(ability);

    const increaseCost = SCORE_COSTS[score + 1] === undefined ?
      null :
      SCORE_COSTS[score + 1] - SCORE_COSTS[score];
    const decreaseCost = SCORE_COSTS[score - 1] === undefined ?
      null :
      SCORE_COSTS[score - 1] - SCORE_COSTS[score];
    abilities.push(<Ability
      key={ability}
      name={ability}
      score={score}
      increaseClick={increaseClick}
      decreaseClick={decreaseClick}
      increaseCost={increaseCost}
      decreaseCost={decreaseCost}
      canIncrease={increaseCost !== null && increaseCost <= props.points}
      canDecrease={decreaseCost !== null}
    />);
  }

  return (
    <div className="abilities-container">
      {abilities}
    </div>
  );

}

function Points(props) {
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
        <Points
          remaining={this.state.points}
          max={DEFAULT_INITIAL_POINTS}
        />
        <Abilities
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
