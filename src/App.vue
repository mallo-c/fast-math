<script setup lang="ts">
import {computed, onMounted, ref} from "vue";


const MAX = 3;
const MAX_RATING = 7;
const FULL_TIME = 4000;

const eq = ref("");
const variants = ref(Array(MAX).fill(0))
const LEVEL = ref(10);
const correct = ref(0);
const corr = ref(0);
const total = ref(0);
const remaining = ref(FULL_TIME);
const asCssUnits = computed({
  get() {
    return remaining.value / FULL_TIME * 100 + "vw";
  },
  set() {
  }
})

const rating = computed({
  get() {
    return Math.round(correct.value / Math.max(1, total.value) * MAX_RATING)
  },
  set() {
  }
})

const mainInterval = setInterval(() => {
  remaining.value -= 10;
  if (remaining.value <= 0) {
    clearInterval(mainInterval);
    console.log(rating.value, MAX_RATING - rating.value);
  }
}, 10);

function rand() {
  return Math.floor(Math.random() * Math.max(LEVEL.value, 10)) + 1
}

function update() {
  LEVEL.value = correct.value + 1;
  let a = rand(), b = rand();
  eq.value = a + "+" + b + "=?";
  corr.value = a + b;
  const id = Math.floor(Math.random() * MAX);
  variants.value = [a + b];
  for (let i = 0; i < id; ++i) {
    variants.value.push(rand() + rand());
  }
  for (let i = 0; i < MAX - id - 1; ++i) {
    variants.value.unshift(rand() + rand());
  }
  variants.value = [...variants.value];
}

function check(e: MouseEvent) {
  total.value += 1;
  const n = parseInt((e.target as HTMLElement).innerHTML.trim());
  if (n == corr.value) {
    correct.value += 1;
    remaining.value = FULL_TIME;
    update();
  } else {
    document.body.classList.add("error");
    setTimeout(() => {
      document.body.classList.remove("error");
      update();
    }, 100);
  }
}

onMounted(update);

</script>

<template>
  <div class="statusbar" v-if="remaining > 0">
    <div id="sp-main"></div>
  </div>
  <h1 v-if="remaining > 0">{{ eq }}</h1>
  <div class="btn-group" v-if="remaining > 0">
    <button v-for="i in variants" @click="check($event)">{{ i }}</button>
  </div>
  <div class="gameOver" v-if="remaining <= 0">
    <h1>Game over</h1>
    <h2>Your rating:</h2>
    <p>
      <span v-for="i in rating"><i class="fas fa-star">{{i}}</i></span>
      <span v-for="i in MAX_RATING - rating"><i class="far fa-star">{{i}}</i></span>
    </p>
  </div>
</template>

<style scoped>
.gameOver {
  /*position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100dvh;*/
  background: #000000;
  z-index: 99999;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.statusbar {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 1dvh;
}

#sp-main {
  width: v-bind(asCssUnits);
  background: #00ff00;
  height: 100%;
}

button {
  display: inline-block;
}

.btn-group {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}

.btn-group > * {
  cursor: pointer;
  font-size: 5vmin;
  border: 1px dotted #00ff00;
  background: #000000;
  width: 20vw;
  padding: 1vh 2vw;
}
</style>
