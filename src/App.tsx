import React, {useState, useEffect, useRef} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Textarea from './components/Textarea';

import './App.css';

function App() {
  const [detecting, setDetecting] = useState(false); // 音声認識ステータス

  return (
    <div className="App">
      <header className="App-header">
        <h1>コエカラ</h1>
        <p>良い感じに文章を整えてくれる・音声文字起こしサービス</p>
      </header>
      <Container>
        <Grid container>
          <Grid item xs={12}>
            <Textarea />
          </Grid>
        </Grid>
        <Grid container>
          <Button
            variant="outlined"
            // disabled={detecting}
            color="secondary"
            size="large"
            onClick={() => {
              // recognizerRef.current.start();
            }}>
            {detecting ? '検知中...' : '検知開始'}
          </Button>
          <Button
            variant="outlined"
            // disabled={detecting}
            color="secondary"
            size="large"
            onClick={() => {
              // recognizerRef.current.start();
            }}>
            検知停止
          </Button>
          <Button
            variant="outlined"
            // disabled={detecting}
            color="secondary"
            size="large"
            onClick={() => {
              // recognizerRef.current.start();
            }}>
            自動要約
          </Button>
          <p>要約する行数を指定</p>
          <form noValidate autoComplete="off">
            <TextField id="standard-basic" label="Standard" />
          </form>
        </Grid>
      </Container>
    </div>
  );
}

export default App;
