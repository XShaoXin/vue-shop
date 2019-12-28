// 导航栏
<template>
     <div class="nav-breadcrumb-wrap">
        <div class="container">
          <nav class="nav-breadcrumb">
            <a href="/">首页</a>
            <slot name="secBread"></slot><!-- 商品列表或购物车 -->
          </nav>
        </div>
      </div>
</template>