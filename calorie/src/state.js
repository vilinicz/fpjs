const initState = {
  showForm: false,
  nextId: 2,
  editId: null,
  meal: {
    name: "",
    calories: 0
  },
  meals: [
    {
      id: 0,
      name: "Breakfast",
      calories: 460
    },
    {
      id: 1,
      name: "Lunch",
      calories: 640
    }
  ]
};

export default initState;
