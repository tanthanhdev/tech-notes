package main

import (
	"fmt"
	"math"
)

// BubbleSort implements the bubble sort algorithm
// Time complexity: O(n^2)
func BubbleSort(arr []int) []int {
	result := make([]int, len(arr))
	copy(result, arr)
	n := len(result)

	for i := 0; i < n; i++ {
		swapped := false

		for j := 0; j < n-i-1; j++ {
			if result[j] > result[j+1] {
				result[j], result[j+1] = result[j+1], result[j]
				swapped = true
			}
		}

		// If no swapping occurred in this pass, the array is already sorted
		if !swapped {
			break
		}
	}
	return result
}

// SelectionSort implements the selection sort algorithm
// Time complexity: O(n^2)
func SelectionSort(arr []int) []int {
	result := make([]int, len(arr))
	copy(result, arr)
	n := len(result)

	for i := 0; i < n; i++ {
		minIdx := i
		for j := i + 1; j < n; j++ {
			if result[j] < result[minIdx] {
				minIdx = j
			}
		}
		// Swap the found minimum element with the first element
		result[i], result[minIdx] = result[minIdx], result[i]
	}
	return result
}

// InsertionSort implements the insertion sort algorithm
// Time complexity: O(n^2)
func InsertionSort(arr []int) []int {
	result := make([]int, len(arr))
	copy(result, arr)
	n := len(result)

	for i := 1; i < n; i++ {
		key := result[i]
		j := i - 1

		// Move elements of result[0..i-1], that are greater than key,
		// to one position ahead of their current position
		for j >= 0 && result[j] > key {
			result[j+1] = result[j]
			j--
		}
		result[j+1] = key
	}
	return result
}

// MergeSort implements the merge sort algorithm
// Time complexity: O(n log n)
func MergeSort(arr []int) []int {
	result := make([]int, len(arr))
	copy(result, arr)

	if len(result) <= 1 {
		return result
	}

	// Recursive mergesort
	return mergeSortHelper(result)
}

func mergeSortHelper(arr []int) []int {
	if len(arr) <= 1 {
		return arr
	}

	mid := len(arr) / 2
	left := mergeSortHelper(arr[:mid])
	right := mergeSortHelper(arr[mid:])

	return merge(left, right)
}

func merge(left, right []int) []int {
	result := make([]int, 0, len(left)+len(right))
	i, j := 0, 0

	for i < len(left) && j < len(right) {
		if left[i] <= right[j] {
			result = append(result, left[i])
			i++
		} else {
			result = append(result, right[j])
			j++
		}
	}

	// Append remaining elements
	result = append(result, left[i:]...)
	result = append(result, right[j:]...)

	return result
}

// QuickSort implements the quick sort algorithm
// Time complexity: O(n log n) average, O(n^2) worst case
func QuickSort(arr []int) []int {
	result := make([]int, len(arr))
	copy(result, arr)

	if len(result) <= 1 {
		return result
	}

	quickSortHelper(result, 0, len(result)-1)
	return result
}

func quickSortHelper(arr []int, low, high int) {
	if low < high {
		// pi is partitioning index
		pi := partition(arr, low, high)

		// Recursively sort elements before and after partition
		quickSortHelper(arr, low, pi-1)
		quickSortHelper(arr, pi+1, high)
	}
}

func partition(arr []int, low, high int) int {
	pivot := arr[high] // Choose the last element as pivot
	i := low - 1       // Index of smaller element

	for j := low; j < high; j++ {
		// If current element is smaller than the pivot
		if arr[j] <= pivot {
			i++
			arr[i], arr[j] = arr[j], arr[i]
		}
	}

	// Swap the pivot element with the element at (i+1)
	arr[i+1], arr[high] = arr[high], arr[i+1]
	return i + 1
}

// HeapSort implements the heap sort algorithm
// Time complexity: O(n log n)
func HeapSort(arr []int) []int {
	result := make([]int, len(arr))
	copy(result, arr)
	n := len(result)

	// Build max heap
	for i := n/2 - 1; i >= 0; i-- {
		heapify(result, n, i)
	}

	// Extract elements from heap one by one
	for i := n - 1; i > 0; i-- {
		// Move current root to end
		result[0], result[i] = result[i], result[0]

		// Call heapify on the reduced heap
		heapify(result, i, 0)
	}

	return result
}

// heapify a subtree rooted with node i which is an index in arr[]
func heapify(arr []int, n, i int) {
	largest := i     // Initialize largest as root
	left := 2*i + 1  // left = 2*i + 1
	right := 2*i + 2 // right = 2*i + 2

	// If left child is larger than root
	if left < n && arr[left] > arr[largest] {
		largest = left
	}

	// If right child is larger than largest so far
	if right < n && arr[right] > arr[largest] {
		largest = right
	}

	// If largest is not root
	if largest != i {
		arr[i], arr[largest] = arr[largest], arr[i]

		// Recursively heapify the affected sub-tree
		heapify(arr, n, largest)
	}
}

// CountingSort implements the counting sort algorithm
// Time complexity: O(n + k) where k is the range of the non-negative key values
func CountingSort(arr []int) []int {
	if len(arr) == 0 {
		return []int{}
	}

	result := make([]int, len(arr))
	copy(result, arr)

	// Find the maximum and minimum element in the array
	max := result[0]
	min := result[0]
	for _, val := range result {
		if val > max {
			max = val
		}
		if val < min {
			min = val
		}
	}

	range_of_elements := max - min + 1

	// Create a count array to store the count of each element
	count := make([]int, range_of_elements)
	output := make([]int, len(result))

	// Store the count of each element
	for i := 0; i < len(result); i++ {
		count[result[i]-min]++
	}

	// Store the cumulative count
	for i := 1; i < len(count); i++ {
		count[i] += count[i-1]
	}

	// Build the output array
	for i := len(result) - 1; i >= 0; i-- {
		output[count[result[i]-min]-1] = result[i]
		count[result[i]-min]--
	}

	return output
}

