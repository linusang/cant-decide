import Coord from "@/models/Coord";

export function round(value: number, precision: number) {
  const multiplier = Math.pow(10, precision || 0);
  return Math.round(value * multiplier) / multiplier;
}

export function toRadians(degrees: number) {
  return (degrees * Math.PI) / 180;
}

export function computePos(
  clockWiseAngle: number,
  radius: number,
  midX = 50,
  midY = 50
): Coord {
  if (0 <= clockWiseAngle && clockWiseAngle < 90) {
    // 1st quadrant
    const effectiveAngle = 90 - clockWiseAngle;
    const radians = toRadians(effectiveAngle);
    const x = radius * Math.cos(radians) + midX;
    const y = midY - radius * Math.sin(radians);
    return { x, y };
  } else if (90 <= clockWiseAngle && clockWiseAngle < 180) {
    // 2nd quadrant
    const effectiveAngle = clockWiseAngle - 90;
    const radians = toRadians(effectiveAngle);
    const x = radius * Math.cos(radians) + midX;
    const y = radius * Math.sin(radians) + midY;
    return { x, y };
  } else if (180 <= clockWiseAngle && clockWiseAngle < 270) {
    // 3rd quadrant
    const effectiveAngle = 270 - clockWiseAngle;
    const radians = toRadians(effectiveAngle);
    const x = midX - radius * Math.cos(radians);
    const y = radius * Math.sin(radians) + midY;
    return { x, y };
  } else {
    // 4th quadrant
    const effectiveAngle = clockWiseAngle - 270;
    const radians = toRadians(effectiveAngle);
    const x = midX - radius * Math.cos(radians);
    const y = midY - radius * Math.sin(radians);
    return { x, y };
  }
}

export type Operator = "+" | "-" | "*" | "/";

export function accurateCalc(num1: number, operator: Operator, num2: number) {
  if (isNaN(num1) || isNaN(num2)) {
    // Values validation
    return Number.NaN;
  }

  const strNum1 = num1 + "";
  const strNum2 = num2 + "";
  const dpNum1 = num1 % 1 ? strNum1.length - strNum1.indexOf(".") - 1 : 0; // Get total decimal places of num1
  const dpNum2 = num2 % 1 ? strNum2.length - strNum2.indexOf(".") - 1 : 0; // Get total decimal places of num2
  const multiplier = Math.pow(10, dpNum1 > dpNum2 ? dpNum1 : dpNum2); // Compare dpNum1 and dpNum2, then find value of 10 to the power of the largest between them.
  const tempNum1 = Math.round(num1 * multiplier); // Multiply num1 by multiplier to eliminate all decimal places of num1.
  const tempNum2 = Math.round(num2 * multiplier); // Multiply num2 by multiplier to eliminate all decimal places of num2.
  let result;

  switch (operator.trim()) {
    case "+":
      result = (tempNum1 + tempNum2) / multiplier;
      break;
    case "-":
      result = (tempNum1 - tempNum2) / multiplier;
      break;
    case "*":
      result = (tempNum1 * tempNum2) / (multiplier * multiplier);
      break;
    case "/":
      result = tempNum1 / tempNum2;
      break;
    case "%":
      result = (tempNum1 % tempNum2) / multiplier;
      break;
    default:
      result = Number.NaN;
  }

  return result;
}

export function shuffle<T>(array: T[]): T[] {
  let currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}
