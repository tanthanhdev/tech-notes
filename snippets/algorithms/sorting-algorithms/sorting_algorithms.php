<?php

/**
 * Bubble Sort
 * Time complexity: O(n^2)
 */
function bubbleSort($arr) {
    $result = $arr;
    $n = count($result);

    for ($i = 0; $i < $n; $i++) {
        $swapped = false;

        for ($j = 0; $j < $n - $i - 1; $j++) {
            if ($result[$j] > $result[$j + 1]) {
                // Swap elements
                $temp = $result[$j];
                $result[$j] = $result[$j + 1];
                $result[$j + 1] = $temp;
                $swapped = true;
            }
        }

        // If no swapping occurred in this pass, the array is already sorted
        if (!$swapped) {
            break;
        }
    }

    return $result;
}

/**
 * Selection Sort
 * Time complexity: O(n^2)
 */
function selectionSort($arr) {
    $result = $arr;
    $n = count($result);

    for ($i = 0; $i < $n - 1; $i++) {
        // Find the minimum element in the unsorted part
        $minIdx = $i;
        for ($j = $i + 1; $j < $n; $j++) {
            if ($result[$j] < $result[$minIdx]) {
                $minIdx = $j;
            }
        }

        // Swap the found minimum element with the first element
        $temp = $result[$minIdx];
        $result[$minIdx] = $result[$i];
        $result[$i] = $temp;
    }

    return $result;
}

/**
 * Insertion Sort
 * Time complexity: O(n^2)
 */
function insertionSort($arr) {
    $result = $arr;
    $n = count($result);

    for ($i = 1; $i < $n; $i++) {
        $key = $result[$i];
        $j = $i - 1;

        // Move elements greater than key one position ahead
        while ($j >= 0 && $result[$j] > $key) {
            $result[$j + 1] = $result[$j];
            $j--;
        }
        $result[$j + 1] = $key;
    }

    return $result;
}

/**
 * Merge Sort
 * Time complexity: O(n log n)
 */
function mergeSort($arr) {
    $result = $arr;
    $n = count($result);

    if ($n <= 1) {
        return $result;
    }

    $mid = (int)($n / 2);
    $left = array_slice($result, 0, $mid);
    $right = array_slice($result, $mid);

    $left = mergeSort($left);
    $right = mergeSort($right);

    return merge($left, $right);
}

/**
 * Helper function for merge sort
 */
function merge($left, $right) {
    $result = [];
    $i = $j = 0;
    $leftCount = count($left);
    $rightCount = count($right);

    // Merge the two arrays
    while ($i < $leftCount && $j < $rightCount) {
        if ($left[$i] <= $right[$j]) {
            $result[] = $left[$i];
            $i++;
        } else {
            $result[] = $right[$j];
            $j++;
        }
    }

    // Add remaining elements
    while ($i < $leftCount) {
        $result[] = $left[$i];
        $i++;
    }

    while ($j < $rightCount) {
        $result[] = $right[$j];
        $j++;
    }

    return $result;
}

/**
 * Quick Sort
 * Time complexity: O(n log n) average, O(n^2) worst case
 */
function quickSort($arr) {
    if (count($arr) <= 1) {
        return $arr;
    }

    $result = $arr;
    quickSortHelper($result, 0, count($result) - 1);
    return $result;
}

/**
 * Helper function for quick sort
 */
function quickSortHelper(&$arr, $low, $high) {
    if ($low < $high) {
        // pi is the partitioning index
        $pi = partition($arr, $low, $high);

        // Recursively sort elements before and after partition
        quickSortHelper($arr, $low, $pi - 1);
        quickSortHelper($arr, $pi + 1, $high);
    }
}

/**
 * Partition function for quick sort
 */
