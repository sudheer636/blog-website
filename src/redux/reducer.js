const initialState = {
  username: null,
  token: null,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_USERNAME":
      return { ...state, username: action.payload };
    case "SET_TOKEN":
      return { ...state, token: action.payload };
    default:
      return state;
  }
};

export default userReducer;