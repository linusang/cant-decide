<template>
  <div
    class="fixed inset-0 no-swiping"
    v-if="toggleOpen"
    @mousedown="toggleOpen = false"
    @touchstart="toggleOpen = false"
  ></div>
  <toggle-icon-button
    class="relative w-16 h-16 bg-chetwode-blue-700 hover:bg-chetwode-blue-600 no-swiping"
    v-model="toggleOpen"
    ref="referenceComponent"
    #default="{ isChecked }"
  >
    <template v-if="!isChecked">
      <Icon icon="HamburgerMenu" class="w-8 h-8 text-white"></Icon>
    </template>
    <template v-if="isChecked">
      <Icon icon="Cross" class="w-8 h-8 text-white"></Icon>
    </template>
  </toggle-icon-button>
  <teleport to="body">
    <menu-popper ref="menuPopper">
      <ul class="text-white" ref="menuButtonsList">
        <li>
          <button
            type="button"
            id="about-btn"
            @click="showAbout()"
            class="w-full px-5 py-3 text-sm font-bold tracking-widest text-left uppercase hover:bg-chetwode-blue-500 focus:outline-none"
          >
            <div class="flex items-center space-x-3">
              <div>
                <Icon icon="info" class="inline-block w-6 h-6"></Icon>
              </div>
              <div>About</div>
            </div>
          </button>
          <teleport to="body">
            <modal
              ref="aboutModal"
              class="flex flex-col w-full h-full sm:w-112"
              :options="{ bodyFlexGrow: true, bodyOverflowAuto: true }"
            >
              <template #header="{ close }">
                <div class="flex items-center justify-between">
                  <div class="text-xl uppercase text-catalina-blue-200">
                    About
                  </div>
                  <icon-button
                    class="bg-violet-red-500 hover:bg-violet-red-400"
                    @click="close()"
                    ><Icon icon="Cross" class="text-white"></Icon
                  ></icon-button>
                </div>
              </template>
              <template #default>
                <div class="p-8 space-y-5 text-lg text-chetwode-blue-300">
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
                  <ul class="pl-5 text-white list-disc">
                    <li>"Who should pay for the treat?"</li>
                    <li>"Who should wash the dishes?"</li>
                    <li>"What to do for my next hot date?"</li>
                    <li>"Where to travel after COVID?"</li>
                    <li>"My next bucketlist is..."</li>
                  </ul>
                </div>
              </template>
              <template #footer="{ close }">
                <div class="text-center">
                  <rounded-button
                    class="border bg-chetwode-blue-700 hover:bg-chetwode-blue-600 border-chetwode-blue-700 hover:border-chetwode-blue-600"
                    @click="close()"
                  >
                    OK
                  </rounded-button>
                </div>
              </template>
            </modal>
          </teleport>
        </li>
        <li>
          <button
            type="button"
            id="share-btn"
            @click="share()"
            class="w-full px-5 py-3 text-sm font-bold tracking-widest text-left uppercase hover:bg-chetwode-blue-500 focus:outline-none"
          >
            <div class="flex items-center space-x-3">
              <div>
                <Icon icon="Share" class="w-6 h-6"></Icon>
              </div>
              <div>Share</div>
            </div>
          </button>
          <teleport to="body">
            <modal ref="copiedUrlToClipboardModal" class="w-full sm:w-112">
              <template #header="{ close }">
                <div class="flex items-center justify-between">
                  <div class="text-xl uppercase text-catalina-blue-200">
                    Share link
                  </div>
                  <icon-button
                    class="bg-violet-red-500 hover:bg-violet-red-400"
                    @click="close()"
                    ><Icon icon="Cross" class="text-white"></Icon
                  ></icon-button>
                </div>
              </template>
              <template #default>
                <p
                  class="p-8 text-lg font-semibold text-center text-chetwode-blue-300"
                >
                  Copied
                  <span class="text-white">https://cantdecide.fun</span> to
                  clipboard.
                </p>
              </template>
              <template #footer="{ close }">
                <div class="text-center">
                  <rounded-button
                    class="border bg-chetwode-blue-700 hover:bg-chetwode-blue-600 border-chetwode-blue-700 hover:border-chetwode-blue-600"
                    @click="close()"
                  >
                    OK
                  </rounded-button>
                </div>
              </template>
            </modal>
          </teleport>
        </li>
        <li v-if="canInstall">
          <button
            type="button"
            id="install-btn"
            @click="installAsApp()"
            class="w-full px-5 py-3 text-sm font-bold tracking-widest text-left uppercase hover:bg-chetwode-blue-500 focus:outline-none"
          >
            <div class="flex items-center space-x-3">
              <div>
                <Icon icon="Download" class="w-6 h-6"></Icon>
              </div>
              <div>Install as App</div>
            </div>
          </button>
          <teleport to="body">
            <modal
              ref="iosInstallPromptModal"
              class="w-full sm:w-112"
              :hideFooter="true"
            >
              <template #header="{ close }">
                <div class="flex items-center justify-between">
                  <div class="text-xl uppercase text-catalina-blue-200">
                    App Install
                  </div>
                  <icon-button
                    class="bg-violet-red-500 hover:bg-violet-red-400"
                    @click="close()"
                    ><Icon icon="Cross" class="text-white"></Icon
                  ></icon-button>
                </div>
              </template>
              <template #default>
                <div class="text-gray-800 bg-white rounded-b-lg">
                  <div class="flex items-center justify-center pt-8">
                    <div
                      class="w-24 h-24 rounded-xl"
                      style="background: url('/img/icons/apple-icon-180.png'); background-size: 6rem 6rem"
                    ></div>
                  </div>
                  <div class="p-8 space-y-3">
                    <h1 class="text-3xl font-bold text-center">
                      Install Can't Decide
                    </h1>
                    <p class="text-lg font-semibold text-center">
                      Install this application on your home screen for quick and
                      easy access when you're on the go.
                    </p>
                  </div>
                  <p
                    class="py-3 text-center text-gray-900 bg-gray-200 rounded-b-lg"
                  >
                    <span>Just tap</span>
                    <span
                      ><Icon
                        icon="IosShare"
                        class="inline-block w-10 h-10 text-blue-600"
                      ></Icon
                    ></span>
                    <span>then</span>
                    <span class="font-bold">&nbsp; Add to Home Screen</span>
                  </p>
                </div>
              </template>
            </modal>
          </teleport>
        </li>
      </ul>
    </menu-popper>
  </teleport>
</template>

<script lang="ts">
import {
  defineComponent,
  inject,
  ref,
  ComponentOptions,
  watch,
  computed,
} from "vue";
import AppStore, { APP_STORE } from "@/share/AppStore";
import { IconButton, RoundedButton, ToggleIconButton } from "./buttons";
import Modal from "./Modal.vue";
import MenuPopper from "./MenuPopper.vue";
import { isIos, isInStandaloneMode } from "@/share/platform";
import { copyTextToClipboard } from "@/share/utils/browserUtils";
import Icon from "./icons/Icon.vue";
export default defineComponent({
  components: {
    IconButton,
    Modal,
    RoundedButton,
    MenuPopper,
    ToggleIconButton,
    Icon,
  },
  setup() {
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

    return {
      toggleOpen,
      installAsApp,
      showAbout,
      share,
      menuPopper,
      referenceComponent,
      menuButtonsList,
      canInstall,
      iosInstallPromptModal,
      copiedUrlToClipboardModal,
      aboutModal,
    };
  },
});
</script>
