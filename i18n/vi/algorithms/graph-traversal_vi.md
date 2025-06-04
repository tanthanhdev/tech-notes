# Các Thuật Toán Duyệt Đồ Thị (Graph Traversal Algorithms)

Các thuật toán duyệt đồ thị là những kỹ thuật cơ bản được sử dụng để thăm mỗi đỉnh trong một đồ thị. Chúng là nền tảng cho nhiều thuật toán đồ thị phức tạp hơn.

## Mục Lục

- [Tìm Kiếm Theo Chiều Rộng (BFS)](#tìm-kiếm-theo-chiều-rộng-bfs)
- [Tìm Kiếm Theo Chiều Sâu (DFS)](#tìm-kiếm-theo-chiều-sâu-dfs)
- [So Sánh BFS và DFS](#so-sánh-bfs-và-dfs)
- [Ứng Dụng](#ứng-dụng)
- [Độ Phức Tạp Về Thời Gian và Không Gian](#độ-phức-tạp-về-thời-gian-và-không-gian)

## Tìm Kiếm Theo Chiều Rộng (BFS)

Tìm kiếm theo chiều rộng là một thuật toán duyệt đồ thị khám phá tất cả các đỉnh ở mức độ sâu hiện tại trước khi di chuyển đến các đỉnh ở mức độ sâu tiếp theo.

### Cách Hoạt Động của BFS

1. Bắt đầu từ một đỉnh nguồn và đánh dấu nó là đã thăm
2. Thăm tất cả các đỉnh kề chưa thăm và đánh dấu chúng là đã thăm
3. Đối với mỗi đỉnh kề đó, thăm tất cả các đỉnh kề chưa thăm của chúng
4. Lặp lại cho đến khi tất cả các đỉnh đã được thăm

### Cài Đặt

```python
from collections import deque

def bfs(graph, start):
    visited = set([start])
    queue = deque([start])
    result = []

    while queue:
        vertex = queue.popleft()
        result.append(vertex)

        for neighbor in graph[vertex]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)

    return result

# Ví dụ sử dụng
graph = {
    'A': ['B', 'C'],
    'B': ['A', 'D', 'E'],
    'C': ['A', 'F'],
    'D': ['B'],
    'E': ['B', 'F'],
    'F': ['C', 'E']
}

print(bfs(graph, 'A'))  # Kết quả: ['A', 'B', 'C', 'D', 'E', 'F']
```

## Tìm Kiếm Theo Chiều Sâu (DFS)

Tìm kiếm theo chiều sâu là một thuật toán duyệt đồ thị khám phá càng xa càng tốt dọc theo mỗi nhánh trước khi quay lui.

### Cách Hoạt Động của DFS

1. Bắt đầu từ một đỉnh nguồn và đánh dấu nó là đã thăm
2. Đệ quy thăm một trong các đỉnh kề chưa thăm của nó
3. Tiếp tục quá trình này, đi sâu hơn vào đồ thị
4. Khi bạn đến một đỉnh không có đỉnh kề chưa thăm, quay lui

### Cài Đặt

```python
def dfs_recursive(graph, vertex, visited=None, result=None):
    if visited is None:
        visited = set()
    if result is None:
        result = []

    visited.add(vertex)
    result.append(vertex)

    for neighbor in graph[vertex]:
        if neighbor not in visited:
            dfs_recursive(graph, neighbor, visited, result)

    return result

# Cài đặt lặp sử dụng ngăn xếp
def dfs_iterative(graph, start):
    visited = set()
    stack = [start]
    result = []

    while stack:
        vertex = stack.pop()
        if vertex not in visited:
            visited.add(vertex)
            result.append(vertex)

            # Thêm các đỉnh kề theo thứ tự ngược lại để mô phỏng DFS đệ quy
            for neighbor in reversed(graph[vertex]):
                if neighbor not in visited:
                    stack.append(neighbor)

    return result

# Ví dụ sử dụng (cùng đồ thị như ví dụ BFS)
print(dfs_recursive(graph, 'A'))  # Kết quả có thể là: ['A', 'B', 'D', 'E', 'F', 'C']
print(dfs_iterative(graph, 'A'))  # Kết quả tương tự, có thể thay đổi tùy thuộc vào thứ tự đỉnh kề
```

## So Sánh BFS và DFS

| Khía cạnh | BFS | DFS |
|-----------|-----|-----|
| Cấu trúc dữ liệu | Hàng đợi (Queue) | Ngăn xếp (Stack) hoặc đệ quy |
| Độ phức tạp không gian | O(b^d) với b là hệ số phân nhánh và d là khoảng cách từ nguồn | O(h) với h là chiều cao của cây |
| Tính đầy đủ | Đầy đủ (tìm tất cả các đỉnh ở độ sâu nhất định trước khi đi sâu hơn) | Không đầy đủ cho đồ thị vô hạn |
| Tính tối ưu | Tối ưu cho đồ thị không có trọng số | Không tối ưu nói chung |
| Trường hợp sử dụng | Đường đi ngắn nhất trong đồ thị không trọng số, duyệt theo cấp | Sắp xếp tô-pô, phát hiện chu trình, tìm đường đi |

## Ứng Dụng

- **Ứng Dụng của BFS**:
  - Tìm đường đi ngắn nhất trong đồ thị không trọng số
  - Tìm tất cả các đỉnh trong một thành phần liên thông
  - Kiểm tra tính hai phía của đồ thị
  - Bộ thu thập thông tin web (Web crawlers)
  - Tính năng mạng xã hội (ví dụ: "Bạn bè trong vòng 2 kết nối")

- **Ứng Dụng của DFS**:
  - Sắp xếp tô-pô
  - Tìm thành phần liên thông mạnh
  - Giải các câu đố chỉ có một lời giải (ví dụ: mê cung)
  - Phát hiện chu trình
  - Tìm đường đi trong trò chơi và câu đố

## Độ Phức Tạp Về Thời Gian và Không Gian

Cả BFS và DFS đều có độ phức tạp thời gian là O(V + E) với V là số đỉnh và E là số cạnh. Điều này là do trong trường hợp xấu nhất, mỗi đỉnh và mỗi cạnh sẽ được khám phá một lần.

Độ phức tạp không gian:
- BFS: O(V) trong trường hợp xấu nhất khi tất cả các đỉnh được lưu trữ trong hàng đợi
- DFS: O(h) với h là độ sâu tối đa của ngăn xếp đệ quy (có thể là O(V) trong trường hợp xấu nhất)

## Tài Liệu Tham Khảo

1. Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). Introduction to Algorithms (3rd ed.). MIT Press.
2. Sedgewick, R., & Wayne, K. (2011). Algorithms (4th ed.). Addison-Wesley Professional.