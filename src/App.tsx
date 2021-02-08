import React, { useState, useEffect, useRef } from 'react';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import TranscriptField from './components/TranscriptField';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Config from './config';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
    },
    trascriptTitle: {
      fontSize: 20,
      textAlign: 'center',
    },
    transcriptField: {
      color: theme.palette.text.secondary,
      minHeight: 50,
      marginBottom: 30,
    },
  })
);

declare global {
  interface Window {
    webkitSpeechRecognition: any;
  }
}

function App() {
  const classes = useStyles();

  const recognizerRef = useRef<SpeechRecognition>();

  const [transcript, setTranscript] = useState(''); // 認識中の文章
  const [finalText, setFinalText] = useState(
    '「検知開始」ボタンを押して、文字起こし開始します。左の「要約開始」ボタンで要約します。'
  ); // 確定した文章

  const [detecting, setDetecting] = useState(false); // 音声認識ステータス
  const [summarizing, setSummarizing] = useState(false); // 音声認識ステータス

  const [lineCount, setLinuCount] = useState('3');
  const [summarizeText, setSummarizeText] = useState(''); // 要約された文章

  useEffect(() => {
    // NOTE: Web Speech APIが使えるブラウザか判定
    // https://developer.mozilla.org/ja/docs/Web/API/Web_Speech_API
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
      alert('お使いのブラウザには未対応です');
      return;
    }

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
    <div className="App" style={{ marginTop: 5 + 'vh' }}>
      <Container>
        <Grid container justify="center">
          <header className="App-header">
            <Box textAlign="center">
              <Box fontSize="h5.fontSize">
                <h1 style={{ marginBottom: 0 }}>コエカラ</h1>
              </Box>
              <p>良い感じに文章を整えてくれる・音声文字起こしサービス</p>
              <h1>📣 ➡ 📝</h1>
            </Box>
          </header>
        </Grid>
        <Grid container direction="row" spacing={3}>
          <Grid item container xs={6} direction="column" alignItems="center">
            <h4 className={classes.trascriptTitle}>文字起こしテキスト</h4>
            <Box fontSize={18} className={classes.transcriptField}>
              <TranscriptField finalText={finalText} transcript={transcript} />
            </Box>
            <Button
              variant="outlined"
              disabled={detecting}
              color="secondary"
              size="large"
              onClick={() => {
                setFinalText('');
                recognizerRef.current?.start();
              }}
            >
              {detecting ? '検知中...' : '検知開始'}
            </Button>
          </Grid>
          <Grid item xs={6}>
            <h4 className={classes.trascriptTitle}>要約テキスト</h4>
            <Box fontSize={18} className={classes.transcriptField}>
              {summarizeText && (
                <TranscriptField finalText={summarizeText} transcript={''} />
              )}
            </Box>
            <Grid item container direction="column" alignItems="center">
              <Button
                variant="outlined"
                disabled={summarizing}
                color="secondary"
                size="large"
                onClick={() => {
                  setSummarizing(true);
                  axios({
                    method: 'post',
                    url: Config.apiUrl,
                    data: {
                      line_count: lineCount,
                      text: finalText,
                    },
                  })
                    .then(results => {
                      setSummarizeText(results.data['summary']);
                      setSummarizing(false);
                    })
                    .catch(results => {
                      console.log(results);
                      setSummarizing(false);
                    });
                }}
              >
                {summarizing ? '要約中...' : '要約開始'}
              </Button>
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
      </Container>
    </div>
  );
}

export default App;
