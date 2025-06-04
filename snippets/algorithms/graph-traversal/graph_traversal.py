#!/usr/bin/env python3
"""
Graph Traversal Algorithms Implementation

This module provides implementations of BFS and DFS for graph traversal,
along with a visualization function to display the traversal order.

Example usage:
    python graph_traversal_example.py
"""

from collections import deque
import time


class Graph:
    """A simple graph representation using adjacency lists."""
    
    def __init__(self):
        """Initialize an empty graph."""
        self.graph = {}
        
    def add_vertex(self, vertex):
        """Add a vertex to the graph if it doesn't exist."""
        if vertex not in self.graph:
            self.graph[vertex] = []
            
    def add_edge(self, v1, v2):
        """Add an edge between v1 and v2."""
        if v1 not in self.graph:
            self.add_vertex(v1)
        if v2 not in self.graph:
            self.add_vertex(v2)
            
        self.graph[v1].append(v2)
        self.graph[v2].append(v1)  # For undirected graph
        
    def bfs(self, start):
        """
        Perform Breadth-First Search starting from the given vertex.
        
        Args:
            start: The starting vertex for BFS
            
        Returns:
            A list containing vertices in the order they were visited
        """
        if start not in self.graph:
            return []
            
        visited = set([start])
        queue = deque([start])
        result = []
        
        print(f"Starting BFS traversal from vertex {start}")
        
        while queue:
            vertex = queue.popleft()
            result.append(vertex)
            
            print(f"Visiting: {vertex}")
            print(f"Queue: {list(queue)}")
            print(f"Visited so far: {result}")
            print("-" * 30)
            time.sleep(0.5)  # Slow down for demonstration
            
            for neighbor in sorted(self.graph[vertex]):  # Sort for consistent order
                if neighbor not in visited:
                    visited.add(neighbor)
                    queue.append(neighbor)
                    
        return result
        
    def dfs_recursive(self, start):
        """
        Perform Depth-First Search recursively starting from the given vertex.
        
        Args:
            start: The starting vertex for DFS
            
        Returns:
            A list containing vertices in the order they were visited
        """
        if start not in self.graph:
            return []
            
        visited = set()
        result = []
        
        print(f"Starting recursive DFS traversal from vertex {start}")
        
        def dfs_helper(vertex):
            visited.add(vertex)
            result.append(vertex)
            
            print(f"Visiting: {vertex}")
            print(f"Visited so far: {result}")
            print("-" * 30)
            time.sleep(0.5)  # Slow down for demonstration
            
            for neighbor in sorted(self.graph[vertex]):  # Sort for consistent order
                if neighbor not in visited:
                    dfs_helper(neighbor)
        
        dfs_helper(start)
        return result
        
    def dfs_iterative(self, start):
        """
        Perform Depth-First Search iteratively starting from the given vertex.
        
        Args:
            start: The starting vertex for DFS
            
        Returns:
            A list containing vertices in the order they were visited
        """
        if start not in self.graph:
            return []
            
        visited = set()
        stack = [start]
        result = []
        
        print(f"Starting iterative DFS traversal from vertex {start}")
        
        while stack:
            vertex = stack.pop()
            
            if vertex not in visited:
                visited.add(vertex)
                result.append(vertex)
                
                print(f"Visiting: {vertex}")
                print(f"Stack: {stack}")
                print(f"Visited so far: {result}")
                print("-" * 30)
                time.sleep(0.5)  # Slow down for demonstration
                
                # Add neighbors in reverse sorted order to simulate recursive DFS
                for neighbor in sorted(self.graph[vertex], reverse=True):
                    if neighbor not in visited:
                        stack.append(neighbor)
                        
        return result
    
    def visualize_graph(self):
        """Print a simple visualization of the graph structure."""
        print("\nGraph Structure:")
        print("-" * 30)
        for vertex, neighbors in sorted(self.graph.items()):
            print(f"{vertex} -> {sorted(neighbors)}")
        print("-" * 30)


def create_sample_graph():
    """Create a sample graph for demonstration."""
    g = Graph()
    
    # Add edges to build this graph:
    #     A
    #    / \
    #   B   C
    #  / \   \
    # D   E---F
    
    edges = [
        ('A', 'B'), ('A', 'C'),
        ('B', 'D'), ('B', 'E'),
        ('C', 'F'), ('E', 'F')
    ]
    
    for v1, v2 in edges:
        g.add_edge(v1, v2)
        
    return g


def main():
    """Main function to demonstrate graph traversal algorithms."""
    g = create_sample_graph()
    g.visualize_graph()
    
    print("\n=== BFS Traversal ===")
    bfs_result = g.bfs('A')
    print(f"BFS Result: {bfs_result}")
    
    print("\n=== DFS Traversal (Recursive) ===")
    dfs_rec_result = g.dfs_recursive('A')
    print(f"DFS Recursive Result: {dfs_rec_result}")
    
    print("\n=== DFS Traversal (Iterative) ===")
    dfs_iter_result = g.dfs_iterative('A')
    print(f"DFS Iterative Result: {dfs_iter_result}")


if __name__ == "__main__":
    main() 