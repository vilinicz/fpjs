import * as R from "ramda";
import state from "./state.js";

export const MSGS = {
  LEVEL_INPUT: "level",
  UNIT_INPUT: "unit"
};

export function inputMsg(side, type, value) {
  return {
    side,
    type,
    value
  };
}

const toInt = R.pipe(
  parseInt,
  R.defaultTo(0)
);

function round(number) {
  return Math.round(number * 10) / 10;
}

function convert(state) {
  const [from, to] =
    state.source === "left"
      ? [state.left, state.right]
      : [state.right, state.left];

  const otherValue = R.pipe(
    convertFromToTemp,
    round
  )(from.unit, to.unit, from.level);

  return state.source === "left"
    ? { ...state, right: { ...state.right, level: otherValue } }
    : { ...state, left: { ...state.left, level: otherValue } };
}

function convertFromToTemp(fromUnit, toUnit, level) {
  const convertFn = R.pathOr(R.identity, [fromUnit, toUnit], UnitConversions);
  return convertFn(level);
}

const FtoC = f => ((f - 32) * 5) / 9;
const CtoF = c => (c * 9) / 5 + 32;
const KtoC = k => k - 273.15;
const CtoK = c => c + 273.15;
const FtoK = R.pipe(
  FtoC,
  CtoK
);
const KtoF = R.pipe(
  KtoC,
  CtoF
);

const UnitConversions = {
  Celsius: {
    Fahrenheit: CtoF,
    Kelvin: CtoK
  },
  Fahrenheit: {
    Celsius: FtoC,
    Kelvin: FtoK
  },
  Kelvin: {
    Celsius: KtoC,
    Fahrenheit: KtoF
  }
};

function update(msg, state) {
  switch (msg.type) {
    case MSGS.LEVEL_INPUT: {
      if (msg.value === "") {
        return {
          ...state,
          source: msg.side,
          [msg.side]: { ...state[msg.side], level: null }
        };
      }
      const side = msg.side,
        level = toInt(msg.value);
      return convert({
        ...state,
        source: msg.side,
        [side]: { ...state[side], level }
      });
    }
    case MSGS.UNIT_INPUT: {
      const { side, value } = msg;
      return convert({ ...state, [side]: { ...state[side], unit: value } });
    }
  }
  return state;
}

export default update;
