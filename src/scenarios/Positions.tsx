import { ToastPosition, toast } from '../react-toastify';
import { RendererProvider, createDOMRenderer } from "@griffel/react";
import { Toaster } from '../components/Toaster';

const renderer = createDOMRenderer(document);

function App() {
  const notify = (position: ToastPosition) => toast('This is a toast', { position });

  return (
    <RendererProvider renderer={renderer}>
      <Toaster position="bottom-right" targetDocument={document} />
      <button onClick={() => notify('bottom-left')}>bottom-left</button>
      <button onClick={() => notify("bottom-right")}>bottom-right</button>
      <button onClick={() => notify("top-left")}>top-left</button>
      <button onClick={() => notify("top-right")}>top-right</button>
    </RendererProvider>
  );
}

export default App;
