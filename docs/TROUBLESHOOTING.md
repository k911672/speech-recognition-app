# トラブルシューティング

このドキュメントでは、よくある問題とその解決方法について説明します。

## よくあるエラーと解決方法

### マイク関連のエラー

#### マイクへのアクセスが拒否されました

**エラーメッセージ:**
> マイクへのアクセスが拒否されました。ブラウザの設定でマイクの許可を確認してください。

**原因:**
ブラウザでマイクへのアクセスが許可されていません。

**解決方法:**

1. ブラウザのアドレスバー左側の鍵アイコンをクリック
2. 「サイトの設定」を開く
3. 「マイク」を「許可」に変更
4. ページを再読み込み

**Chrome の場合:**
```
設定 → プライバシーとセキュリティ → サイトの設定 → マイク
```

---

#### マイクが見つかりません

**エラーメッセージ:**
> マイクが見つかりません。マイクが接続されているか確認してください。

**原因:**
- マイクが接続されていない
- マイクがシステムに認識されていない

**解決方法:**

1. マイクが正しく接続されているか確認
2. システムの音声設定でマイクが認識されているか確認
3. 他のアプリケーションでマイクが使用中でないか確認
4. ブラウザを再起動

---

#### ブラウザがサポートされていません

**エラーメッセージ:**
> このブラウザでは音声認識がサポートされていません。

**原因:**
使用しているブラウザがWeb Audio APIまたはAudioWorkletをサポートしていません。

**解決方法:**

以下のブラウザを使用してください：
- Google Chrome（推奨）
---

### AWS関連のエラー

#### 認証情報エラー

**エラーメッセージ:**
> AWS認証情報が正しく設定されていません。環境変数を確認してください。

**原因:**
- 環境変数が設定されていない
- アクセスキーが無効

**解決方法:**

1. `.env` ファイルを確認
```bash
VITE_AWS_ACCESS_KEY_ID=your_access_key
VITE_AWS_SECRET_ACCESS_KEY=your_secret_key
VITE_AWS_REGION=ap-northeast-1
```

2. IAMユーザーのアクセスキーが有効か確認
3. 開発サーバーを再起動

---

#### リージョンエラー

**エラーメッセージ:**
> AWSリージョンが正しく設定されていません。

**原因:**
環境変数 `VITE_AWS_REGION` が設定されていないか、無効なリージョンが指定されています。

**解決方法:**

1. `.env` ファイルで有効なリージョンを指定
```bash
VITE_AWS_REGION=ap-northeast-1
```

2. AWS Transcribe Streamingがサポートされているリージョンを使用：
   - `us-east-1`
   - `us-west-2`
   - `ap-northeast-1`（東京）
   - `eu-west-1`

---

#### IAM権限エラー

**エラーメッセージ:**
> Transcribe Streamingの権限がありません。IAMポリシーを確認してください。

**原因:**
IAMユーザーにTranscribe/Translateの権限が付与されていません。

**解決方法:**

IAMポリシーに以下の権限を追加：

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "transcribe:StartStreamTranscription",
        "transcribe:StartStreamTranscriptionWebSocket"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "translate:TranslateText"
      ],
      "Resource": "*"
    }
  ]
}
```

---

#### スロットリングエラー

**エラーメッセージ:**
> リクエストが多すぎます。しばらく待ってから再試行してください。

**原因:**
AWSサービスへのリクエストが制限を超えています。

**解決方法:**

1. 数分待ってから再試行
2. 連続して開始/停止を繰り返さない
3. 必要に応じてAWSサポートに制限緩和を申請

---

### その他のエラー

#### AudioWorklet初期化エラー

**エラーメッセージ:**
> AudioWorklet initialization failed

**原因:**
- ブラウザがAudioWorkletをサポートしていない
- `audio-processor.js` が読み込めない

**解決方法:**

1. `public/audio-processor.js` が存在するか確認
2. 開発サーバーが正しく起動しているか確認
3. ブラウザのキャッシュをクリア
4. 最新のChromeを使用

---

## デバッグ方法

### ブラウザのコンソールログ

開発者ツール（F12）を開き、Consoleタブでエラーログを確認します。

```javascript
// 主要なログ
"Transcription stopped"  // 正常停止
"No transcript results in event"  // 結果なし（無音時）
"Error starting transcription"  // 開始エラー
```

### ネットワークタブの確認

1. 開発者ツールの「Network」タブを開く
2. WebSocketまたはHTTPリクエストを確認
3. エラーステータスコードを確認

### 環境変数の確認

```javascript
// コンソールで実行
console.log(import.meta.env.VITE_AWS_REGION);
console.log(import.meta.env.VITE_AWS_ACCESS_KEY_ID ? '設定済み' : '未設定');
```

---

## サポート

問題が解決しない場合は、GitHubのIssueを作成してください。

Issue作成時に含める情報：
- ブラウザの種類とバージョン
- エラーメッセージの全文
- 再現手順
- コンソールログのスクリーンショット
