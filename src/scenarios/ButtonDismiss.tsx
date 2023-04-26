import { toast } from "../react-toastify";
import { RendererProvider, createDOMRenderer } from "@griffel/react";
import { Toaster } from "../components/Toaster";
import { useToastContext } from "../contexts/toastContext";

const renderer = createDOMRenderer(document);

const ToastContent = () => {
  const { closeToast } = useToastContext();
  return (
    <div>
      This is a toast <button onClick={closeToast}>dismiss</button>
    </div>
  );
};

function App() {
  const notify = () => toast(<ToastContent />, { autoClose: 5000});

  return (
    <RendererProvider renderer={renderer}>
      <Toaster position="bottom-right" targetDocument={document} />
      <button onClick={notify}>Make toast</button>
    </RendererProvider>
  );
}

export default App;
