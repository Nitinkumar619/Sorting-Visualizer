const container = document.getElementById("bars-container");
    const speedSlider = document.getElementById("speedSlider");
    let barValues = [];
    let delay = 205 - parseInt(speedSlider.value);
    let stop = false;

    speedSlider.addEventListener("input", () => {
      delay = 205 - parseInt(speedSlider.value);
    });

    function generateBars(n = Math.floor(container.clientWidth / 6)) {
      stop = true;
      setTimeout(() => {
        container.innerHTML = "";
        barValues = [];
        for (let i = 0; i < n; i++) {
          barValues.push(Math.floor(Math.random() * container.clientHeight));
        }
        renderBars();
        stop = false;
      }, delay);
    }

    function renderBars(activeIndices = []) {
      container.innerHTML = "";
      barValues.forEach((value, index) => {
        const bar = document.createElement("div");
        bar.classList.add("bar");
        bar.style.height = `${value}px`;
        if (activeIndices.includes(index)) {
          bar.classList.add("active");
        }
        container.appendChild(bar);
      });
    }

    function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function bubbleSort() {
      for (let i = 0; i < barValues.length - 1; i++) {
        for (let j = 0; j < barValues.length - i - 1; j++) {
          if (stop) return;
          renderBars([j, j + 1]);
          if (barValues[j] > barValues[j + 1]) {
            [barValues[j], barValues[j + 1]] = [barValues[j + 1], barValues[j]];
          }
          await sleep(delay);
        }
      }
      renderBars();
    }

    async function selectionSort() {
      for (let i = 0; i < barValues.length; i++) {
        let minIndex = i;
        for (let j = i + 1; j < barValues.length; j++) {
          if (stop) return;
          renderBars([minIndex, j]);
          if (barValues[j] < barValues[minIndex]) {
            minIndex = j;
          }
          await sleep(delay);
        }
        if (minIndex !== i) {
          [barValues[i], barValues[minIndex]] = [barValues[minIndex], barValues[i]];
        }
        renderBars([i]);
        await sleep(delay);
      }
      renderBars();
    }

    async function insertionSort() {
      for (let i = 1; i < barValues.length; i++) {
        if (stop) return;
        let key = barValues[i];
        let j = i - 1;
        while (j >= 0 && barValues[j] > key) {
          barValues[j + 1] = barValues[j];
          renderBars([j, j + 1]);
          j--;
          await sleep(delay);
        }
        barValues[j + 1] = key;
        renderBars([j + 1]);
        await sleep(delay);
      }
      renderBars();
    }

    async function quickSort(start = 0, end = barValues.length - 1) {
      if (stop || start >= end) return;
      let index = await partition(start, end);
      await quickSort(start, index - 1);
      await quickSort(index + 1, end);
    }

    async function partition(start, end) {
      let pivot = barValues[end];
      let i = start;
      for (let j = start; j < end; j++) {
        if (stop) return i;
        renderBars([j, end]);
        if (barValues[j] < pivot) {
          [barValues[i], barValues[j]] = [barValues[j], barValues[i]];
          i++;
        }
        await sleep(delay);
      }
      [barValues[i], barValues[end]] = [barValues[end], barValues[i]];
      renderBars([i, end]);
      await sleep(delay);
      return i;
    }

    async function mergeSort(start = 0, end = barValues.length - 1) {
      if (stop || start >= end) return;
      const mid = Math.floor((start + end) / 2);
      await mergeSort(start, mid);
      await mergeSort(mid + 1, end);
      await merge(start, mid, end);
    }

    async function merge(start, mid, end) {
      const left = barValues.slice(start, mid + 1);
      const right = barValues.slice(mid + 1, end + 1);
      let i = 0, j = 0, k = start;
      while (i < left.length && j < right.length) {
        if (stop) return;
        barValues[k] = left[i] <= right[j] ? left[i++] : right[j++];
        renderBars([k]);
        await sleep(delay);
        k++;
      }
      while (i < left.length) {
        if (stop) return;
        barValues[k++] = left[i++];
        renderBars([k - 1]);
        await sleep(delay);
      }
      while (j < right.length) {
        if (stop) return;
        barValues[k++] = right[j++];
        renderBars([k - 1]);
        await sleep(delay);
      }
    }

    async function heapSort() {
      const n = barValues.length;
      for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        if (stop) return;
        await heapify(n, i);
      }
      for (let i = n - 1; i > 0; i--) {
        if (stop) return;
        [barValues[0], barValues[i]] = [barValues[i], barValues[0]];
        renderBars([0, i]);
        await sleep(delay);
        await heapify(i, 0);
      }
      renderBars();
    }

    async function heapify(n, i) {
      let largest = i;
      let l = 2 * i + 1;
      let r = 2 * i + 2;
      if (l < n && barValues[l] > barValues[largest]) largest = l;
      if (r < n && barValues[r] > barValues[largest]) largest = r;
      if (largest !== i) {
        [barValues[i], barValues[largest]] = [barValues[largest], barValues[i]];
        renderBars([i, largest]);
        await sleep(delay);
        await heapify(n, largest);
      }
    }

    async function startSort() {
      stop = false;
      const algo = document.getElementById("algorithm").value;
      switch (algo) {
        case "bubble": await bubbleSort(); break;
        case "selection": await selectionSort(); break;
        case "insertion": await insertionSort(); break;
        case "quick": await quickSort(); break;
        case "merge": await mergeSort(); break;
        case "heap": await heapSort(); break;
      }
    }

    function stopSort() {
      stop = true;
    }

    generateBars();
    window.addEventListener("resize", () => generateBars());