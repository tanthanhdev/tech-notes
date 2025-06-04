# Graph Traversal Algorithms

Graph traversal algorithms are fundamental techniques used to visit every vertex in a graph. They serve as building blocks for many more complex graph algorithms.

## Table of Contents

- [Breadth-First Search (BFS)](#breadth-first-search-bfs)
- [Depth-First Search (DFS)](#depth-first-search-dfs)
- [Comparison of BFS and DFS](#comparison-of-bfs-and-dfs)
- [Applications](#applications)
- [Time and Space Complexity](#time-and-space-complexity)

## Breadth-First Search (BFS)

Breadth-First Search is a graph traversal algorithm that explores all vertices at the current depth level before moving to vertices at the next depth level.

### How BFS Works

1. Start at a source vertex and mark it as visited
2. Visit all its unvisited neighbors and mark them as visited
3. For each of those neighbors, visit all of their unvisited neighbors
4. Repeat until all vertices have been visited

### Implementation

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

# Example usage
graph = {
    'A': ['B', 'C'],
    'B': ['A', 'D', 'E'],
    'C': ['A', 'F'],
    'D': ['B'],
    'E': ['B', 'F'],
    'F': ['C', 'E']
}

print(bfs(graph, 'A'))  # Output: ['A', 'B', 'C', 'D', 'E', 'F']
```

## Depth-First Search (DFS)

Depth-First Search is a graph traversal algorithm that explores as far as possible along each branch before backtracking.

### How DFS Works

1. Start at a source vertex and mark it as visited
2. Recursively visit one of its unvisited neighbors
3. Continue this process, going deeper into the graph
4. When you reach a vertex with no unvisited neighbors, backtrack

### Implementation

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

# Iterative implementation using a stack
def dfs_iterative(graph, start):
    visited = set()
    stack = [start]
    result = []
    
    while stack:
        vertex = stack.pop()
        if vertex not in visited:
            visited.add(vertex)
            result.append(vertex)
            
            # Add neighbors in reverse order to simulate recursive DFS
            for neighbor in reversed(graph[vertex]):
                if neighbor not in visited:
                    stack.append(neighbor)
                    
    return result

# Example usage (same graph as BFS example)
print(dfs_recursive(graph, 'A'))  # Output might be: ['A', 'B', 'D', 'E', 'F', 'C']
print(dfs_iterative(graph, 'A'))  # Similar output, might vary depending on neighbor order
```

## Comparison of BFS and DFS

| Aspect | BFS | DFS |
|--------|-----|-----|
| Data Structure | Queue | Stack (or recursion) |
| Space Complexity | O(b^d) where b is branching factor and d is distance from source | O(h) where h is the height of the tree |
| Completeness | Complete (finds all nodes at a given depth before moving deeper) | Not complete for infinite graphs |
| Optimality | Optimal for unweighted graphs | Not optimal in general |
| Use Case | Shortest path in unweighted graphs, level order traversal | Topological sorting, cycle detection, path finding |

## Applications

- **BFS Applications**:
  - Finding the shortest path in unweighted graphs
  - Finding all nodes within one connected component
  - Testing bipartiteness of a graph
  - Web crawlers
  - Social networking features (e.g., "Friends within 2 connections")

- **DFS Applications**:
  - Topological sorting
  - Finding strongly connected components
  - Solving puzzles with only one solution (e.g., mazes)
  - Cycle detection
  - Path finding in games and puzzles

## Time and Space Complexity

Both BFS and DFS have a time complexity of O(V + E) where V is the number of vertices and E is the number of edges. This is because in the worst case, each vertex and each edge will be explored once.

Space complexity:
- BFS: O(V) in the worst case when all vertices are stored in the queue
- DFS: O(h) where h is the maximum depth of the recursion stack (which could be O(V) in the worst case)

## References

1. Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). Introduction to Algorithms (3rd ed.). MIT Press.
2. Sedgewick, R., & Wayne, K. (2011). Algorithms (4th ed.). Addison-Wesley Professional. 