/// Bubble Sort
/// Time complexity: O(n^2)
fn bubble_sort(arr: &[i32]) -> Vec<i32> {
    let mut result = arr.to_vec();
    let n = result.len();

    for i in 0..n {
        let mut swapped = false;

        for j in 0..(n - i - 1) {
            if result[j] > result[j + 1] {
                result.swap(j, j + 1);
                swapped = true;
            }
        }

        // If no swapping occurred in this pass, the array is already sorted
        if !swapped {
            break;
        }
    }

    result
}

/// Selection Sort
/// Time complexity: O(n^2)
fn selection_sort(arr: &[i32]) -> Vec<i32> {
    let mut result = arr.to_vec();
    let n = result.len();

    for i in 0..n {
        let mut min_idx = i;

        for j in (i + 1)..n {
            if result[j] < result[min_idx] {
                min_idx = j;
            }
        }

        // Swap the found minimum element with the first element of the unsorted part
        result.swap(i, min_idx);
    }

    result
}

/// Insertion Sort
/// Time complexity: O(n^2)
fn insertion_sort(arr: &[i32]) -> Vec<i32> {
    let mut result = arr.to_vec();
    let n = result.len();

    for i in 1..n {
        let key = result[i];
        let mut j = i as i32 - 1;

        // Move elements greater than key one position ahead
        while j >= 0 && result[j as usize] > key {
            result[(j + 1) as usize] = result[j as usize];
            j -= 1;
        }
        result[(j + 1) as usize] = key;
    }

    result
}

/// Merge Sort
/// Time complexity: O(n log n)
fn merge_sort(arr: &[i32]) -> Vec<i32> {
    if arr.len() <= 1 {
        return arr.to_vec();
    }

    let mid = arr.len() / 2;
    let left = merge_sort(&arr[0..mid]);
    let right = merge_sort(&arr[mid..]);

    merge(&left, &right)
}

fn merge(left: &[i32], right: &[i32]) -> Vec<i32> {
    let mut result = Vec::with_capacity(left.len() + right.len());
    let (mut i, mut j) = (0, 0);

    while i < left.len() && j < right.len() {
        if left[i] <= right[j] {
            result.push(left[i]);
            i += 1;
        } else {
            result.push(right[j]);
            j += 1;
        }
    }

    // Add remaining elements
    result.extend_from_slice(&left[i..]);
    result.extend_from_slice(&right[j..]);

    result
}

/// Quick Sort
/// Time complexity: O(n log n) average, O(n^2) worst case
fn quick_sort(arr: &[i32]) -> Vec<i32> {
    if arr.len() <= 1 {
        return arr.to_vec();
    }

    let mut result = arr.to_vec();
    quick_sort_helper(&mut result, 0, (result.len() - 1) as i32);
    result
}

fn quick_sort_helper(arr: &mut [i32], low: i32, high: i32) {
    if low < high {
        let pi = partition(arr, low, high);

        // Recursively sort elements before and after partition
        quick_sort_helper(arr, low, pi - 1);
        quick_sort_helper(arr, pi + 1, high);
    }
}

fn partition(arr: &mut [i32], low: i32, high: i32) -> i32 {
    let pivot = arr[high as usize];
    let mut i = low - 1;

    for j in low..high {
        if arr[j as usize] <= pivot {
            i += 1;
            arr.swap(i as usize, j as usize);
        }
    }

    arr.swap((i + 1) as usize, high as usize);
    i + 1
}

/// Heap Sort
/// Time complexity: O(n log n)
fn heap_sort(arr: &[i32]) -> Vec<i32> {
    let mut result = arr.to_vec();
    let n = result.len();

    // Build max heap
    for i in (0..(n / 2)).rev() {
        heapify(&mut result, n, i);
    }

    // Extract elements from heap one by one
    for i in (1..n).rev() {
        // Move current root to end
        result.swap(0, i);

        // Call heapify on the reduced heap
        heapify(&mut result, i, 0);
    }

    result
}

fn heapify(arr: &mut [i32], n: usize, i: usize) {
    let mut largest = i;      // Initialize largest as root
    let left = 2 * i + 1;     // left = 2*i + 1
    let right = 2 * i + 2;    // right = 2*i + 2

    // If left child is larger than root
    if left < n && arr[left] > arr[largest] {
        largest = left;
    }

    // If right child is larger than largest so far
    if right < n && arr[right] > arr[largest] {
        largest = right;
    }

    // If largest is not root
    if largest != i {
        arr.swap(i, largest);

        // Recursively heapify the affected sub-tree
        heapify(arr, n, largest);
    }
}

/// Counting Sort
/// Time complexity: O(n + k) where k is the range of input elements
fn counting_sort(arr: &[i32]) -> Vec<i32> {
    if arr.is_empty() {
        return Vec::new();
    }

    // Find the maximum and minimum element in the array
    let max_val = *arr.iter().max().unwrap();
    let min_val = *arr.iter().min().unwrap();
    let range = (max_val - min_val + 1) as usize;

    // Create a count array and result array
    let mut count = vec![0; range];
    let mut output = vec![0; arr.len()];

    // Store count of each element
    for &val in arr {
        count[(val - min_val) as usize] += 1;
    }

    // Change count[i] so that count[i] now contains the actual
    // position of this element in output array
    for i in 1..range {
        count[i] += count[i - 1];
    }

    // Build the output array
    for i in (0..arr.len()).rev() {
        let val = arr[i];
        output[count[(val - min_val) as usize] - 1] = val;
        count[(val - min_val) as usize] -= 1;
    }

    output
}

