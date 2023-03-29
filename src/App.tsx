import { ToastContainer } from "./ToastContainer";
import { ToastExample } from "./ToastExample";

function App() {
  return (
    <ToastContainer>
      <div className="App">
        <ToastExample name="one">One</ToastExample>
        <ToastExample name="two">Two</ToastExample>
        <ToastExample name="three">Three</ToastExample>
        <ToastExample name="four">Four</ToastExample>
        <ToastExample name="five">Five</ToastExample>
        <ToastExample name="six">Six</ToastExample>
      </div>
    </ToastContainer>
  );
}

export default App;
