#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <math.h>

/**
 * Bubble Sort
 * Time complexity: O(n^2)
 */
void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        // Flag to optimize for already sorted arrays
        int swapped = 0;

        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                // Swap elements
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
                swapped = 1;
            }
        }

        // If no elements were swapped in this iteration, the array is already sorted
        if (swapped == 0) {
            break;
        }
    }
}

/**
 * Selection Sort
 * Time complexity: O(n^2)
 */
void selectionSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        // Find the smallest element in the unsorted part
        int min_idx = i;

        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[min_idx]) {
                min_idx = j;
            }
        }

        // Swap the smallest element with the first element in the unsorted part
        if (min_idx != i) {
            int temp = arr[i];
            arr[i] = arr[min_idx];
            arr[min_idx] = temp;
        }
    }
}

/**
 * Insertion Sort
 * Time complexity: O(n^2)
 */
void insertionSort(int arr[], int n) {
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;

        // Move elements greater than key to the right by one position
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }

        arr[j + 1] = key;
    }
}

/**
 * Merge two sorted subarrays - helper function for Merge Sort
 */
void merge(int arr[], int l, int m, int r) {
    int i, j, k;
    int n1 = m - l + 1;
    int n2 = r - m;

    // Create temporary arrays
    int L[n1], R[n2];

    // Copy data into temporary arrays
    for (i = 0; i < n1; i++) {
        L[i] = arr[l + i];
    }
    for (j = 0; j < n2; j++) {
        R[j] = arr[m + 1 + j];
    }

    // Merge the temporary arrays
    i = 0; // Initial index of first subarray
    j = 0; // Initial index of second subarray
    k = l; // Initial index of merged subarray

    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) {
            arr[k] = L[i];
            i++;
        } else {
            arr[k] = R[j];
            j++;
        }
        k++;
    }

    // Copy remaining elements of L[] if any
    while (i < n1) {
        arr[k] = L[i];
        i++;
        k++;
    }

    // Copy remaining elements of R[] if any
    while (j < n2) {
        arr[k] = R[j];
        j++;
        k++;
    }
}

/**
 * Merge Sort
 * Time complexity: O(n log n)
 */
void mergeSort(int arr[], int l, int r) {
    if (l < r) {
        // Find the middle point
        int m = l + (r - l) / 2;

        // Sort first and second halves
        mergeSort(arr, l, m);
        mergeSort(arr, m + 1, r);

        // Merge the sorted halves
        merge(arr, l, m, r);
    }
}

/**
 * Utility function to call mergeSort
 */
void mergeSortWrapper(int arr[], int n) {
    mergeSort(arr, 0, n - 1);
}

/**
 * Partition function - helper function for Quick Sort
 */
