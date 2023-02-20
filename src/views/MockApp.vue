<template>
  <el-container>
    <el-header id="nav">
      <mock-nav default-active="2"></mock-nav>
    </el-header>
    <el-container>
      <el-main>
        <el-form :model="searchForm" :inline="true">
          <el-form-item label="应用环境">
            <el-input v-model="searchForm.appEnv" placeholder="请输入应用环境..."></el-input>
          </el-form-item>
          <el-form-item label="应用名称">
            <el-input v-model="searchForm.appName" placeholder="请输入应用名称..."></el-input>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="searchForm.isEnable" placeholder="请选择状态..." clearable>
              <el-option v-for="(isEnable, index) in searchForm.isEnables" :key="index" :label="isEnable.key"
                         :value="isEnable.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search">查 询</el-button>
          </el-form-item>
        </el-form>
        <el-table :data="tableData" stripe v-loading="isLoading">
          <el-table-column prop="id" label="ID" width="100"></el-table-column>
          <el-table-column prop="appEnv" label="应用环境" width="150" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="appName" label="应用名称" width="150" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="ip" label="IP" width="150"></el-table-column>
          <el-table-column prop="port" label="端口" width="100"></el-table-column>
          <el-table-column prop="version" label="版本号" width="100"></el-table-column>
          <el-table-column prop="isEnable" label="状态" width="100">
            <template #default="scope">
              {{ scope.row.enable ? "在线" : "离线" }}
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" align="center" width="200"></el-table-column>
          <el-table-column prop="updateTime" label="修改时间" align="center" width="200"></el-table-column>
          <el-table-column label="操作" align="center" fixed="right" width="200">
            <template #default="scope">
              <el-button link type="primary" @click="refreshConfig(scope)">刷新配置</el-button>
              <el-button link type="primary" @click="viewLog(scope)">查看日志</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination id="pagination" layout="prev, pager, next" :page-count="pageCount" @current-change="changePage"
                       :hide-on-single-page="true" background></el-pagination>
      </el-main>
    </el-container>
  </el-container>
  <el-dialog :model-value="log.visible" @close="cancelViewLog" width="70%">
    <div id="log">
      <pre style="margin: 0">{{ log.text }}</pre>
    </div>
    <template #footer>
      <el-button @click="cancelViewLog">关 闭</el-button>
    </template>
  </el-dialog>
</template>

<script>
import MockNav from '@/components/MockNav.vue'

export default {
  name: 'MockApp',
  data() {
    return {
      searchForm: {
        appEnv: '',
        appName: '',
        isEnable: '',
        isEnables: [
          {'key': '在线', 'value': true},
          {'key': '离线', 'value': false}
        ]
      },
      log: {
        text: '',
        visible: false
      },
      tableData: [],
      isLoading: false,
      pageCount: 0
    }
  },
  components: {
    MockNav
  },
  methods: {
    search() {
      const data = {
        appEnv: this.searchForm.appEnv,
        appName: this.searchForm.appName,
        isEnable: this.searchForm.isEnable
      }
      this.$http.get('/mock-app/search', {params: data})
          .then(response => {
            if (response['success'] === true) {
              this.tableData = response['data']['targetData']
              this.pageCount = response['data']['totalPage']
            } else {
              this.$message({
                type: 'error',
                message: '查询失败：' + response['message']
              })
            }
          })
          .catch(error => {
            this.$message({
              type: 'error',
              message: '查询失败：' + error
            })
          })
    },
    getTableData() {
      this.$http.get('/mock-app/all')
          .then(response => {
            if (response['success'] === true) {
              this.tableData = response['data']['targetData']
              this.pageCount = response['data']['totalPage']
            } else {
              this.$message({
                type: 'error',
                message: '获取列表数据失败：' + response['message']
              })
            }
          })
          .catch(error => {
            this.$message({
              type: 'error',
              message: '获取列表数据失败：' + error
            })
          })
    },
    refreshConfig(scope) {
      this.isLoading = true
      if (scope.row.enable === false) {
        this.$message({
          type: 'error',
          message: '刷新配置失败：Mock应用离线。'
        })
        this.isLoading = false
        return
      }
      this.$http.get('/mock-app/refresh-config/' + scope.row.id)
          .then(response => {
            if (response['success'] === true) {
              this.$message({
                type: 'success',
                message: '刷新配置成功。'
              })
            } else {
              this.$message({
                type: 'error',
                message: '刷新配置失败：' + response['message']
              })
            }
          })
          .catch(error => {
            this.$message({
              type: 'error',
              message: '刷新配置失败：' + error
            })
          })
          .finally(() => {
            this.isLoading = false
          })
    },
    viewLog(scope) {
      this.isLoading = true
      if (scope.row.enable === false) {
        this.$message({
          type: 'error',
          message: '查看日志失败：Mock应用离线。'
        })
        this.isLoading = false
        return
      }
      this.$http.get('/mock-app/view-log/' + scope.row.id)
          .then(response => {
            if (response['success'] === true) {
              const data = response['data']
              if (data === "") {
                this.$message({
                  type: 'error',
                  message: '查看日志失败：日志为空。'
                })
              } else {
                this.log.text = data
                this.log.visible = true
              }
            } else {
              this.$message({
                type: 'error',
                message: '查看日志失败：' + response['message']
              })
            }
          })
          .catch(error => {
            this.$message({
              type: 'error',
              message: '查看日志失败：' + error
            })
          })
          .finally(() => {
            this.isLoading = false
          })
    },
    cancelViewLog() {
      this.log = {
        text: '',
        visible: false
      }
    },
    changePage(targetPage) {
      const data = {
        appEnv: this.searchForm.appEnv,
        appName: this.searchForm.appName,
        isEnable: this.searchForm.isEnable,
        targetPage: targetPage
      }
      this.$http.get('/mock-app/page', {params: data})
          .then(response => {
            if (response['success'] === true) {
              this.tableData = response['data']['targetData']
              this.pageCount = response['data']['totalPage']
            } else {
              this.$message({
                type: 'error',
                message: '获取列表数据失败：' + response['message']
              })
            }
          })
          .catch(error => {
            this.$message({
              type: 'error',
              message: '获取列表数据失败：' + error
            })
          })
    }
  },
  created() {
    this.getTableData()
  }
}
</script>
<style scoped>
#log {
  background-color: black;
  color: lightgray;
  height: 50vh;
  overflow: auto;
  padding: 10px
}

#log:hover {
  cursor: text
}
</style>