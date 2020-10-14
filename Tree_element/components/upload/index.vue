<template>
  <div>
    <div>
      <el-input
        type="text"
        placeholder="测试页面是否卡顿"
        v-model="inputVal"
      ></el-input>
    </div>
    <h1>测试</h1>
    <input
      type="file"
      @change="handleFileChange"
    />
    <el-button
      type="primary"
      @click="handleUpload"
    >上传</el-button>
    <el-button
      type='warning'
      @click="slowUpload"
    >慢上传</el-button>
    <el-button
      type='warning'
      @click="handleResume"
      v-if="status === Status.pause"
    >恢复</el-button>
    <!-- <el-button
      v-else
      :disabled="status !== Status.uploading || !container.hash"
      @click="handlePause"
    >暂停</el-button> -->
    <el-button @click="handlePause">暂停</el-button>
    <div>
      <div>计算文件hash</div>
      <el-progress :percentage="hashProgress"></el-progress>
      <div>总进度</div>
      <el-progress :percentage="fakeProgress"></el-progress>
    </div>
    <div
      class="cube-container"
      :style="{width: cubeWidth+'px'}"
    >
      <div
        class="cube"
        v-for="chunk in chunks"
        :key="chunk.hash"
      >
        <div
          :class="{
          'uploading':chunk.propress>0 && chunk.propress<100,
          'success': chunk.propress === 100,
          'error': chunk.propress<0
          }"
          :style="{height: chunks.propress + '%'}"
        >{{chunk.index}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import SparkMD5 from 'spark-md5'; // 快速获取文件MD5值
const SIZE = 0.2 * 1024 * 1024; // 设置分片大小 200kb
import { post, request } from '../../api';
import sparkMd5 from 'spark-md5';
const Status = {
  wait: 'wait',
  pause: 'pause',
  uploading: 'uploading',
  error: 'error',
  done: 'success',
};
export default {
  data() {
    return {
      inputVal: '',
      container: {
        file: null,
      },
      chunks: [],
      hashProgress: 0,
      requestList: [],
      Status,
      status: Status.wait,
      fakeProgress: 0,
    };
  },
  filters: {
    transformByte(val) {
      return Number((val / 1024).toFixed(0));
    },
  },
  computed: {
    cubeWidth() {
      return Math.ceil(Math.sqrt(this.chunks.length)) * 16;
    },
  },
  methods: {
    handlePause() {
      this.mergeRequest();
    },
    // 慢上传
    async slowUpload() {
      if (!this.container.file) return;
      const file = this.container.file;
      this.status = Status.uploading;
      const fileSize = file.size;
      let offset = 1024 * 1024;
      let cur = 0;
      let count = 0;
      this.container.hash = await this.calculateHashSample();
      while (cur < fileSize) {
        const chunk = file.slice(cur, cur + offset);
        cur += offset;
        const chunkName = this.container.hash + '-' + count;
        const formData = new FormData();
        formData.append('chunk', chunk);
        formData.append('hash', chunkName);
        formData.append('filename', file.name);
        formData.append('filehash', this.container.hash);
        formData.append('size', chunk.size);
        // 计算开始时间
        let start = new Date().getTime();
        await request({ url: '/upload', data: formData });
        // 计算结束时间
        const now = new Date().getTime();
        // 计算时间差
        const time = ((now - start) / 1000).toFixed(4);
        // 计算上传滚动条
        this.fakeProgress = (cur / fileSize) * 100;
        // 计算一个速率
        let rate = time / 30;
        // 实时调整上传大小
        if (rate < 0.5) rate = 0.5;
        if (rate > 2) rate = 2;
        console.log(
          `切片${count}大小是${this.format(
            offset
          )},耗时${time}秒，是30秒的${rate}倍，修正大小为${this.format(
            offset / rate
          )}`
        );
        offset = parseInt(offset / rate);
        count++;
      }
    },
    format(num) {
      if (num > 1024 * 1024 * 1024) {
        return (num / (1024 * 1024 * 1024)).toFixed(2) + 'GB';
      }
      if (num > 1024 * 1024) {
        return (num / (1024 * 1024)).toFixed(2) + 'MB';
      }
      if (num > 1024) {
        return (num / 1024).toFixed(2) + 'KB';
      }
      return num + 'B';
    },
    // input change 事件
    handleFileChange(e) {
      const [file] = e.target.files;
      if (!file) return;
      this.container.file = file;
    },
    // 点击上传,生成上传切片
    async handleUpload() {
      // 文件是否存在
      if (!this.container.file) return;
      // 状态
      this.status = Status.uploading;
      // 生成分片
      const chunks = this.createFileChunk(this.container.file);
      // 计算hash，对于小文件，使用分片
      // this.container.hash = await this.calculateHashSync(chunks);
      // 计算hash，形成文件唯一标识！ 类似于博隆过滤器
      this.container.hash = await this.calculateHashSample();
      // 计算hash, 使用wookloop
      // this.container.hash = await this.calculateHashIdle(chunks);
      // 判断文件是否存在，如果不存在，获取已经上传的切片
      const { uploaded, uploadedList } = await this.verify(
        this.container.file.name,
        this.container.hash
      );
      if (uploaded) {
        return this.$message.success('文件上传成功！');
      }
      // 生成上传切片
      this.chunks = chunks.map((chunk, index) => {
        const chunkName = this.container.hash + '-' + index;
        return {
          fileHash: this.container.hash,
          chunk: chunk.file,
          index,
          hash: chunkName,
          propress: uploadedList.indexOf(chunkName) > -1 ? 100 : 0, // 用于断点续传的
          size: chunk.file.size,
        };
      });
      // 执行上传
      await this.uploadChunks(uploadedList);
    },
    // 切分chunks
    createFileChunk(file, size = SIZE) {
      const chunks = [];
      let cur = 0;
      while (cur < file.size) {
        chunks.push({ file: file.slice(cur, cur + size) });
        cur += size;
      }
      return chunks;
    },
    // 异步计算hash
    async calculateHashSync(chunks) {
      return new Promise((resolve) => {
        const spark = new sparkMd5.ArrayBuffer();
        let progress = 0;
        let count = 0;
        const loadNext = (index) => {
          const reader = new FileReader();
          reader.readAsArrayBuffer(chunks[index].file);
          reader.onload = (e) => {
            count++;
            spark.append(e.target.result);
            if (count === chunks.length) {
              this.hashProgress = 100;
              resolve(spark.end());
            } else {
              this.hashProgress += 100 / chunks.length;
              loadNext(count);
            }
          };
        };
        loadNext(0);
      });
    },
    // 计算hash
    async calculateHashSample() {
      return new Promise((resolve) => {
        const spark = new SparkMD5.ArrayBuffer();
        const reader = new FileReader();
        const file = this.container.file;
        // 文件大小
        const size = file.size;
        let offset = 2 * 1024 * 1024;
        if (size < offset) {
          this.hashProgress = 100;
        }
        // 前面2M
        let chunks = [file.slice(0, offset)];
        // 后面的
        let cur = offset;
        while (cur < size) {
          // 最后一块，加入进来
          if (cur + offset > size) {
            this.hashProgress = 100;
            chunks.push(file.slice(cur, cur + offset));
          } else {
            // 中间的 前中后取两个字节
            const mid = cur + offset / 2;
            const end = cur + offset;
            chunks.push(file.slice(cur, cur + 2));
            chunks.push(file.slice(mid, mid + 2));
            chunks.push(file.slice(end - 2, end));
            this.hashProgress = (cur / size) * 100;
            console.log(cur / size);
          }
          cur += offset;
        }
        reader.readAsArrayBuffer(new Blob(chunks));
        reader.onload = (e) => {
          spark.append(e.target.result);
          resolve(spark.end());
        };
      });
    },
    // 计算hash , 类似于Filber
    async calculateHashIdle(chunks) {
      return new Promise((resolve) => {
        const spark = new sparkMd5.ArrayBuffer();
        let count = 0;
        const appendToSpark = async (file) => {
          return new Promise((resolve) => {
            const read = new FileReader();
            read.readAsArrayBuffer(file);
            read.onload = (e) => {
              spark.append(e.target.result);
              resolve();
            };
          });
        };
        const workLoop = async (deadLine) => {
          while (count < chunks.length && deadLine.timeRemaining() > 1) {
            await appendToSpark(chunks[count].file);
            count++;
            if (count < chunks.length) {
              this.hashProgress = Number((count / chunks.length) * 100);
            } else {
              this.hashProgress = 100;
              resolve(spark.end());
            }
          }
          window.requestIdleCallback(workLoop);
        };
        window.requestIdleCallback(workLoop);
      });
    },
    // 获取文件状态
    async verify(filename, hash) {
      const data = await post('/verify', { filename, hash });
      return data;
    },
    // 上传切片
    async uploadChunks(uploadedList = []) {
      /**
       * 上传完成的分片，大文件就是灾难
       * 需要解决，异步并发控制策略
       */

      // 过滤出来没有上传的，生成formData上传数据
      const list = this.chunks
        .filter((chunk) => uploadedList.indexOf(chunk.hash) == -1)
        .map(({ chunk, hash, index }) => {
          const form = new FormData();
          form.append('chunk', chunk);
          form.append('hash', hash);
          form.append('filename', this.container.file.name);
          form.append('filehash', this.container.hash);
          return { form, index, status: Status.wait };
        });
      try {
        const ret = await this.sendRequest(list, 4);
        // 判断是否上传完成
        console.log(uploadedList.length + list.length, this.chunks.length);
        if (uploadedList.length + list.length === this.chunks.length) {
          // 合并上传的数据
          await this.mergeRequest();
        }
      } catch (e) {
        // 上传又被reject
        this.$message.error('上传失败，请重新尝试！');
      }
    },
    // 异步并发策略
    async sendRequest(urls, max = 4, retrys = 3) {
      return new Promise((resolve, reject) => {
        const len = urls.length;
        let counter = 0;
        let retryArr = [];
        const start = async () => {
          while (counter < len && max > 0) {
            max--;
            const i = urls.findIndex(
              (v) => v.status === Status.wait || v.status === Status.error
            ); // 找出 等待或者error的
            if (i === -1) {
              resolve();
              return false;
            }
            urls[i].status = Status.uploading;
            const form = urls[i].form;
            const index = urls[i].index;
            if (typeof retryArr[index] === 'number') {
              console.log(index, '开始重试');
            }
            request({
              url: '/upload',
              data: form,
              onProgres: this.createPorgresshandler(this.chunks[index]),
              requestList: this.requestList,
            })
              .then(() => {
                counter++;
                if (counter > len) {
                  this.fakeProgress = 100;
                  resolve();
                  return false;
                } else {
                  max++;
                  this.chunks[i].propress = 100;
                  this.chunks[i].done = true;
                  this.chunks[i].status = Status.done;
                  this.fakeProgress = (counter / len) * 100;
                  start();
                }
              })
              .catch(() => {
                urls[i].status = Status.error;
                if (typeof retryArr[index] !== 'number') {
                  retryArr[index] = 0;
                }
                retryArr[index]++;
                if (retryArr[index] >= retrys) {
                  return reject();
                }
                this.chunks[index].process = -1;
                max++;
                start();
              });
          }
        };
        start();
      });
    },
    // 合并上传数据
    async mergeRequest() {
      // this.container = {
      //   file: { name: '01简易搭建（免费版）.exe' },
      //   hash: '36744f6312478fd2bc292dcac23eada4',
      // };
      await post('/merge', {
        filename: this.container.file.name,
        size: SIZE,
        fileHash: this.container.hash,
      });
    },
    // 创建开始上传
    createPorgresshandler(item) {
      return (e) => {
        item.propress = parseInt(String((e.loaded / e.total) * 100));
      };
    },
  },
};
</script>

<style lang='css' scoped>
.cube-container {
  width: 100px;
  overflow: hidden;
}

.cube {
  width: 30px;
  height: 30px;
  text-align: center;

  line-height: 30px;
  border: 1px solid black;
  background: #eee;
  float: left;
}

.cube .success {
  background: #67c23a;
}

.cube .uploading {
  background: #409eff;
}

.cube .error {
  background: #f56c6c;
}
</style>