# Bubble Sort
# Time complexity: O(n^2)
def bubble_sort(arr)
  result = arr.clone
  n = result.length

  for i in 0...n
    swapped = false

    for j in 0...(n-i-1)
      if result[j] > result[j+1]
        result[j], result[j+1] = result[j+1], result[j]
        swapped = true
      end
    end

    # If no swapping occurred in this pass, the array is already sorted
    break unless swapped
  end

  result
end

# Selection Sort
# Time complexity: O(n^2)
def selection_sort(arr)
  result = arr.clone
  n = result.length

  for i in 0...n
    min_idx = i

    for j in (i+1)...n
      min_idx = j if result[j] < result[min_idx]
    end

    # Swap the found minimum element with the first element of the unsorted part
    result[i], result[min_idx] = result[min_idx], result[i]
  end

  result
end

# Insertion Sort
# Time complexity: O(n^2)
def insertion_sort(arr)
  result = arr.clone
  n = result.length

  for i in 1...n
    key = result[i]
    j = i - 1

    # Move elements greater than key one position ahead
    while j >= 0 && result[j] > key
      result[j+1] = result[j]
      j -= 1
    end

    result[j+1] = key
  end

  result
end

# Merge Sort
# Time complexity: O(n log n)
def merge_sort(arr)
  return arr.clone if arr.length <= 1

  mid = arr.length / 2
  left = merge_sort(arr[0...mid])
  right = merge_sort(arr[mid...arr.length])

  merge(left, right)
end

def merge(left, right)
  result = []
  i = j = 0

  while i < left.length && j < right.length
    if left[i] <= right[j]
      result << left[i]
      i += 1
    else
      result << right[j]
      j += 1
    end
  end

  # Add remaining elements
  result.concat(left[i...left.length])
  result.concat(right[j...right.length])

  result
end

# Quick Sort
# Time complexity: O(n log n) average, O(n^2) worst case
def quick_sort(arr)
  return arr.clone if arr.length <= 1

  # Use closure to avoid modifying the original array
  quick_sort_helper = lambda do |array, low, high|
    if low < high
      # pi is the partition index
      pi = partition(array, low, high)

      # Recursively sort elements before and after partition
      quick_sort_helper.call(array, low, pi - 1)
      quick_sort_helper.call(array, pi + 1, high)
    end
  end

  result = arr.clone
  quick_sort_helper.call(result, 0, result.length - 1)
  result
end

def partition(arr, low, high)
  pivot = arr[high]  # Choose the last element as pivot
  i = low - 1  # Index of smaller element

  for j in low...high
    # If current element is smaller than or equal to pivot
    if arr[j] <= pivot
      i += 1
      arr[i], arr[j] = arr[j], arr[i]
    end
  end

  # Swap the pivot element with the element at (i+1)
  arr[i+1], arr[high] = arr[high], arr[i+1]
  i + 1
end

# Heap Sort
# Time complexity: O(n log n)
def heap_sort(arr)
  result = arr.clone
  n = result.length

  # Build max heap
  (n/2 - 1).downto(0) do |i|
    heapify(result, n, i)
  end

  # Extract elements from heap one by one
  (n-1).downto(1) do |i|
    # Move current root to end
    result[0], result[i] = result[i], result[0]

    # Call heapify on the reduced heap
    heapify(result, i, 0)
  end

  result
end

def heapify(arr, n, i)
  largest = i        # Initialize largest as root
  left = 2 * i + 1   # left = 2*i + 1
  right = 2 * i + 2  # right = 2*i + 2

  # If left child is larger than root
  largest = left if left < n && arr[left] > arr[largest]

  # If right child is larger than largest so far
  largest = right if right < n && arr[right] > arr[largest]

  # If largest is not root
  if largest != i
    arr[i], arr[largest] = arr[largest], arr[i]

    # Recursively heapify the affected sub-tree
    heapify(arr, n, largest)
  end
end

# Counting Sort
# Time complexity: O(n + k) where k is the range of input elements
def counting_sort(arr)
  return [] if arr.empty?

  # Find the maximum and minimum element in the array
  max_val = arr.max
  min_val = arr.min
  range_of_elements = max_val - min_val + 1

  # Create a count array and result array
  count = Array.new(range_of_elements, 0)
  output = Array.new(arr.length, 0)

  # Count occurrences of each element
  arr.each { |val| count[val - min_val] += 1 }

  # Update count[i] to contain the actual position of this value in output
  for i in 1...range_of_elements
    count[i] += count[i-1]
  end

  # Build output array
  (arr.length-1).downto(0) do |i|
    output[count[arr[i] - min_val] - 1] = arr[i]
    count[arr[i] - min_val] -= 1
  end

  output
