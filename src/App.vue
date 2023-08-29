<script lang="ts">
import settings from "@/settings";

const ANSWER_VARIANTS = settings.answerVariants;
const MAX_RATING = settings.numberOfStars;
const FULL_TIME = settings.answerTime * 1000;

</script>

<script setup lang="ts">
import {computed, onMounted, ref} from "vue";
/// <reference path="@/shims-vue.d.ts" />
import Star from "@/components/Star.vue";

const equation = ref("");
const variants = ref(Array(ANSWER_VARIANTS).fill(0))
const numberOfCorrectAnswers = ref(0);
const correctAnswer = ref(0);
const total = ref(0);
const remainingTimeRaw = ref(FULL_TIME);

// because v-bind() in css allows only property name
const remainingTimeAsCssUnits = computed(() => remainingTimeRaw.value / FULL_TIME * 100 + "vw");

const rating = computed(()=>Math.round(numberOfCorrectAnswers.value / Math.max(1, total.value) * MAX_RATING))

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
  equation.value = a + "+" + b + "=?";
  correctAnswer.value = a + b;
  const id = Math.floor(Math.random() * ANSWER_VARIANTS);
  variants.value = Array(ANSWER_VARIANTS).fill(null).map(() => (rand() + rand()));
  variants.value[id] = a + b;
  variants.value = [...variants.value];
}

function check(e: MouseEvent) {
  const n = parseInt((e.target as HTMLElement).innerHTML.trim());
  if (n == correctAnswer.value) {
    if (settings.doReset) remainingTimeRaw.value = FULL_TIME;
    numberOfCorrectAnswers.value += 1;
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
  <h1 v-if="remainingTimeRaw > 0">{{ equation }}</h1>
  <div class="btn-group" v-if="remainingTimeRaw > 0">
    <button v-for="i in variants" @click="check($event)">{{ i }}</button>
  </div>
  <div class="gameOver" v-if="remainingTimeRaw <= 0">
    <h1>Game over</h1>
    <h2>{{ numberOfCorrectAnswers }} of {{ total }} are numberOfCorrectAnswers
      ({{ Math.floor(numberOfCorrectAnswers / total * 1000) / 10 || 0 }}%)</h2>
    <h2>Your rating:</h2>
    <p>
      <!--suppress JSUnusedLocalSymbols -->
      <Star full="yes" size="48" v-for="i in rating" />
      <!--suppress JSUnusedLocalSymbols -->
      <Star size="48" v-for="i in MAX_RATING - rating"/>
    </p>
  </div>
</template>

<!-- For WebStorm -->
<!--suppress CssUnusedSymbol -->
<style>

body.error {
  background: #ff0000 !important;
}

body.error * {
  display: none !important;
}

</style>

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
