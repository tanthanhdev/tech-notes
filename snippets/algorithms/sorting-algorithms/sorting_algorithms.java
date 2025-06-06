import java.util.Arrays;
import java.util.ArrayList;
import java.util.List;
import java.util.Collections;

/**
 * Collection of popular sorting algorithms implemented in Java
 */
public class SortingAlgorithms {

    /**
     * Bubble Sort
     * Time complexity: O(n^2)
     *
     * @param arr Array to be sorted
     * @return Sorted array
     */
    public static int[] bubbleSort(int[] arr) {
        int[] result = Arrays.copyOf(arr, arr.length);
        int n = result.length;

        for (int i = 0; i < n - 1; i++) {
            // Flag to optimize for already sorted arrays
            boolean swapped = false;

            for (int j = 0; j < n - i - 1; j++) {
                if (result[j] > result[j + 1]) {
                    // Swap elements
                    int temp = result[j];
                    result[j] = result[j + 1];
                    result[j + 1] = temp;
                    swapped = true;
                }
            }

            // If no elements were swapped in this pass, the array is already sorted
            if (!swapped) break;
        }

        return result;
    }

    /**
     * Selection Sort
     * Time complexity: O(n^2)
     *
     * @param arr Array to be sorted
     * @return Sorted array
     */
    public static int[] selectionSort(int[] arr) {
        int[] result = Arrays.copyOf(arr, arr.length);
        int n = result.length;

        for (int i = 0; i < n - 1; i++) {
            // Find the smallest element in the unsorted part of the array
            int minIdx = i;

            for (int j = i + 1; j < n; j++) {
                if (result[j] < result[minIdx]) {
                    minIdx = j;
                }
            }

            // Swap the smallest element with the first element in the unsorted part
            int temp = result[minIdx];
            result[minIdx] = result[i];
            result[i] = temp;
        }

        return result;
    }

