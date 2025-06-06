/**
 * Sorting Algorithms in JavaScript
 *
 * This module provides implementations of various sorting algorithms.
 *
 * Example usage:
 *   node sorting_algorithms.js
 */

/**
 * Bubble Sort
 * Time complexity: O(n^2)
 * @param {Array} arr - Array to be sorted
 * @returns {Array} Sorted array
 */
function bubbleSort(arr) {
    const n = arr.length;
    const result = [...arr]; // Create a copy to avoid modifying the original array

    for (let i = 0; i < n; i++) {
        // Flag to optimize for already sorted arrays
        let swapped = false;

        for (let j = 0; j < n - i - 1; j++) {
            if (result[j] > result[j + 1]) {
                // Swap elements
                [result[j], result[j + 1]] = [result[j + 1], result[j]];
                swapped = true;
            }
        }

        // If no elements were swapped in this iteration, the array is already sorted
        if (!swapped) break;
    }

    return result;
}

/**
 * Selection Sort
 * Time complexity: O(n^2)
 * @param {Array} arr - Array to be sorted
 * @returns {Array} Sorted array
 */
function selectionSort(arr) {
    const n = arr.length;
    const result = [...arr]; // Create a copy to avoid modifying the original array

    for (let i = 0; i < n; i++) {
        // Find the smallest element in the unsorted part of the array
        let minIdx = i;

        for (let j = i + 1; j < n; j++) {
            if (result[j] < result[minIdx]) {
                minIdx = j;
            }
        }

        // Swap the smallest element with the first element in the unsorted part
        if (minIdx !== i) {
            [result[i], result[minIdx]] = [result[minIdx], result[i]];
        }
    }

    return result;
}

/**
 * Insertion Sort
 * Time complexity: O(n^2)
 * @param {Array} arr - Array to be sorted
 * @returns {Array} Sorted array
 */
function insertionSort(arr) {
    const n = arr.length;
    const result = [...arr]; // Create a copy to avoid modifying the original array

    for (let i = 1; i < n; i++) {
        const key = result[i];
        let j = i - 1;

        // Move elements greater than key one position ahead
        while (j >= 0 && result[j] > key) {
            result[j + 1] = result[j];
            j--;
        }

        result[j + 1] = key;
    }

    return result;
}

/**
 * Merge Sort
 * Time complexity: O(n log n)
 * @param {Array} arr - Array to be sorted
 * @returns {Array} Sorted array
 */
function mergeSort(arr) {
    // Function to merge two sorted arrays
    function merge(left, right) {
        const result = [];
        let i = 0;
        let j = 0;

        // Merge the two sorted arrays
        while (i < left.length && j < right.length) {
            if (left[i] <= right[j]) {
                result.push(left[i++]);
            } else {
                result.push(right[j++]);
            }
        }

        // Add remaining elements
        return result.concat(left.slice(i)).concat(right.slice(j));
    }

    // Merge sort function
    function sort(arr) {
        const n = arr.length;

        // Base case: array with 0 or 1 element
        if (n <= 1) {
            return arr;
        }

        // Divide array into two halves
        const mid = Math.floor(n / 2);
        const left = arr.slice(0, mid);
        const right = arr.slice(mid);

        // Recursively sort and merge
        return merge(sort(left), sort(right));
    }

    return sort([...arr]); // Create a copy to avoid modifying the original array
}

/**
 * Quick Sort
 * Time complexity: O(n log n) average, O(n^2) worst case
 * @param {Array} arr - Array to be sorted
 * @returns {Array} Sorted array
 */
