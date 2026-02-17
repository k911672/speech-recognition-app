class AudioProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.bufferSize = 2048;
    this.buffer = new Float32Array(this.bufferSize);
    this.bufferIndex = 0;
    
    // メッセージハンドラーを設定
    this.port.onmessage = (event) => {
      const { type, data } = event.data;
      
      if (type === 'configure') {
        this.bufferSize = data.bufferSize || 2048;
        this.buffer = new Float32Array(this.bufferSize);
        this.bufferIndex = 0;
      }
    };
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0];
    
    if (input && input.length > 0) {
      const inputChannel = input[0];
      
      // 入力データをバッファに蓄積
      for (let i = 0; i < inputChannel.length; i++) {
        this.buffer[this.bufferIndex] = inputChannel[i];
        this.bufferIndex++;
        
        // バッファが満杯になったらメインスレッドに送信
        if (this.bufferIndex >= this.bufferSize) {
          this.port.postMessage({
            type: 'audioData',
            audioData: new Float32Array(this.buffer)
          });
          this.bufferIndex = 0;
        }
      }
    }
    
    // オーディオをそのまま出力（パススルー）
    const output = outputs[0];
    if (output && output.length > 0) {
      for (let channel = 0; channel < output.length; channel++) {
        if (input && input[channel]) {
          output[channel].set(input[channel]);
        }
      }
    }
    
    return true; // プロセッサーを継続実行
  }
}

registerProcessor('audio-processor', AudioProcessor);
