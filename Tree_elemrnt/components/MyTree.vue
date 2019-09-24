<template>
  <div class="tree-wrap">
    <el-tree
      :data="treeDataResult"
      style="width:400px"
      default-expand-all
      :expand-on-click-node="false"
      v-if="treeDataResult.length !== 0"
      :render-content="render"
    ></el-tree>
  </div>
</template>

<script>
import _ from "loadsh";
export default {
  name: "",
  props: {
    data: {
      type: Array,
      default: () => new Array()
    },
    fileDrop: {
      type: Array,
      default: () => new Array()
    },
    directoryDrop: {
      type: Array,
      default: () => new Array()
    },
    deleteFn: {
      type: Function,
      default: () => new Function()
    }
  },
  data() {
    return {
      treeDataResult: [],
      currentId: "",
      currentContent: ""
    };
  },
  watch: {
    data() {
      this.transformData(this.data);
    }
  },
  methods: {
    isParent(data) {
      return data.type === "parent";
    },
    handleReName(data) {
      // console.log(data);
      this.currentId = data.id;
      this.currentContent = data.name;
    },
    remove(id) {
      let list = _.cloneDeep(this.data);
      list = list.filter(l => l.id !== id);
      this.$emit("update:data", list);
      this.$message({
        type: "success",
        message: "删除成功"
      });
    },
    handleRemove(data) {
      this.$confirm(`是否确认删除${data.name}`, "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // console.log(this.deleteFn);
          this.deleteFn
            ? this.deleteFn(data.id).then(() => {
                this.remove(data.id);
              })
            : this.remove(data.id);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    handleCommand(data, value) {
      if (value === "rn") {
        this.handleReName(data);
      } else if (value === "rm") {
        this.handleRemove(data);
      }
    },
    okFn(data) {
      let list = _.cloneDeep(this.data);
      list = list.map(item => {
        if (item.id === data.id) {
          item.name = this.currentContent;
        }
        return item;
      });
      this.$emit("update:data", list);
      this.cancelFn();
    },
    cancelFn() {
      this.currentId = "";
      this.currentContent = "";
    },
    handleInput(v) {
      this.currentContent = v;
    },
    render(h, { node, data, store }) {
      let list = this.isParent(data) ? this.directoryDrop : this.fileDrop;
      return (
        <div style="width:100%" class="tree_wrap">
          {this.isParent(data) ? (
            node.expanded ? (
              <i class="el-icon-folder-opened"></i>
            ) : (
              <i class="el-icon-folder"></i>
            )
          ) : (
            <i class="el-icon-document"></i>
          )}
          {data.id === this.currentId ? (
            <el-input
              value={this.currentContent}
              on-input={this.handleInput}
              style="width:90%;height:22px"
              class="tree-input-wrap"
              // width="90%"
              height="22px"
            />
          ) : (
            <a>{node.label}</a>
          )}
          {data.id !== this.currentId ? (
            <el-dropdown
              style="float:right"
              placement="bottom"
              on-command={this.handleCommand.bind(this, data)}
              trigger="hover"
            >
              <span class="el-dropdown-link">
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                {list.map(item => {
                  return (
                    <el-dropdown-item command={item.text}>
                      {item.value}
                    </el-dropdown-item>
                  );
                })}
              </el-dropdown-menu>
            </el-dropdown>
          ) : (
            <span>
              <el-button type="text" on-click={this.okFn.bind(this, data)}>
                确定
              </el-button>
              <el-button type="text" on-click={this.cancelFn}>
                取消
              </el-button>
            </span>
          )}
        </div>
      );
    },
    transformData(data) {
      /**
       * 合并数据
       */
      let allData = _.cloneDeep(data);
      let treeMapList = allData.reduce((memo, current) => {
        current.label = current.name;
        memo[current["id"]] = current;
        return memo;
      }, {});
      /**
       * 处理数据
       */
      // console.log(treeMapList)
      this.treeDataResult = allData.reduce((arr, current) => {
        let pid = current.pid;
        let parent = treeMapList[pid];
        if (parent) {
          parent.children
            ? parent.children.push(current)
            : (parent.children = [current]);
        } else if (pid === 0) {
          arr.push(current);
        }
        return arr;
      }, []);
      // console.log( this.treeDataResult);
    }
  },
  mounted() {
    this.transformData(this.data);
  }
};
</script>

<style lang="css" scoped>
.el-input {
  width: 90%;
}
.tree-wrap >>> .el-input .el-input__inner {
  height: 22px;
  line-height: 22px;
}
</style>