end

# Radix Sort
# Time complexity: O(d * (n + b)) with d being the number of digits and b being the base
def radix_sort(arr)
  return [] if arr.empty?

  # Handle negative numbers
  has_negative = arr.any? { |val| val < 0 }
  if has_negative
    # Separate into negative and positive arrays
    neg = arr.select { |val| val < 0 }.map(&:-@)  # Get absolute values
    pos = arr.select { |val| val >= 0 }

    # Sort absolute values of negative numbers
    neg = radix_sort(neg)
    neg = neg.map(&:-@).reverse  # Negate and reverse

    # Sort positive numbers
    pos = pos.empty? ? [] : radix_sort(pos)

    # Combine: negative (reversed) + positive
    return neg + pos
  end

  # Find maximum number to know number of digits
  max_num = arr.max

  # Find the number of digits
  digits = 0
  temp = max_num
  while temp > 0
    digits += 1
    temp /= 10
  end

  # Perform counting sort for each digit
  result = arr.clone
  exp = 1

  digits.times do
    # Counting sort for the digit at position 'exp'
    output = Array.new(result.length, 0)
    count = Array.new(10, 0)

    # Store count of occurrences in count[]
    result.each do |val|
      digit = (val / exp) % 10
      count[digit] += 1
    end

    # Change count[i] so that count[i] now contains actual position of this digit in output[]
    for i in 1...10
      count[i] += count[i-1]
    end

    # Build the output array
    (result.length-1).downto(0) do |i|
      digit = (result[i] / exp) % 10
      output[count[digit] - 1] = result[i]
      count[digit] -= 1
    end

    result = output
    exp *= 10
  end

  result
end

# Bucket Sort
# Time complexity: O(n + k) with k being the number of buckets
def bucket_sort(arr, num_buckets = 10)
  return [] if arr.empty?

  # Find min and max values
  min_val = arr.min
  max_val = arr.max

  # Create buckets
  bucket_range = (max_val - min_val).to_f / num_buckets
  buckets = Array.new(num_buckets) { [] }

  # Place elements into corresponding buckets
  arr.each do |val|
    index = ((val - min_val) / bucket_range).to_i
    # Handle case for max value
    index = num_buckets - 1 if index == num_buckets
    buckets[index] << val
  end

  # Sort each bucket and merge
  result = []
  buckets.each do |bucket|
    result.concat(insertion_sort(bucket)) unless bucket.empty?
  end

  result
end

# Shell Sort
# Time complexity: depends on the gap sequence, usually O(n log^2 n)
def shell_sort(arr)
  result = arr.clone
  n = result.length

  # Start with a big gap, then reduce the gap
  gap = n / 2

  while gap > 0
    for i in gap...n
      # Save result[i] in temp and make a hole at position i
      temp = result[i]

      # Shift earlier gap-sorted elements up until the correct location for result[i] is found
      j = i
      while j >= gap && result[j - gap] > temp
        result[j] = result[j - gap]
        j -= gap
      end

      # Put temp (the original result[i]) in its correct location
      result[j] = temp
    end

    # Reduce the gap
    gap /= 2
  end

  result
end

# Test with an array
if __FILE__ == $0
  # Test array
  test_array = [64, 34, 25, 12, 22, 11, 90]

  puts "Original array: #{test_array}"
  puts "Bubble Sort: #{bubble_sort(test_array)}"
  puts "Selection Sort: #{selection_sort(test_array)}"
  puts "Insertion Sort: #{insertion_sort(test_array)}"
  puts "Merge Sort: #{merge_sort(test_array)}"
  puts "Quick Sort: #{quick_sort(test_array)}"
  puts "Heap Sort: #{heap_sort(test_array)}"
  puts "Counting Sort: #{counting_sort(test_array)}"
  puts "Radix Sort: #{radix_sort(test_array)}"
  puts "Bucket Sort: #{bucket_sort(test_array)}"
  puts "Shell Sort: #{shell_sort(test_array)}"
end