    /**
     * Insertion Sort
     * Time complexity: O(n^2)
     *
     * @param arr Array to be sorted
     * @return Sorted array
     */
    public static int[] insertionSort(int[] arr) {
        int[] result = Arrays.copyOf(arr, arr.length);
        int n = result.length;

        for (int i = 1; i < n; i++) {
            int key = result[i];
            int j = i - 1;

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
     *
     * @param arr Array to be sorted
     * @return Sorted array
     */
    public static int[] mergeSort(int[] arr) {
        int[] result = Arrays.copyOf(arr, arr.length);
        mergeSort(result, 0, result.length - 1);
        return result;
    }

    private static void mergeSort(int[] arr, int left, int right) {
        if (left < right) {
            // Find the middle point
            int mid = left + (right - left) / 2;

            // Sort first and second halves
            mergeSort(arr, left, mid);
            mergeSort(arr, mid + 1, right);

            // Merge the sorted halves
            merge(arr, left, mid, right);
        }
    }

    private static void merge(int[] arr, int left, int mid, int right) {
        // Find the size of the two subarrays to merge
        int n1 = mid - left + 1;
        int n2 = right - mid;

        // Create temporary arrays
        int[] L = new int[n1];
        int[] R = new int[n2];

        // Copy data into temporary arrays
        for (int i = 0; i < n1; i++) {
            L[i] = arr[left + i];
        }
        for (int j = 0; j < n2; j++) {
            R[j] = arr[mid + 1 + j];
        }

        // Merge the temporary arrays
        int i = 0, j = 0;
        int k = left;

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
     * Quick Sort
     * Time complexity: O(n log n) average, O(n^2) worst case
     *
     * @param arr Array to be sorted
     * @return Sorted array
     */
    public static int[] quickSort(int[] arr) {
        int[] result = Arrays.copyOf(arr, arr.length);
        quickSort(result, 0, result.length - 1);
        return result;
    }

    private static void quickSort(int[] arr, int low, int high) {
        if (low < high) {
            // pi is the partition index, arr[pi] is already in the correct position
            int pi = partition(arr, low, high);

            // Recursively sort elements before and after pivot
            quickSort(arr, low, pi - 1);
            quickSort(arr, pi + 1, high);
        }
    }

    private static int partition(int[] arr, int low, int high) {
        // Choose pivot as the last element
        int pivot = arr[high];
        int i = low - 1; // Index of the element smaller than pivot

        for (int j = low; j < high; j++) {
            // If current element is less than or equal to pivot
            if (arr[j] <= pivot) {
                i++;

                // Swap arr[i] and arr[j]
                int temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
            }
        }

        // Swap arr[i+1] and arr[high] (place pivot in the correct position)
        int temp = arr[i + 1];
        arr[i + 1] = arr[high];
        arr[high] = temp;

        return i + 1;
    }

    /**
     * Heap Sort
     * Time complexity: O(n log n)
     *
     * @param arr Array to be sorted
     * @return Sorted array
     */
    public static int[] heapSort(int[] arr) {
        int[] result = Arrays.copyOf(arr, arr.length);
        int n = result.length;

        // Build heap (heapify)
        for (int i = n / 2 - 1; i >= 0; i--) {
            heapify(result, n, i);
        }

        // One by one extract an element from heap
        for (int i = n - 1; i > 0; i--) {
            // Move current root to end
            int temp = result[0];
            result[0] = result[i];
            result[i] = temp;

            // Call max heapify on the reduced heap
            heapify(result, i, 0);
        }

        return result;
    }

    private static void heapify(int[] arr, int n, int i) {
        int largest = i; // Initialize largest as root
        int left = 2 * i + 1; // Left child index = 2*i + 1
        int right = 2 * i + 2; // Right child index = 2*i + 2

        // If left child is larger than root
        if (left < n && arr[left] > arr[largest]) {
            largest = left;
        }

        // If right child is larger than root
        if (right < n && arr[right] > arr[largest]) {
            largest = right;
        }

        // If largest is not root
        if (largest != i) {
            int swap = arr[i];
            arr[i] = arr[largest];
            arr[largest] = swap;

            // Recursively heapify the affected sub-tree
            heapify(arr, n, largest);
        }
    }

    /**
     * Counting Sort
     * Time complexity: O(n + k) with k being the range of input elements
     *
     * @param arr Array to be sorted
     * @return Sorted array
     */
    public static int[] countingSort(int[] arr) {
        if (arr.length == 0) return new int[0];

        // Find the largest and smallest elements
        int max = arr[0], min = arr[0];
        for (int i = 1; i < arr.length; i++) {
            if (arr[i] > max) max = arr[i];
            if (arr[i] < min) min = arr[i];
        }

        int range = max - min + 1;

        // Create count array and output array
        int[] count = new int[range];
        int[] output = new int[arr.length];

        // Count occurrences of each element
        for (int i = 0; i < arr.length; i++) {
            count[arr[i] - min]++;
        }

        // Update count[i] to contain the actual position of this value in output
        for (int i = 1; i < count.length; i++) {
            count[i] += count[i - 1];
        }

        // Build output array
        for (int i = arr.length - 1; i >= 0; i--) {
            output[count[arr[i] - min] - 1] = arr[i];
            count[arr[i] - min]--;
        }

        return output;
    }

    /**
     * Radix Sort
     * Time complexity: O(d * (n + b)) with d being the number of digits in the largest number, b being the base
     *
     * @param arr Array to be sorted (only applies to non-negative integers)
     * @return Sorted array
     */
    public static int[] radixSort(int[] arr) {
        if (arr.length == 0) return new int[0];

        // Check for negative numbers
        boolean hasNegative = false;
        for (int i = 0; i < arr.length; i++) {
            if (arr[i] < 0) {
                hasNegative = true;
                break;
            }
        }

        if (hasNegative) {
            // Separate into negative and positive lists
            List<Integer> negatives = new ArrayList<>();
            List<Integer> positives = new ArrayList<>();

            for (int value : arr) {
                if (value < 0) {
                    negatives.add(-value); // Get absolute value
                } else {
                    positives.add(value);
                }
            }

            // Convert list to array
            int[] negArray = new int[negatives.size()];
            for (int i = 0; i < negatives.size(); i++) {
                negArray[i] = negatives.get(i);
            }

            int[] posArray = new int[positives.size()];
            for (int i = 0; i < positives.size(); i++) {
                posArray[i] = positives.get(i);
            }

            // Sort each array
            int[] sortedNegs = radixSort(negArray);
            int[] sortedPos = posArray.length > 0 ? radixSort(posArray) : new int[0];

            // Combine: negative (reverse and sign) + positive
            int[] result = new int[arr.length];
            int index = 0;

            // Add negative (reverse and sign)
            for (int i = sortedNegs.length - 1; i >= 0; i--) {
                result[index++] = -sortedNegs[i];
            }

            // Add positive
            for (int i = 0; i < sortedPos.length; i++) {
                result[index++] = sortedPos[i];
            }

            return result;
        }

        // Case with only non-negative numbers
        int[] result = Arrays.copyOf(arr, arr.length);

        // Find the largest number to know the number of digits
        int max = getMax(result);

        // Perform counting sort for each digit
        for (int exp = 1; max / exp > 0; exp *= 10) {
            countingSortByDigit(result, exp);
        }

        return result;
    }

    private static void countingSortByDigit(int[] arr, int exp) {
        int n = arr.length;
        int[] output = new int[n];
        int[] count = new int[10]; // 0-9 digits

        // Count occurrences of each digit
        for (int i = 0; i < n; i++) {
            count[(arr[i] / exp) % 10]++;
        }

        // Update count to contain the actual position
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

    private static int getMax(int[] arr) {
        int max = arr[0];
        for (int i = 1; i < arr.length; i++) {
            if (arr[i] > max) {
                max = arr[i];
            }
        }
        return max;
    }

    /**
     * Bucket Sort
     * Time complexity: O(n + k) with k being the number of buckets
     *
     * @param arr Array to be sorted
     * @return Sorted array
     */
    public static int[] bucketSort(int[] arr) {
        return bucketSort(arr, 5); // Default 5 elements per bucket
    }

    public static int[] bucketSort(int[] arr, int bucketSize) {
        if (arr.length == 0) return new int[0];

        // Find the largest and smallest values
        int minValue = arr[0];
        int maxValue = arr[0];

        for (int i = 1; i < arr.length; i++) {
            if (arr[i] < minValue) {
                minValue = arr[i];
            } else if (arr[i] > maxValue) {
                maxValue = arr[i];
            }
        }

        // Create buckets
        int bucketCount = (maxValue - minValue) / bucketSize + 1;
        List<List<Integer>> buckets = new ArrayList<>(bucketCount);
        for (int i = 0; i < bucketCount; i++) {
            buckets.add(new ArrayList<>());
        }

        // Distribute elements into buckets
        for (int i = 0; i < arr.length; i++) {
            int bucketIndex = (arr[i] - minValue) / bucketSize;
            buckets.get(bucketIndex).add(arr[i]);
        }

        // Sort each bucket and combine
        int[] result = new int[arr.length];
        int currentIndex = 0;

        for (int i = 0; i < buckets.size(); i++) {
            List<Integer> bucket = buckets.get(i);
            if (bucket.isEmpty()) {
                continue;
            }

            // Sort bucket
            Collections.sort(bucket);

            // Add sorted elements from bucket to result
            for (int j = 0; j < bucket.size(); j++) {
                result[currentIndex++] = bucket.get(j);
            }
        }

        return result;
    }

    /**
     * Shell Sort
     * Time complexity: depends on the gap sequence, typically O(n log^2 n)
     *
     * @param arr Array to be sorted
     * @return Sorted array
     */
    public static int[] shellSort(int[] arr) {
        int[] result = Arrays.copyOf(arr, arr.length);
        int n = result.length;

        // Start with large gap, then decrease
        for (int gap = n/2; gap > 0; gap /= 2) {
            // Perform insertion sort with gap
            for (int i = gap; i < n; i++) {
                // Add arr[i] to the sorted gap elements
                // Save arr[i] in temp and create a hole at position i
                int temp = result[i];

                // Shift sorted gap elements until the correct position for temp is found
                int j;
                for (j = i; j >= gap && result[j - gap] > temp; j -= gap) {
                    result[j] = result[j - gap];
                }

                // Place temp in the correct position
                result[j] = temp;
            }
        }

        return result;
    }

    /**
     * Main method to test sorting algorithms
     */
    public static void main(String[] args) {
        // Test array
        int[] testArray = {64, 34, 25, 12, 22, 11, 90};

        System.out.println("Original array: " + Arrays.toString(testArray));
        System.out.println("Bubble Sort: " + Arrays.toString(bubbleSort(testArray)));
        System.out.println("Selection Sort: " + Arrays.toString(selectionSort(testArray)));
        System.out.println("Insertion Sort: " + Arrays.toString(insertionSort(testArray)));
        System.out.println("Merge Sort: " + Arrays.toString(mergeSort(testArray)));
        System.out.println("Quick Sort: " + Arrays.toString(quickSort(testArray)));
        System.out.println("Heap Sort: " + Arrays.toString(heapSort(testArray)));
        System.out.println("Counting Sort: " + Arrays.toString(countingSort(testArray)));
        System.out.println("Radix Sort: " + Arrays.toString(radixSort(testArray)));
        System.out.println("Bucket Sort: " + Arrays.toString(bucketSort(testArray)));
        System.out.println("Shell Sort: " + Arrays.toString(shellSort(testArray)));
    }
}