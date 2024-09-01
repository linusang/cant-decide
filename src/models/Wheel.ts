import Choice from "./Choice";

export default interface Wheel {
  id: string;
  title: string;
  choices: Choice[];
  repeat?: number;
  excludeLastResultsCount?: number;
  lastSaved?: Date;
  hideLabelsOnWheel?: boolean;
}
