<template>
  <div>
    <el-table v-loading="loading" :data="playList" stripe>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column label="封面" width="100">
        <template slot-scope="scope">
          <img :src="scope.row.picUrl" alt height="50" />
        </template>
      </el-table-column>
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column prop="copywriter" label="描述"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="edit(scope.row)">编辑</el-button>
          <el-button size="mini" @click="openDialog(scope.row)" type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 确认是否删除对话框 -->
    <el-dialog title="提示" :visible.sync="delDialogVisiable">
      <span>是否确认删除吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delDialogVisiable = false ">取消</el-button>
        <el-button type="primary" @click="doDel">删除</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, playlistDelete } from "@/api/playlist";
import scroll from "@/utils/scroll.js";
export default {
  data() {
    return {
      playList: [],
      count: 50,
      delDialogVisiable: false,
      loading: false,
      detailID: {}
    };
  },
  created() {
    this.getList();
  },
  mounted() {
    scroll.start(this.getList);
  },
  methods: {
    getList() {
      this.loading = true;
      fetchList({
        start: this.playList.length,
        count: this.count
      }).then(res => {
        this.playList = this.playList.concat(res.data);
        if (res.data.length < this.count) {
          scroll.end();
        }
        this.loading = false;
        // console.log(res)
      });
    },
    edit(row) {
      this.$router.push(`/playlist/edit/${row._id}`);
    },
    openDialog(row) {
      this.delDialogVisiable = true;
      this.detailID = row._id;
    },
    doDel() {
      playlistDelete({ id: this.detailID }).then(res => {
        if (res.data.deleted > 0) {
          this.delDialogVisiable = false;
          this.$message.success("删除成功");
          this.playList = [];
          this.getList();
        } else {
          this.$message.error("删除失败");
        }
      });
    }
  }
};
</script>

<style></style>
