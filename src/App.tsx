import * as React from "react";

const scenarios = import.meta.glob("./scenarios/*.tsx", { eager: true });

function App() {
  const names = Object.keys(scenarios).map((key) => key.split("/")[2]);
  const [scenario, setScenario] = React.useState(
    () => Object.keys(scenarios)[2]
  );

  const onChange = (e: React.FormEvent) => {
    const target = e.target as HTMLInputElement;
    const nextScenario = `./scenarios/${target.name}`;
    setScenario(nextScenario);
  };

  return (
    <>
      <div onChange={onChange}>
        {names.map((name) => (
          <div key={name}>
            <label htmlFor={name}>{name}</label>
            <input
              onChange={() => null}
              checked={scenario === `./scenarios/${name}`}
              id={name}
              type="radio"
              value="scenario"
              name={name}
            />
          </div>
        ))}
      </div>
      {(scenarios[scenario] as any).default()}
    </>
  );
}

export default App;
