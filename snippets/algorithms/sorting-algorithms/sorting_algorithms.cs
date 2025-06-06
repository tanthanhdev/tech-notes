using System;
using System.Collections.Generic;
using System.Linq;

namespace SortingAlgorithms
{
    public class SortingAlgorithms
    {
        /// <summary>
        /// Bubble Sort
        /// Time complexity: O(n^2)
        /// </summary>
        public static int[] BubbleSort(int[] arr)
        {
            int[] result = (int[])arr.Clone();
            int n = result.Length;

            for (int i = 0; i < n; i++)
            {
                bool swapped = false;

                for (int j = 0; j < n - i - 1; j++)
                {
                    if (result[j] > result[j + 1])
                    {
                        // Swap elements
                        int temp = result[j];
                        result[j] = result[j + 1];
                        result[j + 1] = temp;
                        swapped = true;
                    }
                }

                // If no swapping occurred in this pass, the array is already sorted
                if (!swapped)
                    break;
            }

            return result;
        }

        /// <summary>
        /// Selection Sort
        /// Time complexity: O(n^2)
        /// </summary>
        public static int[] SelectionSort(int[] arr)
        {
            int[] result = (int[])arr.Clone();
            int n = result.Length;

            for (int i = 0; i < n - 1; i++)
            {
                // Find the minimum element in the unsorted part
                int minIdx = i;
                for (int j = i + 1; j < n; j++)
                {
                    if (result[j] < result[minIdx])
                    {
                        minIdx = j;
                    }
                }

                // Swap the found minimum element with the first element
                int temp = result[minIdx];
                result[minIdx] = result[i];
                result[i] = temp;
            }

            return result;
        }

        /// <summary>
        /// Insertion Sort
        /// Time complexity: O(n^2)
        /// </summary>
        public static int[] InsertionSort(int[] arr)
        {
            int[] result = (int[])arr.Clone();
            int n = result.Length;

            for (int i = 1; i < n; i++)
            {
                int key = result[i];
                int j = i - 1;

                // Move elements greater than key one position ahead
                while (j >= 0 && result[j] > key)
                {
                    result[j + 1] = result[j];
                    j--;
                }
                result[j + 1] = key;
            }

            return result;
        }

        /// <summary>
        /// Merge Sort
        /// Time complexity: O(n log n)
        /// </summary>
        public static int[] MergeSort(int[] arr)
        {
            int[] result = (int[])arr.Clone();
            if (result.Length <= 1)
                return result;

            return MergeSortHelper(result);
        }

        private static int[] MergeSortHelper(int[] arr)
        {
            if (arr.Length <= 1)
                return arr;

            int mid = arr.Length / 2;
            int[] left = new int[mid];
            int[] right = new int[arr.Length - mid];

            // Fill left and right subarrays
            Array.Copy(arr, 0, left, 0, mid);
            Array.Copy(arr, mid, right, 0, arr.Length - mid);

            left = MergeSortHelper(left);
            right = MergeSortHelper(right);

            return Merge(left, right);
        }

        private static int[] Merge(int[] left, int[] right)
        {
            int[] result = new int[left.Length + right.Length];
            int i = 0, j = 0, k = 0;

            // Merge the two arrays
            while (i < left.Length && j < right.Length)
            {
                if (left[i] <= right[j])
                {
                    result[k++] = left[i++];
                }
                else
                {
                    result[k++] = right[j++];
                }
            }

            // Copy remaining elements
            while (i < left.Length)
            {
                result[k++] = left[i++];
            }

            while (j < right.Length)
            {
                result[k++] = right[j++];
            }

            return result;
        }

        /// <summary>
        /// Quick Sort
        /// Time complexity: O(n log n) average, O(n^2) worst case
        /// </summary>
        public static int[] QuickSort(int[] arr)
        {
            int[] result = (int[])arr.Clone();
            if (result.Length <= 1)
                return result;

            QuickSortHelper(result, 0, result.Length - 1);
            return result;
        }

        private static void QuickSortHelper(int[] arr, int low, int high)
        {
            if (low < high)
            {
                // pi is the partitioning index
                int pi = Partition(arr, low, high);

                // Recursively sort elements before and after partition
                QuickSortHelper(arr, low, pi - 1);
                QuickSortHelper(arr, pi + 1, high);
            }
        }

