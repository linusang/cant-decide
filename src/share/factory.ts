import type Choice from "@/models/Choice";
import type UserWheels from "@/models/UserWheels";
import type Wheel from "@/models/Wheel";

import { generateUniqueId } from "./utils/stringUtils";

function createLunchWheel(): Wheel {
  const choices = [
    {
      id: generateUniqueId(),
      name: "Wan Ton Mee 🥟🍜",
      weightage: 1,
      isIncluded: true,
    },
    {
      id: generateUniqueId(),
      name: "Popiah",
      weightage: 1,
      isIncluded: true,
    },
    {
      id: generateUniqueId(),
      name: "Bak Kut Teh 🐖",
      weightage: 1,
      isIncluded: true,
    },
    {
      id: generateUniqueId(),
      name: "Chicken Rice 🍗🍚",
      weightage: 1,
      isIncluded: true,
    },
    {
      id: generateUniqueId(),
      name: "Kway Chup",
      weightage: 1,
      isIncluded: true,
    },
    {
      id: generateUniqueId(),
      name: "Roti Prata",
      weightage: 1,
      isIncluded: true,
    },
    {
      id: generateUniqueId(),
      name: "Rojak",
      weightage: 1,
      isIncluded: true,
    },
    {
      id: generateUniqueId(),
      name: "Bak Chor Mee",
      weightage: 1,
      isIncluded: true,
    },
    {
      id: generateUniqueId(),
      name: "McDonald's 🍔🍟",
      weightage: 1,
      isIncluded: true,
    },
    {
      id: generateUniqueId(),
      name: "Chicken Chop 🥩",
      weightage: 1,
      isIncluded: true,
    },
    {
      id: generateUniqueId(),
      name: "Fried Prawn Mee 🍤",
      weightage: 1,
      isIncluded: true,
    },
    {
      id: generateUniqueId(),
      name: "Mala Xiang Guo",
      weightage: 1,
      isIncluded: true,
    },
    {
      id: generateUniqueId(),
      name: "Fried Carrot Cake 🥕",
      weightage: 1,
      isIncluded: true,
    },
    {
      id: generateUniqueId(),
      name: "Japanese Bento 🍱",
      weightage: 1,
      isIncluded: true,
    },
    {
      id: generateUniqueId(),
      name: "Sushi 🍣",
      weightage: 1,
      isIncluded: true,
    },
  ];

  return {
    choices,
    id: generateUniqueId(),
    title: "What's for lunch? 🍝",
    excludeLastResultsCount: undefined,
    lastSaved: new Date(),
    repeat: 1,
    hideLabelsOnWheel: false,
  };
}

export function createBucketListWheel(): Wheel {
  const choices = [
    {
      id: generateUniqueId(),
      name: "Northern Lights",
      weightage: 1,
      isIncluded: true,
    },
    {
      id: generateUniqueId(),
      name: "Skydiving",
      weightage: 1,
      isIncluded: true,
    },
    {
      id: generateUniqueId(),
      name: "Scuba Diving",
      weightage: 1,
      isIncluded: true,
    },
    {
      id: generateUniqueId(),
      name: "Fly a Hot Air Balloon",
      weightage: 1,
      isIncluded: true,
    },
    {
      id: generateUniqueId(),
      name: "Bungee Jump",
      weightage: 1,
      isIncluded: true,
    },
  ];

  return {
    choices,
    id: generateUniqueId(),
    title: "My next bucket list is...",
    excludeLastResultsCount: undefined,
    lastSaved: new Date(),
    repeat: 1,
    hideLabelsOnWheel: false,
  };
}

export function createSampleUserWheels(): UserWheels {
  return {
    wheels: [createLunchWheel()],
  };
}

export function createEmptyNewChoice(): Choice {
  return {
    id: generateUniqueId(),
    name: "",
    weightage: 1,
    isIncluded: true,
  };
}