function quickSort(arr) {
    // Create a copy to avoid modifying the original array
    const result = [...arr];

    // Partition function
    function partition(arr, low, high) {
        // Choose pivot as the last element
        const pivot = arr[high];
        let i = low - 1;

        for (let j = low; j < high; j++) {
            // If current element is less than or equal to pivot
            if (arr[j] <= pivot) {
                i++;
                // Swap elements at indices i and j
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
        }

        // Swap elements at indices i+1 and high (place pivot in correct position)
        [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
        return i + 1;
    }

    // Quick sort function
    function sort(arr, low, high) {
        if (low < high) {
            // pi is the partition index, arr[pi] is already in correct position
            const pi = partition(arr, low, high);

            // Recursively sort elements before and after pivot
            sort(arr, low, pi - 1);
            sort(arr, pi + 1, high);
        }
        return arr;
    }

    return sort(result, 0, result.length - 1);
}

/**
 * Heap Sort
 * Time complexity: O(n log n)
 * @param {Array} arr - Array to be sorted
 * @returns {Array} Sorted array
 */
function heapSort(arr) {
    const result = [...arr]; // Create a copy to avoid modifying the original array
    const n = result.length;

    // Build heap (heapify)
    function heapify(arr, n, i) {
        let largest = i; // Initialize largest as root
        const left = 2 * i + 1; // Left child index = 2*i + 1
        const right = 2 * i + 2; // Right child index = 2*i + 2

        // If left child is greater than root
        if (left < n && arr[left] > arr[largest]) {
            largest = left;
        }

        // If right child is greater than root
        if (right < n && arr[right] > arr[largest]) {
            largest = right;
        }

        // If largest is not root
        if (largest !== i) {
            [arr[i], arr[largest]] = [arr[largest], arr[i]]; // Swap elements

            // Recursively heapify the affected subtree
            heapify(arr, n, largest);
        }
    }

    // Build max heap
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        heapify(result, n, i);
    }

    // One by one extract elements from heap
    for (let i = n - 1; i > 0; i--) {
        // Move current root to end
        [result[0], result[i]] = [result[i], result[0]];

        // Call max heapify on the reduced heap
        heapify(result, i, 0);
    }

    return result;
}

/**
 * Counting Sort
 * Time complexity: O(n + k) with k being the range of input elements
 * @param {Array} arr - Array to be sorted
 * @returns {Array} Sorted array
 */
function countingSort(arr) {
    if (arr.length === 0) return [];

    // Find the maximum and minimum elements
    const max = Math.max(...arr);
    const min = Math.min(...arr);
    const range = max - min + 1;

    // Create count array and initialize with 0
    const count = new Array(range).fill(0);
    const output = new Array(arr.length);

    // Count occurrences of each element
    for (let i = 0; i < arr.length; i++) {
        count[arr[i] - min]++;
    }

    // Update count[i] to contain the actual position of this value in output
    for (let i = 1; i < count.length; i++) {
        count[i] += count[i - 1];
    }

    // Build output array
    for (let i = arr.length - 1; i >= 0; i--) {
        output[count[arr[i] - min] - 1] = arr[i];
        count[arr[i] - min]--;
    }

    return output;
}

/**
 * Radix Sort
 * Time complexity: O(d * (n + b)) with d being the number of digits and b being the base
 * @param {Array} arr - Array to be sorted (only applies to non-negative integers)
 * @returns {Array} Sorted array
 */
function radixSort(arr) {
    if (arr.length === 0) return [];

    // Handle negative numbers
    const hasNegative = arr.some(x => x < 0);
    if (hasNegative) {
        // Separate into negative and positive arrays
        const negatives = arr.filter(x => x < 0).map(x => -x);
        const positives = arr.filter(x => x >= 0);

        // Sort absolute values of negative numbers
        const sortedNegatives = radixSort(negatives).map(x => -x).reverse();
        // Sort positive numbers
        const sortedPositives = positives.length ? radixSort(positives) : [];

        // Combine: negative (reversed) + positive
        return [...sortedNegatives, ...sortedPositives];
    }

    // Find the maximum number of digits
    const max = Math.max(...arr);
    let maxDigits = 0;
    if (max > 0) {
        maxDigits = Math.floor(Math.log10(max)) + 1;
    }

    // Create a copy to avoid modifying the original array
    let result = [...arr];

    // Radix sort
    for (let digit = 0; digit < maxDigits; digit++) {
        // Use counting sort for each digit
        const count = new Array(10).fill(0);
        const output = new Array(result.length);
        const divisor = Math.pow(10, digit);

        // Count occurrences of each digit
        for (let i = 0; i < result.length; i++) {
            const digitValue = Math.floor((result[i] / divisor) % 10);
            count[digitValue]++;
        }

        // Update count to contain the actual position
        for (let i = 1; i < 10; i++) {
            count[i] += count[i - 1];
        }

        // Build output array
        for (let i = result.length - 1; i >= 0; i--) {
            const digitValue = Math.floor((result[i] / divisor) % 10);
            output[count[digitValue] - 1] = result[i];
            count[digitValue]--;
        }

        result = output;
    }

    return result;
}

/**
 * Sắp xếp xô - Bucket Sort
 * Độ phức tạp thời gian: O(n + k) với k là số lượng buckets
 * @param {Array} arr - Mảng cần sắp xếp
 * @param {number} [bucketSize=5] - Kích thước xô
 * @returns {Array} Mảng đã sắp xếp
 */
function bucketSort(arr, bucketSize = 5) {
    if (arr.length === 0) return [];

    // Tìm giá trị lớn nhất và nhỏ nhất
    const min = Math.min(...arr);
    const max = Math.max(...arr);

    // Tạo bucket
    const bucketCount = Math.floor((max - min) / bucketSize) + 1;
    const buckets = new Array(bucketCount);
    for (let i = 0; i < bucketCount; i++) {
        buckets[i] = [];
    }

    // Phân phối các phần tử vào bucket
    for (const num of arr) {
        const bucketIndex = Math.floor((num - min) / bucketSize);
        buckets[bucketIndex].push(num);
    }

    // Sắp xếp từng bucket và ghép lại
    const result = [];
    for (const bucket of buckets) {
        if (bucket.length > 0) {
            // Sắp xếp từng bucket bằng insertion sort
            insertionSort(bucket);
            result.push(...bucket);
        }
    }

    return result;
}

/**
 * Sắp xếp Shell - Shell Sort
 * Độ phức tạp thời gian: phụ thuộc vào dãy khoảng cách, thường là O(n log^2 n)
 * @param {Array} arr - Mảng cần sắp xếp
 * @returns {Array} Mảng đã sắp xếp
 */
function shellSort(arr) {
    const n = arr.length;
    const result = [...arr]; // Tạo bản sao để không thay đổi mảng gốc

    // Bắt đầu với khoảng cách lớn, sau đó giảm dần
    for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
        // Thực hiện insertion sort với khoảng cách gap
        for (let i = gap; i < n; i++) {
            // Thêm arr[i] vào các phần tử đã được sắp xếp gap
            // Lưu arr[i] trong temp và tạo lỗ hổng tại vị trí i
            const temp = result[i];

            // Dịch chuyển các phần tử đã sắp xếp gap cho đến khi tìm thấy vị trí đúng cho temp
            let j;
            for (j = i; j >= gap && result[j - gap] > temp; j -= gap) {
                result[j] = result[j - gap];
            }

            // Đặt temp vào vị trí đúng
            result[j] = temp;
        }
    }

    return result;
}

// Kiểm thử với một mảng
function testSortingAlgorithms() {
    // Mảng test
    const testArray = [64, 34, 25, 12, 22, 11, 90];

    console.log("Mảng ban đầu:", testArray);
    console.log("Bubble Sort:", bubbleSort(testArray));
    console.log("Selection Sort:", selectionSort(testArray));
    console.log("Insertion Sort:", insertionSort(testArray));
    console.log("Merge Sort:", mergeSort(testArray));
    console.log("Quick Sort:", quickSort(testArray));
    console.log("Heap Sort:", heapSort(testArray));
    console.log("Counting Sort:", countingSort(testArray));
    console.log("Radix Sort:", radixSort(testArray));
    console.log("Bucket Sort:", bucketSort(testArray));
    console.log("Shell Sort:", shellSort(testArray));
}

// Xuất các thuật toán
module.exports = {
    bubbleSort,
    selectionSort,
    insertionSort,
    mergeSort,
    quickSort,
    heapSort,
    countingSort,
    radixSort,
    bucketSort,
    shellSort,
    testSortingAlgorithms
};