/// Radix Sort
/// Time complexity: O(d * (n + b)) with d being the number of digits and b being the base
fn radix_sort(arr: &[i32]) -> Vec<i32> {
    if arr.is_empty() {
        return Vec::new();
    }

    // Handle negative numbers
    let has_negative = arr.iter().any(|&val| val < 0);
    if has_negative {
        // Separate into negative and positive arrays
        let mut neg: Vec<i32> = arr.iter()
                                   .filter(|&&val| val < 0)
                                   .map(|&val| -val)
                                   .collect();
        let mut pos: Vec<i32> = arr.iter()
                                   .filter(|&&val| val >= 0)
                                   .copied()
                                   .collect();

        // Sort absolute values of negative numbers
        if !neg.is_empty() {
            neg = radix_sort(&neg);
            // Reverse and negate
            neg.reverse();
            for val in &mut neg {
                *val = -*val;
            }
        }

        // Sort positive numbers
        if !pos.is_empty() {
            pos = radix_sort(&pos);
        }

        // Combine: negative (reversed) + positive
        neg.extend(pos);
        return neg;
    }

    // Find maximum number to know number of digits
    let max_num = *arr.iter().max().unwrap();
    let mut result = arr.to_vec();
    let mut exp = 1;

    // Do counting sort for every digit
    while max_num / exp > 0 {
        counting_sort_by_digit(&mut result, exp);
        exp *= 10;
    }

    result
}

fn counting_sort_by_digit(arr: &mut [i32], exp: i32) {
    let n = arr.len();
    let mut output = vec![0; n];
    let mut count = vec![0; 10];

    // Store count of occurrences in count[]
    for &val in arr.iter() {
        let digit = ((val / exp) % 10) as usize;
        count[digit] += 1;
    }

    // Change count[i] so that count[i] now contains actual
    // position of this digit in output[]
    for i in 1..10 {
        count[i] += count[i - 1];
    }

    // Build the output array
    for i in (0..n).rev() {
        let digit = ((arr[i] / exp) % 10) as usize;
        output[count[digit] - 1] = arr[i];
        count[digit] -= 1;
    }

    // Copy the output array to arr[]
    for i in 0..n {
        arr[i] = output[i];
    }
}

/// Bucket Sort
/// Time complexity: O(n + k) where k is the number of buckets
fn bucket_sort(arr: &[i32], num_buckets: usize) -> Vec<i32> {
    if arr.is_empty() {
        return Vec::new();
    }

    // Find min and max values
    let min_val = *arr.iter().min().unwrap();
    let max_val = *arr.iter().max().unwrap();

    // Create buckets
    let bucket_range = (max_val - min_val + 1) as f64 / num_buckets as f64;
    let mut buckets: Vec<Vec<i32>> = vec![Vec::new(); num_buckets];

    // Place elements into corresponding buckets
    for &val in arr {
        let bucket_idx = ((val - min_val) as f64 / bucket_range) as usize;
        // Handle case for max value
        let idx = if bucket_idx == num_buckets { num_buckets - 1 } else { bucket_idx };
        buckets[idx].push(val);
    }

    // Sort individual buckets and collect them
    let mut result = Vec::new();
    for mut bucket in buckets {
        if !bucket.is_empty() {
            // Sort each bucket using insertion sort
            bucket = insertion_sort(&bucket);
            result.extend(bucket);
        }
    }

    result
}

/// Shell Sort
/// Time complexity: depends on the gap sequence, usually O(n log^2 n)
fn shell_sort(arr: &[i32]) -> Vec<i32> {
    let mut result = arr.to_vec();
    let n = result.len();

    // Start with a big gap, then reduce the gap
    let mut gap = n / 2;

    while gap > 0 {
        for i in gap..n {
            // Save result[i] in temp and make a hole at position i
            let temp = result[i];

            // Shift earlier gap-sorted elements up until the correct
            // location for result[i] is found
            let mut j = i;
            while j >= gap && result[j - gap] > temp {
                result[j] = result[j - gap];
                j -= gap;
            }

            // Put temp (the original result[i]) in its correct location
            result[j] = temp;
        }

        // Reduce the gap
        gap /= 2;
    }

    result
}

fn main() {
    // Test array
    let test_array = vec![64, 34, 25, 12, 22, 11, 90];

    println!("Original array: {:?}", test_array);
    println!("Bubble Sort: {:?}", bubble_sort(&test_array));
    println!("Selection Sort: {:?}", selection_sort(&test_array));
    println!("Insertion Sort: {:?}", insertion_sort(&test_array));
    println!("Merge Sort: {:?}", merge_sort(&test_array));
    println!("Quick Sort: {:?}", quick_sort(&test_array));
    println!("Heap Sort: {:?}", heap_sort(&test_array));
    println!("Counting Sort: {:?}", counting_sort(&test_array));
    println!("Radix Sort: {:?}", radix_sort(&test_array));
    println!("Bucket Sort: {:?}", bucket_sort(&test_array, 5)); // Using 5 buckets
    println!("Shell Sort: {:?}", shell_sort(&test_array));
}
