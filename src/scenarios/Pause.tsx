
import { toast } from '../react-toastify';
import { RendererProvider, createDOMRenderer } from "@griffel/react";
import { Toaster } from '../components/Toaster';

const renderer = createDOMRenderer(document);

function App() {
  const notify = () => toast('This is a toast', { pauseOnFocusLoss: true, pauseOnHover: true });

  return (
    <RendererProvider renderer={renderer}>
      <Toaster position="bottom-right" targetDocument={document} />
      <button onClick={notify}>Make toast</button>
      Pauses on hover and window blur
    </RendererProvider>
  );
}

export default App;