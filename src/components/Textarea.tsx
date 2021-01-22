import * as React from 'react';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles({
  root: {
    width: '80%',
  },
});

type Props = {};

const Content = (props: Props) => {
  const classes = useStyles();
  return (
    <TextareaAutosize
      className={classes.root}
      aria-label="minimum height"
      rowsMin={10}
      placeholder="要約する文章を入力"
    />
  );
};
export default Content;
