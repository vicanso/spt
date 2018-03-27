<template lang="pug">
  .settingPage 
    h3.tac System Setting 
    el-form(
      ref="form"
      v-model="form"
      label-width="100px"
    )
      el-form-item(
        label="Name"
      )
        el-input(
          v-model="form.name"
          autofocus
        )
      el-form-item(
        label="Disabled"
      )
        el-switch(
          v-model="form.disabled"
        )
      el-form-item(
        label="Data"
      )
        el-input(
          type="textarea"
          v-model="form.data"
          :rows="8"
        )
      el-form-item(
        label="Description"
      )
        el-input(
          type="textarea"
          v-model="form.description"
        )
      el-form-item
        el-button(
          type="primary"
          @click.native="submit"
        ) Submit 


</template>
<script src="./setting.js"></script>
<style lang="sass" scoped>
.settingPage
  padding: 10px
  width: 600px
  margin: auto
</style>

