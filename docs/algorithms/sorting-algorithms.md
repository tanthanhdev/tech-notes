---
author: Tech Notes Hub
tags: 'learning, technology, programming'
update: '2025-06-06'
date: '2025-06-06'
title: Sorting Algorithms
description: Guide about Sorting Algorithms
---
# Sorting Algorithms

Sorting is one of the most fundamental operations in computer science. This article explores various sorting algorithms, their implementations, and performance characteristics.

## Quick Sort

Quick Sort is a divide-and-conquer algorithm that works by selecting a 'pivot' element from the array and partitioning the other elements into two sub-arrays according to whether they are less than or greater than the pivot.

```python
def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quick_sort(left) + middle + quick_sort(right)

# Example usage
arr = [3, 6, 8, 10, 1, 2, 1]
print(quick_sort(arr))  # Output: [1, 1, 2, 3, 6, 8, 10]
```

**Time Complexity**:
- Best Case: O(n log n)
- Average Case: O(n log n)
- Worst Case: O(n²)

## Merge Sort

Merge Sort is another divide-and-conquer algorithm that divides the input array into two halves, recursively sorts them, and then merges the sorted halves.

```python
def merge_sort(arr):
    if len(arr) <= 1:
        return arr

    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])

    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0

    while i < len(left) and j < len(right):
        if left[i] < right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1

    result.extend(left[i:])
    result.extend(right[j:])
    return result
```

**Time Complexity**:
- Best Case: O(n log n)
- Average Case: O(n log n)
- Worst Case: O(n log n)

## Bubble Sort

Bubble Sort is a simple comparison-based algorithm that repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order.

```python
def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        # Flag to optimize if array is already sorted
        swapped = False

        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True

        # If no swapping occurred in this pass, array is sorted
        if not swapped:
            break

    return arr
```

**Time Complexity**:
- Best Case: O(n) - when array is already sorted
- Average Case: O(n²)
- Worst Case: O(n²)

## Comparison of Sorting Algorithms

| Algorithm | Time Complexity (Best) | Time Complexity (Average) | Time Complexity (Worst) | Space Complexity | Stable |
|-----------|------------------------|---------------------------|-------------------------|-----------------|--------|
| Quick Sort | O(n log n) | O(n log n) | O(n²) | O(log n) | No |
| Merge Sort | O(n log n) | O(n log n) | O(n log n) | O(n) | Yes |
| Bubble Sort | O(n) | O(n²) | O(n²) | O(1) | Yes |
| Insertion Sort | O(n) | O(n²) | O(n²) | O(1) | Yes |
| Selection Sort | O(n²) | O(n²) | O(n²) | O(1) | No |
| Heap Sort | O(n log n) | O(n log n) | O(n log n) | O(1) | No |
| Counting Sort | O(n+k) | O(n+k) | O(n+k) | O(k) | Yes |
| Radix Sort | O(nk) | O(nk) | O(nk) | O(n+k) | Yes |

Where:
- n is the number of elements
- k is the range of the input

## When to Use Each Algorithm

- **Quick Sort**: General-purpose sorting, works well for arrays that fit in memory
- **Merge Sort**: When stability is needed and O(n log n) worst-case is required
- **Bubble Sort**: Educational purposes or very small datasets
- **Insertion Sort**: Small datasets or nearly sorted arrays
- **Heap Sort**: When consistent performance is needed without worst-case scenarios
- **Counting/Radix Sort**: When the range of input values is limited

## Conclusion

Choosing the right sorting algorithm depends on your specific requirements, including the size of the dataset, memory constraints, and whether stability is important. In practice, most programming languages implement hybrid sorting algorithms that combine the benefits of different approaches.
