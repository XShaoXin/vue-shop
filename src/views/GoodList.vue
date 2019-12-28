<template>
  <div>
    <nav-header></nav-header>
    <!-- 导航栏 -->
    <nav-bread>
      <router-link slot="secBread" to="/">商品列表</router-link>
    </nav-bread>

    <div class="accessory-result-page accessory-page">
      <div class="container">
        <!-- 筛选 -->
        <div class="filter-nav">
          <span class="sortby">筛选:</span>
          <a
            href="javascript:void(0)"
            :class="{default:true,cur:sortFlag}"
            @click="defaultSort()"
          >默认</a>
          <a href="javascript:void(0)" :class="{price:true,cur:!sortFlag}" @click="priceSort()">
            价格
            <span v-if="isPriceArrowUp">↑</span>
            <span v-else>↓</span>
          </a>
          <!-- <a href="javascript:void(0)" class="filterby stopPop" @click="showFilterPop">Filter by</a> -->
          <a href="javascript:void(0)" class="filterby stopPop">Filter by</a>
        </div>

        <div class="accessory-result">
          <!-- filter 价格区间box -->
          <!-- <div class="filter stopPop" id="filter" :class="{'filterby-show':filterBy}"> -->
          <div class="filter stopPop" id="filter">
            <dl class="filter-price">
              <dt>价格区间:</dt>
              <dd>
                <a
                  href="javascript:void(0)"
                  @click="setPriceFilter('all')"
                  :class="{'cur':priceChecked=='all'}"
                >全部</a>
              </dd>
              <dd v-for="(item,index) in priceFilter" :key="item.id">
                <a
                  href="javascript:void(0)"
                  @click="setPriceFilter(index)"
                  :class="{'cur':priceChecked==index}"
                >{{item.startPrice}} - {{item.endPrice}}</a>
              </dd>
            </dl>
          </div>

          <div class="accessory-list-wrap">
            <div class="accessory-list col-4">
              <ul>
                <li v-for="item in goodList" :key="item.id">
                  <div class="pic">
                    <a href="#">
                      <img :src="item.productUrl" />
                      <!-- <img :src="'static/'+item.productImage" /> -->
                    </a>
                  </div>
                  <div class="main">
                    <div class="name">{{item.productName}}</div>
                    <div class="price">{{item.salePrice}}</div>
                    <div class="btn-area">
                      <a
                        href="javascript:;"
                        class="btn btn--m"
                        @click="addCart(item.productId)"
                      >加入购物车</a>
                    </div>
                  </div>
                </li>
              </ul>
              <div
                v-infinite-scroll="loadMore"
                style="position: relative;margin-bottom: 50px;"
                infinite-scroll-disabled="busy"
                infinite-scroll-distance="30"
              >
                <img
                  v-show="loading"
                  style="position: absolute;margin-left: 500px;"
                  src="./../../static/loading-svg/loading-spinning-bubbles.svg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 提示modal -->
    <modal v-bind:mdShow="mdFalseAddFlag" v-on:close="closeModal">
      <p slot="message">请先登录，否则无法加入购物车</p>
      <div slot="btnGroup">
        <a class="btn btn--m" href="javascript:;" @click="mdFalseAddFlag=false">关闭</a>
      </div>
    </modal>
    <!-- 提示 -->
    <modal v-bind:mdShow="mdSucAddFlag" v-on:close="closeModal">
      <p slot="message">
        <span>添加成功</span>
      </p>
      <div slot="btnGroup">
        <a class="btn btn--m" href="javascript:;" @click="mdSucAddFlag=false">继续购物</a>
        <router-link class="btn btn--m" href="javascript:;" to="/cart">查看购物车</router-link>
      </div>
    </modal>
    <!-- 遮罩层 -->
    <!-- <div class="md-overlay" v-show="overlayFlag" @click="closeFilterPop"></div> -->
    <nav-footer></nav-footer>
  </div>
