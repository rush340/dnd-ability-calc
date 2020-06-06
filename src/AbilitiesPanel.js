import React from 'react';
import PropTypes from 'prop-types';

import {
  SCORE_COSTS,
  getAbilityModifierString
} from './abilities.js';
import './AbilitiesPanel.css';


function AbilityChangeControl(props) {
  const label = props.increase ? '+' : '-';

  return (
    <button
      className="ability-change-control"
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {label}
    </button>
  );
}

AbilityChangeControl.propTypes = {
  increase: PropTypes.bool,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
};

function AbilityDisplay(props) {
  const modifier = getAbilityModifierString(props.score);

  // we show a minus for positive costs because we're conveying the effect
  // on the remaining point value
  const cost = SCORE_COSTS[props.score];
  const costPlusOrMinus = cost >= 0 ? '-' : '+';
  const costLabel = `${costPlusOrMinus}${cost}`;

  return (
    <div className="ability">
      <div className="ability-name"><strong>{props.name}</strong></div>
      <table>
        <tr>
          <th>Score:</th>
          <td>{props.score}</td>
        </tr>
        <tr>
          <th>Modifier:</th>
          <td>{modifier}</td>
        </tr>
        <tr>
          <th>Points:</th>
          <td>{costLabel}</td>
        </tr>
      </table>
      <AbilityChangeControl
        increase={false}
        onClick={props.decreaseClick}
        cost={props.decreaseCost}
        disabled={!props.canDecrease}
      />
      <AbilityChangeControl
        increase={true}
        onClick={props.increaseClick}
        cost={props.increaseCost}
        disabled={!props.canIncrease}
      />
    </div>
  );
}

AbilityDisplay.propTypes = {
  name: PropTypes.string,
  score: PropTypes.number,
  increaseClick: PropTypes.func,
  increaseCost: PropTypes.number,
  canIncrease: PropTypes.bool,
  decreaseClick: PropTypes.func,
  decreaseCost: PropTypes.number,
  canDecrease: PropTypes.bool,
};

function AbilitiesPanel(props) {
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
    abilities.push(<AbilityDisplay
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

AbilitiesPanel.propTypes = {
  abilityScores: PropTypes.objectOf(PropTypes.number),
  points: PropTypes.number,
  increaseAbility: PropTypes.func,
  decreaseAbility: PropTypes.func,
};

export default AbilitiesPanel;
