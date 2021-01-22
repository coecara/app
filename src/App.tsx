import React, { useState, useEffect, useRef } from 'react';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Textarea from './components/Textarea';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

declare global {
  interface Window {
    webkitSpeechRecognition: any;
  }
}

function App() {
  let speechRecognition: SpeechRecognition;

  useEffect(() => {
    // NOTE: Web Speech APIが使えるブラウザか判定
    // https://developer.mozilla.org/ja/docs/Web/API/Web_Speech_API
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
      alert('お使いのブラウザには未対応です');
      return;
    }
    // NOTE: 将来的にwebkit prefixが取れる可能性があるため
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    speechRecognition = new SpeechRecognition();
    speechRecognition.lang = 'ja-JP';
    speechRecognition.interimResults = true;
    speechRecognition.continuous = true;
    speechRecognition.onstart = () => {};
    speechRecognition.onresult = (event: SpeechRecognitionEvent) => {
      [...event.results].slice(event.resultIndex).forEach(result => {
        const transcript = result[0].transcript;
        setTranscript(transcript);
        if (result.isFinal) {
          // 音声認識が完了して文章が確定
          setFinalText(prevState => {
            // Android chromeなら値をそのまま返す
            return isAndroid ? transcript : prevState + transcript;
          });
          // 文章確定したら候補を削除
          setTranscript('');
        }
      });
    };
  }, []);

  const [detecting, setDetecting] = useState(false); // 音声認識ステータス
  return (
    <div className="App" style={{ marginTop: 50 + 'px' }}>
      <Container>
        <Grid container justify="center">
          <header className="App-header">
            <Box textAlign="center">
              <Box fontSize="h4.fontSize">
                <h1 style={{ marginBottom: 0 }}>コエカラ</h1>
              </Box>
              <p>良い感じに文章を整えてくれる・音声文字起こしサービス</p>
              <h1>📣 ➡ 📝</h1>
            </Box>
          </header>
        </Grid>
        <Grid container>
          <Grid container item justify="center">
            <Textarea />
          </Grid>
        </Grid>
        <Box m={5}>
          <Grid container justify="center" spacing={5}>
            <Grid item xs={3}>
              <Button
                variant="outlined"
                // disabled={detecting}
                color="secondary"
                size="large"
                onClick={() => {
                  speechRecognition.start();
                }}
              >
                {detecting ? '検知中...' : '検知開始'}
              </Button>
            </Grid>
            <Grid container item xs={3} justify="center">
              <Grid container item justify="center">
                <Button
                  variant="outlined"
                  // disabled={detecting}
                  color="secondary"
                  size="large"
                  onClick={() => {
                    // recognizerRef.current.start();
                  }}
                >
                  自動要約
                </Button>
              </Grid>
              <Grid container item justify="center">
                <p>要約する行数を指定</p>
                <form noValidate autoComplete="off">
                  <TextField
                    id="standard-basic"
                    type="number"
                    defaultValue={3}
                  />
                </form>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </div>
  );
}

export default App;
