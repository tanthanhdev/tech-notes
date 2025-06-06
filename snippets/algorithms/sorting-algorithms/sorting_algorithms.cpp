#include <iostream>
#include <vector>
#include <algorithm>
#include <cmath>
#include <list>

/**
 * Collection of popular sorting algorithms implemented in C++
 */
class SortingAlgorithms {
public:
    /**
     * Bubble Sort
     * Time complexity: O(n^2)
     */
    static std::vector<int> bubbleSort(const std::vector<int>& arr) {
        std::vector<int> result = arr; // Create a copy to avoid modifying the original array
        int n = result.size();

        for (int i = 0; i < n - 1; i++) {
            // Flag to optimize for already sorted arrays
            bool swapped = false;

            for (int j = 0; j < n - i - 1; j++) {
                if (result[j] > result[j + 1]) {
                    // Swap elements
                    std::swap(result[j], result[j + 1]);
                    swapped = true;
                }
            }

            // If no elements were swapped in this loop, the array is already sorted
            if (!swapped) break;
        }

        return result;
    }

    /**
     * Selection Sort
     * Time complexity: O(n^2)
     */
    static std::vector<int> selectionSort(const std::vector<int>& arr) {
        std::vector<int> result = arr; // Create a copy to avoid modifying the original array
        int n = result.size();

        for (int i = 0; i < n - 1; i++) {
            // Find the minimum element in the unsorted part of the array
            int minIdx = i;

            for (int j = i + 1; j < n; j++) {
                if (result[j] < result[minIdx]) {
                    minIdx = j;
                }
            }

            // Swap the minimum element with the first element of the unsorted part
            if (minIdx != i) {
                std::swap(result[i], result[minIdx]);
            }
        }

        return result;
    }

    /**
     * Insertion Sort
     * Time complexity: O(n^2)
     */
    static std::vector<int> insertionSort(const std::vector<int>& arr) {
        std::vector<int> result = arr; // Create a copy to avoid modifying the original array
        int n = result.size();

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
     */
    static std::vector<int> mergeSort(const std::vector<int>& arr) {
        std::vector<int> result = arr; // Create a copy to avoid modifying the original array

        if (result.size() <= 1) return result;

        mergeSort(result, 0, result.size() - 1);
        return result;
    }

private:
    /**
     * Helper function for Merge Sort
     */
    static void mergeSort(std::vector<int>& arr, int left, int right) {
        if (left >= right) return;

        // Find the middle point
        int mid = left + (right - left) / 2;

        // Sort first and second halves
        mergeSort(arr, left, mid);
        mergeSort(arr, mid + 1, right);

        // Merge the sorted halves
        merge(arr, left, mid, right);
    }

    /**
     * Merge two sorted subarrays
     */
    static void merge(std::vector<int>& arr, int left, int mid, int right) {
        // Find the sizes of two subarrays to be merged
        int n1 = mid - left + 1;
        int n2 = right - mid;

        // Create temporary arrays
        std::vector<int> L(n1);
        std::vector<int> R(n2);

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

        // Sao chép các phần tử còn lại của R[] nếu có
        while (j < n2) {
            arr[k] = R[j];
            j++;
            k++;
        }
    }

public:
    /**
     * Quick Sort
     * Time complexity: O(n log n) average, O(n^2) worst case
     */
    static std::vector<int> quickSort(const std::vector<int>& arr) {
        std::vector<int> result = arr; // Create a copy to avoid modifying the original array

        if (result.size() <= 1) return result;

        quickSort(result, 0, result.size() - 1);
        return result;
    }

private:
    /**
     * Partition function for Quick Sort
     */
    static int partition(std::vector<int>& arr, int low, int high) {
        // Select the last element as pivot
        int pivot = arr[high];
        int i = low - 1;

        for (int j = low; j < high; j++) {
            // If the current element is less than or equal to pivot
            if (arr[j] <= pivot) {
                i++;
                std::swap(arr[i], arr[j]);
            }
        }

        std::swap(arr[i + 1], arr[high]);
        return i + 1;
    }

    /**
     * Helper function for Quick Sort
     */
    static void quickSort(std::vector<int>& arr, int low, int high) {
        if (low < high) {
            // pi is the partition index, arr[pi] is already in the correct position
            int pi = partition(arr, low, high);

            // Recursively sort elements before and after pivot
            quickSort(arr, low, pi - 1);
            quickSort(arr, pi + 1, high);
        }
    }

public:
    /**
     * Heap Sort
     * Time complexity: O(n log n)
     */
    static std::vector<int> heapSort(const std::vector<int>& arr) {
        std::vector<int> result = arr; // Create a copy to avoid modifying the original array
        int n = result.size();

        // Build heap (heapify)
        for (int i = n / 2 - 1; i >= 0; i--) {
            heapify(result, n, i);
        }

        // One by one extract an element from heap
        for (int i = n - 1; i > 0; i--) {
            // Move current root to end
            std::swap(result[0], result[i]);

            // Call max heapify on the reduced heap
            heapify(result, i, 0);
        }

        return result;
    }

private:
    /**
     * Heapify function for Heap Sort
     */
    static void heapify(std::vector<int>& arr, int n, int i) {
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
            std::swap(arr[i], arr[largest]);

            // Recursively heapify the affected sub-tree
            heapify(arr, n, largest);
        }
    }

public:
    /**
     * Counting Sort
     * Time complexity: O(n + k) with k being the range of input values
     */
    static std::vector<int> countingSort(const std::vector<int>& arr) {
        if (arr.empty()) return {};

        // Find the maximum and minimum elements
        int max = *std::max_element(arr.begin(), arr.end());
        int min = *std::min_element(arr.begin(), arr.end());
        int range = max - min + 1;

        std::vector<int> count(range, 0);
        std::vector<int> output(arr.size());

        // Count the occurrences of each element
        for (int i = 0; i < arr.size(); i++) {
            count[arr[i] - min]++;
        }

        // Update count[i] to contain the actual position of this value in output
        for (int i = 1; i < count.size(); i++) {
            count[i] += count[i - 1];
        }

        // Build the output array
        for (int i = arr.size() - 1; i >= 0; i--) {
            output[count[arr[i] - min] - 1] = arr[i];
            count[arr[i] - min]--;
        }

        return output;
    }

