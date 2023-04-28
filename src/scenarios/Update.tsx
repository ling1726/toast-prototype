
import { toast } from '../react-toastify';
import { RendererProvider, createDOMRenderer } from "@griffel/react";
import { Toaster } from '../components/Toaster';

const renderer = createDOMRenderer(document);

const toastId = 'foo';

function App() {
  const notify = () => toast('Loading', { toastId, autoClose: false});

  const update = () => toast.update(toastId, { render: 'Downloaded file', autoClose: 3000});

  return (
    <RendererProvider renderer={renderer}>
      <Toaster position="bottom-right" targetDocument={document} />
      <button onClick={notify}>Make toast</button>
      <button onClick={update}>Update toast</button>
    </RendererProvider>
  );
}

export default App;
