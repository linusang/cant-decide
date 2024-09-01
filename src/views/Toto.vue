<script setup>
import { ref, reactive, unref } from "vue";
import RoundedButton from "@/components/buttons/RoundedButton.vue";

const options = createOptions();
const selectedOption = ref(options[0].value);
let rolledNumbers = reactive([]);

let availableNumbers = [];

function createOptions() {
  const result = [];
  for (let i = 6; i <= 12; i++) {
    result.push({ label: `System ${i}`, value: i });
  }
  return result;
}

function initAvailableNumbers() {
  availableNumbers.splice(0, availableNumbers.length);
  for (let i = 1; i <= 49; i++) {
    availableNumbers.push(i);
  }
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function roll() {
  initAvailableNumbers();
  rolledNumbers.splice(0, rolledNumbers.length);

  let tempRolledNumbers = [];
  const count = selectedOption.value;
  for (let i = 0; i < count; i++) {
    const pickedIndex = getRandomInt(0, availableNumbers.length - 1);
    tempRolledNumbers.push(availableNumbers[pickedIndex]);
    availableNumbers.splice(pickedIndex, 1);
  }
  tempRolledNumbers.sort((a, b) => {
    return a - b;
  });

  rolledNumbers.push(...tempRolledNumbers);
}
</script>

<template>
  <div class="h-screen">
    <div class="flex justify-center items-center h-full">
      <div class="w-[500px] bg-white rounded p-8">
        <div class="space-y-3">
          <h1 class="text-3xl text-center font-bold text-catalina-blue-600">
            Pick my TOTO numbers!
          </h1>

          <div class="flex justify-center">
            <div class="space-x-3">
              <select
                v-model="selectedOption"
                class="border border-catalina-blue-800 px-3 py-1"
              >
                <option v-for="option in options" :value="option.value">{{
                  option.label
                }}</option>
              </select>
              <RoundedButton
                @click="roll"
                class="bg-violet-red-500 hover:bg-violet-red-400"
              >
                ROLL!
              </RoundedButton>
            </div>
          </div>
          <ul class="flex flex-wrap justify-center gap-3">
            <li
              v-for="n in rolledNumbers"
              class="text-xl p-2 rounded-full bg-catalina-blue-400 text-white w-[50px] h-[50px] flex items-center justify-center"
            >
              {{ n }}
            </li>
          </ul>
          <h1
            v-show="rolledNumbers.length > 0"
            class="text-xl text-center font-bold text-catalina-blue-400"
          >
            Huat ah!
          </h1>
        </div>
      </div>
    </div>
  </div>
</template>
