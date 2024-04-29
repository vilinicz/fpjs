import * as R from "ramda";

const MSGS = {
  SHOW_FORM: "SHOW_FORM",
  NAME_INPUT: "NAME_INPUT",
  CALORIES_INPUT: "CALORIES_INPUT",
  SAVE_MEAL: "SAVE_MEAL",
  DELETE_MEAL: "DELETE_MEAL",
  EDIT_MEAL: "EDIT_MEAL"
};

export function showFormMsg(showForm) {
  return {
    type: MSGS.SHOW_FORM,
    showForm
  };
}

export function nameInputMsg(name) {
  return {
    type: MSGS.NAME_INPUT,
    name
  };
}

export function caloriesInputMsg(calories) {
  return {
    type: MSGS.CALORIES_INPUT,
    calories
  };
}

export const saveMealMsg = { type: MSGS.SAVE_MEAL };

export function deleteMealMsg(id) {
  return {
    type: MSGS.DELETE_MEAL,
    id
  };
}

export function editMealMsg(editId) {
  return {
    type: MSGS.EDIT_MEAL,
    editId
  };
}

function update(msg, state) {
  switch (msg.type) {
    case MSGS.SHOW_FORM:
      const { showForm } = msg;
      return { ...state, showForm, meal: { name: "", calories: 0 } };
    case MSGS.NAME_INPUT:
      const { name } = msg;
      return { ...state, meal: { ...state.meal, name } };
    case MSGS.CALORIES_INPUT:
      const calories = R.pipe(
        parseInt,
        R.defaultTo(0)
      )(msg.calories);
      return { ...state, meal: { ...state.meal, calories } };
    case MSGS.SAVE_MEAL:
      return state.editId !== null ? edit(msg, state) : add(msg, state);
    case MSGS.DELETE_MEAL:
      const { id } = msg;
      const meals = R.filter(meal => meal.id !== id, state.meals);
      return { ...state, meals };
    case MSGS.EDIT_MEAL:
      const { editId } = msg;
      const meal = R.find(meal => meal.id === editId, state.meals);
      return {
        ...state,
        editId,
        meal: { name: meal.name, calories: meal.calories },
        showForm: true
      };
  }
  return state;
}

function add(msg, state) {
  const meals = R.append({ ...state.meal, id: state.nextId }, state.meals);
  return {
    ...state,
    meals,
    nextId: state.nextId + 1,
    meal: { name: "", calories: 0 },
    showForm: false
  };
}

function edit(msg, state) {
  const { editId } = state;
  const meals = R.map(meal => {
    if (meal.id === editId) {
      return { ...meal, ...state.meal };
    }
    return meal;
  }, state.meals);
  return {
    ...state,
    meals,
    meal: { name: "", calories: 0 },
    editId: null,
    showForm: false
  };
}

export default update;
