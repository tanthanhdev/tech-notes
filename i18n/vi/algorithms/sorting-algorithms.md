---
author: Tech Notes Hub
tags: 'learning, technology, programming'
update: '2025-06-06'
date: '2025-06-06'
title: Sorting Algorithms
description: Guide about Sorting Algorithms
---
# Thuật toán sắp xếp

Sắp xếp là một trong những hoạt động cơ bản nhất trong khoa học máy tính. Bài viết này khám phá các thuật toán sắp xếp khác nhau, cách triển khai và đặc điểm hiệu suất của chúng.

## Quick Sort (Sắp xếp nhanh)

Quick Sort là một thuật toán chia để trị hoạt động bằng cách chọn một phần tử 'trục' từ mảng và phân vùng các phần tử khác thành hai mảng con theo điều kiện chúng nhỏ hơn hoặc lớn hơn trục.

```python
def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quick_sort(left) + middle + quick_sort(right)

# Ví dụ sử dụng
arr = [3, 6, 8, 10, 1, 2, 1]
print(quick_sort(arr))  # Kết quả: [1, 1, 2, 3, 6, 8, 10]
```

**Độ phức tạp thời gian**:
- Trường hợp tốt nhất: O(n log n)
- Trường hợp trung bình: O(n log n)
- Trường hợp xấu nhất: O(n²)

## Merge Sort (Sắp xếp trộn)

Merge Sort là một thuật toán chia để trị khác, chia mảng đầu vào thành hai nửa, sắp xếp đệ quy chúng, và sau đó trộn các nửa đã sắp xếp.

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

**Độ phức tạp thời gian**:
- Trường hợp tốt nhất: O(n log n)
- Trường hợp trung bình: O(n log n)
- Trường hợp xấu nhất: O(n log n)

## Bubble Sort (Sắp xếp nổi bọt)

Bubble Sort là một thuật toán đơn giản dựa trên so sánh, lặp đi lặp lại qua danh sách, so sánh các phần tử liền kề và hoán đổi chúng nếu chúng không đúng thứ tự.

```python
def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        # Cờ để tối ưu hóa nếu mảng đã được sắp xếp
        swapped = False

        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True

        # Nếu không có hoán đổi nào xảy ra trong lần này, mảng đã được sắp xếp
        if not swapped:
            break

    return arr
```

**Độ phức tạp thời gian**:
- Trường hợp tốt nhất: O(n) - khi mảng đã được sắp xếp
- Trường hợp trung bình: O(n²)
- Trường hợp xấu nhất: O(n²)

## So sánh các thuật toán sắp xếp

| Thuật toán | Độ phức tạp (Tốt nhất) | Độ phức tạp (Trung bình) | Độ phức tạp (Xấu nhất) | Độ phức tạp không gian | Ổn định |
|------------|------------------------|--------------------------|------------------------|------------------------|---------|
| Quick Sort | O(n log n) | O(n log n) | O(n²) | O(log n) | Không |
| Merge Sort | O(n log n) | O(n log n) | O(n log n) | O(n) | Có |
| Bubble Sort | O(n) | O(n²) | O(n²) | O(1) | Có |
| Insertion Sort | O(n) | O(n²) | O(n²) | O(1) | Có |
| Selection Sort | O(n²) | O(n²) | O(n²) | O(1) | Không |
| Heap Sort | O(n log n) | O(n log n) | O(n log n) | O(1) | Không |
| Counting Sort | O(n+k) | O(n+k) | O(n+k) | O(k) | Có |
| Radix Sort | O(nk) | O(nk) | O(nk) | O(n+k) | Có |

Trong đó:
- n là số lượng phần tử
- k là phạm vi của giá trị đầu vào

## Khi nào sử dụng từng thuật toán

- **Quick Sort**: Sắp xếp đa năng, hoạt động tốt cho các mảng vừa với bộ nhớ
- **Merge Sort**: Khi cần tính ổn định và yêu cầu trường hợp xấu nhất O(n log n)
- **Bubble Sort**: Mục đích giáo dục hoặc tập dữ liệu rất nhỏ
- **Insertion Sort**: Tập dữ liệu nhỏ hoặc mảng gần như đã được sắp xếp
- **Heap Sort**: Khi cần hiệu suất ổn định mà không có kịch bản xấu nhất
- **Counting/Radix Sort**: Khi phạm vi giá trị đầu vào bị giới hạn

## Kết luận

Việc chọn thuật toán sắp xếp phù hợp phụ thuộc vào yêu cầu cụ thể của bạn, bao gồm kích thước của tập dữ liệu, giới hạn bộ nhớ và liệu tính ổn định có quan trọng hay không. Trong thực tế, hầu hết các ngôn ngữ lập trình triển khai các thuật toán sắp xếp kết hợp kết hợp lợi ích của các phương pháp khác nhau.