    /**
     * Radix Sort
     * Time complexity: O(d * (n + b)) with d being the number of digits in the largest number, b being the base
     */
    static std::vector<int> radixSort(const std::vector<int>& arr) {
        if (arr.empty()) return {};

        // Check for negative numbers
        bool hasNegative = false;
        for (int num : arr) {
            if (num < 0) {
                hasNegative = true;
                break;
            }
        }

        if (hasNegative) {
            // Split into negative and positive lists
            std::vector<int> negatives;
            std::vector<int> positives;

            for (int num : arr) {
                if (num < 0) {
                    negatives.push_back(-num); // Get the absolute value
                } else {
                    positives.push_back(num);
                }
            }

            // Sort the absolute values of negative numbers
            auto sortedNegatives = radixSort(negatives);
            // Sort positive numbers
            auto sortedPositives = radixSort(positives);

            // Combine: negative numbers (reversed and signed) + positive numbers
            std::vector<int> result;
            for (int i = sortedNegatives.size() - 1; i >= 0; i--) {
                result.push_back(-sortedNegatives[i]);
            }
            result.insert(result.end(), sortedPositives.begin(), sortedPositives.end());

            return result;
        }

        // Find the maximum number of digits
        int max = *std::max_element(arr.begin(), arr.end());
        std::vector<int> result = arr;

        // Perform counting sort for each digit
        for (int exp = 1; max / exp > 0; exp *= 10) {
            countingSortByDigit(result, exp);
        }

        return result;
    }

private:
    /**
     * Helper function for Radix Sort - sort based on the digit at position exp
     */
    static void countingSortByDigit(std::vector<int>& arr, int exp) {
        int n = arr.size();
        std::vector<int> output(n);
        std::vector<int> count(10, 0); // 0-9 digits

        // Count the occurrences of each digit
        for (int i = 0; i < n; i++) {
            int digit = (arr[i] / exp) % 10;
            count[digit]++;
        }

        // Update count to contain the actual position
        for (int i = 1; i < 10; i++) {
            count[i] += count[i - 1];
        }

        // Build the output array
        for (int i = n - 1; i >= 0; i--) {
            int digit = (arr[i] / exp) % 10;
            output[count[digit] - 1] = arr[i];
            count[digit]--;
        }

        // Copy the output array to arr
        for (int i = 0; i < n; i++) {
            arr[i] = output[i];
        }
    }

public:
    /**
     * Bucket Sort
     * Time complexity: O(n + k) with k being the number of buckets
     */
    static std::vector<int> bucketSort(const std::vector<int>& arr, int bucketCount = 10) {
        if (arr.empty()) return {};

        // Find the maximum and minimum values
        int minVal = *std::min_element(arr.begin(), arr.end());
        int maxVal = *std::max_element(arr.begin(), arr.end());

        // Create buckets
        double range = (maxVal - minVal + 1) / static_cast<double>(bucketCount);
        std::vector<std::list<int>> buckets(bucketCount);

        // Distribute elements into buckets
        for (int num : arr) {
            int bucketIndex = static_cast<int>((num - minVal) / range);
            if (bucketIndex >= bucketCount) bucketIndex = bucketCount - 1;
            buckets[bucketIndex].push_back(num);
        }

        // Sort each bucket and concatenate
        std::vector<int> result;
        for (auto& bucket : buckets) {
            bucket.sort(); // Sort bucket using std::list's sort function
            result.insert(result.end(), bucket.begin(), bucket.end());
        }

        return result;
    }

