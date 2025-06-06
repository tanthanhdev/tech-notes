def bubble_sort(arr):
    """
    Bubble Sort
    Time complexity: O(n^2)
    """
    n = len(arr)
    for i in range(n):
        # Flag to optimize for already sorted arrays
        swapped = False

        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True

        # If no elements were swapped in this iteration, the array is already sorted
        if not swapped:
            break

    return arr


def selection_sort(arr):
    """
    Selection Sort
    Time complexity: O(n^2)
    """
    n = len(arr)

    for i in range(n):
        min_idx = i

        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j

        # Swap the smallest element with the first element in the unsorted part
        arr[i], arr[min_idx] = arr[min_idx], arr[i]

    return arr


def insertion_sort(arr):
    """
    Insertion Sort
    Time complexity: O(n^2)
    """
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1

        # Move elements greater than key one position ahead
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1

        arr[j + 1] = key

    return arr


def merge_sort(arr):
    """
    Merge Sort
    Time complexity: O(n log n)
    """
    if len(arr) > 1:
        mid = len(arr) // 2
        L = arr[:mid]
        R = arr[mid:]

        # Recursively sort the first half
        merge_sort(L)

        # Recursively sort the second half
        merge_sort(R)

        i = j = k = 0

        # Copy data into temporary arrays L[] and R[]
        while i < len(L) and j < len(R):
            if L[i] <= R[j]:
                arr[k] = L[i]
                i += 1
            else:
                arr[k] = R[j]
                j += 1
            k += 1

        # Check if there are any remaining elements
        while i < len(L):
            arr[k] = L[i]
            i += 1
            k += 1

        while j < len(R):
            arr[k] = R[j]
            j += 1
            k += 1

    return arr


def quick_sort(arr):
    """
    Quick Sort
    Time complexity: O(n log n) average, O(n^2) worst case
    """
    if len(arr) <= 1:
        return arr

    def partition(arr, low, high):
        pivot = arr[high]  # Choose pivot as the last element
        i = low - 1  # Index of the element less than pivot

        for j in range(low, high):
            # If current element is less than or equal to pivot
            if arr[j] <= pivot:
                i += 1
                arr[i], arr[j] = arr[j], arr[i]

        arr[i + 1], arr[high] = arr[high], arr[i + 1]
        return i + 1

    def quick_sort_helper(arr, low, high):
        if low < high:
            # pi is the partition index, arr[pi] is already in correct position
            pi = partition(arr, low, high)

            # Recursively sort elements before and after partition
            quick_sort_helper(arr, low, pi - 1)
            quick_sort_helper(arr, pi + 1, high)

    arr_copy = arr.copy()
    quick_sort_helper(arr_copy, 0, len(arr_copy) - 1)
    return arr_copy


