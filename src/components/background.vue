<template>
  <a-carousel autoplay  class="mycarousel">
    <div><img src="/static/a.jpg"></div>
    <div><img src="/static/b.jpg"></div>
    <div><img src="/static/c.jpg"></div>
    <div><img src="/static/d.jpg"></div>
    <!-- /sharedcloud -->
  </a-carousel>
</template>
<script>
export default {
}
</script>
<style scoped>
/* For demo */
.ant-carousel >>> .slick-slide {
  text-align: center;
  height: 700px;
  line-height: 700px;
  background: #364d79;
  overflow: hidden;
}

.ant-carousel >>> .slick-slide h3 {
  color: #fff;
}

img{
  width: 100%;
  /* height: 100%; */
  /* object-fit:contain; */
}
</style>