        private static int Partition(int[] arr, int low, int high)
        {
            int pivot = arr[high];  // Choose the last element as pivot
            int i = low - 1;  // Index of smaller element

            for (int j = low; j < high; j++)
            {
                // If current element is smaller than or equal to pivot
                if (arr[j] <= pivot)
                {
                    i++;

                    // Swap arr[i] and arr[j]
                    int temp = arr[i];
                    arr[i] = arr[j];
                    arr[j] = temp;
                }
            }

            // Swap arr[i+1] and arr[high] (pivot)
            int temp1 = arr[i + 1];
            arr[i + 1] = arr[high];
            arr[high] = temp1;

            return i + 1;
        }

        /// <summary>
        /// Heap Sort
        /// Time complexity: O(n log n)
        /// </summary>
        public static int[] HeapSort(int[] arr)
        {
            int[] result = (int[])arr.Clone();
            int n = result.Length;

            // Build max heap
            for (int i = n / 2 - 1; i >= 0; i--)
            {
                Heapify(result, n, i);
            }

            // Extract elements from heap one by one
            for (int i = n - 1; i > 0; i--)
            {
                // Move current root to end
                int temp = result[0];
                result[0] = result[i];
                result[i] = temp;

                // Call heapify on the reduced heap
                Heapify(result, i, 0);
            }

            return result;
        }

        private static void Heapify(int[] arr, int n, int i)
        {
            int largest = i;      // Initialize largest as root
            int left = 2 * i + 1;  // left = 2*i + 1
            int right = 2 * i + 2; // right = 2*i + 2

            // If left child is larger than root
            if (left < n && arr[left] > arr[largest])
                largest = left;

            // If right child is larger than largest so far
            if (right < n && arr[right] > arr[largest])
                largest = right;

            // If largest is not root
            if (largest != i)
            {
                int swap = arr[i];
                arr[i] = arr[largest];
                arr[largest] = swap;

                // Recursively heapify the affected sub-tree
                Heapify(arr, n, largest);
            }
        }

        /// <summary>
        /// Counting Sort
        /// Time complexity: O(n + k) where k is the range of input elements
        /// </summary>
        public static int[] CountingSort(int[] arr)
        {
            if (arr.Length == 0)
                return new int[0];

            // Find the maximum and minimum element in the array
            int max = arr.Max();
            int min = arr.Min();
            int range = max - min + 1;

            // Create a count array and result array
            int[] count = new int[range];
            int[] output = new int[arr.Length];

            // Store count of each element
            for (int i = 0; i < arr.Length; i++)
            {
                count[arr[i] - min]++;
            }

            // Change count[i] so that count[i] now contains the actual
            // position of this element in output array
            for (int i = 1; i < count.Length; i++)
            {
                count[i] += count[i - 1];
            }

            // Build the output array
            for (int i = arr.Length - 1; i >= 0; i--)
            {
                output[count[arr[i] - min] - 1] = arr[i];
                count[arr[i] - min]--;
            }

            return output;
        }

        /// <summary>
        /// Radix Sort
        /// Time complexity: O(d * (n + b)) with d being the number of digits and b being the base
        /// </summary>
        public static int[] RadixSort(int[] arr)
        {
            if (arr.Length == 0)
                return new int[0];

            // Handle negative numbers
            bool hasNegative = arr.Any(val => val < 0);
            if (hasNegative)
            {
                // Separate into negative and positive arrays
                int[] neg = arr.Where(val => val < 0).Select(val => -val).ToArray();
                int[] pos = arr.Where(val => val >= 0).ToArray();

                // Sort absolute values of negative numbers
                if (neg.Length > 0)
                {
                    neg = RadixSort(neg);
                    // Reverse and negate
                    Array.Reverse(neg);
                    for (int i = 0; i < neg.Length; i++)
                    {
                        neg[i] = -neg[i];
                    }
                }

                // Sort positive numbers
                if (pos.Length > 0)
                {
                    pos = RadixSort(pos);
                }

                // Merge negative and positive arrays
                int[] result = new int[arr.Length];
                Array.Copy(neg, 0, result, 0, neg.Length);
                Array.Copy(pos, 0, result, neg.Length, pos.Length);
                return result;
            }

            // Find the maximum number to know the number of digits
            int max = arr.Max();

            // Copy the array
            int[] result = (int[])arr.Clone();

            // Do counting sort for every digit
            for (int exp = 1; max / exp > 0; exp *= 10)
            {
                CountingSortByDigit(result, exp);
            }

            return result;
        }

