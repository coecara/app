import React, { useState, useEffect, useRef } from 'react';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import TranscriptField from './components/TranscriptField';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import axios from 'axios';

declare global {
  interface Window {
    webkitSpeechRecognition: any;
  }
}

function App() {
  const recognizerRef = useRef<SpeechRecognition>();
  const [finalText, setFinalText] = useState(''); // 確定された文章
  const [transcript, setTranscript] = useState(''); // 認識中の文章
  const [detecting, setDetecting] = useState(false); // 音声認識ステータス
  const [lineCount, setLinuCount] = useState('5');
  const [summarizeText, setSummarizeText] = useState(''); // 要約された文章

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
    recognizerRef.current = new SpeechRecognition();
    recognizerRef.current.lang = 'ja-JP';
    recognizerRef.current.interimResults = true;
    recognizerRef.current.continuous = true;
    recognizerRef.current.onstart = () => {
      setDetecting(true);
    };
    recognizerRef.current.onend = () => {
      setDetecting(false);
    };
    recognizerRef.current.onresult = (event: SpeechRecognitionEvent) => {
      [...event.results].slice(event.resultIndex).forEach(result => {
        const transcript = result[0].transcript;
        setTranscript(transcript);
        if (result.isFinal) {
          // 音声認識が完了して文章が確定
          setFinalText(prevState => {
            return prevState + transcript;
          });
          // 文章確定したら候補を削除
          setTranscript('');
        }
      });
    };
  }, []);

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
        <Grid container direction="column">
          <Grid item>
            <Box fontSize={25}>
              <h4>文字起こしテキスト</h4>
              <TranscriptField finalText={finalText} transcript={transcript} />
            </Box>
          </Grid>
          <Grid item>
            <Box fontSize={25}>
              <h4>要約後テキスト</h4>
              {summarizeText && (
                <TranscriptField finalText={summarizeText} transcript={''} />
              )}
            </Box>
          </Grid>
        </Grid>
        <Box m={5}>
          <Grid container justify="center" spacing={5}>
            <Grid item xs={3}>
              <Button
                variant="outlined"
                disabled={detecting}
                color="secondary"
                size="large"
                onClick={() => {
                  recognizerRef.current?.start();
                }}
              >
                {detecting ? '検知中...' : '検知開始'}
              </Button>
            </Grid>
            <Grid container item xs={3} justify="center">
              <Grid container item justify="center">
                <Button
                  variant="outlined"
                  color="secondary"
                  size="large"
                  onClick={() => {
                    axios({
                      method: 'post',
                      url:
                        'https://h4xuyae3td.execute-api.ap-northeast-1.amazonaws.com/default/coecara-summarize-api-dev',
                      data: {
                        line_count: lineCount,
                        text: finalText,
                      },
                    })
                      .then(results => {
                        setSummarizeText(results.data['summary']);
                      })
                      .catch(results => {
                        console.log(results);
                      });
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
                    value={lineCount}
                    onChange={event => {
                      setLinuCount(event.target.value);
                    }}
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
