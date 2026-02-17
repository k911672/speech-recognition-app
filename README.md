# React 文字起こしアプリケーション

このプロジェクトは、AWS Transcribeを使用してリアルタイムの文字起こしを行うReactアプリケーションです。

## 機能

- **文字起こし**: 日本語でのリアルタイム文字起こし
- **翻訳**: 文字起こし結果の翻訳機能（日本語 → 英語）

## 技術スタック

| カテゴリ | 技術 |
|---------|------|
| フロントエンド | React 18, TypeScript |
| UIライブラリ | Mantine UI v8 |
| ビルドツール | Vite |
| AWS サービス | Transcribe Streaming, Translate |
| インフラ | AWS Amplify Gen2 |

## プロジェクト構造

```
src/
├── speech-recognition/      # 音声認識機能
│   ├── components/          # UIコンポーネント
│   ├── hooks/               # カスタムフック
│   │   ├── transcription/   # 文字起こし用
│   │   └── translation/     # 翻訳用
│   ├── services/            # サービス層
│   │   ├── transcription/   # AWS Transcribe連携
│   │   └── translation/     # AWS Translate連携
│   ├── constants/           # 定数定義
│   └── types/               # 型定義
└── common/                  # 共通ユーティリティ
    ├── components/          # 共通コンポーネント
    ├── hooks/               # 共通フック
    ├── constants/           # 共通定数
    └── utils/               # ユーティリティ関数
```

## セットアップ

### 前提条件

- Node.js 18.x以上
- AWS CLIが設定済み

### 1. 依存関係のインストール

```bash
npm install
```

### 2. Amplifyのサンドボックス立ち上げ

```bash
npx ampx sandbox
```

### 3. インフラストラクチャのデプロイ

以下記事の「2. Amplify Gen2でのデプロイ設定手順」を参照

[Amplify Gen2でのデプロイを簡単にやってみよう！](https://benjamin.co.jp/blog/technologies/amplify-gen2-deploy-method/)

### 4. 環境変数の設定

#### ローカル開発時
`.env-sample`を`.env`にコピーし、AWS アクセスキー等を記載します。

```bash
cp .env-sample .env
```

#### Amplify Gen2 デプロイ時
Amplifyコンソールから環境変数を設定します。

詳細な手順は [Amplify Gen2 環境変数設定手順](./docs/AMPLIFY_ENV_SETUP.md) を参照してください。


### 5. アプリケーションの起動

```bash
npm run dev
```

## 使用方法

### 文字起こし開始

1. マイクのアクセス許可を確認
2. 「翻訳開始」ボタンをクリック
3. 日本語で話すと、リアルタイムで文字起こしと英語翻訳が表示されます
4. 停止する場合は「全て停止」ボタンをクリック

## ドキュメント

- [Amplify Gen2 環境変数設定手順](./docs/AMPLIFY_ENV_SETUP.md)
- [アーキテクチャ詳細](./docs/ARCHITECTURE.md)
- [トラブルシューティング](./docs/TROUBLESHOOTING.md)

## 開発

```bash
# 開発サーバー起動
npm run dev

# ビルド
npm run build

# リント
npm run lint
```

## ライセンス

MIT License