function partition(&$arr, $low, $high) {
    $pivot = $arr[$high];  // Choose the last element as pivot
    $i = $low - 1;  // Index of smaller element

    for ($j = $low; $j < $high; $j++) {
        // If current element is smaller than or equal to pivot
        if ($arr[$j] <= $pivot) {
            $i++;

            // Swap arr[i] and arr[j]
            $temp = $arr[$i];
            $arr[$i] = $arr[$j];
            $arr[$j] = $temp;
        }
    }

    // Swap arr[i+1] and arr[high] (pivot)
    $temp = $arr[$i + 1];
    $arr[$i + 1] = $arr[$high];
    $arr[$high] = $temp;

    return $i + 1;
}

/**
 * Heap Sort
 * Time complexity: O(n log n)
 */
function heapSort($arr) {
    $result = $arr;
    $n = count($result);

    // Build max heap
    for ($i = (int)($n / 2) - 1; $i >= 0; $i--) {
        heapify($result, $n, $i);
    }

    // Extract elements from heap one by one
    for ($i = $n - 1; $i > 0; $i--) {
        // Move current root to end
        $temp = $result[0];
        $result[0] = $result[$i];
        $result[$i] = $temp;

        // Call heapify on the reduced heap
        heapify($result, $i, 0);
    }

    return $result;
}

/**
 * Helper function for heap sort
 */
function heapify(&$arr, $n, $i) {
    $largest = $i;      // Initialize largest as root
    $left = 2 * $i + 1;  // left = 2*i + 1
    $right = 2 * $i + 2; // right = 2*i + 2

    // If left child is larger than root
    if ($left < $n && $arr[$left] > $arr[$largest]) {
        $largest = $left;
    }

    // If right child is larger than largest so far
    if ($right < $n && $arr[$right] > $arr[$largest]) {
        $largest = $right;
    }

    // If largest is not root
    if ($largest != $i) {
        $swap = $arr[$i];
        $arr[$i] = $arr[$largest];
        $arr[$largest] = $swap;

        // Recursively heapify the affected sub-tree
        heapify($arr, $n, $largest);
    }
}

/**
 * Counting Sort
 * Time complexity: O(n + k) where k is the range of input elements
 */
function countingSort($arr) {
    if (empty($arr)) {
        return [];
    }

    // Find the maximum and minimum element in the array
    $max = max($arr);
    $min = min($arr);
    $range = $max - $min + 1;

    // Create a count array and result array
    $count = array_fill(0, $range, 0);
    $output = array_fill(0, count($arr), 0);

    // Store count of each element
    foreach ($arr as $val) {
        $count[$val - $min]++;
    }

    // Change count[i] so that count[i] now contains the actual
    // position of this element in output array
    for ($i = 1; $i < $range; $i++) {
        $count[$i] += $count[$i - 1];
    }

    // Build the output array
    for ($i = count($arr) - 1; $i >= 0; $i--) {
        $output[$count[$arr[$i] - $min] - 1] = $arr[$i];
        $count[$arr[$i] - $min]--;
    }

    return $output;
}

/**
 * Radix Sort
 * Time complexity: O(d * (n + b)) with d being the number of digits and b being the base
 */
function radixSort($arr) {
    if (empty($arr)) {
        return [];
    }

    // Handle negative numbers
    $hasNegative = false;
    foreach ($arr as $val) {
        if ($val < 0) {
            $hasNegative = true;
            break;
        }
    }

    if ($hasNegative) {
        // Separate into negative and positive arrays
        $neg = [];
        $pos = [];

        foreach ($arr as $val) {
            if ($val < 0) {
                $neg[] = -$val; // Get absolute value
            } else {
                $pos[] = $val;
            }
        }

        // Sort absolute values of negative numbers
        if (!empty($neg)) {
            $neg = radixSort($neg);
            // Reverse and negate
            $neg = array_reverse($neg);
            foreach ($neg as &$val) {
                $val = -$val;
            }
        }

        // Sort positive numbers
        if (!empty($pos)) {
            $pos = radixSort($pos);
        }

        // Merge negative and positive arrays
        return array_merge($neg, $pos);
    }

    // Find the maximum number to know the number of digits
    $max = max($arr);

    // Perform counting sort for each digit
    $result = $arr;
    $exp = 1;

    while ((int)($max / $exp) > 0) {
        $result = countingSortByDigit($result, $exp);
        $exp *= 10;
    }

    return $result;
}

