<template>
  <div>
    <div class="filter-container" style="padding:20px">
      <el-upload
        class="upload-demo"
        action="http://localhost:3000/swiper/upload"
        :on-success="uploadSuccess"
        :show-file-list="false"
        :on-change="changeUpload"
      >
        <el-button size="small" type="primary">点击上传</el-button>
      </el-upload>
    </div>
    <el-table v-loading="loading" :data="swiperList" stripe>
      <el-table-column type="index" width="50px"></el-table-column>
      <el-table-column label="图片" width="400">
        <template slot-scope="scope">
          <img :src="scope.row.download_url" alt height="30" />
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="danger" @click="doDialog(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="提示" :visible.sync="dialogVisiable">
      <span>是否确认删除吗？</span>
      <span slot="footer">
        <el-button @click="dialogVisiable = false">取消</el-button>
        <el-button @click="doDel" type="primary">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getSwiper, swiperDelete } from "@/api/swiper";
export default {
  data() {
    return {
      swiperList: [],
      dialogVisiable: false,
      loading: false,
      swiper: {}
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.loading = true;
      getSwiper().then(res => {
        this.swiperList = res.data;
        this.loading = false;
      });
    },
    doDel() {
      this.loading = true;
      swiperDelete(this.swiper).then(res => {
        if (res.data.deleted > 0) {
          this.loading = false;
          this.$message.success("删除成功！");
          this.getList();
          this.dialogVisiable = false;
        } else {
          this.$message.success("删除失败！");
        }
      });
    },
    changeUpload(){
      this.loading = true;
    },
    doDialog(row) {
      this.dialogVisiable = true;
      this.swiper = row;
    },
    uploadSuccess(res) {
      this.loading = true;
      this.$message.success("上传成功！");
      this.getList();
    }
  }
};
</script>

<style></style>
