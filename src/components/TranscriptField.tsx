import * as React from 'react';

type Props = {
  finalText: string;
  transcript: string;
};

const Content = (props: Props) => {
  return (
    <p>
      {props.finalText}
      {props.transcript}
    </p>
  );
};
export default Content;
