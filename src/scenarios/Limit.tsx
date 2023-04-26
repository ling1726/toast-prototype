import { toast } from '../react-toastify';
import { RendererProvider, createDOMRenderer } from "@griffel/react";
import { Toaster } from '../components/Toaster';

const renderer = createDOMRenderer(document);

function App() {
  const notify = () => toast('This is a toast');

  return (
    <RendererProvider renderer={renderer}>
      <Toaster limit={3} position="bottom-right" targetDocument={document} />
      <button onClick={notify}>Make toast</button>
    </RendererProvider>
  );
}

export default App;
