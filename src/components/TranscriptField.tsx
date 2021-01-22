import * as React from 'react';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  root: {
    width: '80%',
  },
});

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