</template>
<script>
import "./../assets/css/base.css";
import "./../assets/css/product.css";
import "./../assets/css/checkout.css";
import NavHeader from "@/components/Header.vue";
import NavFooter from "@/components/Footer.vue";
import NavBread from "@/components/Bread.vue";
import Modal from "@/components/Modal.vue";
import axios from "axios";
export default {
  data() {
    return {
      priceFilter: [
        // 价格区间数组
        {
          id: "00001",
          startPrice: "0.00",
          endPrice: "20.00"
        },
        {
          id: "00002",
          startPrice: "20.00",
          endPrice: "50.00"
        },
        {
          id: "00003",
          startPrice: "50.00",
          endPrice: "100.00"
        },
        {
          id: "00004",
          startPrice: "100.00",
          endPrice: "500.00"
        }
      ],
      priceChecked: "all", // 选中的价格区间
      goodList: [], //商品列表数组
      filterBy: false, // 控制价格菜单的显示
      overlayFlag: false, // 遮罩的显示
      page: 1, // 当前第一页
      pageSize: 8, // 一页有8条数据
      mdFalseAddFlag: false,
      mdSucAddFlag: false,
      sort: false,
      priceSortFlag: false,
      sortFlag: true, // 排序:默认
      busy: true, // 滚动加载插件默认禁用
      loading: false, // 往下滚动"加载图标"的出现效果:默认不出现
      isPriceArrowUp: false
    };
  },
  components: {
    NavHeader,
    NavFooter,
    NavBread,
    Modal
  },
  mounted() {
    this.getGoodList(false);
  },
  methods: {
    //获取商品列表
    getGoodList(flag) {
      let param = {
        page: this.page,
        pageSize: this.pageSize,
        priceLevel: this.priceChecked // 点击的价格区间
      };
      if (this.priceSortFlag) {
        param.sort = this.sort ? 1 : -1;
      } else {
        param.sort = 0;
      }
      this.loading = true;
      // 发送和处理请求
      axios
        .get("/goods/list", {
          params: param
        })
        .then(response => {
          let res = response.data;
          if (res.status == "0") {
            this.loading = false; // 请求前出现加载图标
            if (flag) {
              // true.商品数据累加
              this.goodList = this.goodList.concat(res.result.list);
              if (res.result.count == 0) {
                this.busy = true;
              } else {
                this.busy = false;
              }
            } else {
              this.goodList = res.result.list;
              this.busy = false;
            }
          } else {
            this.goodList = [];
          }
        });
    },
    //点击排序商品事件
    priceSort() {
      this.page = 1;
      this.sortFlag = false;
      this.priceSortFlag = true;
      this.sort = !this.sort;
      this.getGoodList(); // 重新加载数据
      this.isPriceArrowUp = !this.isPriceArrowUp;
    },
    defaultSort() {
      this.page = 1;
      this.sortFlag = true;
      this.priceSortFlag = false;
      this.getGoodList();
    },
    // 点击价格区间
    setPriceFilter(index) {
      this.page = 1;
      this.priceChecked = index;
      this.getGoodList(false);
      // this.closeFilterPop();
    },
    // showFilterPop() {
    //   this.filterBy = true;
    //   this.overlayFlag = true;
    // },
    // closeFilterPop() {
    //   this.filterBy = false;
    //   this.overlayFlag = false;
    // },
    loadMore() {
      // 滚动加载插件方法
      this.busy = true;
      setTimeout(() => {
        this.page++;
        this.getGoodList(true); // 滚动加载,累加数据
      }, 500);
    },
    addCart(productId) {
      axios
        .post("/goods/addCart", {
          productId: productId
        })
        .then(res => {
          if (res.data.status == 0) {
            this.mdSucAddFlag = true;
          } else {
            this.mdFalseAddFlag = true;
          }
        });
    },
    closeModal() {
      this.mdFalseAddFlag = false;
      this.mdSucAddFlag = false;
    }
  }
};
</script>
