#!/usr/bin/env ruby

# Graph Traversal Algorithms in Ruby
#
# This script demonstrates BFS and DFS traversal algorithms on a graph.
#
# Run: ruby graph_traversal.rb

class Graph
  # Initialize an empty graph
  def initialize
    @adjacency_list = {}
  end

  # Add a vertex to the graph
  def add_vertex(vertex)
    @adjacency_list[vertex] = [] unless @adjacency_list.key?(vertex)
  end

  # Add an edge between two vertices
  def add_edge(v1, v2)
    # Ensure both vertices exist
    add_vertex(v1)
    add_vertex(v2)
    
    # Add the edge (undirected graph)
    @adjacency_list[v1] << v2
    @adjacency_list[v2] << v1
  end

  # Get sorted neighbors for consistent output
  def get_sorted_neighbors(vertex)
    @adjacency_list[vertex].sort
  end

  # Breadth-First Search traversal
  def bfs(start)
    return [] unless @adjacency_list.key?(start)
    
    visited = { start => true }
    queue = [start]
    result = []
    
    puts "Starting BFS traversal from vertex #{start}"
    
    until queue.empty?
      # Dequeue the first vertex
      vertex = queue.shift
      result << vertex
      
      puts "Visiting: #{vertex}"
      puts "Queue: #{queue.inspect}"
      puts "Visited so far: #{result.inspect}"
      puts "------------------------------"
      
      # Pause for demonstration
      sleep(0.5) # 500ms
      
      # Get sorted neighbors for consistent order
      neighbors = get_sorted_neighbors(vertex)
      
      # Enqueue all unvisited neighbors
      neighbors.each do |neighbor|
        unless visited[neighbor]
          visited[neighbor] = true
          queue << neighbor
        end
      end
    end
    
    result
  end

  # Depth-First Search traversal (recursive)
  def dfs_recursive(start)
    return [] unless @adjacency_list.key?(start)
    
    visited = {}
    result = []
    
    puts "Starting recursive DFS traversal from vertex #{start}"
    
    dfs_helper(start, visited, result)
    
    result
  end

  # Helper method for recursive DFS
  def dfs_helper(vertex, visited, result)
    # Mark as visited and add to result
    visited[vertex] = true
    result << vertex
    
    puts "Visiting: #{vertex}"
    puts "Visited so far: #{result.inspect}"
    puts "------------------------------"
    
    # Pause for demonstration
    sleep(0.5) # 500ms
    
    # Get sorted neighbors for consistent order
    neighbors = get_sorted_neighbors(vertex)
    
    # Recursively visit all unvisited neighbors
    neighbors.each do |neighbor|
      dfs_helper(neighbor, visited, result) unless visited[neighbor]
    end
  end

  # Depth-First Search traversal (iterative)
  def dfs_iterative(start)
    return [] unless @adjacency_list.key?(start)
    
    visited = {}
    stack = [start]
    result = []
    
    puts "Starting iterative DFS traversal from vertex #{start}"
    
    until stack.empty?
      # Pop the top vertex
      vertex = stack.pop
      
      # If not visited, process it
      unless visited[vertex]
        visited[vertex] = true
        result << vertex
        
        puts "Visiting: #{vertex}"
        puts "Stack: #{stack.inspect}"
        puts "Visited so far: #{result.inspect}"
        puts "------------------------------"
        
        # Pause for demonstration
        sleep(0.5) # 500ms
        
        # Get sorted neighbors in reverse order for stack
        neighbors = get_sorted_neighbors(vertex).reverse
        
        # Push all unvisited neighbors onto the stack
        neighbors.each do |neighbor|
          stack << neighbor unless visited[neighbor]
        end
      end
    end
    
    result
  end

  # Print the graph structure
  def visualize_graph
    puts "\nGraph Structure:"
    puts "------------------------------"
    
    # Sort vertices for consistent output
    vertices = @adjacency_list.keys.sort
    
    vertices.each do |vertex|
      neighbors = get_sorted_neighbors(vertex)
      puts "#{vertex} -> #{neighbors.inspect}"
    end
    
    puts "------------------------------"
  end
end

# Create a sample graph for demonstration
def create_sample_graph
  g = Graph.new
  
  # Add edges to build this graph:
  #     A
  #    / \
  #   B   C
  #  / \   \
  # D   E---F
  
  edges = [
    ["A", "B"], ["A", "C"],
    ["B", "D"], ["B", "E"],
    ["C", "F"], ["E", "F"]
  ]
  
  edges.each do |v1, v2|
    g.add_edge(v1, v2)
  end
  
  g
end

# Main execution
g = create_sample_graph
g.visualize_graph

# Demonstrate BFS
puts "\n=== BFS Traversal ==="
bfs_result = g.bfs("A")
puts "BFS Result: #{bfs_result.inspect}"

# Demonstrate recursive DFS
puts "\n=== DFS Traversal (Recursive) ==="
dfs_rec_result = g.dfs_recursive("A")
puts "DFS Recursive Result: #{dfs_rec_result.inspect}"

# Demonstrate iterative DFS
puts "\n=== DFS Traversal (Iterative) ==="
dfs_iter_result = g.dfs_iterative("A")
puts "DFS Iterative Result: #{dfs_iter_result.inspect}" 