// RadixSort implements the radix sort algorithm
// Time complexity: O(d * (n + b)) where d is the number of digits and b is the base
func RadixSort(arr []int) []int {
	if len(arr) == 0 {
		return []int{}
	}

	// Handle negative numbers by splitting into negative and positive arrays
	hasNegative := false
	for _, val := range arr {
		if val < 0 {
			hasNegative = true
			break
		}
	}

	if hasNegative {
		neg := []int{}
		pos := []int{}

		// Split into negative and positive arrays
		for _, val := range arr {
			if val < 0 {
				neg = append(neg, -val) // Get absolute value
			} else {
				pos = append(pos, val)
			}
		}

		// Sort both arrays
		if len(neg) > 0 {
			neg = RadixSort(neg)
			// Reverse and negate
			for i, j := 0, len(neg)-1; i < j; i, j = i+1, j-1 {
				neg[i], neg[j] = neg[j], neg[i]
			}
			for i := range neg {
				neg[i] = -neg[i]
			}
		}

		if len(pos) > 0 {
			pos = RadixSort(pos)
		}

		// Merge negative and positive arrays
		return append(neg, pos...)
	}

	// Find the maximum number to know number of digits
	max := arr[0]
	for _, val := range arr {
		if val > max {
			max = val
		}
	}

	// Do counting sort for every digit
	result := make([]int, len(arr))
	copy(result, arr)
	exp := 1

	// Perform counting sort for each digit
	for max/exp > 0 {
		countingSortByDigit(result, exp)
		exp *= 10
	}

	return result
}

func countingSortByDigit(arr []int, exp int) {
	n := len(arr)
	output := make([]int, n)
	count := make([]int, 10)

	// Store count of occurrences in count[]
	for i := 0; i < n; i++ {
		digit := (arr[i] / exp) % 10
		count[digit]++
	}

	// Change count[i] so that count[i] now contains actual
	// position of this digit in output[]
	for i := 1; i < 10; i++ {
		count[i] += count[i-1]
	}

	// Build the output array
	for i := n - 1; i >= 0; i-- {
		digit := (arr[i] / exp) % 10
		output[count[digit]-1] = arr[i]
		count[digit]--
	}

	// Copy the output array to arr[], so that arr[] now
	// contains sorted numbers according to current digit
	for i := 0; i < n; i++ {
		arr[i] = output[i]
	}
}

// BucketSort implements the bucket sort algorithm
// Time complexity: O(n + k) where k is the number of buckets
func BucketSort(arr []int, numBuckets int) []int {
	if len(arr) == 0 {
		return []int{}
	}

	// Find min and max values
	min := arr[0]
	max := arr[0]
	for _, val := range arr {
		if val < min {
			min = val
		}
		if val > max {
			max = val
		}
	}

	// Create buckets
	bucketRange := float64(max-min) / float64(numBuckets)
	buckets := make([][]int, numBuckets)
	for i := range buckets {
		buckets[i] = []int{}
	}

	// Distribute elements into buckets
	for _, val := range arr {
		idx := int(math.Floor(float64(val-min) / bucketRange))
		// Handle edge case for max value
		if idx == numBuckets {
			idx = numBuckets - 1
		}
		buckets[idx] = append(buckets[idx], val)
	}

	// Sort individual buckets and merge them
	result := []int{}
	for _, bucket := range buckets {
		if len(bucket) > 0 {
			sortedBucket := InsertionSort(bucket)
			result = append(result, sortedBucket...)
		}
	}

	return result
}

// ShellSort implements the shell sort algorithm
// Time complexity: depends on the gap sequence, usually O(n log^2 n)
func ShellSort(arr []int) []int {
	result := make([]int, len(arr))
	copy(result, arr)
	n := len(result)

	// Start with a big gap, then reduce the gap
	for gap := n / 2; gap > 0; gap /= 2 {
		// Do a gapped insertion sort for this gap size
		for i := gap; i < n; i++ {
			// Save result[i] in temp and make a hole at position i
			temp := result[i]

			// Shift earlier gap-sorted elements up until the correct
			// location for result[i] is found
			var j int
			for j = i; j >= gap && result[j-gap] > temp; j -= gap {
				result[j] = result[j-gap]
			}

			// Put temp (the original result[i]) in its correct location
			result[j] = temp
		}
	}
	return result
}

func main() {
	// Test array
	testArray := []int{64, 34, 25, 12, 22, 11, 90}

	fmt.Println("Original array:", testArray)
	fmt.Println("Bubble Sort:", BubbleSort(testArray))
	fmt.Println("Selection Sort:", SelectionSort(testArray))
	fmt.Println("Insertion Sort:", InsertionSort(testArray))
	fmt.Println("Merge Sort:", MergeSort(testArray))
	fmt.Println("Quick Sort:", QuickSort(testArray))
	fmt.Println("Heap Sort:", HeapSort(testArray))
	fmt.Println("Counting Sort:", CountingSort(testArray))
	fmt.Println("Radix Sort:", RadixSort(testArray))
	fmt.Println("Bucket Sort:", BucketSort(testArray, 5)) // Using 5 buckets
	fmt.Println("Shell Sort:", ShellSort(testArray))
}
