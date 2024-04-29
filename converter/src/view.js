import * as R from "ramda";
import hh from "hyperscript-helpers";
import { h } from "virtual-dom";
import { inputMsg, MSGS } from "./update";

const { div, h1, pre, button, input, select, option } = hh(h);

const UNITS = ["Fahrenheit", "Celsius", "Kelvin"];

function unitOptions(selectedUnit) {
  return R.map(
    unit => option({ value: unit, selected: selectedUnit === unit }, unit),
    UNITS
  );
}

function inputGroup(dispatch, group, inputMsg) {
  const { level, unit } = group;
  return div({ className: "w-50 ma1" }, [
    input({
      type: "text",
      className: "db w-100 mv2 pa2 input-reset ba",
      value: level,
      oninput: e => dispatch(inputMsg(MSGS.LEVEL_INPUT, e.target.value))
    }),
    select(
      {
        className: "db w-100 pa2 ba input-reset br1 bg-white ba b--black",
        onchange: e => dispatch(inputMsg(MSGS.UNIT_INPUT ,e.target.value))
      },
      unitOptions(unit)
    )
  ]);
}

function view(dispatch, state) {
  return div({ className: "mw6 center" }, [
    h1({ className: "f2 pv2 bb" }, "Temperature Converter"),
    div({ className: "flex" }, [
      inputGroup(
        dispatch,
        state.left,
        inputMsg.bind(null, "left"),
      ),
      inputGroup(
        dispatch,
        state.right,
        inputMsg.bind(null, "right"),
      )
    ]),
    pre(JSON.stringify(state, null, 2))
  ]);
}

export default view;