def heap_sort(arr):
    """
    Heap Sort
    Time complexity: O(n log n)
    """
    def heapify(arr, n, i):
        largest = i  # Initialize largest as root
        left = 2 * i + 1
        right = 2 * i + 2

        # Check if left child is greater than root
        if left < n and arr[i] < arr[left]:
            largest = left

        # Check if right child is greater than root
        if right < n and arr[largest] < arr[right]:
            largest = right

        # Change root if necessary
        if largest != i:
            arr[i], arr[largest] = arr[largest], arr[i]

            # Heapify the root
            heapify(arr, n, largest)

    arr_copy = arr.copy()
    n = len(arr_copy)

    # Build max heap
    for i in range(n // 2 - 1, -1, -1):
        heapify(arr_copy, n, i)

    # Extract elements from heap one by one
    for i in range(n - 1, 0, -1):
        arr_copy[i], arr_copy[0] = arr_copy[0], arr_copy[i]  # Swap elements
        heapify(arr_copy, i, 0)

    return arr_copy


def counting_sort(arr):
    """
    Counting Sort
    Time complexity: O(n + k) with k being the range of input elements
    """
    # Find the maximum element in the array
    if not arr:
        return []

    max_val = max(arr)
    min_val = min(arr)
    range_of_elements = max_val - min_val + 1

    # Create count array and result array
    count = [0] * range_of_elements
    output = [0] * len(arr)

    # Count occurrences of each element
    for i in range(0, len(arr)):
        count[arr[i] - min_val] += 1

    # Update count[i] to contain the actual position of this value in output
    for i in range(1, len(count)):
        count[i] += count[i - 1]

    # Build output array
    for i in range(len(arr) - 1, -1, -1):
        output[count[arr[i] - min_val] - 1] = arr[i]
        count[arr[i] - min_val] -= 1

    return output


def radix_sort(arr):
    """
    Radix Sort
    Time complexity: O(d * (n + b)) with d being the number of digits and b being the base
    """
    if not arr:
        return []

    # Find the maximum number to know the number of digits
    max_num = max(abs(x) for x in arr)

    # Handle negative numbers
    has_negative = any(x < 0 for x in arr)
    if has_negative:
        # Separate into negative and positive arrays
        neg = [x for x in arr if x < 0]
        pos = [x for x in arr if x >= 0]

        # Sort absolute values of negative numbers
        neg = [-x for x in neg]  # Get absolute value
        neg = radix_sort(neg)    # Sort
        neg = [-x for x in neg]  # Reverse
        neg.reverse()            # Reverse

        # Sort positive numbers
        pos = radix_sort(pos) if pos else []

        # Combine: negative (reversed) + positive
        return neg + pos

    # Find the number of digits
    digits = 0
    while max_num > 0:
        digits += 1
        max_num //= 10

    # Counting sort for each digit
    result = arr.copy()
    exp = 1

    for _ in range(digits):
        # Counting sort for the digit at position 'exp'
        output = [0] * len(result)
        count = [0] * 10

        for i in range(len(result)):
            index = (result[i] // exp) % 10
            count[index] += 1

        for i in range(1, 10):
            count[i] += count[i - 1]

        for i in range(len(result) - 1, -1, -1):
            index = (result[i] // exp) % 10
            output[count[index] - 1] = result[i]
            count[index] -= 1

        result = output
        exp *= 10

    return result


def bucket_sort(arr, num_buckets=10):
    """
    Bucket Sort
    Time complexity: O(n + k) with k being the number of buckets
    """
    if not arr:
        return []

    # Find min and max
    min_val = min(arr)
    max_val = max(arr)

    # Create buckets
    bucket_range = (max_val - min_val) / num_buckets
    buckets = [[] for _ in range(num_buckets)]

    # Place elements into corresponding buckets
    for i in arr:
        index = int((i - min_val) / bucket_range)
        # Special case for max value
        if index == num_buckets:
            index -= 1
        buckets[index].append(i)

    # Sort each bucket and merge
    result = []
    for bucket in buckets:
        insertion_sort(bucket)  # Use insertion sort for each bucket
        result.extend(bucket)

    return result


def shell_sort(arr):
    """
    Shell Sort
    Time complexity: depends on the gap sequence, usually O(n log^2 n)
    """
    n = len(arr)
    arr_copy = arr.copy()

    # Start with large gap, then decrease
    gap = n // 2

    while gap > 0:
        for i in range(gap, n):
            # Add arr[i] to the sorted elements with gap
            # Save arr[i] in temp and create a gap at position i
            temp = arr_copy[i]

            # Shift the sorted elements with gap until the correct position for temp is found
            j = i
            while j >= gap and arr_copy[j - gap] > temp:
                arr_copy[j] = arr_copy[j - gap]
                j -= gap

            # Place temp (original arr[i]) in the correct position
            arr_copy[j] = temp

        # Decrease gap for the next iteration
        gap //= 2

    return arr_copy


# Test with an array
if __name__ == "__main__":
    # Test array
    test_array = [64, 34, 25, 12, 22, 11, 90]

    print("Original array:", test_array)
    print("Bubble Sort:", bubble_sort(test_array))
    print("Selection Sort:", selection_sort(test_array))
    print("Insertion Sort:", insertion_sort(test_array))
    print("Merge Sort:", merge_sort(test_array.copy()))  # Need to copy because merge sort modifies the original array
    print("Quick Sort:", quick_sort(test_array))
    print("Heap Sort:", heap_sort(test_array))
    print("Counting Sort:", counting_sort(test_array))
    print("Radix Sort:", radix_sort(test_array))
    print("Bucket Sort:", bucket_sort(test_array))
    print("Shell Sort:", shell_sort(test_array))