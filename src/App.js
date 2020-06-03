// TODO camelCase var names
// TODO refactor

import React from 'react';
import './App.css';


const COST_TABLE = {
  8: 0,
  9: 1,
  10: 2,
  11: 3,
  12: 4,
  13: 5,
  14: 7,
  15: 9,
};

const STR = 'strength';
const CON = 'constitution';
const DEX = 'dexterity';
const INT = 'intelligence';
const WIS = 'wisdom';
const CHA = 'charisma';
const ABILITIES = [
  STR,
  CON,
  DEX,
  INT,
  WIS,
  CHA,
];

const INITIAL_ABILITY_SCORES = {};
for (const ability of ABILITIES) {
  INITIAL_ABILITY_SCORES[ability] = 8
}

// defualt number of points to start with
const DEFAULT_INITIAL_POINTS = 27;


function getAbilityModifier(score) {
  return Math.floor(score / 2) - 5;
}


function AbilityChangeControl(props) {
  const label = props.increase ? 'Increase' : 'Decrease';
  const disabled = props.cost === null;
  // we show a minus for positive costs because we're conveying the effect
  // on the remaining point value
  const plusOrMinus = props.cost >= 0 ? '-' : '+';
  const costLabel = disabled ?
    '' :
    `(${plusOrMinus}${Math.abs(props.cost)} point${Math.abs(props.cost) > 1 ? 's' : ''})`;
  return (
    <div>
      <button
        className="ability-change-control"
        onClick={props.onClick}
        disabled={disabled}
      >
        {label} {costLabel}
      </button>
    </div>
  );
}

function getAbilityModifierString(score) {
  const modifier = getAbilityModifier(score);
  const plusOrMinus = modifier >= 0 ? '+' : '-';
  return `${plusOrMinus}${Math.abs(modifier)}`;
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
      />
      <AbilityChangeControl
        increase={false}
        onClick={props.decreaseClick}
        cost={props.decreaseCost}
      />
    </div>
  );
}

function Abilities(props) {
  const abilities = [];
  for (let [ability, score] of Object.entries(props.abilityScores)) {
    const increaseClick = () => props.increaseAbility(ability);
    const decreaseClick = () => props.decreaseAbility(ability);

    const increaseCost = COST_TABLE[score + 1] === undefined ?
      null :
      COST_TABLE[score + 1] - COST_TABLE[score];
    const decreaseCost = COST_TABLE[score - 1] === undefined ?
      null :
      COST_TABLE[score - 1] - COST_TABLE[score];
    abilities.push(<Ability
      key={ability}
      name={ability}
      score={score}
      increaseClick={increaseClick}
      decreaseClick={decreaseClick}
      increaseCost={increaseCost}
      decreaseCost={decreaseCost}
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
    const old_value = this.state.abilities[ability];
    const new_value = old_value + value;

    if (COST_TABLE[new_value] === undefined) {
      // the new value is not allowed
      return;
    }

    const change_cost = COST_TABLE[new_value] - COST_TABLE[old_value];
    if (change_cost > this.state.points) {
      // there are not enough points remaining for this change
      return;
    }

    const updated_points = this.state.points - change_cost;
    const updated_ability = {
      [ability]: this.state.abilities[ability] + value,
    };
    this.setState({
      points: updated_points,
      abilities: Object.assign({}, this.state.abilities, updated_ability),
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
      <div>
        <h1>D&amp;D 5e Point Buy Calculator</h1>
        <Points
          remaining={this.state.points}
          max={DEFAULT_INITIAL_POINTS}
        />
        <Abilities
          abilityScores={this.state.abilities}
          increaseAbility={this.increaseAbility}
          decreaseAbility={this.decreaseAbility}
        />
      </div>
    );
  }
}

export default App;
