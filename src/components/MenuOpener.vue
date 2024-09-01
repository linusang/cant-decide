<script setup lang="ts">
  import type { ComponentOptions } from "vue";
  import { computed, inject, ref, watch } from "vue";

  import type AppStore from "@/share/AppStore";
  import { APP_STORE } from "@/share/AppStore";
  import { isInStandaloneMode, isIos } from "@/share/platform";
  import { copyTextToClipboard } from "@/share/utils/browserUtils";

  import { IconButton, RoundedButton, ToggleIconButton } from "./buttons";
  import Icon from "./icons/Icon.vue";
  import MenuPopper from "./MenuPopper.vue";
  import Modal from "./Modal.vue";

  const appStore = inject(APP_STORE) as AppStore;
  const menuPopper = ref<InstanceType<typeof MenuPopper>>();
  const referenceComponent = ref<ComponentOptions>();
  const toggleOpen = ref<boolean>(false);
  const menuButtonsList = ref<HTMLElement>();
  const iosInstallPromptModal = ref<InstanceType<typeof Modal>>();
  const copiedUrlToClipboardModal = ref<InstanceType<typeof Modal>>();
  const aboutModal = ref<InstanceType<typeof Modal>>();

  function installAsApp() {
    const promptEvent = appStore.getState().installPromptEvent;
    if (promptEvent) {
      promptEvent.prompt();
    } else {
      if (isIos()) {
        if (iosInstallPromptModal.value) {
          iosInstallPromptModal.value.open();
        }
      }
    }
  }

  function showAbout() {
    if (aboutModal.value) {
      aboutModal.value.open();
    }
  }

  function onMenuButtonClick() {
    toggleOpen.value = false;
  }

  function subscribeToButtonsClick() {
    if (menuButtonsList.value) {
      menuButtonsList.value.addEventListener("click", onMenuButtonClick);
    }
  }

  function unsubscribeToButtonsClick() {
    if (menuButtonsList.value) {
      menuButtonsList.value.removeEventListener("click", onMenuButtonClick);
    }
  }

  function open() {
    if (menuPopper.value && referenceComponent.value) {
      menuPopper.value.open(referenceComponent.value.$el);
      subscribeToButtonsClick();
    }
  }

  function close() {
    if (menuPopper.value && referenceComponent.value) {
      menuPopper.value.close();
    }
    unsubscribeToButtonsClick();
  }

  function showCopiedUrlToClipboardModal() {
    if (copiedUrlToClipboardModal.value) {
      copiedUrlToClipboardModal.value.open();
    }
  }

  async function share() {
    if (navigator.share) {
      try {
        const share = {
          title: "Can't Decide",
          text: "Check out Can't Decide!",
          url: "https://cantdecide.fun/",
        };
        await navigator.share(share);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Error sharing", error);
      }
    } else {
      try {
        await copyTextToClipboard("https://cantdecide.fun");
        showCopiedUrlToClipboardModal();
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Error copying to clipboard", error);
      }
    }
  }

  watch(toggleOpen, (isOpen: boolean) => {
    if (isOpen) {
      open();
    } else {
      close();
    }
  });

  const canInstall = computed(() => {
    const conditions = [
      !!appStore.getState().installPromptEvent,
      isIos() && !isInStandaloneMode(),
    ];

    return conditions.some((x) => x);
  });
</script>

