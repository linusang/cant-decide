declare interface PropellerOptions {
  /**
   * sets initial angle
   */
  angle?: number;
  /**
   * is the most valueble option. It is a number between 0 and 1. 0 means no rotation after mouse was released. 1 means infinite rotation. For this demo we use inertia equals to 0.99.
   */
  inertia?: number;
  /**
   * initial speed of rotation. It also can be used as property in runtime.
   */
  speed?: number;
  /**
   * minimal speed of rotation. Works only if propeller have inertia between 0 and 1.
   */
  minimalSpeed?: number;
  /**
   * allows to set step in degrees for stepwise mode.
   */
  step?: number;
  /**
   * enables CSS transition to move from step to step. This makes steps smooth and allows to use CSS transitions easing.
   */
  stepTransitionTime?: number;
  /**
   * CSS easing mode for transition when in stepwise mode and stepTransitionTime is more than zero.
   */
  stepTransitionEasing?: string;
  /**
   * callback executed when rotated. You can easily get current angle as this.angle inside of callback function.
   */
  onRotate?: () => void;
  /**
   * callback executed when stopped.
   */
  onStop?: () => void;
  /**
   * callback executed when start dragging.
   */
  onDragStart?: () => void;
  /**
   * callback executed when stop dragging.
   */
  onDragStop?: () => void;
  /**
   * queryString to point to a different touch element to trigger the drag
   */
  touchElement?: string;
}

declare class Propeller {
  /**
   * @constructor
   * @param {Element} element - The element to be rotated.
   * @param {PropellerOptions} options - The options for the propeller.
   */
  constructor(element: Element, options: PropellerOptions);
  /**
   * current propellers angle.
   */
  angle: number;
  /**
   * current speed of rotation. Degrees per frame.
   */
  speed: number;
  /**
   * unbind listeners to make propeller inactive, this does not stop rotation
   */
  unbind(): void;
  /**
   * bind listeners after they were unbinded
   */
  bind(): void;
  /**
   * stop rotation immediately
   */
  stop(): void;
}
