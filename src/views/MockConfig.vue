<template>
  <el-container>
    <el-header id="nav">
      <mock-nav default-active="1"></mock-nav>
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
          <el-form-item label="Mock类">
            <el-input v-model="searchForm.mockClass" placeholder="请输入Mock类..."></el-input>
          </el-form-item>
          <el-form-item label="Mock方法">
            <el-input v-model="searchForm.mockMethod" placeholder="请输入Mock方法..."></el-input>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="searchForm.isEnable" placeholder="请选择状态..." clearable>
              <el-option v-for="(isEnable, index) in searchForm.isEnables" :key="index" :label="isEnable.key"
                         :value="isEnable.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search">查 询</el-button>
            <el-button type="primary" @click="addItem">新 增</el-button>
          </el-form-item>
        </el-form>
        <el-table :data="tableData" stripe>
          <el-table-column prop="id" label="ID" width="100"></el-table-column>
          <el-table-column prop="appEnv" label="应用环境" width="150" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="appName" label="应用名称" width="150" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="mockClass" label="Mock类" width="200" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="mockMethod" label="Mock方法" width="200"
                           :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="parameterRules" label="参数规则" width="200"
                           :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="returnOrThrowData" label="Mock数据" width="200"
                           :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="isEnable" label="状态" width="100">
            <template #default="scope">
              {{ scope.row.enable ? "启用" : "禁用" }}
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" align="center" width="200"></el-table-column>
          <el-table-column prop="updateTime" label="修改时间" align="center" width="200"></el-table-column>
          <el-table-column label="操作" align="center" fixed="right" width="200">
            <template #default="scope">
              <el-button link type="primary" @click="modifyItem(scope)">编辑</el-button>
              <el-button link type="primary" @click="deleteItem(scope)">删除</el-button>
              <el-button link type="primary" @click="changeStatus(scope)">{{
                  scope.row.enable ? '禁用' : '启用'
                }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination id="pagination" layout="prev, pager, next" :page-count="pageCount" @current-change="changePage"
                       :hide-on-single-page="true" background></el-pagination>
      </el-main>
    </el-container>
  </el-container>
  <el-dialog :title="addOrModifyTitle" :model-value="addOrModifyVisible" @close="cancelAddOrModify" width="60%">
    <el-form label-width="15%" :model="addOrModifyForm" style="height: 50vh; overflow: auto">
      <el-form-item label="应用环境">
        <el-select v-model="addOrModifyForm.appEnv" @change="getAppNames" @clear="clearAppNames"
                   placeholder="请选择应用环境..." clearable>
          <el-option v-for="(appEnv, index) in addOrModifyForm.appEnvs" :key="index" :label="appEnv"
                     :value="appEnv"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="应用名称">
        <el-select v-model="addOrModifyForm.appName" placeholder="请选择应用名称..." clearable>
          <el-option v-for="(appName, index) in addOrModifyForm.appNames" :key="index" :label="appName"
                     :value="appName"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Mock类">
        <el-input v-model="addOrModifyForm.mockClass" placeholder="请输入Mock类..."></el-input>
      </el-form-item>
      <el-form-item label="Mock方法">
        <el-input v-model="addOrModifyForm.mockMethod" placeholder="请输入Mock方法..."></el-input>
      </el-form-item>
      <el-form-item v-if="addOrModifyForm.parameterRules.length === 0" label="参数规则">
        <el-button @click="addParameterRule">
          <el-icon>
            <Plus/>
          </el-icon>
        </el-button>
      </el-form-item>
      <el-form-item v-else v-for="(parameterRule, index) in addOrModifyForm.parameterRules" :key="index"
                    :label="'第' + (index + 1) + '个参数规则'">
        <el-row :gutter="2">
          <el-col :span="6">
            <el-select v-model="parameterRule.pattern" placeholder="请选择匹配模式..." clearable>
              <el-option v-for="(pattern, index) in parameterRule.patterns" :key="index" :label="pattern.key"
                         :value="pattern.value"></el-option>
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-select v-model="parameterRule.type" placeholder="请选择参数类型..." clearable>
              <el-option v-for="(type, index) in parameterRule.types" :key="index" :label="type.key"
                         :value="type.value"></el-option>
            </el-select>
          </el-col>
          <el-col :span="8">
            <el-input v-model="parameterRule.value" placeholder="请输入参数值..."/>
          </el-col>
          <el-col :span="2" style="text-align: right">
            <el-button @click="addParameterRule">
              <el-icon>
                <Plus/>
              </el-icon>
            </el-button>
          </el-col>
          <el-col :span="2">
            <el-button @click="removeParameterRule(parameterRule)">
              <el-icon>
                <Minus/>
              </el-icon>
            </el-button>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="addOrModifyForm.isEnable" placeholder="请选择状态..." clearable>
          <el-option v-for="(isEnable, index) in addOrModifyForm.isEnables" :key="index" :label="isEnable.key"
                     :value="isEnable.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Mock数据">
        <el-input type="textarea" v-model="addOrModifyForm.returnOrThrowData"
                  placeholder="请输入Mock数据..." :autosize="{ minRows: 2, maxRows: 10 }"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="cancelAddOrModify">取 消</el-button>
      <el-button type="primary" @click="addOrModify">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script>
import MockNav from '@/components/MockNav.vue'

export default {
  name: 'MockConfig',
  data() {
    return {
      searchForm: {
        appEnv: '',
        appName: '',
        mockClass: '',
        mockMethod: '',
        isEnable: '',
        isEnables: [
          {'key': '启用', 'value': true},
          {'key': '禁用', 'value': false}
        ]
      },
      addOrModifyForm: {
        id: 0,
        appEnv: '',
        appEnvs: [],
        appName: '',
        appNames: [],
        mockClass: '',
        mockMethod: '',
        parameterRules: [],
        returnOrThrowData: '',
        isEnable: '',
        isEnables: [
          {'key': '启用', 'value': true},
          {'key': '禁用', 'value': false}
        ]
      },
      addOrModifyTitle: '',
      addOrModifyVisible: false,
      tableData: [],
      pageCount: 0
    }
  },
  components: {
    MockNav
  },
  methods: {
    getAppEnvs() {
      this.$http.get('/mock-app/app-env')
          .then(response => {
            if (response['success'] === true) {
              this.addOrModifyForm.appEnvs = response['data']
            } else {
              this.$message({
                type: 'error',
                message: '获取应用环境失败：' + response['message']
              })
            }
          })
          .catch(error => {
            this.$message({
              type: 'error',
              message: '获取应用环境失败：' + error
            })
          })
    },
    getAppNames(value) {
      if (value === '') {
        return
      }
      this.addOrModifyForm.appName = ''
      this.$http.get('/mock-app/app-name/' + value)
          .then(response => {
            if (response['success'] === true) {
              this.addOrModifyForm.appNames = response['data']
            } else {
              this.$message({
                type: 'error',
                message: '获取应用名称失败：' + response['message']
              })
            }
          })
          .catch(error => {
            this.$message({
              type: 'error',
              message: '获取应用名称失败：' + error
            })
          })
    },
    clearAppNames() {
      this.addOrModifyForm.appName = ''
      this.addOrModifyForm.appNames = []
    },
    search() {
      const data = {
        appEnv: this.searchForm.appEnv,
        appName: this.searchForm.appName,
        mockClass: this.searchForm.mockClass,
        mockMethod: this.searchForm.mockMethod,
        isEnable: this.searchForm.isEnable
      }
      this.$http.get('/mock-config/search', {params: data})
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
    addItem() {
      this.getAppEnvs()
      this.addOrModifyTitle = '新增'
      this.addOrModifyVisible = true
    },
    cancelAddOrModify() {
      this.addOrModifyForm = {
        id: 0,
        appEnv: '',
        appEnvs: [],
        appName: '',
        appNames: [],
        mockClass: '',
        mockMethod: '',
        parameterRules: [],
        returnOrThrowData: '',
        isEnable: '',
        isEnables: [
          {'key': '启用', 'value': true},
          {'key': '禁用', 'value': false}
        ]
      }
      this.addOrModifyTitle = ''
      this.addOrModifyVisible = false
    },
    addParameterRule() {
      this.addOrModifyForm.parameterRules.push({
        pattern: 'IGNORE',
        patterns: [
          {'key': '忽略', 'value': 'IGNORE'},
          {'key': '包含', 'value': 'CONTAIN'},
          {'key': '不包含', 'value': 'NOT_CONTAIN'},
          {'key': '等于', 'value': 'EQUAL'},
          {'key': '不等于', 'value': 'NOT_EQUAL'},
          {'key': '大于', 'value': 'MORE_THAN'},
          {'key': '大于等于', 'value': 'MORE_THAN_OR_EQUAL'},
          {'key': '小于', 'value': 'LESS_THAN'},
          {'key': '小于等于', 'value': 'LESS_THAN_OR_EQUAL'}
        ],
        type: '',
        types: [
          {'key': 'String', 'value': 'java.lang.String'},
          {'key': 'int/Integer', 'value': 'java.lang.Integer'},
          {'key': 'double/Double', 'value': 'java.lang.Double'},
          {'key': 'boolean/Boolean', 'value': 'java.lang.Boolean'}
        ],
        value: ''
      })
    },
    removeParameterRule(parameterRule) {
      const index = this.addOrModifyForm.parameterRules.indexOf(parameterRule)
      if (index !== -1) {
        this.addOrModifyForm.parameterRules.splice(index, 1)
      }
    },
    addOrModify() {
      const newParameterRules = []
      for (let i = 0; i < this.addOrModifyForm.parameterRules.length; i++) {
        newParameterRules.push({
          pattern: this.addOrModifyForm.parameterRules[i].pattern,
          type: this.addOrModifyForm.parameterRules[i].type,
          value: this.addOrModifyForm.parameterRules[i].value
        })
      }
      const data = {
        id: this.addOrModifyForm.id,
        appEnv: this.addOrModifyForm.appEnv,
        appName: this.addOrModifyForm.appName,
        mockClass: this.addOrModifyForm.mockClass,
        mockMethod: this.addOrModifyForm.mockMethod,
        parameterRules: JSON.stringify(newParameterRules),
        returnOrThrowData: this.addOrModifyForm.returnOrThrowData,
        isEnable: this.addOrModifyForm.isEnable
      }
      this.$http.request({
        method: this.addOrModifyTitle === '新增' ? 'POST' : 'PUT',
        url: '/mock-config',
        data: data
      })
          .then(response => {
            if (response['success'] === true) {
              this.cancelAddOrModify()
              this.getTableData()
            } else {
              this.$message({
                type: 'error',
                message: this.addOrModifyTitle + '失败：' + response['message']
              })
            }
          })
          .catch(error => {
            this.$message({
              type: 'error',
              message: this.addOrModifyTitle + '失败：' + error
            })
          })
    },
    getTableData() {
      this.$http.get('/mock-config/all')
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
    modifyItem(scope) {
      this.getAppEnvs()
      this.addOrModifyTitle = '编辑'
      this.addOrModifyVisible = true
      this.addOrModifyForm.id = scope.row.id
      this.addOrModifyForm.appEnv = scope.row.appEnv
      this.getAppNames(scope.row.appEnv)
      this.addOrModifyForm.appName = scope.row.appName
      this.addOrModifyForm.mockClass = scope.row.mockClass
      this.addOrModifyForm.mockMethod = scope.row.mockMethod
      const tmps = JSON.parse(scope.row.parameterRules)
      for (let i = 0; i < tmps.length; i++) {
        tmps[i]['patterns'] = [
          {'key': '忽略', 'value': 'IGNORE'},
          {'key': '包含', 'value': 'CONTAIN'},
          {'key': '不包含', 'value': 'NOT_CONTAIN'},
          {'key': '等于', 'value': 'EQUAL'},
          {'key': '不等于', 'value': 'NOT_EQUAL'},
          {'key': '大于', 'value': 'MORE_THAN'},
          {'key': '大于等于', 'value': 'MORE_THAN_OR_EQUAL'},
          {'key': '小于', 'value': 'LESS_THAN'},
          {'key': '小于等于', 'value': 'LESS_THAN_OR_EQUAL'}
        ]
        tmps[i]['types'] = [
          {'key': 'String', 'value': 'java.lang.String'},
          {'key': 'int/Integer', 'value': 'java.lang.Integer'},
          {'key': 'double/Double', 'value': 'java.lang.Double'},
          {'key': 'boolean/Boolean', 'value': 'java.lang.Boolean'}
        ]
      }
      this.addOrModifyForm.parameterRules = tmps
      this.addOrModifyForm.returnOrThrowData = scope.row.returnOrThrowData
      this.addOrModifyForm.isEnable = scope.row.enable
    },
    deleteItem(scope) {
      this.$confirm('确认删除？', '删除', {
        confirmButtonText: '确 定',
        cancelButtonText: '取 消',
        type: 'warning'
      }).then(() => {
        const data = {
          id: scope.row.id
        }
        this.$http.delete('/mock-config', {params: data})
            .then(response => {
              if (response['success'] === true) {
                window.location.reload()
              } else {
                this.$message({
                  type: 'error',
                  message: '删除失败：' + response['message']
                })
              }
            })
            .catch(error => {
              this.$message({
                type: 'error',
                message: '删除失败：' + error
              })
            })
      })
    },
    changeStatus(scope) {
      const data = {
        id: scope.row.id,
        isEnable: !scope.row.enable
      }
      this.$http.put('/mock-config', data)
          .then(response => {
            if (response['success'] === true) {
              this.getTableData()
            } else {
              this.$message({
                type: 'error',
                message: scope.row.enable ? '禁用失败：' : '启用失败：' + response['message']
              })
            }
          })
          .catch(error => {
            this.$message({
              type: 'error',
              message: scope.row.enable ? '禁用失败：' : '启用失败：' + error
            })
          })
    },
    changePage(targetPage) {
      const data = {
        appEnv: this.searchForm.appEnv,
        appName: this.searchForm.appName,
        mockClass: this.searchForm.mockClass,
        mockMethod: this.searchForm.mockMethod,
        isEnable: this.searchForm.isEnable,
        targetPage: targetPage
      }
      this.$http.get('/mock-config/page', {params: data})
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
    this.getAppEnvs()
    this.getTableData()
  }
}
</script>