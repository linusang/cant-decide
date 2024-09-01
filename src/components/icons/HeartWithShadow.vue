<template>
  <svg
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
  >
    <defs>
      <filter id="shadow">
        <feDropShadow
          dx="0"
          dy="0.5"
          stdDeviation="1.5"
          flood-color="#898686"
        />
      </filter>
      <filter id="shadow2">
        <feDropShadow dx="0" dy="0" stdDeviation="0.5" flood-color="cyan" />
      </filter>
      <filter id="shadow3">
        <feDropShadow
          dx="-0.8"
          dy="-0.8"
          stdDeviation="0"
          flood-color="pink"
          flood-opacity="0.5"
        />
      </filter>
    </defs>
    <path
      style="filter:url(#shadow);"
      d="M21.6 2.438c1.6 1.4 2.4 2.8 2.4 4.8s-.6 3.6-1.8 5L12 22.638l-10.2-10.4c-1.2-1.4-1.8-3-1.8-5s.8-3.6 2.4-4.8c1.2-1 2.8-1.6 4.4-1.4 1.6.2 3.2.8 4.2 2l1 1 1-1c1.2-1.2 2.6-1.8 4.2-2 1.6-.2 3.2.4 4.4 1.4z"
    />
  </svg>
</template>
