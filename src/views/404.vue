<template>
  <el-container>
    <el-header id="nav">
      <mock-nav></mock-nav>
    </el-header>
    <el-container>
      <el-main>
        <el-empty description="404未知页面"></el-empty>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import MockNav from '@/components/MockNav.vue'

export default {
  name: 'FourZeroFour',
  components: {
    MockNav
  }
}
</script>