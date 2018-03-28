<template lang="pug">
  .registerPage  
    h3.tac Register 
    el-form(
      ref="form"
      v-model="form"
      label-width="100px"
    )
      el-form-item(
        label="Account"
      )
        el-input(
          v-model="form.account"
          @keyup.enter.native="submit"
          autofocus
        )
      el-form-item(
        label="Email"
      )
        el-input(
          v-model="form.email"
          @keyup.enter.native="submit"
          type="email"
        )
      el-form-item(
        label="Password"
      )
        el-input(
          v-model="form.password"
          @keyup.enter.native="submit"
          type="password"
        )
      el-form-item(
        label="Password"
      )
        el-input(
          v-model="form.confirmPassword"
          @keyup.enter.native="submit"
          type="password"
        )
      el-form-item
        el-button(
          type='primary'
          @click="submit"
        ) Submit
</template>
<style lang="sass" scoped>
.registerPage
  padding: 10px
  width: 600px
  margin: auto
</style>

<script src="./register.js"></script>

