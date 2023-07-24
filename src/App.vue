<script setup lang="ts">
import {computed, onMounted, ref} from "vue";
import settings from "@/settings";

const MAX = settings.answerVariants;
const MAX_RATING = settings.numberOfStars;
const FULL_TIME = settings.answerTime * 1000;

const eq = ref("");
const variants = ref(Array(MAX).fill(0))
const correct = ref(0);
const correctAnswer = ref(0);
const total = ref(0);
const remainingTimeRaw = ref(FULL_TIME);
const remainingTimeAsCssUnits = computed({
  get() {
    return remainingTimeRaw.value / FULL_TIME * 100 + "vw";
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
  remainingTimeRaw.value -= 10;
  if (remainingTimeRaw.value <= 0) {
    clearInterval(mainInterval);
    console.log(rating.value, MAX_RATING - rating.value);
  }
}, 10);

function rand(): number {
  if (typeof settings.taskGenerator.maxNumber == "number") {
    return Math.floor(Math.random() * settings.taskGenerator.maxNumber) + 1;
  } else {
    switch (settings.taskGenerator.maxNumber) {
      case "linear":
        return Math.floor(Math.random() * total.value * settings.taskGenerator.ratio) + settings.taskGenerator.minNumber;
    }
  }
}

function update() {
  total.value += 1;
  let a = rand(), b = rand();
  eq.value = a + "+" + b + "=?";
  correctAnswer.value = a + b;
  const id = Math.floor(Math.random() * MAX);
  variants.value = Array(MAX).fill(null).map(()=>(rand() + rand()));
  variants.value[id] = a+b;
  variants.value = [...variants.value];
}

function check(e: MouseEvent) {
  const n = parseInt((e.target as HTMLElement).innerHTML.trim());
  if (n == correctAnswer.value) {
    if (settings.doReset) remainingTimeRaw.value = FULL_TIME;
    correct.value += 1;
    update();
  } else {
    if (settings.doReset && settings.resetTimeIfWrong) remainingTimeRaw.value = FULL_TIME;
    remainingTimeRaw.value -= settings.penalty;
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
  <div class="statusbar" v-if="remainingTimeRaw > 0">
    <div id="sp-main"></div>
  </div>
  <h1 v-if="remainingTimeRaw > 0">{{ eq }}</h1>
  <div class="btn-group" v-if="remainingTimeRaw > 0">
    <button v-for="i in variants" @click="check($event)">{{ i }}</button>
  </div>
  <div class="gameOver" v-if="remainingTimeRaw <= 0">
    <h1>Game over</h1>
    <h2>{{correct}} of {{total}} are correct ({{Math.floor(correct/total*1000)/10 || 0}}%)</h2>
    <h2>Your rating:</h2>
    <p>
      <span v-for="i in rating"><i class="fas fa-star">{{ i }}</i></span>
      <span v-for="i in MAX_RATING - rating"><i class="far fa-star">{{ i }}</i></span>
    </p>
  </div>
</template>

<style scoped>
.gameOver {
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
  width: v-bind(remainingTimeAsCssUnits);
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
