import hh from "hyperscript-helpers";
import { h } from "virtual-dom";
import * as R from "ramda";
import {
  showFormMsg,
  nameInputMsg,
  caloriesInputMsg,
  saveMealMsg,
  deleteMealMsg,
  editMealMsg,
} from "./update.js";

const {
  pre,
  div,
  h1,
  button,
  form,
  input,
  label,
  table,
  tbody,
  thead,
  tr,
  td,
  th,
  i,
} = hh(h);

function cell(tag, className, value) {
  return tag({ className }, value);
}

const tableHeader = thead([
  tr([
    cell(th, "pa2 tl", "Meal"),
    cell(th, "pa2 tr", "Calories"),
    cell(th, "pa2 tr", "")
  ])
]);

function mealRow(dispatch, className, meal) {
  return tr({ className }, [
    cell(td, "pa2", meal.name),
    cell(td, "pa2 tr", meal.calories),
    cell(td, "pa2 tr", [
      i(
        {
          className: "ph1 mr1 blue fa fa-pencil pointer",
          onclick: () => dispatch(editMealMsg(meal.id))
        },
      ),
      i(
        {
          className: "ph1 red fa fa-trash-o pointer",
          onclick: () => dispatch(deleteMealMsg(meal.id))
        },
      )
    ])
  ]);
}

function mealsBody(dispatch, className, meals) {
  const rows = R.map(R.partial(mealRow, [dispatch, "stripe-dark"]), meals);

  const rowsWithTotal = [...rows, totalRow(meals)];

  return tbody({ className }, rowsWithTotal);
}

function tableView(dispatch, meals) {
  if (meals.length === 0) {
    return div({ className: "mv2 i black-50" }, "No meals to display");
  }
  return table({ className: "mv2 w-100 collapse" }, [
    tableHeader,
    mealsBody(dispatch, "", meals)
  ]);
}

function totalRow(meals) {
  const total = R.pipe(
    R.map(meal => meal.calories),
    R.sum
  )(meals);
  return tr({ className: "bt b" }, [
    cell(td, "pa2", "Total"),
    cell(td, "pa2 tr", total),
    cell(td, "", "")
  ]);
}

function fieldSet(labelText, inputValue, oninput) {
  return div({ className: "mv2" }, [
    label({ className: "db mb1" }, labelText),
    input({
      className: "pa2 input-reset ba w-100 mb2",
      type: "text",
      value: inputValue,
      oninput
    })
  ]);
}

function buttonSet(dispatch) {
  return div([
    button(
      {
        className: "pv2 ph3 link bg-blue white bn br2 mr2 dim dib",
        type: "submit"
      },
      "Save"
    ),
    button(
      {
        className: "pv2 ph3 bg-light-gray bn br2 dim",
        type: "button",
        onclick: () => dispatch(showFormMsg(false))
      },
      "Cancel"
    )
  ]);
}

function formView(dispatch, state) {
  const { name, calories } = state.meal;
  if (state.showForm) {
    return form(
      {
        className: "w-100 mv2",
        onsubmit: e => {
          e.preventDefault();
          dispatch(saveMealMsg);
        }
      },
      [
        fieldSet("Meal", name, e => dispatch(nameInputMsg(e.target.value))),
        fieldSet("Calories", calories || "", e =>
          dispatch(caloriesInputMsg(e.target.value))
        ),
        buttonSet(dispatch)
      ]
    );
  }
  return button(
    {
      className: "pv2 ph3 bg-blue white bn br2",
      type: "submit",
      onclick: () => dispatch(showFormMsg(true))
    },
    "Add Meal"
  );
}

function view(dispatch, state) {
  return div({ className: "mw6 center" }, [
    h1({ className: "f2 pv2 bb" }, "Calorie Counter"),
    formView(dispatch, state),
    tableView(dispatch, state.meals),
    // pre(JSON.stringify(state, null, 2))
  ]);
}

export default view;
