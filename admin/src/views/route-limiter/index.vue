<template lang="pug">
.routeLimiterPage
  h3.tac Route Limiter Setting
  div(
    v-if="mode === 0"
  )
    p.tac(v-if="!routeLimits || routeLimits.length === 0") There isn't any route limit
    el-button.addRouteLimit.mtop10(
      type="primary"
      @click.native="add"
    ) Add Route Limit
  el-form.form(
    v-model="form"
    label-width="100px"
    v-if="mode === 1"
  )
    el-form-item(
      label="Name"
    )
      el-input(
        v-model="form.name"
        autofocus
      )
    el-form-item(
      label="Path"
    )
      el-input(
        v-model="form.path"
      )
    el-form-item(
      label="Method"
    )
      el-select(
        v-model="form.method"
        placeholder="select method"
      )
        el-option(
          v-for="item in methods"
          :key="item"
          :label="item"
          :value="item"
        )
    el-form-item(
      label="Status"
    )
      el-select(
        v-model="form.statuses"
        placeholder="select status"
      )
        el-option(
          v-for="item in statuses"
          :key="item"
          :label="item"
          :value="item"
        )
    el-form-item
      el-button(
        type="primary"
        @click.native="submit"
      ) Submit 
      el-button(
        @click.native="mode = 0"
      ) Back
</template>
<script src="./route-limiter.js"></script>
<style lang="sass" scoped>
.routeLimiterPage
  padding: 10px
  pre
    overflow-x: auto
.form
  width: 600px
  padding: 40px 20px 20px
  margin: auto
.addRouteLimit, .table
  width: 100%
</style>
