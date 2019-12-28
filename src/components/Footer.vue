<template>
  <footer class="footer">
    <!-- <input type="button" value="测试post" @click="post" /> -->
    <!-- <input type="button" value="测试" @click="go"/> -->
  </footer>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {};
  },
  methods: {
    // post() {
    //   axios
    //     .post("/goods/del", {
    //       productId: '19',
    //       // productName: 'xsx',
    //       // salePrice: '1000',
    //       // productUrl: 'https://img.alicdn.com/bao/uploaded/i4/3367587481/O1CN01QRjLEi258LY19T4jD_!!3367587481.jpg'
    //     })
    //     .then(response => {
    //       let res = response.data;
    //       if (res.status == "0") {
    //         console.log("suc.msg", res);
    //       } else {
    //         console.log("err.msg", res);
    //       }
    //     });
    // }

    // go(){
    //   this.$router.push({path:'/admin'})
    // }
  }
};
</script>