    /**
     * Shell Sort
     * Time complexity: O(n log^2 n)
     */
    static std::vector<int> shellSort(const std::vector<int>& arr) {
        std::vector<int> result = arr; // Create a copy to avoid modifying the original array
        int n = result.size();

        // Start with large gaps, then decrease
        for (int gap = n/2; gap > 0; gap /= 2) {
            // Perform insertion sort with gap
            for (int i = gap; i < n; i++) {
                // Add arr[i] to the sorted elements with gap
                // Save arr[i] in temp and create a gap at position i
                int temp = result[i];

                // Shift the sorted elements with gap until the correct position for temp is found
                int j;
                for (j = i; j >= gap && result[j - gap] > temp; j -= gap) {
                    result[j] = result[j - gap];
                }

                // Place temp (original arr[i]) in the correct position
                result[j] = temp;
            }
        }

        return result;
    }
};

/**
 * Utility function to print vector
 */
void printVector(const std::vector<int>& arr) {
    for (int num : arr) {
        std::cout << num << " ";
    }
    std::cout << std::endl;
}

/**
 * Main function to test sorting algorithms
 */
int main() {
    // Vector test
    std::vector<int> arr = {64, 34, 25, 12, 22, 11, 90};

    std::cout << "Original array: ";
    printVector(arr);

    std::cout << "Bubble Sort: ";
    printVector(SortingAlgorithms::bubbleSort(arr));

    std::cout << "Selection Sort: ";
    printVector(SortingAlgorithms::selectionSort(arr));

    std::cout << "Insertion Sort: ";
    printVector(SortingAlgorithms::insertionSort(arr));

    std::cout << "Merge Sort: ";
    printVector(SortingAlgorithms::mergeSort(arr));

    std::cout << "Quick Sort: ";
    printVector(SortingAlgorithms::quickSort(arr));

    std::cout << "Heap Sort: ";
    printVector(SortingAlgorithms::heapSort(arr));

    std::cout << "Counting Sort: ";
    printVector(SortingAlgorithms::countingSort(arr));

    std::cout << "Radix Sort: ";
    printVector(SortingAlgorithms::radixSort(arr));

    std::cout << "Bucket Sort: ";
    printVector(SortingAlgorithms::bucketSort(arr));

    std::cout << "Shell Sort: ";
    printVector(SortingAlgorithms::shellSort(arr));

    return 0;
}