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
          autofocus
        )
      el-form-item(
        label="Email"
      )
        el-input(
          v-model="form.email"
          type="email"
        )
      el-form-item(
        label="Password"
      )
        el-input(
          v-model="form.password"
          type="password"
        )
      el-form-item(
        label="Password"
      )
        el-input(
          v-model="form.confirmPassword"
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

