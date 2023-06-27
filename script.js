const { useState, useReducer, useContext, useEffect, createContext } = React;
const { render } = ReactDOM;

// Context
const actions = {
  increment: "INCREMENT_CURRENT",
  decrement: "DECREMENT_CURRENT",
  reset: "RESET_CURRENT",
  changeSession: "CHANGE_SESSION" };


const initialContext = {
  current: "work",
  work: {
    name: "work",
    initialTime: 1500,
    timeLeft: 1500 },

  break: {
    name: "break",
    initialTime: 300,
    timeLeft: 300 } };



const reducer = (state, action) => {
  const { current } = state;
  let result;

  switch (action.type) {
    case actions.increment:
      result = state[current].timeLeft + action.payload;
      return {
        ...state,
        [current]: {
          ...state[current],
          timeLeft: result > 3600 ? 3600 : state[current].timeLeft + action.payload } };


    case actions.decrement:
      result = state[current].timeLeft - action.payload;
      return {
        ...state,
        [current]: {
          ...state[current],
          timeLeft: result <= 0 ? 0 : state[current].timeLeft - action.payload } };


    case actions.reset:
      return {
        ...state,
        [current]: {
          ...state[current],
          timeLeft: state[current].initialTime } };


    case actions.changeSession:
      return {
        ...state,
        current: current === "work" ? "break" : "work" };

    default:
      return {
        ...state };}


};

const Context = createContext(initialContext);

const ContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialContext);

  return /*#__PURE__*/(
    React.createElement(Context.Provider, { value: { state, dispatch } }, children));

};

// App
const formatTime = time => {
  const mins = String(Math.floor(time / 60)).padStart(2, "0");
  const secs = String(Math.ceil(time - mins * 60)).padStart(2, "0");
  return { mins, secs };
};

const TimeLeft = ({ timeLeft }) => {
  const { mins, secs } = formatTime(timeLeft);
  return /*#__PURE__*/React.createElement("p", { className: "timer__time" }, `${mins}:${secs}`);
};

const TimerPad = ({ active, setActive }) => {
  const { state, dispatch } = useContext(Context);

  return /*#__PURE__*/(
    React.createElement("div", { className: "timer__pad" }, /*#__PURE__*/
    React.createElement("button", {
      type: "button",
      className: `btn ${active ? 'btn-red' : null} pad__start`,
      onClick: () => setActive(!active) },

    active ? "Stop" : "Start"), /*#__PURE__*/

    React.createElement("button", {
      type: "button",
      className: "btn pad__plus-five",
      onClick: () => dispatch({ type: actions.increment, payload: 300 }) }, "+5"), /*#__PURE__*/



    React.createElement("button", {
      type: "button",
      className: "btn pad__minus-five",
      onClick: () => dispatch({ type: actions.decrement, payload: 300 }) }, "-5"), /*#__PURE__*/



    React.createElement("button", {
      type: "button",
      className: "btn pad__reset",
      onClick: () => {
        setActive(false);
        dispatch({ type: actions.reset });
      } }, "Reset"), /*#__PURE__*/



    React.createElement("button", {
      type: "button",
      className: "btn pad__change",
      onClick: () => {
        setActive(false);
        dispatch({ type: actions.changeSession });
      } }, "Change")));





};

const Timer = () => {
  const { state, dispatch } = useContext(Context);
  const [isActive, setIsActive] = useState(false);

  const { current } = state;

  useEffect(() => {
    let interval = undefined;
    if (!isActive) return;

    interval = setInterval(
    () => dispatch({ type: actions.decrement, payload: 1 }),
    1000);

    return () => clearInterval(interval);
  }, [state[current].timeLeft, isActive]);

  return /*#__PURE__*/(
    React.createElement("div", null, /*#__PURE__*/
    React.createElement("div", { className: "timer__card" }, /*#__PURE__*/
    React.createElement("p", { className: "timer__current" }, current), /*#__PURE__*/
    React.createElement(TimeLeft, { timeLeft: state[current].timeLeft })), /*#__PURE__*/

    React.createElement(TimerPad, { active: isActive, setActive: setIsActive })));


};

const app = document.getElementById("app");
render( /*#__PURE__*/
React.createElement(ContextProvider, null, /*#__PURE__*/
React.createElement(Timer, null)),

app);