/**
 * Helper function for radix sort
 */
function countingSortByDigit($arr, $exp) {
    $n = count($arr);
    $output = array_fill(0, $n, 0);
    $count = array_fill(0, 10, 0); // Count array for digits 0-9

    // Store count of occurrences in count[]
    for ($i = 0; $i < $n; $i++) {
        $digit = (int)(($arr[$i] / $exp) % 10);
        $count[$digit]++;
    }

    // Change count[i] so that count[i] now contains the actual
    // position of this digit in output[]
    for ($i = 1; $i < 10; $i++) {
        $count[$i] += $count[$i - 1];
    }

    // Build the output array
    for ($i = $n - 1; $i >= 0; $i--) {
        $digit = (int)(($arr[$i] / $exp) % 10);
        $output[$count[$digit] - 1] = $arr[$i];
        $count[$digit]--;
    }

    return $output;
}

/**
 * Bucket Sort
 * Time complexity: O(n + k) where k is the number of buckets
 */
function bucketSort($arr, $numBuckets = 10) {
    if (empty($arr)) {
        return [];
    }

    // Find min and max values
    $minValue = min($arr);
    $maxValue = max($arr);

    // Create buckets
    $bucketRange = ($maxValue - $minValue + 1) / $numBuckets;
    $buckets = array_fill(0, $numBuckets, []);

    // Distribute elements into buckets
    foreach ($arr as $val) {
        $bucketIndex = (int)(($val - $minValue) / $bucketRange);
        // Handle case for max value
        if ($bucketIndex == $numBuckets) {
            $bucketIndex = $numBuckets - 1;
        }
        $buckets[$bucketIndex][] = $val;
    }

    // Sort individual buckets and collect them
    $result = [];
    foreach ($buckets as $bucket) {
        if (!empty($bucket)) {
            // Sort each bucket using insertion sort
            $sortedBucket = insertionSort($bucket);
            $result = array_merge($result, $sortedBucket);
        }
    }

    return $result;
}

/**
 * Shell Sort
 * Time complexity: depends on the gap sequence, usually O(n log^2 n)
 */
function shellSort($arr) {
    $result = $arr;
    $n = count($result);

    // Start with a big gap, then reduce the gap
    for ($gap = (int)($n / 2); $gap > 0; $gap = (int)($gap / 2)) {
        // Do a gapped insertion sort for this gap size
        for ($i = $gap; $i < $n; $i++) {
            // Save result[i] in temp and make a hole at position i
            $temp = $result[$i];

            // Shift earlier gap-sorted elements up until the correct
            // location for result[i] is found
            $j = $i;
            while ($j >= $gap && $result[$j - $gap] > $temp) {
                $result[$j] = $result[$j - $gap];
                $j -= $gap;
            }

            // Put temp (the original result[i]) in its correct location
            $result[$j] = $temp;
        }
    }

    return $result;
}

// Test with an array
$testArray = [64, 34, 25, 12, 22, 11, 90];

echo "Original array: " . implode(", ", $testArray) . "\n";
echo "Bubble Sort: " . implode(", ", bubbleSort($testArray)) . "\n";
echo "Selection Sort: " . implode(", ", selectionSort($testArray)) . "\n";
echo "Insertion Sort: " . implode(", ", insertionSort($testArray)) . "\n";
echo "Merge Sort: " . implode(", ", mergeSort($testArray)) . "\n";
echo "Quick Sort: " . implode(", ", quickSort($testArray)) . "\n";
echo "Heap Sort: " . implode(", ", heapSort($testArray)) . "\n";
echo "Counting Sort: " . implode(", ", countingSort($testArray)) . "\n";
echo "Radix Sort: " . implode(", ", radixSort($testArray)) . "\n";
echo "Bucket Sort: " . implode(", ", bucketSort($testArray, 5)) . "\n"; // Using 5 buckets
echo "Shell Sort: " . implode(", ", shellSort($testArray)) . "\n";

?>
