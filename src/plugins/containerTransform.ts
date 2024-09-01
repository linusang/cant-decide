import type { AnimeInstance } from "animejs";
import anime from "animejs";

const DefaultDuration = 500;
const DefaultEasing = "easeOutCubic";
const DefaultBorderRadius = "0";
const DefaultBackgroundColor = "#FFF";

export function useContainerTransform(
  tgtElement: HTMLElement,
  bgElement: HTMLElement,
  contentElement: HTMLElement,
  srcPlaceholderElement: HTMLElement,
  bgElementBorderRadius: string,
  bgElementBackgroundColor: string,
  fadeInDurationFraction = 0.7,
  fadeOutDurationFraction = 0.2
) {
  if (fadeOutDurationFraction < 0 || fadeOutDurationFraction > 1) {
    throw "contentFadeOutDurationFraction must be between 0 and 1 inclusive";
  }
  if (fadeInDurationFraction < 0 || fadeInDurationFraction > 1) {
    throw "contentFaceInDurationFraction must be between 0 and 1 inclusive";
  }

  function calcScaleAndTranslateValues(
    srcRect: DOMRect,
    tgtRect: DOMRect
  ): {
    translateX: number;
    translateY: number;
    scaleX: number;
    scaleY: number;
  } {
    const srcRectCenterX = srcRect.left + srcRect.width / 2;
    const srcRectCenterY = srcRect.top + srcRect.height / 2;

    const tgtRectCenterX = tgtRect.left + tgtRect.width / 2;
    const tgtRectCenterY = tgtRect.top + tgtRect.height / 2;

    const translateX = srcRectCenterX - tgtRectCenterX;
    const translateY = srcRectCenterY - tgtRectCenterY;

    const scaleX = srcRect.width / tgtRect.width;
    const scaleY = srcRect.height / tgtRect.height;

    return {
      translateX,
      translateY,
      scaleX,
      scaleY,
    };
  }

  function calcFadeOutTimings(
    totalDuration: number,
    fraction: number
  ): Timings {
    return {
      duration: totalDuration * fraction,
      delay: 0,
    };
  }

  function calcFadeInTimings(totalDuration: number, fraction: number): Timings {
    return {
      duration: totalDuration * fraction,
      delay: totalDuration - totalDuration * fraction,
    };
  }

  function performTgtElementEntranceAnimation(
    srcElement: HTMLElement,
    tgtElement: HTMLElement,
    duration: number,
    easing: string
  ) {
    const srcRect = srcElement.getBoundingClientRect();
    const tgtRect = tgtElement.getBoundingClientRect();
    const { translateX, translateY } = calcScaleAndTranslateValues(
      srcRect,
      tgtRect
    );
    const promise = new Promise<AnimeInstance>((resolve) => {
      anime({
        targets: tgtElement,
        duration,
        easing,
        translateX: [translateX, 0],
        translateY: [translateY, 0],
        complete: resolve,
      });
    });
    return promise;
  }

  function performBgElementEntranceAnimation(
    srcElement: HTMLElement,
    bgElement: HTMLElement,
    duration: number,
    easing: string,
    srcElementBorderRadius: string,
    srcElementBackgroundColor: string
  ) {
    const srcRect = srcElement.getBoundingClientRect();
    const bgRect = bgElement.getBoundingClientRect();

    const promise = new Promise<AnimeInstance>((resolve) => {
      anime({
        targets: bgElement,
        borderRadius: [srcElementBorderRadius, bgElementBorderRadius],
        backgroundColor: {
          value: [srcElementBackgroundColor, bgElementBackgroundColor],
        },
        translateX: [`${srcRect.x - bgRect.x}px`, "0"],
        translateY: [`${srcRect.y - bgRect.y}px`, "0"],
        width: [`${srcRect.width}px`, `${bgRect.width}px`],
        height: [`${srcRect.height}px`, `${bgRect.height}px`],
        duration,
        easing,
        complete: resolve,
      });
    });

    return promise;
  }

  function performContentElementEntranceAnimation(
    srcElement: HTMLElement,
    contentElement: HTMLElement,
    totalDuration: number,
    easing: string
  ) {
    const srcRect = srcElement.getBoundingClientRect();
    const contentRect = contentElement.getBoundingClientRect();
    const { scaleX, scaleY } = calcScaleAndTranslateValues(
      srcRect,
      contentRect
    );

    const { duration: fadeInDuration, delay } = calcFadeInTimings(
      totalDuration,
      fadeInDurationFraction
    );

    const promise = new Promise<AnimeInstance>((resolve) => {
      anime({
        targets: contentElement,
        duration: totalDuration,
        easing,
        scaleX: [scaleX, 1],
        scaleY: [scaleY, 1],
        opacity: {
          value: [0, 1],
          delay,
          duration: fadeInDuration,
          easing: "linear",
        },
        complete: resolve,
      });
    });
    return promise;
  }

  function performClonedElementEntranceAnimation(
    srcPlaceHolderElement: HTMLElement,
    clonedElement: HTMLElement,
    totalDuration: number
  ) {
    const srcPlaceholderRect = srcPlaceHolderElement.getBoundingClientRect();
    const cloneRect = clonedElement.getBoundingClientRect();

    anime.set(clonedElement, {
      translateX: srcPlaceholderRect.width / 2 - cloneRect.width / 2,
      translateY: srcPlaceholderRect.height / 2 - cloneRect.height / 2,
    });

    const { duration: fadeOutDuration } = calcFadeOutTimings(
      totalDuration,
      fadeOutDurationFraction
    );

    const promise = new Promise<AnimeInstance>((resolve) => {
      anime({
        targets: clonedElement,
        opacity: 0,
        duration: fadeOutDuration,
        complete: resolve,
        easing: "linear",
      });
    });
    return promise;
  }

  function performTgtElementExitAnimation(
    srcElement: HTMLElement,
    tgtElement: HTMLElement,
    duration: number,
    easing: string
  ) {
    const srcRect = srcElement.getBoundingClientRect();
    const tgtRect = tgtElement.getBoundingClientRect();
    const { translateX, translateY } = calcScaleAndTranslateValues(
      srcRect,
      tgtRect
    );
    const promise = new Promise<AnimeInstance>((resolve) => {
      anime({
        targets: tgtElement,
        duration,
        easing,
        translateX: [0, translateX],
        translateY: [0, translateY],
        complete: resolve,
      });
    });
    return promise;
  }

  function performBgElementExitAnimation(
    srcElement: HTMLElement,
    bgElement: HTMLElement,
    duration: number,
    easing: string,
    srcElementBorderRadius: string,
    srcElementBackgroundColor: string
  ) {
    const srcRect = srcElement.getBoundingClientRect();
    const bgRect = bgElement.getBoundingClientRect();

    const promise = new Promise<AnimeInstance>((resolve) => {
      anime({
        targets: bgElement,
        borderRadius: [bgElementBorderRadius, srcElementBorderRadius],
        backgroundColor: [bgElementBackgroundColor, srcElementBackgroundColor],
        translateX: ["0", `${bgRect.width / 2 - srcRect.width / 2}px`],
        translateY: ["0", `${bgRect.height / 2 - srcRect.height / 2}px`],
        width: [`${bgRect.width}px`, `${srcRect.width}px`],
        height: [`${bgRect.height}px`, `${srcRect.height}px`],
        duration,
        easing,
        complete: resolve,
      });
    });
    return promise;
  }

  function performContentElementExitAnimation(
    srcElement: HTMLElement,
    contentElement: HTMLElement,
    totalDuration: number,
    easing: string
  ) {
    const srcRect = srcElement.getBoundingClientRect();
    const contentRect = contentElement.getBoundingClientRect();
    const { scaleX, scaleY } = calcScaleAndTranslateValues(
      srcRect,
      contentRect
    );

    const { duration: fadeOutDuration } = calcFadeOutTimings(
      totalDuration,
      fadeOutDurationFraction
    );
    const promise = new Promise<AnimeInstance>((resolve) => {
      anime({
        targets: contentElement,
        duration: totalDuration,
        easing,
        scaleX: [1, scaleX],
        scaleY: [1, scaleY],
        opacity: {
          value: [1, 0],
          duration: fadeOutDuration,
          easing: "linear",
        },
        complete: resolve,
      });
    });
    return promise;
  }

  function performClonedElementExitAnimation(
    srcPlaceholderElement: HTMLElement,
    clonedElement: HTMLElement,
    totalDuration: number
  ) {
    const srcPlaceHolderRect = srcPlaceholderElement.getBoundingClientRect();
    const cloneRect = clonedElement.getBoundingClientRect();

    anime.set(clonedElement, {
      translateX: srcPlaceHolderRect.width / 2 - cloneRect.width / 2,
      translateY: srcPlaceHolderRect.height / 2 - cloneRect.height / 2,
    });

    const { duration: fadeInDuration, delay } = calcFadeInTimings(
      totalDuration,
      fadeInDurationFraction
    );

    const promise = new Promise<AnimeInstance>((resolve) => {
      anime({
        targets: clonedElement,
        opacity: 1,
        duration: fadeInDuration,
        delay: delay,
        complete: resolve,
        easing: "linear",
      });
    });
    return promise;
  }

  function setDisplayNone(element: HTMLElement) {
    anime.set(element, {
      display: "none",
    });
  }

  function setDisplayBlock(element: HTMLElement) {
    anime.set(element, {
      display: "block",
    });
  }

  function cloneThenPlaceSrcElement(
    srcElement: HTMLElement,
    srcElementPlaceholder: HTMLElement
  ): HTMLElement {
    const cloned = srcElement.cloneNode(true);
    srcElementPlaceholder.innerHTML = "";
    srcElementPlaceholder.append(cloned);
    return cloned as HTMLElement;
  }

  async function performEntranceTransition(params: ContainerTransformParams) {
    if (!params.srcElement) throw "srcElement required";
    if (!srcPlaceholderElement) throw "srcPlaceHolderElement required";
    if (!tgtElement) throw "tgtElement required";
    if (!bgElement) throw "bgElement required";
    if (!contentElement) throw "contentElement required";

    const duration = params.duration || DefaultDuration;
    const easing = params.easing || DefaultEasing;
    const srcElementBorderRadius =
      params.srcElementBorderRadius || DefaultBorderRadius;
    const srcElementBackgroundColor =
      params.srcElementBackgroundColor || DefaultBackgroundColor;

    const cloned = cloneThenPlaceSrcElement(
      params.srcElement,
      srcPlaceholderElement
    );
    params.afterClone?.(params.srcElement, cloned, bgElement);

    const p1 = performTgtElementEntranceAnimation(
      params.srcElement,
      tgtElement,
      duration,
      easing
    );

    const p2 = performBgElementEntranceAnimation(
      params.srcElement,
      bgElement,
      duration,
      easing,
      srcElementBorderRadius,
      srcElementBackgroundColor
    );

    const p3 = performContentElementEntranceAnimation(
      params.srcElement,
      contentElement,
      duration,
      easing
    );

    const p4 = performClonedElementEntranceAnimation(
      srcPlaceholderElement,
      cloned,
      duration
    );

    await Promise.all([p1, p2, p3, p4]);

    anime.set(bgElement, {
      width: "100%",
      height: "100%",
    });
    setDisplayNone(srcPlaceholderElement);
  }

  async function performExitTransition(params: ContainerTransformParams) {
    if (!params.srcElement) throw "srcElement required";
    if (!srcPlaceholderElement) throw "srcPlaceHolderElement required";
    if (!tgtElement) throw "tgtElement required";
    if (!bgElement) throw "bgElement required";
    if (!contentElement) throw "contentElement required";

    const duration = params.duration || DefaultDuration;
    const easing = params.easing || DefaultEasing;
    const srcElementBorderRadius =
      params.srcElementBorderRadius || DefaultBorderRadius;
    const srcElementBackgroundColor =
      params.srcElementBackgroundColor || DefaultBackgroundColor;

    const cloned = cloneThenPlaceSrcElement(
      params.srcElement,
      srcPlaceholderElement
    );
    params.afterClone?.(params.srcElement, cloned, bgElement);

    setDisplayBlock(srcPlaceholderElement);

    const p1 = performTgtElementExitAnimation(
      params.srcElement,
      tgtElement,
      duration,
      easing
    );

    const p2 = performBgElementExitAnimation(
      params.srcElement,
      bgElement,
      duration,
      easing,
      srcElementBorderRadius,
      srcElementBackgroundColor
    );

    const p3 = performContentElementExitAnimation(
      params.srcElement,
      contentElement,
      duration,
      easing
    );

    const p4 = performClonedElementExitAnimation(
      srcPlaceholderElement,
      cloned,
      duration
    );
    await Promise.all([p1, p2, p3, p4]);
  }

  return {
    performEntranceTransition,
    performExitTransition,
  };
}

type Timings = {
  duration: number;
  delay: number;
};

export interface ContainerTransformParams {
  srcElement: HTMLElement;
  afterClone?: (
    srcEl: HTMLElement,
    clonedEl: HTMLElement,
    bgElement: HTMLElement
  ) => void;
  srcElementBorderRadius?: string;
  srcElementBackgroundColor?: string;
  duration?: number;
  easing?: string;
}