<template>
  <div
    v-if="toggleOpen"
    class="no-swiping fixed inset-0"
    @mousedown="toggleOpen = false"
    @touchstart="toggleOpen = false"
  ></div>
  <ToggleIconButton
    ref="referenceComponent"
    v-slot="{ isChecked }"
    v-model="toggleOpen"
    class="no-swiping relative h-16 w-16 bg-chetwode-blue-700 hover:bg-chetwode-blue-600"
  >
    <template v-if="!isChecked">
      <Icon icon="HamburgerMenu" class="h-8 w-8 text-white"></Icon>
    </template>
    <template v-if="isChecked">
      <Icon icon="Cross" class="h-8 w-8 text-white"></Icon>
    </template>
  </ToggleIconButton>
  <Teleport to="body">
    <MenuPopper ref="menuPopper">
      <ul ref="menuButtonsList" class="text-white">
        <li>
          <button
            id="about-btn"
            type="button"
            class="w-full px-5 py-3 text-left text-sm font-bold uppercase tracking-widest hover:bg-chetwode-blue-500 focus:outline-none"
            @click="showAbout()"
          >
            <div class="flex items-center space-x-3">
              <div>
                <Icon icon="info" class="inline-block h-6 w-6"></Icon>
              </div>
              <div>About</div>
            </div>
          </button>
          <Teleport to="body">
            <Modal
              ref="aboutModal"
              class="flex h-full w-full flex-col sm:w-112"
              :options="{ bodyFlexGrow: true, bodyOverflowAuto: true }"
            >
              <template #header="{ close: closeModal }">
                <div class="flex items-center justify-between">
                  <div class="text-xl uppercase text-catalina-blue-200">
                    About
                  </div>
                  <IconButton
                    class="bg-violet-red-500 hover:bg-violet-red-400"
                    @click="closeModal()"
                    ><Icon icon="Cross" class="text-white"></Icon
                  ></IconButton>
                </div>
              </template>
              <template #default>
                <div class="space-y-5 p-8 text-lg text-chetwode-blue-300">
                  <p>
                    <span class="font-bold text-white">Can't Decide</span> is
                    born out of the annoying question: "What to eat?".
                    Oftentimes, we can't decide what to eat because we just
                    don't want to think of what to eat or there are just too
                    many choices. So instead of tossing a coin or scratching
                    your head, why not make it a little more interactive and fun
                    in your decision making dilemma? Spin the wheel!
                  </p>
                  <p>
                    Expanding the idea of "What to eat?", here are some fun and
                    creative examples that you can kickstart with:
                  </p>
                  <ul class="list-disc pl-5 text-white">
                    <li>"Who should pay for the treat?"</li>
                    <li>"Who should wash the dishes?"</li>
                    <li>"What to do for my next hot date?"</li>
                    <li>"Where to travel after COVID?"</li>
                    <li>"My next bucketlist is..."</li>
                  </ul>
                </div>
              </template>
              <template #footer="{ close: closeModal }">
                <div class="text-center">
                  <RoundedButton
                    class="border border-chetwode-blue-700 bg-chetwode-blue-700 hover:border-chetwode-blue-600 hover:bg-chetwode-blue-600"
                    @click="closeModal()"
                  >
                    OK
                  </RoundedButton>
                </div>
              </template>
            </Modal>
          </Teleport>
        </li>
        <li>
          <button
            id="share-btn"
            type="button"
            class="w-full px-5 py-3 text-left text-sm font-bold uppercase tracking-widest hover:bg-chetwode-blue-500 focus:outline-none"
            @click="share()"
          >
            <div class="flex items-center space-x-3">
              <div>
                <Icon icon="Share" class="h-6 w-6"></Icon>
              </div>
              <div>Share</div>
            </div>
          </button>
          <Teleport to="body">
            <Modal ref="copiedUrlToClipboardModal" class="w-full sm:w-112">
              <template #header="{ close: closeModal }">
                <div class="flex items-center justify-between">
                  <div class="text-xl uppercase text-catalina-blue-200">
                    Share link
                  </div>
                  <IconButton
                    class="bg-violet-red-500 hover:bg-violet-red-400"
                    @click="closeModal()"
                    ><Icon icon="Cross" class="text-white"></Icon
                  ></IconButton>
                </div>
              </template>
              <template #default>
                <p
                  class="p-8 text-center text-lg font-semibold text-chetwode-blue-300"
                >
                  Copied
                  <span class="text-white">https://cantdecide.fun</span> to
                  clipboard.
                </p>
              </template>
              <template #footer="{ close: closeModal }">
                <div class="text-center">
                  <RoundedButton
                    class="border border-chetwode-blue-700 bg-chetwode-blue-700 hover:border-chetwode-blue-600 hover:bg-chetwode-blue-600"
                    @click="closeModal()"
                  >
                    OK
                  </RoundedButton>
                </div>
              </template>
            </Modal>
          </Teleport>
        </li>
        <li v-if="canInstall">
          <button
            id="install-btn"
            type="button"
            class="w-full px-5 py-3 text-left text-sm font-bold uppercase tracking-widest hover:bg-chetwode-blue-500 focus:outline-none"
            @click="installAsApp()"
          >
            <div class="flex items-center space-x-3">
              <div>
                <Icon icon="Download" class="h-6 w-6"></Icon>
              </div>
              <div>Install as App</div>
            </div>
          </button>
          <Teleport to="body">
            <Modal
              ref="iosInstallPromptModal"
              class="w-full sm:w-112"
              :hide-footer="true"
            >
              <template #header="{ close: closeModal }">
                <div class="flex items-center justify-between">
                  <div class="text-xl uppercase text-catalina-blue-200">
                    App Install
                  </div>
                  <IconButton
                    class="bg-violet-red-500 hover:bg-violet-red-400"
                    @click="closeModal()"
                    ><Icon icon="Cross" class="text-white"></Icon
                  ></IconButton>
                </div>
              </template>
              <template #default>
                <div class="rounded-b-lg bg-white text-gray-800">
                  <div class="flex items-center justify-center pt-8">
                    <div
                      class="h-24 w-24 rounded-xl"
                      style="
                        background: url(&quot;/img/icons/apple-icon-180.png&quot;);
                        background-size: 6rem 6rem;
                      "
                    ></div>
                  </div>
                  <div class="space-y-3 p-8">
                    <h1 class="text-center text-3xl font-bold">
                      Install Can't Decide
                    </h1>
                    <p class="text-center text-lg font-semibold">
                      Install this application on your home screen for quick and
                      easy access when you're on the go.
                    </p>
                  </div>
                  <p
                    class="rounded-b-lg bg-gray-200 py-3 text-center text-gray-900"
                  >
                    <span>Just tap</span>
                    <span
                      ><Icon
                        icon="IosShare"
                        class="inline-block h-10 w-10 text-blue-600"
                      ></Icon
                    ></span>
                    <span>then</span>
                    <span class="font-bold">&nbsp; Add to Home Screen</span>
                  </p>
                </div>
              </template>
            </Modal>
          </Teleport>
        </li>
      </ul>
    </MenuPopper>
  </Teleport>
</template>
