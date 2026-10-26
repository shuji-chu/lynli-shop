<template>
  <article class="card skel">
    <div class="img-wrap">
      <div class="skeleton img-skel"></div>
    </div>
    <div class="info">
      <div class="skeleton line w80"></div>
      <div class="skeleton line w55"></div>
      <div class="skeleton price-skel"></div>
    </div>
  </article>
</template>

<style scoped>
.card {
  border-radius: var(--radius);
  overflow: hidden;
  border: 1px solid var(--border);
  background: var(--panel);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
}
.img-wrap {
  width: 100%;
  aspect-ratio: 1 / 1;
  background: rgba(255, 255, 255, 0.03);
}
.img-skel {
  width: 100%;
  height: 100%;
  border-radius: 0;
}
.info {
  padding: 14px 14px 18px;
}
.line {
  height: 14px;
  margin-bottom: 10px;
}
.w80 {
  width: 80%;
}
.w55 {
  width: 55%;
}
.price-skel {
  height: 20px;
  width: 40%;
  margin-top: 16px;
}
</style>
