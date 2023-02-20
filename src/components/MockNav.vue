<template>
  <div>
    <span>Mock Console</span>
  </div>
  <div>
    <el-menu :default-active="defaultActive" @select="handleSelect" mode="horizontal" :ellipsis=false
             background-color="#409EFF" text-color="#303133" active-text-color="#303133">
      <el-menu-item index="1">Mock配置</el-menu-item>
      <el-menu-item index="2">Mock应用</el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: 'MockNav',
  props: ['defaultActive'],
  methods: {
    handleSelect(key) {
      switch (key) {
        case '1':
          this.$router.push('/mock-config')
          break
        case '2':
          this.$router.push('/mock-app')
      }
    }
  }
}
</script>