import type Coord from "./Coord";

export default interface SvgSlice<T> {
  data: T;
  fill: string;
  d: string;

  textCoord: Coord;
  textTransform: string;
  degrees: number;
}