        private static void CountingSortByDigit(int[] arr, int exp)
        {
            int n = arr.Length;
            int[] output = new int[n];
            int[] count = new int[10]; // Count array for digits 0-9

            // Store count of occurrences in count[]
            for (int i = 0; i < n; i++)
            {
                int digit = (arr[i] / exp) % 10;
                count[digit]++;
            }

            // Change count[i] so that count[i] now contains the actual
            // position of this digit in output[]
            for (int i = 1; i < 10; i++)
            {
                count[i] += count[i - 1];
            }

            // Build the output array
            for (int i = n - 1; i >= 0; i--)
            {
                int digit = (arr[i] / exp) % 10;
                output[count[digit] - 1] = arr[i];
                count[digit]--;
            }

            // Copy the output array to arr[], so that arr[] now
            // contains sorted numbers according to current digit
            for (int i = 0; i < n; i++)
            {
                arr[i] = output[i];
            }
        }

        /// <summary>
        /// Bucket Sort
        /// Time complexity: O(n + k) where k is the number of buckets
        /// </summary>
        public static int[] BucketSort(int[] arr, int numBuckets = 10)
        {
            if (arr.Length == 0)
                return new int[0];

            // Find min and max values
            int minValue = arr.Min();
            int maxValue = arr.Max();

            // Create buckets
            double bucketRange = (double)(maxValue - minValue + 1) / numBuckets;
            List<int>[] buckets = new List<int>[numBuckets];
            for (int i = 0; i < numBuckets; i++)
            {
                buckets[i] = new List<int>();
            }

            // Distribute elements into buckets
            foreach (int val in arr)
            {
                int bucketIndex = (int)Math.Floor((val - minValue) / bucketRange);
                // Handle case for max value
                if (bucketIndex == numBuckets)
                {
                    bucketIndex = numBuckets - 1;
                }
                buckets[bucketIndex].Add(val);
            }

            // Sort individual buckets and collect them
            int index = 0;
            int[] result = new int[arr.Length];
            for (int i = 0; i < numBuckets; i++)
            {
                if (buckets[i].Count > 0)
                {
                    // Sort each bucket
                    int[] bucketArray = buckets[i].ToArray();
                    int[] sortedBucket = InsertionSort(bucketArray);

                    // Add to result array
                    foreach (int val in sortedBucket)
                    {
                        result[index++] = val;
                    }
                }
            }

            return result;
        }

        /// <summary>
        /// Shell Sort
        /// Time complexity: depends on the gap sequence, usually O(n log^2 n)
        /// </summary>
        public static int[] ShellSort(int[] arr)
        {
            int[] result = (int[])arr.Clone();
            int n = result.Length;

            // Start with a big gap, then reduce the gap
            for (int gap = n / 2; gap > 0; gap /= 2)
            {
                // Do a gapped insertion sort for this gap size
                for (int i = gap; i < n; i++)
                {
                    // Save result[i] in temp and make a hole at position i
                    int temp = result[i];

                    // Shift earlier gap-sorted elements up until the correct
                    // location for result[i] is found
                    int j;
                    for (j = i; j >= gap && result[j - gap] > temp; j -= gap)
                    {
                        result[j] = result[j - gap];
                    }

                    // Put temp (the original result[i]) in its correct location
                    result[j] = temp;
                }
            }

            return result;
        }

        public static void Main(string[] args)
        {
            // Test array
            int[] testArray = { 64, 34, 25, 12, 22, 11, 90 };

            Console.WriteLine("Original array: [{0}]", string.Join(", ", testArray));
            Console.WriteLine("Bubble Sort: [{0}]", string.Join(", ", BubbleSort(testArray)));
            Console.WriteLine("Selection Sort: [{0}]", string.Join(", ", SelectionSort(testArray)));
            Console.WriteLine("Insertion Sort: [{0}]", string.Join(", ", InsertionSort(testArray)));
            Console.WriteLine("Merge Sort: [{0}]", string.Join(", ", MergeSort(testArray)));
            Console.WriteLine("Quick Sort: [{0}]", string.Join(", ", QuickSort(testArray)));
            Console.WriteLine("Heap Sort: [{0}]", string.Join(", ", HeapSort(testArray)));
            Console.WriteLine("Counting Sort: [{0}]", string.Join(", ", CountingSort(testArray)));
            Console.WriteLine("Radix Sort: [{0}]", string.Join(", ", RadixSort(testArray)));
            Console.WriteLine("Bucket Sort: [{0}]", string.Join(", ", BucketSort(testArray, 5))); // Using 5 buckets
            Console.WriteLine("Shell Sort: [{0}]", string.Join(", ", ShellSort(testArray)));
        }
    }
}