int partition(int arr[], int low, int high) {
    // Choose pivot as the last element
    int pivot = arr[high];
    int i = (low - 1); // Index of the smaller element

    for (int j = low; j <= high - 1; j++) {
        // If current element is less than or equal to pivot
        if (arr[j] <= pivot) {
            i++; // Increment index of smaller element

            // Swap arr[i] and arr[j]
            int temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
    }

    // Swap arr[i + 1] and arr[high] (place pivot in the correct position)
    int temp = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = temp;

    return (i + 1);
}

/**
 * Quick Sort
 * Time complexity: O(n log n) average, O(n^2) worst case
 */
void quickSort(int arr[], int low, int high) {
    if (low < high) {
        // pi is the partition index, arr[pi] is already in the correct position
        int pi = partition(arr, low, high);

        // Recursively sort elements before and after partition
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}

/**
 * Utility function to call quickSort
 */
void quickSortWrapper(int arr[], int n) {
    quickSort(arr, 0, n - 1);
}

/**
 * Heapify function - helper function for Heap Sort
 */
void heapify(int arr[], int n, int i) {
    int largest = i; // Initialize largest as root
    int left = 2 * i + 1; // Left child index = 2*i + 1
    int right = 2 * i + 2; // Right child index = 2*i + 2

    // If left child is greater than root
    if (left < n && arr[left] > arr[largest]) {
        largest = left;
    }

    // If right child is greater than root
    if (right < n && arr[right] > arr[largest]) {
        largest = right;
    }

    // If largest is not root
    if (largest != i) {
        // Swap i and largest
        int temp = arr[i];
        arr[i] = arr[largest];
        arr[largest] = temp;

        // Heapify recursively on the affected child subtree
        heapify(arr, n, largest);
    }
}

/**
 * Heap Sort
 * Time complexity: O(n log n)
 */
void heapSort(int arr[], int n) {
    // Build heap (heapify)
    for (int i = n / 2 - 1; i >= 0; i--) {
        heapify(arr, n, i);
    }

    // One by one extract elements from heap
    for (int i = n - 1; i > 0; i--) {
        // Move current root to end
        int temp = arr[0];
        arr[0] = arr[i];
        arr[i] = temp;

        // Call max heapify on the reduced heap
        heapify(arr, i, 0);
    }
}

/**
 * Counting Sort
 * Time complexity: O(n + k) with k being the range of input elements
 */
void countingSort(int arr[], int n) {
    // Find the maximum and minimum elements
    int max = arr[0];
    int min = arr[0];
    for (int i = 1; i < n; i++) {
        if (arr[i] > max) {
            max = arr[i];
        }
        if (arr[i] < min) {
            min = arr[i];
        }
    }

    int range = max - min + 1;

    // Create count array and result array
    int* count = (int*)calloc(range, sizeof(int));
    int* output = (int*)malloc(n * sizeof(int));

    // Count occurrences of each element
    for (int i = 0; i < n; i++) {
        count[arr[i] - min]++;
    }

    // Update count[i] to contain the actual position of this value in output
    for (int i = 1; i < range; i++) {
        count[i] += count[i - 1];
    }

    // Build output array
    for (int i = n - 1; i >= 0; i--) {
        output[count[arr[i] - min] - 1] = arr[i];
        count[arr[i] - min]--;
    }

    // Copy output array to arr
    for (int i = 0; i < n; i++) {
        arr[i] = output[i];
    }

    // Free memory
    free(count);
    free(output);
}

/**
 * Utility function for Radix Sort - sorting based on the digit at position exp
 */
void countingSortForRadix(int arr[], int n, int exp) {
    int output[n];
    int count[10] = {0}; // 0-9 digits

    // Count occurrences of each digit
    for (int i = 0; i < n; i++) {
        count[(arr[i] / exp) % 10]++;
    }

    // Update count to contain the actual position of this value in output
    for (int i = 1; i < 10; i++) {
        count[i] += count[i - 1];
    }

    // Build output array
    for (int i = n - 1; i >= 0; i--) {
        int digit = (arr[i] / exp) % 10;
        output[count[digit] - 1] = arr[i];
        count[digit]--;
    }

    // Copy output array to arr
    for (int i = 0; i < n; i++) {
        arr[i] = output[i];
    }
}

/**
 * Radix Sort
 * Time complexity: O(d * (n + b)) with d being the number of digits and b being the base
 * Note: This algorithm only works with non-negative integers
 */
void radixSort(int arr[], int n) {
    // Check if array is empty
    if (n <= 1) return;

    // Separate array into negative and positive parts for separate handling
    int hasNegative = 0;
    for (int i = 0; i < n; i++) {
        if (arr[i] < 0) {
            hasNegative = 1;
            break;
        }
    }

    if (hasNegative) {
        // Count number of negative and positive numbers
        int countNeg = 0;
        for (int i = 0; i < n; i++) {
            if (arr[i] < 0) countNeg++;
        }
        int countPos = n - countNeg;

        // Create separate arrays for negative and positive numbers
        int* negArr = (int*)malloc(countNeg * sizeof(int));
        int* posArr = (int*)malloc(countPos * sizeof(int));

        // Separate array
        int negIdx = 0, posIdx = 0;
        for (int i = 0; i < n; i++) {
            if (arr[i] < 0) {
                negArr[negIdx++] = -arr[i]; // Get absolute value
            } else {
                posArr[posIdx++] = arr[i];
            }
        }

        // Sort negative and positive arrays using radixSort
        if (countNeg > 0) radixSort(negArr, countNeg);
        if (countPos > 0) radixSort(posArr, countPos);

        // Combine results
        for (int i = 0; i < countNeg; i++) {
            arr[i] = -negArr[countNeg - 1 - i]; // Reverse and change sign
        }
        for (int i = 0; i < countPos; i++) {
            arr[countNeg + i] = posArr[i];
        }

        // Free memory
        free(negArr);
        free(posArr);

        return;
    }

    // Find the largest number to know the number of digits
    int max = arr[0];
    for (int i = 1; i < n; i++) {
        if (arr[i] > max) {
            max = arr[i];
        }
    }

    // Perform counting sort for each digit
    for (int exp = 1; max / exp > 0; exp *= 10) {
        countingSortForRadix(arr, n, exp);
    }
}

/**
 * Bucket Sort
 * Time complexity: O(n + k) with k being the number of buckets
 */
void bucketSort(int arr[], int n) {
    if (n <= 0) return;

    // Find the largest and smallest values
    int max = arr[0];
    int min = arr[0];
    for (int i = 1; i < n; i++) {
        if (arr[i] > max) max = arr[i];
        if (arr[i] < min) min = arr[i];
    }

    // Calculate the range and number of buckets
    int range = max - min + 1;
    int bucketCount = (n < 10) ? n : 10; // Number of buckets, maximum 10
    double bucketSize = (double)range / bucketCount;

    // Create array of buckets
    int** buckets = (int**)malloc(bucketCount * sizeof(int*));
    int* bucketSizes = (int*)calloc(bucketCount, sizeof(int));

    // Initialize buckets with initial size of 0
    for (int i = 0; i < bucketCount; i++) {
        buckets[i] = (int*)malloc(n * sizeof(int)); // Maximum size is n
    }

    // Distribute elements into buckets
    for (int i = 0; i < n; i++) {
        int bucketIndex = (int)((arr[i] - min) / bucketSize);
        if (bucketIndex >= bucketCount) bucketIndex = bucketCount - 1;
        buckets[bucketIndex][bucketSizes[bucketIndex]++] = arr[i];
    }

    // Sort each bucket and merge
    int arrIndex = 0;
    for (int i = 0; i < bucketCount; i++) {
        if (bucketSizes[i] > 0) {
            // Sort bucket using insertion sort
            for (int j = 1; j < bucketSizes[i]; j++) {
                int key = buckets[i][j];
                int k = j - 1;
                while (k >= 0 && buckets[i][k] > key) {
                    buckets[i][k + 1] = buckets[i][k];
                    k--;
                }
                buckets[i][k + 1] = key;
            }

            // Add sorted elements from bucket to the original array
            for (int j = 0; j < bucketSizes[i]; j++) {
                arr[arrIndex++] = buckets[i][j];
            }
        }
    }

    // Free memory
    for (int i = 0; i < bucketCount; i++) {
        free(buckets[i]);
    }
    free(buckets);
    free(bucketSizes);
}

/**
 * Shell Sort
 * Time complexity: depends on the gap sequence, usually O(n log^2 n)
 */
void shellSort(int arr[], int n) {
    // Start with large gap, then decrease
    for (int gap = n/2; gap > 0; gap /= 2) {
        // Perform insertion sort with gap
        for (int i = gap; i < n; i++) {
            // Add arr[i] to the sorted elements with gap
            // Save arr[i] in temp and create a gap at position i
            int temp = arr[i];

            // Shift the sorted elements with gap until the correct position for temp is found
            int j;
            for (j = i; j >= gap && arr[j - gap] > temp; j -= gap) {
                arr[j] = arr[j - gap];
            }

            // Place temp (original arr[i]) in the correct position
            arr[j] = temp;
        }
    }
}

/**
 * Utility function to print array
 */
void printArray(int arr[], int n) {
    for (int i = 0; i < n; i++) {
        printf("%d ", arr[i]);
    }
    printf("\n");
}

/**
 * Utility function to copy array
 */
void copyArray(int source[], int dest[], int n) {
    for (int i = 0; i < n; i++) {
        dest[i] = source[i];
    }
}

/**
 * Main function to test sorting algorithms
 */
int main() {
    // Test array
    int arr[] = {64, 34, 25, 12, 22, 11, 90};
    int n = sizeof(arr) / sizeof(arr[0]);
    int arrCopy[n];

    printf("Original array: ");
    printArray(arr, n);

    // Bubble Sort
    copyArray(arr, arrCopy, n);
    bubbleSort(arrCopy, n);
    printf("Bubble Sort: ");
    printArray(arrCopy, n);

    // Selection Sort
    copyArray(arr, arrCopy, n);
    selectionSort(arrCopy, n);
    printf("Selection Sort: ");
    printArray(arrCopy, n);

    // Insertion Sort
    copyArray(arr, arrCopy, n);
    insertionSort(arrCopy, n);
    printf("Insertion Sort: ");
    printArray(arrCopy, n);

    // Merge Sort
    copyArray(arr, arrCopy, n);
    mergeSortWrapper(arrCopy, n);
    printf("Merge Sort: ");
    printArray(arrCopy, n);

    // Quick Sort
    copyArray(arr, arrCopy, n);
    quickSortWrapper(arrCopy, n);
    printf("Quick Sort: ");
    printArray(arrCopy, n);

    // Heap Sort
    copyArray(arr, arrCopy, n);
    heapSort(arrCopy, n);
    printf("Heap Sort: ");
    printArray(arrCopy, n);

    // Counting Sort
    copyArray(arr, arrCopy, n);
    countingSort(arrCopy, n);
    printf("Counting Sort: ");
    printArray(arrCopy, n);

    // Radix Sort
    copyArray(arr, arrCopy, n);
    radixSort(arrCopy, n);
    printf("Radix Sort: ");
    printArray(arrCopy, n);

    // Bucket Sort
    copyArray(arr, arrCopy, n);
    bucketSort(arrCopy, n);
    printf("Bucket Sort: ");
    printArray(arrCopy, n);

    // Shell Sort
    copyArray(arr, arrCopy, n);
    shellSort(arrCopy, n);
    printf("Shell Sort: ");
    printArray(arrCopy, n);

    return 0;
}