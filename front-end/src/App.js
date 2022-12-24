import React, { useState, useEffect } from 'react';
import prettyMilliseconds from 'pretty-ms';

function App() {

  const oldTime = new Date("2022-12-20");

  const [time, setTime] = useState(prettyMilliseconds(new Date() - oldTime));

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(prettyMilliseconds(new Date() - oldTime));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return <div>The current time is: {time.toString()}</div>;
}

export default App; 