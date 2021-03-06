# Coecara

[![Netlify Status](https://api.netlify.com/api/v1/badges/452ce801-4955-427a-873d-c16b768d7647/deploy-status)](https://app.netlify.com/sites/boring-benz-79b0d3/deploys)

コエカラ(Coecara)は、良い感じに文章を整えてくれる・音声文字起こしサービスです。主な機能は、音声文字起こしと、APIを使った自動要約です。

https://coecara.com/  


## 開発者向け


```
$ git clone https://github.com/naogify/coecara-app.git
$ cd coecara-app/

# 依存関係をインストール
$ npm install

# 開発環境の立ち上げ
$ npm start
```
http://localhost:3000 で立ち上がります。  


*開発環境では、要約APIへのアクセスが制限されています。  
*音声文字起こしに [SpeechRecognition](https://developer.mozilla.org/ja/docs/Web/API/SpeechRecognition) を使用しているため、Google Chrome と Microsoft Edge のみ対応です。

## サードパーティリソース

### Twemoji
- Copyright 2020 Twitter, Inc and other contributors
- Code licensed under the MIT License: http://opensource.org/licenses/MIT
- Graphics licensed under CC-BY 4.0: https://creativecommons.org/licenses/by/4.0/